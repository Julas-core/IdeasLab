import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { AIAnalysis, AnalysisData } from "@/components/ai/AIAnalysis";
import { TrendSignals, TrendData } from "@/components/trends/TrendSignals";
import { FounderFitQuiz } from "@/components/founderfit/FounderFitQuiz";
import { GoToMarketHelpers, GoToMarketData } from "@/components/gotomarket/GoToMarketHelpers";
import { ExportReport } from "@/components/export/ExportReport";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { LoadingSkeleton } from "@/components/layout/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

interface IdeaData {
  idea_title: string;
  problem: string;
  solution: string;
  market: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [ideaGenerated, setIdeaGenerated] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<IdeaData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [fitScore, setFitScore] = useState<number | null>(null);
  const [isAnalyzingFit, setIsAnalyzingFit] = useState(false);
  const [goToMarketData, setGoToMarketData] = useState<GoToMarketData | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();
    fetchIdeaOfTheDay();
  }, []);

  const fetchIdeaOfTheDay = async () => {
    setIsLoading(true);
    setFitScore(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-idea');
      if (error) throw error;

      setCurrentIdea(data.idea);
      setAnalysisData(data.analysis);
      setTrendData(data.trends);
      setGoToMarketData(data.goToMarket);
      setIdeaGenerated(prev => !prev);
    } catch (error) {
      console.error("Error fetching new idea:", error);
      showError("Failed to generate a new idea. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeFit = (description: string) => {
    setIsAnalyzingFit(true);
    setFitScore(null);
    setTimeout(() => {
      const baseScore = Math.min(description.length / 2, 70);
      const randomFactor = Math.floor(Math.random() * 30);
      setFitScore(Math.min(Math.round(baseScore + randomFactor), 99));
      setIsAnalyzingFit(false);
    }, 1500);
  };

  const handleSaveIdea = async () => {
    if (!user) {
      showError("You must be logged in to save an idea.");
      return;
    }
    if (!currentIdea) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('ideas').insert({
        user_id: user.id,
        idea_title: currentIdea.idea_title,
        problem: currentIdea.problem,
        solution: currentIdea.solution,
        market: currentIdea.market,
        analysis: analysisData,
        trend_data: trendData,
        go_to_market: goToMarketData,
        fit_score: fitScore,
      });

      if (error) throw error;
      showSuccess("Idea saved successfully!");
    } catch (error) {
      console.error("Error saving idea:", error);
      showError("Failed to save idea. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          currentIdea && (
            <>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Idea of the Day</h2>
                  <p className="text-muted-foreground">An AI-generated startup concept based on emerging trends.</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={fetchIdeaOfTheDay} disabled={isLoading}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Idea
                  </Button>
                  {user && (
                    <Button onClick={handleSaveIdea} disabled={isSaving}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? 'Saving...' : 'Save Idea'}
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>{currentIdea.idea_title}</CardTitle>
                      <CardDescription>{currentIdea.problem}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p><span className="font-semibold">Solution: </span>{currentIdea.solution}</p>
                      <p className="mt-2"><span className="font-semibold">Market: </span>{currentIdea.market}</p>
                    </CardContent>
                  </Card>
                  <FounderFitQuiz 
                      onAnalyze={handleAnalyzeFit}
                      isAnalyzing={isAnalyzingFit}
                      score={fitScore}
                      ideaSubmitted={ideaGenerated} 
                  />
                  <ExportReport 
                      idea={currentIdea}
                      analysis={analysisData}
                      trends={trendData}
                      fitScore={fitScore}
                      goToMarket={goToMarketData}
                  />
                </div>
                <div className="lg:col-span-2 space-y-8">
                  <AIAnalysis data={analysisData} />
                  <TrendSignals data={trendData} />
                  <GoToMarketHelpers data={goToMarketData} />
                </div>
              </div>
            </>
          )
        )}
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;