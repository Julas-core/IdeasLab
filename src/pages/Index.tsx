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

const trendingTopics = [
  "Sustainable Packaging", "AI for Personal Finance", "Remote Team Collaboration",
  "Mental Wellness Apps", "Hyperlocal Delivery", "Personalized Nutrition",
  "Gamified Education", "Circular Economy Fashion",
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ideaGenerated, setIdeaGenerated] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<IdeaData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [fitScore, setFitScore] = useState<number | null>(null);
  const [isAnalyzingFit, setIsAnalyzingFit] = useState(false);
  const [goToMarketData, setGoToMarketData] = useState<GoToMarketData | null>(null);

  useEffect(() => {
    const fetchIdeaOfTheDay = () => {
      setIsLoading(true);
      setFitScore(null); // Reset fit score for new idea
      // Simulate API call to the edge function
      setTimeout(() => {
        const randomTopic = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
        const idea = generateMockIdea(randomTopic);
        
        setCurrentIdea(idea);
        setAnalysisData(generateMockAnalysis(idea));
        setTrendData(generateMockTrends(idea));
        setGoToMarketData(generateMockGoToMarket(idea));
        
        setIdeaGenerated(prev => !prev); // Toggle to reset quiz
        setIsLoading(false);
      }, 1500);
    };

    fetchIdeaOfTheDay();
  }, []);

  const handleAnalyzeFit = (description: string) => {
    setIsAnalyzingFit(true);
    setFitScore(null);
    // Simulate AI analysis
    setTimeout(() => {
      // Simple logic: longer description = higher score, plus some randomness
      const baseScore = Math.min(description.length / 2, 70);
      const randomFactor = Math.floor(Math.random() * 30);
      setFitScore(Math.min(Math.round(baseScore + randomFactor), 99));
      setIsAnalyzingFit(false);
    }, 1500);
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
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Idea of the Day</h2>
                <p className="text-muted-foreground">An AI-generated startup concept based on emerging trends.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg-col-span-1 space-y-8">
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