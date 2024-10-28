import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function assessWriting(text, type = 'academic') {
  const prompt = `As an IELTS examiner, assess the following ${type} IELTS writing task. 
  Provide a score (0-9) and detailed feedback on:
  - Task Achievement/Response
  - Coherence and Cohesion
  - Lexical Resource
  - Grammatical Range and Accuracy

  Writing: ${text}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

export async function assessSpeaking(audioUrl) {
  // First, transcribe the audio using Whisper
  const transcription = await openai.audio.transcriptions.create({
    file: audioUrl,
    model: "whisper-1",
  });

  // Then assess the transcribed speech
  const prompt = `As an IELTS examiner, assess the following speaking response. 
  Provide a score (0-9) and detailed feedback on:
  - Fluency and Coherence
  - Lexical Resource
  - Grammatical Range and Accuracy
  - Pronunciation

  Speech: ${transcription.text}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return {
    transcription: transcription.text,
    assessment: response.choices[0].message.content,
  };
}