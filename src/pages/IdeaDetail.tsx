import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { AIAnalysis, AnalysisData } from "@/components/ai/AIAnalysis";
import { TrendSignals, TrendData } from "@/components/trends/TrendSignals";
import { GoToMarketHelpers, GoToMarketData } from "@/components/gotomarket/GoToMarketHelpers";
import { ExportReport } from "@/components/export/ExportReport";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { showError, showSuccess } from "@/utils/toast";
import { LoadingSkeleton } from "@/components/layout/LoadingSkeleton";
import { BGPattern } from "@/components/ui/bg-pattern";
import { ProFeatureCard } from "@/components/layout/ProFeatureCard";
import { User } from "@supabase/supabase-js";
import { IdeaAttributes, IdeaAttributesData } from "@/components/ideas/IdeaAttributes";
import { IdeaHealthMetrics, IdeaHealthMetricsData } from "@/components/ideas/IdeaHealthMetrics";
import { ValueLadder, ValueLadderItem } from "@/components/ideas/ValueLadder";

interface IdeaData {
  id: string;
  idea_title: string;
  problem: string;
  solution: string;
  market: string;
  analysis: AnalysisData | null;
  trend_data: TrendData | null;
  go_to_market: GoToMarketData | null;
  fit_score: number | null;
  idea_attributes: IdeaAttributesData | null;
  idea_health_metrics: IdeaHealthMetricsData | null;
  value_ladder: ValueLadderItem[] | null;
}

const IdeaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<IdeaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProUser, setIsProUser] = useState(false);

  useEffect(() => {
    const fetchIdeaAndUserStatus = async () => {
      if (!id) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single();
        if (profile) {
          setIsProUser(['pro', 'admin'].includes(profile.subscription_status || ''));
        }
      }

      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error fetching idea:", error);
        showError("Could not find the requested idea.");
        navigate("/my-ideas");
      } else {
        setIdea(data);
      }
      setLoading(false);
    };

    fetchIdeaAndUserStatus();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("ideas").delete().eq("id", id);
      if (error) throw error;
      showSuccess("Idea deleted successfully.");
      navigate("/my-ideas");
    } catch (error) {
      console.error("Error deleting idea:", error);
      showError("Failed to delete the idea.");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <BGPattern variant="grid" mask="fade-edges" />
        <Header />
        <main className="container mx-auto p-4 md:p-8">
          <LoadingSkeleton />
        </main>
        <MadeWithDyad />
      </div>
    );
  }

  if (!idea) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative">
      <BGPattern variant="grid" mask="fade-edges" />
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{idea.idea_title}</h2>
            <p className="text-muted-foreground">A detailed breakdown of your saved idea.</p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Idea
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this idea from your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Yes, delete it"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <div className="mb-2">
                  <IdeaAttributes data={idea.idea_attributes} />
                </div>
                <CardTitle>{idea.idea_title}</CardTitle>
                <CardDescription>{idea.problem}</CardDescription>
              </CardHeader>
              <CardContent>
                <p><span className="font-semibold">Solution: </span>{idea.solution}</p>
                <p className="mt-2"><span className="font-semibold">Market: </span>{idea.market}</p>
                {idea.fit_score && (
                    <div className="text-center pt-4 mt-4 border-t">
                        <p className="text-lg font-bold">Your Founder Fit Score:</p>
                        <p className="text-4xl font-bold text-primary">{idea.fit_score}%</p>
                    </div>
                )}
              </CardContent>
            </Card>
            <IdeaHealthMetrics data={idea.idea_health_metrics} />
            <ExportReport 
                idea={idea}
                analysis={idea.analysis}
                trends={idea.trend_data}
                fitScore={idea.fit_score}
                goToMarket={idea.go_to_market}
            />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <AIAnalysis data={idea.analysis} />
            <TrendSignals data={idea.trend_data} />
            {isProUser ? (
              <>
                <ValueLadder data={idea.value_ladder} />
                <GoToMarketHelpers data={idea.go_to_market} />
              </>
            ) : (
              <>
                <ProFeatureCard
                  title="Unlock Value Ladder"
                  description="View potential monetization strategies for this idea. Upgrade to Pro to access this feature."
                />
                <ProFeatureCard
                  title="Unlock Go-to-Market Helpers"
                  description="View AI-generated landing page copy, brand name suggestions, and ad creative ideas for this idea. Upgrade to Pro to access this feature."
                />
              </>
            )}
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default IdeaDetail;