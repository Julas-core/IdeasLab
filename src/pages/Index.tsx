import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { KeywordForm, KeywordFormValues } from "@/components/ideagen/KeywordForm";
import { AIAnalysis, AnalysisData } from "@/components/ai/AIAnalysis";
import { TrendSignals, TrendData } from "@/components/trends/TrendSignals";
import { FounderFitQuiz } from "@/components/founderfit/FounderFitQuiz";
import { GoToMarketHelpers, GoToMarketData } from "@/components/gotomarket/GoToMarketHelpers";
import { ExportReport } from "@/components/export/ExportReport";
import { MadeWithDyad } from "@/components/made-with-dyad";

// This type is now used for the AI-generated idea
interface IdeaData {
  idea_title: string;
  problem: string;
  solution: string;
  market: string;
}

// Mock data generation functions for local fallback
const generateMockIdea = (keyword: string): IdeaData => ({
    idea_title: `AI-Powered ${keyword} Platform`,
    problem: `People interested in ${keyword} lack a centralized, easy-to-use solution.`,
    solution: `A comprehensive platform that uses AI to provide personalized ${keyword} recommendations and resources.`,
    market: `Enthusiasts and professionals in the ${keyword} space.`,
});

const generateMockAnalysis = (idea: IdeaData): AnalysisData => ({
  problem: `A deeper look into the problem of '${idea.problem}'. It seems to affect ${idea.market} significantly.`,
  opportunity: `There is a huge opportunity to solve this with '${idea.solution}'. The market is ripe for disruption.`,
  targetAudience: `The primary target audience is ${idea.market}, specifically those who struggle with this daily.`,
  competitors: "Current competitors are slow and expensive. Key players include LegacyCorp and OldTech Inc.",
  revenuePotential: "High potential for a subscription-based model, with projected ARR of $5M in 3 years.",
  risks: "Market adoption could be slow. Technological hurdles may arise.",
  whyNow: "Recent advancements in technology and a shift in consumer behavior make this the perfect time.",
});

const generateMockTrends = (idea: IdeaData): TrendData => ({
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

const generateMockGoToMarket = (idea: IdeaData): GoToMarketData => ({
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideaGenerated, setIdeaGenerated] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<IdeaData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [fitScore, setFitScore] = useState<number | null>(null);
  const [goToMarketData, setGoToMarketData] = useState<GoToMarketData | null>(null);

  const handleKeywordSubmit = (values: KeywordFormValues) => {
    setIsGenerating(true);
    setIdeaGenerated(false);
    setCurrentIdea(null);
    setAnalysisData(null);
    setTrendData(null);
    setGoToMarketData(null);
    setFitScore(null);
    
    // Simulate API call to the new edge function
    setTimeout(() => {
      const idea = generateMockIdea(values.keyword);
      setCurrentIdea(idea);
      setAnalysisData(generateMockAnalysis(idea));
      setTrendData(generateMockTrends(idea));
      setGoToMarketData(generateMockGoToMarket(idea));
      setIsGenerating(false);
      setIdeaGenerated(prev => !prev); // Toggle to reset quiz
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-8">
            <KeywordForm onSubmit={handleKeywordSubmit} isGenerating={isGenerating} />
            {currentIdea && <FounderFitQuiz onScoreChange={setFitScore} ideaSubmitted={ideaGenerated} />}
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