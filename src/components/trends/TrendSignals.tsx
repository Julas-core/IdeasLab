import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
                    <CardTitle>Trend Signals</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Submit an idea to see trend data.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trend Signals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">Google Trends Interest</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={data.googleTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="interest" fill="hsl(var(--primary))" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Reddit Mentions</h3>
                     <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={data.redditMentions}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="mentions" fill="hsl(var(--primary))" opacity={0.7} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};