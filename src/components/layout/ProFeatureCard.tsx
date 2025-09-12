import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Crown } from "lucide-react";

interface ProFeatureCardProps {
  title: string;
  description: string;
}

export const ProFeatureCard = ({ title, description }: ProFeatureCardProps) => {
  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader className="text-center">
        <Crown className="h-8 w-8 text-primary mx-auto mb-2" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button asChild className="w-full">
          <Link to="/payments">Upgrade to Pro</Link>
        </Button>
      </CardContent>
    </Card>
  );
};