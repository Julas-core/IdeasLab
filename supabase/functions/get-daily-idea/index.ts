import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // Use service role key for database operations
    );

    // 1. Try to fetch the latest idea generated within the last 24 hours
    const { data: latestIdea, error: fetchError } = await supabase
      .from('daily_ideas')
      .select('idea_data, generated_at')
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error("Error fetching latest daily idea:", fetchError);
      throw new Error("Failed to fetch daily idea from database.");
    }

    const now = new Date();
    let ideaToReturn = null;

    if (latestIdea && latestIdea.generated_at) {
      const generatedAt = new Date(latestIdea.generated_at);
      const hoursDiff = (now.getTime() - generatedAt.getTime()) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        ideaToReturn = latestIdea.idea_data;
      }
    }

    // 2. If no fresh idea, generate a new one
    if (!ideaToReturn) {
      console.log("Generating a new idea of the day...");
      // Invoke the existing generate-idea Edge Function
      const { data: newIdeaData, error: generateError } = await supabase.functions.invoke('generate-idea');
      if (generateError) throw generateError;

      // Store the new idea in the database
      const { error: insertError } = await supabase
        .from('daily_ideas')
        .insert({ idea_data: newIdeaData });

      if (insertError) {
        console.error("Error inserting new daily idea:", insertError);
        throw new Error("Failed to save new daily idea.");
      }
      ideaToReturn = newIdeaData;
    }

    return new Response(JSON.stringify(ideaToReturn), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error in get-daily-idea function:", error.message);
    return new Response(JSON.stringify({ error: "Failed to get daily idea: " + error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});