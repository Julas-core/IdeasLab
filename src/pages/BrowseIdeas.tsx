import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BGPattern } from "@/components/ui/bg-pattern";
import { IdeaAttributes, IdeaAttributesData } from "@/components/ideas/IdeaAttributes";

interface DailyIdea {
  id: string;
  generated_at: string;
  idea_data: {
    idea: {
      idea_title: string;
      problem: string;
    };
    idea_attributes: IdeaAttributesData;
  };
}

const BrowseIdeas = () => {
  const [ideas, setIdeas] = useState<DailyIdea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      const { data, error } = await supabase
        .from("daily_ideas")
        .select("id, generated_at, idea_data")
        .order("generated_at", { ascending: false });

      if (error) {
        console.error("Error fetching daily ideas:", error);
      } else {
        setIdeas(data as DailyIdea[]);
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
          <h2 className="text-3xl font-bold tracking-tight">Idea Database</h2>
          <p className="text-muted-foreground">Explore past "Ideas of the Day" for inspiration.</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
                  <CardTitle>{idea.idea_data.idea.idea_title}</CardTitle>
                  <CardDescription className="line-clamp-3">{idea.idea_data.idea.problem}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                  <div className="mb-4">
                    <IdeaAttributes data={idea.idea_data.idea_attributes} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generated on {new Date(idea.generated_at).toLocaleDateString()}
                  </p>
                  {/* This link won't work yet as these aren't user-saved ideas, but sets up future functionality */}
                  <Button disabled>View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No ideas found!</h3>
            <p className="text-muted-foreground mt-2">The idea database is currently empty. Check back later!</p>
          </div>
        )}
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default BrowseIdeas;