import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export interface ValueLadderItem {
  name: string;
  description: string;
  price: string;
}

interface ValueLadderProps {
  data: ValueLadderItem[] | null;
}

export const ValueLadder = ({ data }: ValueLadderProps) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Value Ladder</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Monetization ideas will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Value Ladder & Monetization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="p-4 rounded-lg border bg-muted/50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-primary">{item.name}</h3>
              <span className="text-sm font-bold">{item.price}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};