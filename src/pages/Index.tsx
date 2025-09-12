import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { IdeaForm, IdeaFormValues } from "@/components/ideacapture/IdeaForm";
import { AIAnalysis, AnalysisData } from "@/components/ai/AIAnalysis";
import { TrendSignals, TrendData } from "@/components/trends/TrendSignals";
import { FounderFitQuiz } from "@/components/founderfit/FounderFitQuiz";
import { GoToMarketHelpers, GoToMarketData } from "@/components/gotomarket/GoToMarketHelpers";
import { ExportReport } from "@/components/export/ExportReport";
import { MadeWithDyad } from "@/components/made-with-dyad";

// Mock data generation functions
const generateMockAnalysis = (idea: IdeaFormValues): AnalysisData => ({
  problem: `A deeper look into the problem of '${idea.problem}'. It seems to affect ${idea.market} significantly.`,
  opportunity: `There is a huge opportunity to solve this with '${idea.solution}'. The market is ripe for disruption.`,
  targetAudience: `The primary target audience is ${idea.market}, specifically those who struggle with this daily.`,
  competitors: "Current competitors are slow and expensive. Key players include LegacyCorp and OldTech Inc.",
  revenuePotential: "High potential for a subscription-based model, with projected ARR of $5M in 3 years.",
  risks: "Market adoption could be slow. Technological hurdles may arise.",
  whyNow: "Recent advancements in technology and a shift in consumer behavior make this the perfect time.",
});

const generateMockTrends = (idea: IdeaFormValues): TrendData => ({
    googleTrends: [
        { name: idea.idea_title.split(" ")[0], interest: Math.floor(Math.random() * 100) },
        { name: "competitor A", interest: Math.floor(Math.random() * 100) },
        { name: "competitor B", interest: Math.floor(Math.random() * 100) },
    ],
    redditMentions: [
        { name: idea.idea_title.split(" ")[0], mentions: Math.floor(Math.random() * 500) },
        { name: "related topic", mentions: Math.floor(Math.random() * 500) },
    ]
});

const generateMockGoToMarket = (idea: IdeaFormValues): GoToMarketData => ({
    landingPageCopy: {
        headline: `The Ultimate Solution for ${idea.problem}`,
        subheadline: `With ${idea.idea_title}, you can finally achieve your goals without the hassle.`,
        cta: "Get Started for Free",
    },
    brandNameSuggestions: ["Solutionify", `${idea.idea_title.split(" ")[0]}Hub`, "NextGen Solutions"],
    adCreativeIdeas: [
        `A video showing someone struggling with '${idea.problem}' and then finding relief with '${idea.solution}'.`,
        `A carousel ad on Instagram showcasing key features.`,
    ]
});


const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ideaSubmitted, setIdeaSubmitted] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<IdeaFormValues | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [fitScore, setFitScore] = useState<number | null>(null);
  const [goToMarketData, setGoToMarketData] = useState<GoToMarketData | null>(null);

  const handleIdeaSubmit = (values: IdeaFormValues) => {
    setIsAnalyzing(true);
    setCurrentIdea(values);
    setIdeaSubmitted(prev => !prev); // Toggle to reset quiz
    
    // Simulate API calls
    setTimeout(() => {
      setAnalysisData(generateMockAnalysis(values));
      setTrendData(generateMockTrends(values));
      setGoToMarketData(generateMockGoToMarket(values));
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-8">
            <IdeaForm onSubmit={handleIdeaSubmit} isAnalyzing={isAnalyzing} />
            {currentIdea && <FounderFitQuiz onScoreChange={setFitScore} ideaSubmitted={ideaSubmitted} />}
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