'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

const ProgressPage = () => {
  const [progressData, setProgressData] = useState({
    reading: { score: 7, outOf: 9, completed: true },
    writing: { score: 6, outOf: 9, completed: true },
    speaking: { score: 7, outOf: 9, completed: true },
    overall: { average: 6.7 },
  });

  const calculateProgress = (score, outOf) => (score / outOf) * 100;

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">Your Progress</h2>
      <p className="text-gray-600 mb-8">Here's a detailed overview of your progress in each section.</p>

      <Card className="p-6 bg-white shadow-md rounded-lg">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Overall Progress</h3>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700 font-medium">Average Score</span>
          <Badge className="text-xl font-bold px-4 py-2 bg-blue-100 text-blue-700">
            {progressData.overall.average.toFixed(1)} / 9
          </Badge>
        </div>
        <Progress value={(progressData.overall.average / 9) * 100} className="h-4 bg-blue-200" />
      </Card>

      {/* Section Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reading Section */}
        <Card className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Reading Section</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Score</span>
            <Badge className="bg-green-100 text-green-700 px-3 py-1">
              {progressData.reading.score} / {progressData.reading.outOf}
            </Badge>
          </div>
          <Progress value={calculateProgress(progressData.reading.score, progressData.reading.outOf)} className="h-3 bg-green-200" />
        </Card>

        {/* Writing Section */}
        <Card className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Writing Section</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Score</span>
            <Badge className="bg-purple-100 text-purple-700 px-3 py-1">
              {progressData.writing.score} / {progressData.writing.outOf}
            </Badge>
          </div>
          <Progress value={calculateProgress(progressData.writing.score, progressData.writing.outOf)} className="h-3 bg-purple-200" />
        </Card>

        {/* Speaking Section */}
        <Card className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold text-teal-700 mb-2">Speaking Section</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Score</span>
            <Badge className="bg-teal-100 text-teal-700 px-3 py-1">
              {progressData.speaking.score} / {progressData.speaking.outOf}
            </Badge>
          </div>
          <Progress value={calculateProgress(progressData.speaking.score, progressData.speaking.outOf)} className="h-3 bg-teal-200" />
        </Card>
      </div>

      {/* Feedback Section */}
      <Card className="p-6 bg-white shadow-md rounded-lg mt-8">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Detailed Feedback</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-green-700">Reading Feedback:</h4>
            <p className="text-gray-700">You've demonstrated a strong understanding of the main ideas in reading passages, but consider focusing on identifying subtle details to improve accuracy.</p>
          </div>
          <div>
            <h4 className="font-medium text-purple-700">Writing Feedback:</h4>
            <p className="text-gray-700">Good structure and flow in writing. Work on expanding vocabulary and enhancing sentence variety for better expressiveness.</p>
          </div>
          <div>
            <h4 className="font-medium text-teal-700">Speaking Feedback:</h4>
            <p className="text-gray-700">Clear pronunciation and fluency. Practice maintaining coherence when addressing all points to strengthen overall impact.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProgressPage;
