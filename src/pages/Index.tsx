import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { IdeaForm, IdeaFormValues } from "@/components/ideacapture/IdeaForm";
import { AIAnalysis, AnalysisData } from "@/components/ai/AIAnalysis";
import { TrendSignals, TrendData } from "@/components/trends/TrendSignals";
import { FounderFitQuiz } from "@/components/founderfit/FounderFitQuiz";
import { GoToMarketHelpers, GoToMarketData } from "@/components/gotomarket/GoToMarketHelpers";
import { ExportReport } from "@/components/export/ExportReport";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { supabase } from "@/integrations/supabase/client";
import { showLoading, showSuccess, showError, dismissToast } from "@/utils/toast";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ideaSubmitted, setIdeaSubmitted] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<IdeaFormValues | null>(null);
  const [currentIdeaId, setCurrentIdeaId] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [fitScore, setFitScore] = useState<number | null>(null);
  const [goToMarketData, setGoToMarketData] = useState<GoToMarketData | null>(null);

  const handleIdeaSubmit = async (values: IdeaFormValues) => {
    setIsAnalyzing(true);
    const toastId = showLoading("Analyzing your idea...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to submit an idea.");

      const { data: analysisResults, error: functionError } = await supabase.functions.invoke('analyze-idea', {
        body: values,
      });
      if (functionError) throw functionError;

      const ideaToInsert = {
        user_id: user.id,
        idea_title: values.idea_title,
        problem: values.problem,
        solution: values.solution,
        market: values.market,
        analysis: analysisResults.analysis,
        trend_data: analysisResults.trends,
        go_to_market: analysisResults.goToMarket,
      };

      const { data: newIdea, error: insertError } = await supabase
        .from('ideas')
        .insert(ideaToInsert)
        .select('id')
        .single();

      if (insertError) throw insertError;
      if (!newIdea) throw new Error("Failed to save the idea.");

      setCurrentIdea(values);
      setCurrentIdeaId(newIdea.id);
      setAnalysisData(analysisResults.analysis);
      setTrendData(analysisResults.trends);
      setGoToMarketData(analysisResults.goToMarket);
      setFitScore(null); // Reset fit score for new idea
      setIdeaSubmitted(prev => !prev);

      showSuccess("Idea analyzed and saved successfully!");
    } catch (error) {
      console.error("Error analyzing idea:", error);
      showError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      dismissToast(toastId);
      setIsAnalyzing(false);
    }
  };

  const handleFitScoreChange = async (score: number | null) => {
    setFitScore(score);
    if (score !== null && currentIdeaId) {
      const { error } = await supabase
        .from('ideas')
        .update({ fit_score: score })
        .eq('id', currentIdeaId);
      
      if (error) {
        showError("Failed to save founder fit score.");
        console.error("Error updating fit score:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-8">
            <IdeaForm onSubmit={handleIdeaSubmit} isAnalyzing={isAnalyzing} />
            {currentIdea && <FounderFitQuiz onScoreChange={handleFitScoreChange} ideaSubmitted={ideaSubmitted} />}
            {currentIdea && <ExportReport 
                idea={currentIdea}
                analysis={analysisData}
                trends={trendData}
                fitScore={fitScore}
                goToMarket={goToMarketData}
            />}
          </div>
          <div className="lg:col-span-2 space-y-8">
            <AIAnalysis data={analysisData} />
            <TrendSignals data={trendData} />
            <GoToMarketHelpers data={goToMarketData} />
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;