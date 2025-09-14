"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import { AIAnalysis, AnalysisData } from "@/components/ai/AIAnalysis";
import { TrendSignals, TrendData } from "@/components/trends/TrendSignals";
import { FounderFitQuiz } from "@/components/founderfit/FounderFitQuiz";
import { GoToMarketHelpers, GoToMarketData } from "@/components/gotomarket/GoToMarketHelpers";
import { ExportReport } from "@/components/export/ExportReport";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { LoadingSkeleton } from "@/components/layout/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, ExternalLink, Copy, FileText, RefreshCw, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { User } from "@supabase/supabase-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { BGPattern } from "@/components/ui/bg-pattern";
import { Textarea } from "@/components/ui/textarea";
import { ProFeatureCard } from "@/components/layout/ProFeatureCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IdeaAttributes, IdeaAttributesData } from "@/components/ideas/IdeaAttributes";
import { IdeaHealthMetrics, IdeaHealthMetricsData } from "@/components/ideas/IdeaHealthMetrics";
import { ValueLadder, ValueLadderItem } from "@/components/ideas/ValueLadder";

interface IdeaData {
  idea_title: string;
  problem: string;
  solution: string;
  market: string;
}

interface DailyIdeaResponse {
  id: string;
  idea: IdeaData;
  analysis: AnalysisData;
  trends: TrendData;
  goToMarket: GoToMarketData;
  idea_attributes: IdeaAttributesData;
  idea_health_metrics: IdeaHealthMetricsData;
  value_ladder: ValueLadderItem[];
}

interface ProfileData {
    first_name: string | null;
    skills_description: string | null;
    subscription_status: string | null;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ideaGenerated, setIdeaGenerated] = useState(false);
  const [dailyIdeaId, setDailyIdeaId] = useState<string | null>(null);
  const [currentIdea, setCurrentIdea] = useState<IdeaData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [fitScore, setFitScore] = useState<number | null>(null);
  const [isAnalyzingFit, setIsAnalyzingFit] = useState(false);
  const [goToMarketData, setGoToMarketData] = useState<GoToMarketData | null>(null);
  const [ideaAttributes, setIdeaAttributes] = useState<IdeaAttributesData | null>(null);
  const [ideaHealthMetrics, setIdeaHealthMetrics] = useState<IdeaHealthMetricsData | null>(null);
  const [valueLadder, setValueLadder] = useState<ValueLadderItem[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [showBuilders, setShowBuilders] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, skills_description, subscription_status')
          .eq('id', user.id)
          .single();
        
        setProfile(profileData);
        if (profileData && !profileData.first_name) {
            setShowProfilePrompt(true);
        }
      }
    };
    
    fetchDailyIdea();
    checkUserAndProfile();
  }, []);

  const fetchDailyIdea = async (forceNew = false) => {
    setIsLoading(true);
    setFitScore(null);
    setShowBuilders(false);
    
    try {
      const { data, error } = await supabase.functions.invoke<DailyIdeaResponse>('get-daily-idea', {
        body: { forceNew: forceNew }
      });
      if (error) throw error;

      setDailyIdeaId(data.id);
      setCurrentIdea(data.idea);
      setAnalysisData(data.analysis);
      setTrendData(data.trends);
      setGoToMarketData(data.goToMarket);
      setIdeaAttributes(data.idea_attributes);
      setIdeaHealthMetrics(data.idea_health_metrics);
      setValueLadder(data.value_ladder);
      setIdeaGenerated(prev => !prev);
    } catch (error) {
      console.error("Error fetching daily idea:", error);
      showError("Failed to load the idea of the day. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeFit = (description: string) => {
    setIsAnalyzingFit(true);
    setFitScore(null);
    if (user && description !== profile?.skills_description) {
        supabase.from('profiles').update({ skills_description: description }).eq('id', user.id).then();
    }

    setTimeout(() => {
      const baseScore = Math.min(description.length / 2, 70);
      const randomFactor = Math.floor(Math.random() * 30);
      setFitScore(Math.min(Math.round(baseScore + randomFactor), 99));
      setIsAnalyzingFit(false);
    }, 1500);
  };

  const handleOwnIdea = () => {
    if (!user) {
      showError("Please log in to own an idea.");
      navigate('/login');
      return;
    }
    if (dailyIdeaId) {
      navigate(`/payments?ideaId=${dailyIdeaId}`);
    }
  };

  const getFullPrompt = () => {
    if (!currentIdea) return '';
    return `Build a startup app for "${currentIdea.idea_title}".

Problem: ${currentIdea.problem}

Solution: ${currentIdea.solution}

Target market: ${currentIdea.market}

Key features to include: User authentication, basic dashboard, core functionality to solve the problem, and simple UI/UX. Make it scalable and modern using React or similar.`;
  };

  const fullPrompt = getFullPrompt();

  const handleCopyAndOpenBuilders = async () => {
    try {
      await navigator.clipboard.writeText(fullPrompt);
      showSuccess("Prompt copied to clipboard! Now opening builders...");
      setShowBuilders(true);
    } catch (err) {
      showError("Failed to copy prompt. Please copy manually.");
      setShowBuilders(true);
    }
  };

  const getBuilderPrompt = () => {
    if (!currentIdea) return '';
    return encodeURIComponent(
      `Build a startup app for "${currentIdea.idea_title}". Problem: ${currentIdea.problem}. Solution: ${currentIdea.solution}. Target market: ${currentIdea.market}. Include key features like user authentication and a basic dashboard.`
    );
  };

  const prompt = getBuilderPrompt();
  const isProUser = ['pro', 'admin'].includes(profile?.subscription_status || '');

  return (
    <div className="min-h-screen bg-background relative">
      <BGPattern variant="grid" mask="fade-edges" />
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
                  <Button onClick={() => fetchDailyIdea(true)} disabled={isLoading}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate New Idea
                  </Button>
                  <Button asChild>
                    <Link to="/my-ideas">
                      <FileText className="mr-2 h-4 w-4" />
                      My Owned Ideas
                    </Link>
                  </Button>
                  <Button onClick={handleOwnIdea}>
                    <Lock className="mr-2 h-4 w-4" />
                    Own This Idea
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-8">
                  <Card>
                    <CardHeader>
                      <div className="mb-2">
                        <IdeaAttributes data={ideaAttributes} />
                      </div>
                      <CardTitle>{currentIdea.idea_title}</CardTitle>
                      <CardDescription>{currentIdea.problem}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p><span className="font-semibold">Solution: </span>{currentIdea.solution}</p>
                      <p className="mt-2"><span className="font-semibold">Market: </span>{currentIdea.market}</p>
                    </CardContent>
                  </Card>
                  <IdeaHealthMetrics data={ideaHealthMetrics} />
                  {isProUser ? (
                    <FounderFitQuiz 
                        onAnalyze={handleAnalyzeFit}
                        isAnalyzing={isAnalyzingFit}
                        score={fitScore}
                        ideaSubmitted={ideaGenerated}
                        initialDescription={profile?.skills_description || ""}
                    />
                  ) : (
                    <ProFeatureCard
                      title="Unlock Founder Fit Analysis"
                      description="Describe your background and skills to determine your fit with the idea. Upgrade to Pro to access this feature."
                    />
                  )}
                </div>
                <div className="lg:col-span-2 space-y-8">
                  <AIAnalysis data={analysisData} />
                  {isProUser ? (
                    <TrendSignals data={trendData} />
                  ) : (
                    <ProFeatureCard
                      title="Unlock Trend Signals"
                      description="See real-time market trends and data-driven analysis for each idea. Upgrade to Pro to access this feature."
                    />
                  )}
                  {isProUser ? (
                    <ValueLadder data={valueLadder} />
                  ) : (
                     <ProFeatureCard
                      title="Unlock Value Ladder"
                      description="See potential monetization strategies and product tiers for this idea. Upgrade to Pro to access this feature."
                    />
                  )}
                  {isProUser ? (
                    <GoToMarketHelpers data={goToMarketData} />
                  ) : (
                    <ProFeatureCard
                      title="Unlock Go-to-Market Helpers"
                      description="Get AI-generated landing page copy, brand name suggestions, and ad creative ideas. Upgrade to Pro to access this feature."
                    />
                  )}
                </div>
              </div>

              {isProUser ? (
                <div className="mt-12">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ready to Build?</CardTitle>
                      <CardDescription>
                        First, here's a complete prompt for your idea. Copy it and paste into any AI builder. Then open the builders below.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <AnimatePresence mode="wait">
                        {!showBuilders ? (
                          <motion.div
                            key="prompt"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="space-y-4">
                              <Textarea
                                value={fullPrompt}
                                readOnly
                                rows={8}
                                placeholder="Your prompt will appear here..."
                                className="font-mono text-sm bg-muted/50 resize-none"
                              />
                              <Button onClick={handleCopyAndOpenBuilders} className="w-full" variant="secondary">
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Prompt & Open Builders
                              </Button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="builders"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {[
                                { name: 'Lovable', domain: 'lovable.dev' },
                                { name: 'Leap', domain: 'leap.new' },
                                { name: 'Base44', domain: 'base44.dev' },
                                { name: 'Bolt', domain: 'bolt.new' },
                                { name: 'v0', domain: 'v0.dev' },
                                { name: 'Replit AI', domain: 'replit.com' },
                              ].map(builder => (
                                <Button key={builder.name} variant="outline" asChild className="justify-start space-x-2">
                                  <a href={`https://${builder.domain}?prompt=${prompt}`} target="_blank" rel="noopener noreferrer">
                                    <img src={`https://icon.horse/icon/${builder.domain}`} alt={builder.name} className="h-4 w-4 rounded" />
                                    <span>{builder.name}</span>
                                    <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                                  </a>
                                </Button>
                              ))}
                            </div>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setShowBuilders(false);
                                navigator.clipboard.writeText(fullPrompt);
                              }}
                              className="w-full"
                            >
                              Back to Prompt
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="mt-12">
                  <ProFeatureCard
                    title="Ready to Build? Upgrade to Pro!"
                    description="Unlock the ability to generate prompts for AI builders and kickstart your development process. Upgrade to Pro to access this feature."
                  />
                </div>
              )}
            </>
          )
        )}
      </main>
      <Dialog open={showProfilePrompt} onOpenChange={setShowProfilePrompt}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Welcome to IdeaLab!</DialogTitle>
                <DialogDescription>
                    Complete your profile to get the most out of your experience, including more accurate Founder Fit scores.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowProfilePrompt(false)}>Skip for now</Button>
                <Button asChild>
                    <Link to="/profile">Complete Profile</Link>
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      <MadeWithDyad />
    </div>
  );
};

export default Dashboard;