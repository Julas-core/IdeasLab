import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface GoToMarketData {
    landingPageCopy: {
        headline: string;
        subheadline: string;
        cta: string;
    };
    brandNameSuggestions: string[];
    adCreativeIdeas: string[];
}

interface GoToMarketHelpersProps {
    data: GoToMarketData | null;
}

export const GoToMarketHelpers = ({ data }: GoToMarketHelpersProps) => {
    if (!data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Go-to-Market Helpers</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Submit an idea to get GTM suggestions.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Go-to-Market Helpers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold">Landing Page Copy</h3>
                    <div className="text-muted-foreground space-y-2 mt-2 p-4 bg-secondary rounded-md">
                        <p><strong>Headline:</strong> {data.landingPageCopy.headline}</p>
                        <p><strong>Sub-headline:</strong> {data.landingPageCopy.subheadline}</p>
                        <p><strong>Call to Action:</strong> {data.landingPageCopy.cta}</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold">Brand Name Suggestions</h3>
                    <ul className="list-disc list-inside text-muted-foreground mt-2">
                        {data.brandNameSuggestions.map((name, i) => <li key={i}>{name}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold">Ad Creative Ideas</h3>
                    <ul className="list-disc list-inside text-muted-foreground mt-2">
                        {data.adCreativeIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};