import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IdeaFormValues } from "../ideacapture/IdeaForm";
import { AnalysisData } from "../ai/AIAnalysis";
import { TrendData } from "../trends/TrendSignals";
import { GoToMarketData } from "../gotomarket/GoToMarketHelpers";

interface ExportReportProps {
    idea: IdeaFormValues | null;
    analysis: AnalysisData | null;
    trends: TrendData | null;
    fitScore: number | null;
    goToMarket: GoToMarketData | null;
}

export const ExportReport = ({ idea, analysis, trends, fitScore, goToMarket }: ExportReportProps) => {
    const generateMarkdown = () => {
        if (!idea) return "";

        let markdown = `# Startup Idea Report: ${idea.idea_title}\n\n`;

        markdown += `## Idea Overview\n`;
        markdown += `**Problem:** ${idea.problem}\n\n`;
        markdown += `**Solution:** ${idea.solution}\n\n`;
        markdown += `**Target Market:** ${idea.market}\n\n`;

        if (analysis) {
            markdown += `## AI Analysis\n`;
            markdown += `**Problem Deep Dive:** ${analysis.problem}\n\n`;
            markdown += `**Opportunity:** ${analysis.opportunity}\n\n`;
            markdown += `**Target Audience:** ${analysis.targetAudience}\n\n`;
            markdown += `**Competitors:** ${analysis.competitors}\n\n`;
            markdown += `**Revenue Potential:** ${analysis.revenuePotential}\n\n`;
            markdown += `**Risks:** ${analysis.risks}\n\n`;
            markdown += `**Why Now?:** ${analysis.whyNow}\n\n`;
        }

        if (trends) {
            markdown += `## Trend Signals\n`;
            markdown += `### Google Trends\n`;
            trends.googleTrends.forEach(t => {
                markdown += `- ${t.name}: Interest Score ${t.interest}\n`;
            });
            markdown += `\n### Reddit Mentions\n`;
            trends.redditMentions.forEach(t => {
                markdown += `- ${t.name}: ${t.mentions} mentions\n`;
            });
            markdown += `\n`;
        }

        if (fitScore !== null) {
            markdown += `## Founder Fit Score\n`;
            markdown += `Your score is **${fitScore}%**.\n\n`;
        }

        if (goToMarket) {
            markdown += `## Go-to-Market Helpers\n`;
            markdown += `### Landing Page Copy\n`;
            markdown += `**Headline:** ${goToMarket.landingPageCopy.headline}\n`;
            markdown += `**Sub-headline:** ${goToMarket.landingPageCopy.subheadline}\n`;
            markdown += `**CTA:** ${goToMarket.landingPageCopy.cta}\n\n`;
            markdown += `### Brand Name Suggestions\n`;
            goToMarket.brandNameSuggestions.forEach(name => {
                markdown += `- ${name}\n`;
            });
            markdown += `\n### Ad Creative Ideas\n`;
            goToMarket.adCreativeIdeas.forEach(ad => {
                markdown += `- ${ad}\n`;
            });
            markdown += `\n`;
        }

        return markdown;
    };

    const handleExport = () => {
        const markdownContent = generateMarkdown();
        const blob = new Blob([markdownContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${idea?.idea_title.replace(/\s+/g, '_') || 'idea'}_report.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Export Report</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Export the complete analysis as a Markdown file.</p>
                <Button onClick={handleExport} disabled={!idea} className="w-full">Export as Markdown</Button>
            </CardContent>
        </Card>
    );
};