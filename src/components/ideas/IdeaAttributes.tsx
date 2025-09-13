import { Badge } from "@/components/ui/badge";
import { Lightbulb, Zap, Gem } from "lucide-react";

export interface IdeaAttributesData {
  timing: string;
  advantage: string;
  quality: string;
}

interface IdeaAttributesProps {
  data: IdeaAttributesData | null;
}

export const IdeaAttributes = ({ data }: IdeaAttributesProps) => {
  if (!data) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline" className="border-yellow-400/50 bg-yellow-400/10 text-yellow-300">
        <Lightbulb className="mr-1 h-3 w-3" /> {data.timing}
      </Badge>
      <Badge variant="outline" className="border-purple-400/50 bg-purple-400/10 text-purple-300">
        <Zap className="mr-1 h-3 w-3" /> {data.advantage}
      </Badge>
      <Badge variant="outline" className="border-teal-400/50 bg-teal-400/10 text-teal-300">
        <Gem className="mr-1 h-3 w-3" /> {data.quality}
      </Badge>
    </div>
  );
};