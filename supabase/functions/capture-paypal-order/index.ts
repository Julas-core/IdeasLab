import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const PAYPAL_API_BASE = Deno.env.get("PAYPAL_API_BASE") || "https://api-m.sandbox.paypal.com"; // Use sandbox for development
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

    const { orderID, userId } = await req.json();

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

    // Update Supabase profile with subscription status
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // Use service role key for server-side operations
    );

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ subscription_status: 'pro', paypal_order_id: orderID })
      .eq('id', userId);

    if (updateError) {
      console.error("Supabase profile update error:", updateError);
      throw new Error("Failed to update user profile after PayPal capture.");
    }

    return new Response(JSON.stringify({ capture }), {
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