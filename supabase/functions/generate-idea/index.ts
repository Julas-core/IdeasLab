import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not set in Supabase secrets.");
    }

    const prompt = `You are an expert startup analyst. Your task is to generate a novel startup idea based on current, real-world trends. You must provide the output in a structured JSON format.

    The JSON object should have the following keys: "idea", "analysis", "trends", "goToMarket", "idea_attributes", "idea_health_metrics", and "value_ladder".

    1.  **idea**: An object with "idea_title", "problem", "solution", and "market".
        -   "idea_title": A catchy name for the startup.
        -   "problem": A concise description of a real problem people are facing.
        -   "solution": A clear, innovative solution to that problem.
        -   "market": The target audience or market for this solution.

    2.  **analysis**: An object with "problem", "opportunity", "targetAudience", "competitors", "revenuePotential", "risks", and "whyNow".
        -   Provide a detailed breakdown for each field.

    3.  **trends**: An object with "googleTrends" and "redditMentions".
        -   "googleTrends": An array of 3 objects, each with "name" (a relevant search term) and "interest" (a score from 0-100).
        -   "redditMentions": An array of 2 objects, each with "name" (a relevant subreddit or topic) and "mentions" (an estimated number of recent mentions).

    4.  **goToMarket**: An object with "landingPageCopy", "brandNameSuggestions", and "adCreativeIdeas".
        -   "landingPageCopy": An object with "headline", "subheadline", and "cta".
        -   "brandNameSuggestions": An array of 3 creative brand names.
        -   "adCreativeIdeas": An array of 2 distinct ad ideas.

    5.  **idea_attributes**: An object with three keys: "timing", "advantage", and "quality".
        -   For each key, provide a short, catchy phrase (e.g., "Perfect Timing", "Unfair Advantage", "10x Better Solution").

    6.  **idea_health_metrics**: An object with four keys: "opportunity", "feasibility", "marketSize", and "whyNow".
        -   For each key, provide a numerical score from 0 to 100.

    7.  **value_ladder**: An array of 3 objects, each representing a product tier. Each object should have "name", "description", and "price".
        -   Example tiers: "Freebie", "Core Offer", "Premium Subscription".

    Generate a high-quality, plausible, and interesting startup concept. Ensure the final output is a single, valid JSON object. The user will now ask for an idea.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { text: "Generate a new startup idea." }
          ]
        }],
        generationConfig: {
          response_mime_type: "application/json",
        }
      }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Gemini API error: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`Gemini API error: ${response.statusText} - ${errorBody}`);
    }

    const completion = await response.json();
    const responseData = JSON.parse(completion.candidates[0].content.parts[0].text);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Error in generate-idea function:", error);
    return new Response(JSON.stringify({ error: "Failed to generate idea: " + error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})