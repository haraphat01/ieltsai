import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export async function POST(request) {
    try {
      const { text, taskType, question } = await request.json();
  
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an IELTS examiner assessing ${taskType === 'task1' ? 'Task 1 Letter Writing' : 'Task 2 Essay Writing'}. 
            Provide detailed feedback and scores for:
            - Task Achievement
            - Coherence and Cohesion
            - Lexical Resource
            - Grammatical Range and Accuracy
            
            For each criterion, provide specific examples from the text and suggestions for improvement.
            Respond *only* with a JSON object with these exact keys: "Task Achievement", "Coherence and Cohesion", "Lexical Resource", and "Grammatical Range and Accuracy". Do not include any extra text.`
          },
          {
            role: "user",
            content: `Question: ${question}\n\nResponse: ${text}`
          }
        ],
        temperature: 0.3
      });
  
      // Attempt to parse the response directly
      let feedback;
      try {
        const rawResponse = completion.choices[0].message.content.trim();
        feedback = JSON.parse(rawResponse);
      } catch (jsonError) {
        console.error('Invalid JSON response:', jsonError);
        return NextResponse.json({ error: 'Invalid response format from OpenAI' }, { status: 500 });
      }
  
      return NextResponse.json({ feedback });
    } catch (error) {
      console.error('Error assessing writing:', error);
      return NextResponse.json({ error: 'Failed to assess writing' }, { status: 500 });
    }
  }
  
