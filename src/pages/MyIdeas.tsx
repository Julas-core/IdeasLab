import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header"; // Corrected import
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BGPattern } from "@/components/ui/bg-pattern";

interface SavedIdea {
  id: string;
  idea_title: string;
  problem: string;
  created_at: string;
}

const MyIdeas = () => {
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("ideas")
          .select("id, idea_title, problem, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching ideas:", error);
        } else {
          setIdeas(data);
        }
      }
      setLoading(false);
    };

    fetchIdeas();
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <BGPattern variant="grid" mask="fade-edges" />
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">My Saved Ideas</h2>
          <p className="text-muted-foreground">All your brilliant startup concepts in one place.</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <Card key={idea.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{idea.idea_title}</CardTitle>
                  <CardDescription className="line-clamp-3">{idea.problem}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                  <p className="text-sm text-muted-foreground mb-4">
                    Saved on {new Date(idea.created_at).toLocaleDateString()}
                  </p>
                  <Button asChild>
                    <Link to={`/idea/${idea.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No ideas saved yet!</h3>
            <p className="text-muted-foreground mt-2">Head back to the dashboard to generate and save your first idea.</p>
            <Button asChild className="mt-4">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        )}
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default MyIdeas;