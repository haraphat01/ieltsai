export async function POST(request) {
    try {
      const { answers, questions } = await request.json();
  
      // Use GPT-4 to assess the answers and provide detailed feedback
      const assessmentResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an IELTS examiner. Assess the student's answers and provide detailed feedback for improvement. Format the response as JSON with score, band score, and detailed feedback for each question."
          },
          {
            role: "user",
            content: JSON.stringify({ answers, questions })
          }
        ]
      });
  
      const assessment = JSON.parse(assessmentResponse.choices[0].message.content);
  
      return NextResponse.json(assessment);
    } catch (error) {
      console.error('Error assessing test:', error);
      return NextResponse.error(new Error('Failed to assess test'));
    }
  }