import { Card } from "@/components/ui/card";
import { BrainCircuit, Lightbulb, LineChart } from "lucide-react";

export const Features = () => {
    return (
        <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent mt-16">
            <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Powerful Features to Fuel Your Innovation
                    </h2>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                        From AI-powered analysis to market trend insights, we've got everything you need to turn a spark of an idea into a viable business plan.
                    </p>
                </div>
                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-3">
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2">
                            <div className="relative flex w-full flex-col justify-between gap-6 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center rounded-lg border bg-background p-2">
                                        <Lightbulb className="h-5 w-5" />
                                    </div>
                                    <p className="font-medium">Idea Generation</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Generate unique startup ideas based on your interests and market trends.
                                </p>
                            </div>
                        </Card>
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-4">
                            <div className="relative flex w-full flex-col justify-between gap-6 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center rounded-lg border bg-background p-2">
                                        <BrainCircuit className="h-5 w-5" />
                                    </div>
                                    <p className="font-medium">AI Analysis</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Get in-depth analysis of your ideas, including potential market fit, competition, and monetization strategies.
                                </p>
                            </div>
                        </Card>
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-4">
                            <div className="relative flex w-full flex-col justify-between gap-6 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center rounded-lg border bg-background p-2">
                                        <LineChart className="h-5 w-5" />
                                    </div>
                                    <p className="font-medium">Market Trends</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Stay ahead of the curve with real-time data on emerging market trends and consumer behavior.
                                </p>
                            </div>
                        </Card>
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2">
                            <div className="relative flex w-full flex-col justify-between gap-6 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center rounded-lg border bg-background p-2">
                                        <Lightbulb className="h-5 w-5" />
                                    </div>
                                    <p className="font-medium">Validation</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Validate your ideas with our tools to ensure you're building something people actually want.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};