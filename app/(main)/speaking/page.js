'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Timer } from '@/components/timer';

const SpeakingSection = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      alert('Error: Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      alert('Error: Please record your response before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/assess/speaking', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to assess speaking');

      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      alert('Error: Failed to assess speaking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = {
    topic: "Describe a place you like to visit in your free time.",
    points: [
      "Where is it?",
      "How often do you go there?",
      "What do you do there?",
      "Why do you like going there?",
    ],
    timeToSpeak: 120, // 2 minutes
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600">Speaking Practice</h2>
        {isRecording && <Timer duration={currentQuestion.timeToSpeak} />}
      </div>

      <Card className="p-8 bg-white shadow-md rounded-lg">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">{currentQuestion.topic}</h3>
        <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
          {currentQuestion.points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>

        <div className="flex justify-center gap-4 mb-6">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="w-40 bg-green-500 text-white font-semibold hover:bg-green-600"
              disabled={isSubmitting}
            >
              <Mic className="mr-2 h-5 w-5" />
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="w-40 bg-red-500 text-white font-semibold hover:bg-red-600"
            >
              <Square className="mr-2 h-5 w-5" />
              Stop Recording
            </Button>
          )}
        </div>

        {audioBlob && !isRecording && (
          <div className="mt-6">
            <audio controls className="w-full mb-4">
              <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
            </audio>
            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Assessing...
                </>
              ) : (
                'Submit for Assessment'
              )}
            </Button>
          </div>
        )}
      </Card>

      {feedback && (
        <Card className="p-6 bg-green-50 border border-green-200 rounded-lg shadow mt-8">
          <h3 className="text-xl font-semibold text-green-700 mb-4">Feedback</h3>
          {feedback.transcription && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Transcription:</h4>
              <p className="text-gray-700">{feedback.transcription}</p>
            </div>
          )}
          <div className="prose dark:prose-invert text-gray-800">
            <h4 className="font-medium mb-2">Assessment:</h4>
            <p className="whitespace-pre-wrap">{feedback.assessment}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SpeakingSection;
