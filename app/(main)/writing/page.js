'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Timer, Book, Send, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
const WritingSection = () => {
  const [activeTask, setActiveTask] = useState('task1');
  const [questionType, setQuestionType] = useState(null);
  const [question, setQuestion] = useState(null);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  const generateQuestion = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generalwriting/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskType: activeTask, questionType }),
      });
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Failed to generate question: ${errorDetails.error || 'Unknown error'}`);
      }
      const data = await response.json();
      setQuestion(data.question);
      setText('');
      setFeedback(null);
      setTimeRemaining(activeTask === 'task1' ? 1200 : 2400); // Reset timer on new question
      setTimerActive(false); // Ensure timer is inactive when generating a new question
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };


  const startTimer = () => {
    setTimerActive(true);
    setTimeRemaining(activeTask === 'task1' ? 1200 : 2400); // Initialize timer based on task
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please write your response before submitting');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/generalwriting/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          taskType: activeTask,
          question: question
        }),
      });
      if (!response.ok) throw new Error('Failed to assess writing');
      const data = await response.json();
      setFeedback(data.feedback);
      setTimerActive(false);
    } catch (error) {
      alert('Failed to assess writing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-6 min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">IELTS General Writing Practice</h1>

        <Tabs defaultValue="task1" value={activeTask} onValueChange={setActiveTask}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="task1">Task 1 - Letter Writing</TabsTrigger>
            <TabsTrigger value="task2">Task 2 - Essay Writing</TabsTrigger>
          </TabsList>

          <TabsContent value="task1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  Letter Writing Task
                </CardTitle>
                {!question && (
                  <div className="flex gap-4 mt-4">
                    <Button onClick={() => {
                      setQuestionType('formal');
                      generateQuestion();
                    }}>Formal Letter</Button>
                    <Button onClick={() => {
                      setQuestionType('semiformal');
                      generateQuestion();
                    }}>Semi-formal Letter</Button>
                    <Button onClick={() => {
                      setQuestionType('informal');
                      generateQuestion();
                    }}>Informal Letter</Button>
                  </div>
                )}
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="task2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  Essay Writing Task
                </CardTitle>
                {!question && (
                  <Button onClick={() => {
                    setQuestionType('essay');
                    generateQuestion();
                  }}>Generate Essay Question</Button>
                )}
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>

        {question && (
          <>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Your Task:</h3>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => generateQuestion()}
                      disabled={isGenerating}
                    >
                      <RefreshCcw className="w-4 h-4 mr-2" />
                      New Question
                    </Button>
                    {!timerActive && timeRemaining === null && (
                      <Button onClick={startTimer}>
                        <Timer className="w-4 h-4 mr-2" />
                        Start Timer
                      </Button>
                    )}
                    {timeRemaining !== null && (
                      <div className={`text-lg font-mono ${timeRemaining < 300 ? 'text-red-500' : 'text-blue-600'}`}>
                        {formatTime(timeRemaining)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <CardContent>
                    <ReactMarkdown>{question}</ReactMarkdown>
                  </CardContent>
                </div>
              </CardContent>
            </Card>

            <Textarea
              placeholder="Write your response here..."
              className="min-h-[400px] w-full p-4 border border-gray-300 rounded-lg shadow focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none resize-none mb-4"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Word count: {text.trim().split(/\s+/).filter(Boolean).length} words
                {activeTask === 'task1' ? ' (minimum 150)' : ' (minimum 250)'}
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Assessing...' : 'Submit for Assessment'}
              </Button>
            </div>
          </>
        )}

        {feedback && (
          <Card className="mt-8 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-700">Your Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(feedback).map(([criterion, score]) => (
                  <div key={criterion} className="border-b border-green-200 pb-4">
                    <h4 className="font-semibold text-green-800 mb-2">
                      {criterion.charAt(0).toUpperCase() + criterion.slice(1)}
                    </h4>
                    <p className="text-gray-800">{score}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WritingSection;
