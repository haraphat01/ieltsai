import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import B2 from 'backblaze-b2';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const b2 = new B2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
  applicationKey: process.env.B2_APPLICATION_KEY
});

// Helper function to split text into chunks based on token size
function splitTextIntoChunks(text, chunkSize) {
  const words = text.split(" ");
  const chunks = [];
  let currentChunk = [];

  for (const word of words) {
    if (currentChunk.join(" ").length + word.length > chunkSize) {
      chunks.push(currentChunk.join(" "));
      currentChunk = [];
    }
    currentChunk.push(word);
  }
  chunks.push(currentChunk.join(" "));
  return chunks;
}

// Process text in chunks
async function processTextInChunks(text, chunkSize, systemMessage) {
  const chunks = splitTextIntoChunks(text, chunkSize);
  const responses = [];

  for (const chunk of chunks) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: chunk }
      ]
    });
    responses.push(response.choices[0].message.content);
  }

  return responses.join(" ");
}

export async function GET() {
  try {
    // Generate a script for the IELTS listening test in chunks
    const script = await processTextInChunks(
      "Generate an IELTS listening test script.",
      3000, // Adjust token size per chunk as needed
      "You are an IELTS test creator. Create a realistic listening test script with 4 sections: 1) A conversation about daily life, 2) A public announcement, 3) An academic discussion, and 4) An academic lecture. Each section should be appropriate for IELTS listening test format."
    );

    console.log('Script:', script); 

    // Generate questions based on the script, also using chunking
    const questions = await processTextInChunks(
      `Create questions for this script: ${script}`,
      3000, // Adjust token size per chunk as needed
      "Create 40 IELTS listening test questions (10 for each section) based on the given script. Include a mix of multiple choice, fill-in-the-blank, and matching questions. Format the response as JSON."
    );

    console.log('Questions:', questions); // Log questions for debugging

    // Generate audio in chunks if necessary
    const scriptChunks = splitTextIntoChunks(script, 1000); // Adjust chunk size for audio if needed
    const audioBuffers = [];

    for (const chunk of scriptChunks) {
      const speechResponse = await openai.audio.speech.create({
        model: "tts-1-hd",
        voice: "alloy",
        input: chunk,
      });
      const buffer = Buffer.from(await speechResponse.arrayBuffer());
      audioBuffers.push(buffer);
    }

    // Combine all audio buffers into a single buffer
    const combinedAudioBuffer = Buffer.concat(audioBuffers);

    // Upload the combined audio to Backblaze B2
    const uploadResponse = await b2.uploadFile({
      bucketId: process.env.B2_BUCKET_ID,
      fileName: 'test.mp3',
      data: combinedAudioBuffer,
      contentType: 'audio/mpeg',
    });

    console.log('Upload Response:', uploadResponse); // Log upload response for debugging
    const audioUrl = uploadResponse.data.url;

    // Return JSON with questions and audio URL
    return NextResponse.json({
      questions: JSON.parse(questions),
      audioUrl,
    });

  } catch (error) {
    console.error('Error generating test:', error);
    return NextResponse.error(new Error('Failed to generate test'));
  }
}
