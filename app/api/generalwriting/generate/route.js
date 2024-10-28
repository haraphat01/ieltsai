export const dynamic = 'force-dynamic';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  try {
    
    const data = await request.json(); 
    console.log('Received data:', data); 
    const { taskType, questionType } = data; 
    console.log('Task Type:', taskType); 
    console.log('Question Type:', questionType); 
    const prompts = {
      task1: {
        formal: "Generate a formal letter writing task for IELTS General Writing Task 1. The scenario should involve writing to an organization or authority figure. Include the situation and 3 bullet points that need to be addressed in the letter.",
        semiformal: "Generate a semi-formal letter writing task for IELTS General Writing Task 1. The scenario should involve writing to someone you don't know well. Include the situation and 3 bullet points that need to be addressed in the letter.",
        informal: "Generate an informal letter writing task for IELTS General Writing Task 1. The scenario should involve writing to a friend or family member. Include the situation and 3 bullet points that need to be addressed in the letter."
      },
      task2: {
        essay: "Generate an IELTS General Writing Task 2 essay question. The topic should be general interest and argumentative in nature. Include the question and any specific points that need to be addressed."
      }
    };

    const prompt = prompts[taskType][questionType];
    console.log('Prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an IELTS examiner creating writing tasks. Provide clear, well-structured questions that follow the official IELTS format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    return NextResponse.json({ question: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}
