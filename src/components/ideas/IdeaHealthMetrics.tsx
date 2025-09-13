import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface IdeaHealthMetricsData {
  opportunity: number;
  feasibility: number;
  marketSize: number;
  whyNow: number;
}

interface IdeaHealthMetricsProps {
  data: IdeaHealthMetricsData | null;
}

export const IdeaHealthMetrics = ({ data }: IdeaHealthMetricsProps) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Idea Health Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Metrics will be available once an idea is generated.</p>
        </CardContent>
      </Card>
    );
  }

  const getProgressColor = (value: number) => {
    if (value > 75) return "bg-green-500";
    if (value > 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Idea Health Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-sm font-bold">{value}%</span>
            </div>
            <Progress value={value} indicatorClassName={getProgressColor(value)} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};