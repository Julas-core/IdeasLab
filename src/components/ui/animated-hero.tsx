import { Button } from "./button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { RaycastAnimatedBackground } from "./raycast-animated-background";

export const Hero = () => {
  return (
    <div>
      <div className="container mx-auto relative overflow-hidden rounded-2xl border bg-background/50 backdrop-blur-sm">
        <RaycastAnimatedBackground />
        <div className="relative z-10 flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-3xl tracking-tighter text-center font-regular">
              Generate Your Next Big Idea with AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-center">
              IdeaLab uses advanced AI to analyze market trends and help you discover innovative startup opportunities.
            </p>
          </div>
          <div className="flex gap-4">
            <Button size="lg" asChild>
                <Link to="/dashboard">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};