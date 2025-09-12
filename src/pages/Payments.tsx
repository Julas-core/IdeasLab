import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { BGPattern } from "@/components/ui/bg-pattern";

// Load Stripe with your publishable key (replace with your actual key)
const stripePromise = loadStripe("pk_test_51RydjgRxghBL4I5rMfD3fkXmapCeK1rrW7kuaceCJMIMWeYgI1ZGnQqYeTWyGodwLQxK42pcVZ8pZZIXfjSou1r0004fvvVB9z"); // Replace with your Stripe publishable key

interface Subscription {
  status: "free" | "pro";
  plan: string;
  price: string;
}

const Payments = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Mock subscription for now; in production, query your database
        setSubscription({ status: "free", plan: "Free", price: "$0/month" });
      }
      setLoading(false);
    };

    fetchSubscription();
  }, []);

  const handleUpgrade = async () => {
    setIsCreatingCheckout(true);
    try {
      // Call the Edge Function to create checkout session
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: { priceId: "price_12345" }, // Replace with your Stripe Price ID for Pro plan
      });

      if (error) throw error;

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      // Redirect to Stripe Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) throw stripeError;
    } catch (error) {
      console.error("Error creating checkout:", error);
      showError("Failed to initiate payment. Please try again.");
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <BGPattern variant="grid" mask="fade-edges" />
        <Header />
        <main className="container mx-auto p-4 md:p-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
        <MadeWithDyad />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <BGPattern variant="grid" mask="fade-edges" />
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Payments & Subscriptions</h2>
          <p className="text-muted-foreground">Manage your plan and billing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current Plan Card */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription && (
                <>
                  <Badge variant={subscription.status === "pro" ? "default" : "secondary"}>
                    {subscription.plan} Plan
                  </Badge>
                  <p className="text-2xl font-bold">{subscription.price}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Unlimited idea generations</li>
                    <li>• Advanced AI analysis</li>
                    <li>• Priority support</li>
                  </ul>
                  {subscription.status === "free" && (
                    <Button onClick={handleUpgrade} disabled={isCreatingCheckout} className="w-full">
                      {isCreatingCheckout ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Redirecting to Payment...
                        </>
                      ) : (
                        "Upgrade to Pro"
                      )}
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Pro Plan Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pro Plan</CardTitle>
              <CardDescription>Unlock premium features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold">$19</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Everything in Free</li>
                <li>• Unlimited exports</li>
                <li>• Custom AI prompts</li>
                <li>• Team collaboration</li>
              </ul>
              <Button onClick={handleUpgrade} disabled={isCreatingCheckout || subscription?.status === "pro"} className="w-full">
                {isCreatingCheckout ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : subscription?.status === "pro" ? (
                  "Already on Pro"
                ) : (
                  "Get Pro"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stripe Elements Wrapper - Only needed for card payments if you want to expand */}
        <Elements stripe={stripePromise}>
          {/* You can add a CardElement form here if needed for direct card input */}
        </Elements>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Payments;