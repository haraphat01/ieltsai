'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Timer } from '@/components/timer';

const ReadingSection = () => {
  const [currentPassage, setCurrentPassage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (Object.keys(answers).length < passages[currentPassage].questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/assess/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passageId: passages[currentPassage].id,
          answers,
        }),
      });

      if (!response.ok) throw new Error('Failed to assess reading');

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert('Failed to submit answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passages = [
    {
      id: 1,
      title: "The Evolution of Urban Planning",
      content: `Urban planning has undergone significant changes over the past century. 
      The modern approach to city development emphasizes sustainability, community engagement, 
      and mixed-use spaces. This marks a departure from earlier models that prioritized 
      automobile-centric design and strict separation of residential and commercial areas.

      Recent studies have shown that cities incorporating green spaces and pedestrian-friendly 
      infrastructure report higher levels of citizen satisfaction and improved public health 
      outcomes. These findings have led to a reimagining of urban spaces, with many cities 
      now focusing on creating walkable neighborhoods and integrated community areas.`,
      questions: [
        {
          id: 'q1',
          text: "What is a key focus of modern urban planning according to the passage?",
          options: [
            "Automobile-centric design",
            "Sustainability and community engagement",
            "Industrial development",
            "Highway construction"
          ],
          correct: 1
        },
        {
          id: 'q2',
          text: "What benefit have cities with green spaces reported?",
          options: [
            "Higher property taxes",
            "Increased car usage",
            "Improved public health outcomes",
            "More industrial development"
          ],
          correct: 2
        }
      ]
    }
  ];

  const currentPassageData = passages[currentPassage];

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-blue-600">Reading Test</h2>
        <Timer duration={60 * 60} /> {/* 60 minutes */}
      </div>

      <Progress value={(currentPassage + 1) / passages.length * 100} className="w-full max-w-3xl" />

      <Card className="p-8 shadow-lg max-w-3xl w-full rounded-lg border border-gray-200 bg-white">
        <h3 className="text-2xl font-semibold mb-4 text-blue-500">{currentPassageData.title}</h3>
        <div className="prose dark:prose-invert mb-6">
          <p className="whitespace-pre-wrap">{currentPassageData.content}</p>
        </div>

        <div className="space-y-6">
          {currentPassageData.questions.map((question) => (
            <div key={question.id} className="space-y-4">
              <p className="font-medium text-gray-800">{question.text}</p>
              <RadioGroup
                onValueChange={(value) => 
                  setAnswers(prev => ({ ...prev, [question.id]: parseInt(value) }))
                }
                value={answers[question.id]?.toString()}
                className="space-y-2"
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`${question.id}-${index}`} className="text-blue-600" />
                    <Label htmlFor={`${question.id}-${index}`} className="text-gray-700">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-between w-full max-w-3xl">
        <Button
          variant="outline"
          disabled={currentPassage === 0}
          onClick={() => setCurrentPassage(prev => prev - 1)}
          className="w-36"
        >
          Previous Passage
        </Button>
        
        {currentPassage === passages.length - 1 ? (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-blue-600 text-white w-36 hover:bg-blue-700"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Test'}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentPassage(prev => prev + 1)}
            className="bg-blue-600 text-white w-36 hover:bg-blue-700"
          >
            Next Passage
          </Button>
        )}
      </div>

      {result && (
        <Card className="p-6 mt-8 bg-green-50 rounded-lg max-w-3xl w-full border border-green-300">
          <h3 className="text-xl font-semibold text-green-700 mb-4">Results</h3>
          <div className="space-y-4">
            <p>Score: {result.score}/9</p>
            <div className="prose dark:prose-invert">
              <p>{result.feedback}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
export default ReadingSection;
