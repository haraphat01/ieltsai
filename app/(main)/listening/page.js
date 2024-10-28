'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ListeningTest = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);  // Updated to false initially
  const [audioUrl, setAudioUrl] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [results, setResults] = useState(null);
  const audioRef = useRef(null);

  const sections = [
    'Section 1: Daily Life Conversation',
    'Section 2: Public Announcement',
    'Section 3: Academic Discussion',
    'Section 4: Academic Lecture'
  ];

  useEffect(() => {
    if (testStarted && timeRemaining === null) {
      setTimeRemaining(30 * 60); // 30 minutes for IELTS listening
    }

    const timer = setInterval(() => {
      if (timeRemaining > 0 && testStarted) {
        setTimeRemaining(prev => prev - 1);
      } else if (timeRemaining === 0) {
        handleSubmitTest();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timeRemaining]);

  // Fetch questions and audio only after the test is started
  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/listening/generate');
      const data = await response.json();
      setQuestions(data.questions);
      setAudioUrl(data.audioUrl);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setTestStarted(true);
    fetchQuestions();  // Fetch data only after starting the test
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitTest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/listening/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, questions })
      });
      
      const results = await response.json();
      setResults(results);
      setTestStarted(false);
    } catch (error) {
      console.error('Failed to submit test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Preparing your IELTS listening test...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">IELTS Listening Test</h1>
        {timeRemaining !== null && (
          <div className="text-xl font-semibold text-gray-700">
            Time Remaining: {formatTime(timeRemaining)}
          </div>
        )}
      </div>

      {!testStarted && !results && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>This test consists of 4 sections with 10 questions each</li>
            <li>You will hear each section only ONCE</li>
            <li>You have 30 minutes to complete all sections</li>
            <li>Write your answers while listening</li>
            <li>At the end, you will have 10 minutes to transfer your answers</li>
          </ul>
          <Button onClick={handleStartTest} className="w-full">
            Start Test
          </Button>
        </Card>
      )}

      {testStarted && (
        <div className="space-y-6">
          <Card className="p-6">
            <audio ref={audioRef} src={audioUrl} controls className="w-full mb-4" />
            <Progress value={(currentSection + 1) * 25} className="mb-4" />
            <h2 className="text-xl font-semibold mb-4">{sections[currentSection]}</h2>
            
            <div className="space-y-6">
              {questions
                .filter(q => q.section === currentSection)
                .map((question) => (
                  <div key={question.id} className="space-y-2">
                    <Label className="text-base">
                      {question.number}. {question.text}
                    </Label>
                    {question.type === 'fill-in' ? (
                      <Input
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Type your answer"
                        className="max-w-md"
                      />
                    ) : (
                      <div className="space-y-2">
                        {question.options.map((option, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`q${question.id}-${idx}`}
                              name={`question-${question.id}`}
                              value={option}
                              checked={answers[question.id] === option}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <Label htmlFor={`q${question.id}-${idx}`}>{option}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </Card>

          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
              disabled={currentSection === 0}
              variant="outline"
            >
              Previous Section
            </Button>
            {currentSection < 3 ? (
              <Button
                onClick={() => setCurrentSection(prev => Math.min(3, prev + 1))}
                disabled={currentSection === 3}
              >
                Next Section
              </Button>
            ) : (
              <Button onClick={handleSubmitTest}>Submit Test</Button>
            )}
          </div>
        </div>
      )}

      {results && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Test Results</h2>
          <div className="space-y-4">
            <div className="text-xl">
              Score: {results.score}/40 ({(results.score / 40 * 9).toFixed(1)} Band Score)
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detailed Feedback</h3>
              {results.feedback.map((item, index) => (
                <Alert key={index} className={item.correct ? 'bg-green-50' : 'bg-red-50'}>
                  <AlertDescription>
                    <div className="font-semibold">Question {item.questionNumber}</div>
                    <div>Your answer: {item.userAnswer}</div>
                    <div>Correct answer: {item.correctAnswer}</div>
                    {!item.correct && <div className="mt-2">{item.improvement}</div>}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ListeningTest;
