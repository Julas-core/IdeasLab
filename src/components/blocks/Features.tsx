import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, LineChart, Rocket } from "lucide-react";

export const Features = () => {
    return (
        <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
            <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">Features</h2>
                </div>
                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-3">
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BrainCircuit /> AI-Powered Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                Leverage cutting-edge AI to analyze your ideas for market fit, potential challenges, and growth opportunities.
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LineChart /> Market Trend Insights
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                Stay ahead of the curve with real-time data on market trends, helping you identify and capitalize on emerging opportunities.
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Rocket /> Go-to-Market Strategy
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                Receive a comprehensive, AI-generated go-to-market strategy to guide your launch and ensure your idea reaches its target audience.
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2">
                            <CardHeader>
                                <CardTitle>
                                    And much more...
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}