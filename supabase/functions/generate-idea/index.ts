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
    const openrouterApiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openrouterApiKey) {
      throw new Error("OpenRouter API key is not set in Supabase secrets.");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openrouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://wkdugvkkxabtipqfvxcd.supabase.co", // Recommended by OpenRouter
        "X-Title": "IdeaLab", // Recommended by OpenRouter
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct-v0.2", // A powerful and cost-effective model
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are an expert startup analyst. Your task is to generate a novel startup idea based on current, real-world trends. You must provide the output in a structured JSON format.

            The JSON object should have the following keys: "idea", "analysis", "trends", and "goToMarket".

            1.  **idea**: An object with "idea_title", "problem", "solution", and "market".
                -   "idea_title": A catchy name for the startup.
                -   "problem": A concise description of a real problem people are facing, based on a current trend.
                -   "solution": A clear, innovative solution to that problem.
                -   "market": The target audience or market for this solution.

            2.  **analysis**: An object with "problem", "opportunity", "targetAudience", "competitors", "revenuePotential", "risks", and "whyNow".
                -   Provide a detailed breakdown for each field. "whyNow" should explain why this idea is timely.

            3.  **trends**: An object with "googleTrends" and "redditMentions".
                -   "googleTrends": An array of 3 objects, each with "name" (a relevant search term) and "interest" (a score from 0-100).
                -   "redditMentions": An array of 2 objects, each with "name" (a relevant subreddit or topic) and "mentions" (an estimated number of recent mentions).

            4.  **goToMarket**: An object with "landingPageCopy", "brandNameSuggestions", and "adCreativeIdeas".
                -   "landingPageCopy": An object with "headline", "subheadline", and "cta".
                -   "brandNameSuggestions": An array of 3 creative brand names.
                -   "adCreativeIdeas": An array of 2 distinct ad ideas.

            Generate a high-quality, plausible, and interesting startup concept. Ensure the final output is a single, valid JSON object.`,
          },
          {
            role: "user",
            content: "Generate a new startup idea.",
          },
        ],
      }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenRouter API error: ${response.statusText} - ${errorBody}`);
    }

    const completion = await response.json();
    const responseData = JSON.parse(completion.choices[0].message.content);

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