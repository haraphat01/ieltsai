import { NextResponse } from 'next/server';
import { assessSpeaking } from '@/lib/openai';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const audio = formData.get('audio');
    const type = formData.get('type');

    if (!audio || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await assessSpeaking(audio);
    
    // Extract score from assessment (assuming it's in the format "Score: X")
    const scoreMatch = result.assessment.match(/Score: (\d+)/);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : null;

    if (score !== null) {
      await connectDB();
      await User.findOneAndUpdate(
        { email: session.user.email },
        {
          $push: {
            [`progress.${type}.speaking`]: {
              score,
              date: new Date(),
            },
          },
        }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Speaking assessment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}