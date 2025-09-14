import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface BlurredProFeatureProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export const BlurredProFeature = ({ children, title, description }: BlurredProFeatureProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg border">
      <div className="blur-md pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4 text-center">
        <Crown className="h-10 w-10 text-primary mb-4" />
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground mt-2 mb-6 max-w-xs">{description}</p>
        <Button asChild>
          <Link to="/payments">Upgrade to Pro</Link>
        </Button>
      </div>
    </div>
  );
};