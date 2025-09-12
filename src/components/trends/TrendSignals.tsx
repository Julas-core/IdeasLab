import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export interface TrendData {
    googleTrends: { name: string; interest: number }[];
    redditMentions: { name: string; mentions: number }[];
}

interface TrendSignalsProps {
    data: TrendData | null;
}

export const TrendSignals = ({ data }: TrendSignalsProps) => {
    if (!data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><TrendingUp className="mr-2" /> Trend Signals</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>No trend data available.</p>
                </CardContent>
            </Card>
        );
    }

    const trendColors = [
        "bg-sky-500",
        "bg-amber-500",
        "bg-emerald-500",
        "bg-indigo-500",
        "bg-rose-500",
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><TrendingUp className="mr-2" /> Trend Signals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <h3 className="font-semibold mb-4 text-center">Google Trends Interest</h3>
                    <div className="flex flex-wrap items-end justify-center gap-6 min-h-[150px]">
                        {data.googleTrends.map((trend, index) => {
                            const size = 60 + trend.interest * 1; // Scale size based on interest
                            const color = trendColors[index % trendColors.length];
                            return (
                                <div key={index} className="flex flex-col items-center gap-2">
                                    <div
                                        className={`rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300 ease-in-out ${color}`}
                                        style={{ width: `${size}px`, height: `${size}px` }}
                                        title={`Interest: ${trend.interest}`}
                                    >
                                        {trend.interest}
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">{trend.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Reddit Mentions</h3>
                    <ul className="space-y-2">
                        {data.redditMentions.map((item, index) => (
                            <li key={index} className="flex justify-between items-center bg-muted p-2 rounded-md">
                                <span>{item.name}</span>
                                <span className="font-bold">{item.mentions} mentions</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};