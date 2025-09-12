import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

const questions = [
  "Do you have the skills for this idea?",
  "Do you have the capital/resources?",
  "Do you have the time to execute?",
];

interface FounderFitQuizProps {
    onScoreChange: (score: number | null) => void;
    ideaSubmitted: boolean;
}

export const FounderFitQuiz = ({ onScoreChange, ideaSubmitted }: FounderFitQuizProps) => {
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    setAnswers({});
    setScore(null);
    onScoreChange(null);
  }, [ideaSubmitted, onScoreChange]);

  const handleValueChange = (index: number, value: string) => {
    setAnswers(prev => ({...prev, [index]: value}));
  };

  const calculateScore = () => {
    const yesCount = Object.values(answers).filter(a => a === 'yes').length;
    const newScore = Math.round((yesCount / questions.length) * 100);
    setScore(newScore);
    onScoreChange(newScore);
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Founder Fit</CardTitle>
        <CardDescription>Assess your alignment with the idea.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="space-y-2">
            <p>{i + 1}. {q}</p>
            <RadioGroup onValueChange={(value) => handleValueChange(i, value)} value={answers[i] || ""} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id={`q${i}-yes`} />
                <Label htmlFor={`q${i}-yes`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id={`q${i}-no`} />
                <Label htmlFor={`q${i}-no`}>No</Label>
              </div>
            </RadioGroup>
          </div>
        ))}
        <Button onClick={calculateScore} disabled={!allAnswered} className="w-full">Calculate Score</Button>
        {score !== null && (
            <div className="pt-4 text-center">
                <h3 className="font-semibold">Your Founder Fit Score:</h3>
                <p className="text-2xl font-bold">{score}%</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
};