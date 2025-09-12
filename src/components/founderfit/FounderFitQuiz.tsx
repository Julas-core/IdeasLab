import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";

interface FounderFitQuizProps {
  onAnalyze: (description: string) => void;
  isAnalyzing: boolean;
  score: number | null;
  ideaSubmitted: boolean;
}

export const FounderFitQuiz = ({ onAnalyze, isAnalyzing, score, ideaSubmitted }: FounderFitQuizProps) => {
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Reset the text area when a new idea is generated
    setDescription("");
  }, [ideaSubmitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length > 10) { // Basic validation
      onAnalyze(description);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Founder Fit Analysis</CardTitle>
        <CardDescription>Describe your background and skills, and let the AI determine your fit.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="e.g., I'm a software engineer with 5 years of experience in SaaS. I'm passionate about sustainable tech and have experience leading small teams..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            disabled={isAnalyzing}
          />
          <Button type="submit" disabled={isAnalyzing || description.trim().length < 10} className="w-full">
            {isAnalyzing ? "Analyzing..." : "Analyze My Fit"}
          </Button>
        </form>
        {score !== null && !isAnalyzing && (
          <div className="text-center pt-4">
            <p className="text-lg font-bold">Your Founder Fit Score:</p>
            <p className="text-4xl font-bold text-primary">{score}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};