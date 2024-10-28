export async function POST(request) {
  try {
    const { text, taskType, question } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
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
          Format the response as a JSON object with these criteria as keys.`
        },
        {
          role: "user",
          content: `Question: ${question}\n\nResponse: ${text}`
        }
      ],
      temperature: 0.3
    });

    const feedback = JSON.parse(completion.choices[0].message.content);
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error assessing writing:', error);
    return NextResponse.json({ error: 'Failed to assess writing' }, { status: 500 });
  }
}