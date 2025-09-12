import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { BGPattern } from "@/components/ui/bg-pattern";
import { useTheme } from "@/hooks/useTheme"; // Import the new useTheme hook

const Payments = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme(); // Use the theme hook

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching subscription status:", error);
          showError("Failed to load subscription status.");
        } else if (profile) {
          setSubscriptionStatus(profile.subscription_status);
        }
      }
      setLoading(false);
    };

    fetchSubscriptionStatus();
  }, []);

  const handlePayPalSubscription = async () => {
    // Placeholder for actual PayPal integration
    // In a real application, this would involve:
    // 1. Creating an order on your backend (which interacts with PayPal API)
    // 2. Redirecting the user to PayPal for approval
    // 3. Handling the return from PayPal (success/cancel)
    // 4. Updating the user's subscription status in your database after successful payment

    showSuccess("Initiating PayPal subscription... (This is a placeholder)");
    console.log("PayPal subscription initiated for $9.99");

    // Simulate a successful subscription update for demonstration
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_status: 'pro', paypal_order_id: 'simulated_paypal_order_id' })
        .eq('id', user.id);

      if (error) {
        showError("Failed to update subscription status in database.");
        console.error("Error updating profile:", error);
      } else {
        setSubscriptionStatus('pro');
        showSuccess("Subscription updated to Pro! (Simulated)");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <BGPattern variant="grid" mask="fade-edges" />
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="max-w-2xl w-full text-center mb-8">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Upgrade to Pro</h2>
          <p className="text-lg text-muted-foreground">
            Unlock all advanced features, AI builders, and go-to-market helpers to supercharge your startup ideas.
          </p>
        </div>

        <Card className="w-full max-w-md border-primary/50 bg-primary/5">
          <CardHeader className="text-center">
            <Crown className="h-10 w-10 text-primary mx-auto mb-2" />
            <CardTitle className="text-3xl font-bold">Pro Plan</CardTitle>
            <CardDescription className="text-5xl font-extrabold text-primary mt-2">
              $9.99<span className="text-lg text-muted-foreground">/month</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-2 text-left text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Unlimited Idea Generation</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> AI Analysis & Trend Signals</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Founder Fit Analysis</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Go-to-Market Helpers</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Ready to Build? Prompts</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Save Unlimited Ideas</li>
            </ul>

            <div className="pt-4 border-t border-border">
              {loading ? (
                <Button className="w-full" disabled>Loading status...</Button>
              ) : subscriptionStatus === 'pro' ? (
                <Button className="w-full" disabled variant="secondary">
                  <CheckCircle className="mr-2 h-4 w-4" /> You are already a Pro member!
                </Button>
              ) : (
                <Button
                  className={`w-full flex items-center justify-center gap-2 ${
                    theme === 'dark' ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={handlePayPalSubscription}
                >
                  <CreditCard className="h-5 w-5" />
                  Subscribe with PayPal
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Payments;