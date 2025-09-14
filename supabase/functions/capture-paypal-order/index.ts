import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const PAYPAL_API_BASE = Deno.env.get("PAYPAL_API_BASE") || "https://api-m.sandbox.paypal.com";
const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID");
const PAYPAL_CLIENT_SECRET = Deno.env.get("PAYPAL_CLIENT_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("PayPal API credentials are not set.");
    }

    const { orderID, userId, ideaId } = await req.json();

    if (!orderID || !userId) {
      throw new Error("Missing orderID or userId.");
    }

    const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("PayPal capture order error:", errorData);
      throw new Error(errorData.message || "Failed to capture PayPal order");
    }

    const capture = await response.json();
    let newIdeaId = null;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (ideaId) {
      const { data: dailyIdea, error: fetchError } = await supabase
        .from('daily_ideas')
        .select('idea_data, status')
        .eq('id', ideaId)
        .single();

      if (fetchError || !dailyIdea || dailyIdea.status !== 'available') {
        throw new Error("Idea to be purchased not found or already sold.");
      }

      const { error: updateDailyError } = await supabase
        .from('daily_ideas')
        .update({ status: 'sold', purchased_by_user_id: userId })
        .eq('id', ideaId);

      if (updateDailyError) {
        throw new Error("Failed to mark idea as sold.");
      }

      const ideaData = dailyIdea.idea_data;
      const { data: insertedIdea, error: insertOwnedError } = await supabase
        .from('ideas')
        .insert({
          user_id: userId,
          idea_title: ideaData.idea.idea_title,
          problem: ideaData.idea.problem,
          solution: ideaData.idea.solution,
          market: ideaData.idea.market,
          analysis: ideaData.analysis,
          trend_data: ideaData.trends,
          go_to_market: ideaData.goToMarket,
          idea_attributes: ideaData.idea_attributes,
          idea_health_metrics: ideaData.idea_health_metrics,
          value_ladder: ideaData.value_ladder,
        })
        .select('id')
        .single();

      if (insertOwnedError || !insertedIdea) {
        throw new Error("Failed to transfer idea ownership.");
      }
      newIdeaId = insertedIdea.id;
    }

    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({ subscription_status: 'pro' })
      .eq('id', userId);

    if (updateProfileError) {
      throw new Error("Failed to update user profile after purchase.");
    }

    return new Response(JSON.stringify({ capture, newIdeaId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in capture-paypal-order Edge Function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});