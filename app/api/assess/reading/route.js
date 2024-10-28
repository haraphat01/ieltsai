import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const passages = {
  1: {
    questions: [
      { id: 'q1', correct: 1 },
      { id: 'q2', correct: 2 }
    ]
  }
};

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type, passageId, answers } = await request.json();
    
    if (!type || !passageId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const passage = passages[passageId];
    if (!passage) {
      return NextResponse.json(
        { error: 'Invalid passage ID' },
        { status: 400 }
      );
    }

    // Calculate score
    let correctAnswers = 0;
    passage.questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / passage.questions.length) * 9);

    // Save progress
    await connectDB();
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $push: {
          [`progress.${type}.reading`]: {
            score,
            date: new Date(),
          },
        },
      }
    );

    // Generate feedback based on score
    let feedback = '';
    if (score >= 7) {
      feedback = 'Excellent work! You demonstrated strong reading comprehension skills.';
    } else if (score >= 5) {
      feedback = 'Good effort. Focus on improving your attention to detail and inference skills.';
    } else {
      feedback = 'Keep practicing. Try to read more carefully and look for key information in the passages.';
    }

    return NextResponse.json({ score, feedback });
  } catch (error) {
    console.error('Reading assessment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}