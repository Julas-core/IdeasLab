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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let forceNew = false;
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      forceNew = body.forceNew || false;
    }

    let ideaToReturn = null;

    if (!forceNew) {
      const { data: latestIdea, error: fetchError } = await supabase
        .from('daily_ideas')
        .select('id, idea_data, generated_at')
        .eq('status', 'available')
        .order('generated_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Error fetching available daily idea:", fetchError);
        throw new Error("Failed to fetch daily idea from database.");
      }

      if (latestIdea) {
        const now = new Date();
        const generatedAt = new Date(latestIdea.generated_at);
        const hoursDiff = (now.getTime() - generatedAt.getTime()) / (1000 * 60 * 60);
        if (hoursDiff < 24) {
          ideaToReturn = {
            id: latestIdea.id,
            ...latestIdea.idea_data
          };
        }
      }
    }

    if (!ideaToReturn) {
      console.log("Generating a new idea of the day...");
      const { data: newIdeaData, error: generateError } = await supabase.functions.invoke('generate-idea');
      if (generateError) throw generateError;

      const { data: insertedIdea, error: insertError } = await supabase
        .from('daily_ideas')
        .insert({ idea_data: newIdeaData, status: 'available' })
        .select('id, idea_data')
        .single();

      if (insertError) {
        console.error("Error inserting new daily idea:", insertError);
        throw new Error("Failed to save new daily idea.");
      }
      
      ideaToReturn = {
        id: insertedIdea.id,
        ...insertedIdea.idea_data
      };
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