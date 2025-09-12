import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AnalysisData {
  problem: string;
  opportunity: string;
  targetAudience: string;
  competitors: string;
  revenuePotential: string;
  risks: string;
  whyNow: string;
}

interface AIAnalysisProps {
  data: AnalysisData | null;
}

export const AIAnalysis = ({ data }: AIAnalysisProps) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Research Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Submit an idea to see the AI analysis.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Research Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <h3 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
            <p className="text-muted-foreground">{value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};