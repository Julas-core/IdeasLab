import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { BGPattern } from "@/components/ui/bg-pattern";
import { useTheme } from "@/hooks/useTheme";

const Payments = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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

  const handleLifetimePurchase = async () => {
    // Placeholder for actual PayPal one-time payment integration
    // In a real application, this would:
    // 1. Create a one-time order on your backend (interacting with PayPal API)
    // 2. Redirect user to PayPal for approval
    // 3. On success, update user's profile to 'pro' lifetime status
    // 4. Handle any webhooks for confirmation

    showSuccess("Initiating one-time PayPal payment... (This is a placeholder)");
    console.log("One-time lifetime purchase initiated for $19.99");

    // Simulate successful lifetime unlock
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          subscription_status: 'pro', 
          paypal_order_id: 'lifetime_order_' + Date.now() // Unique for one-time
        })
        .eq('id', user.id);

      if (error) {
        showError("Failed to unlock lifetime access.");
        console.error("Error updating profile:", error);
      } else {
        setSubscriptionStatus('pro');
        showSuccess("Lifetime Pro access unlocked! Enjoy all features forever.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <BGPattern variant="grid" mask="fade-edges" />
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="max-w-2xl w-full text-center mb-8">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Unlock Lifetime Pro Access</h2>
          <p className="text-lg text-muted-foreground">
            Pay once and get everything forever: All advanced features, AI builders, and go-to-market tools without any recurring fees.
          </p>
        </div>

        <Card className="w-full max-w-md border-primary/50 bg-primary/5">
          <CardHeader className="text-center">
            <Crown className="h-10 w-10 text-primary mx-auto mb-2" />
            <CardTitle className="text-3xl font-bold">Lifetime Pro</CardTitle>
            <CardDescription className="text-5xl font-extrabold text-primary mt-2">
              $19.99<span className="text-lg text-muted-foreground"> one-time</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-2 text-left text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Unlimited Idea Generation</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> AI Analysis & Trend Signals</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Founder Fit Analysis</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Go-to-Market Helpers</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Ready to Build? Prompts</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Save Unlimited Ideas Forever</li>
            </ul>

            <div className="pt-4 border-t border-border">
              {loading ? (
                <Button className="w-full" disabled>Loading status...</Button>
              ) : subscriptionStatus === 'pro' ? (
                <Button className="w-full" disabled variant="secondary">
                  <CheckCircle className="mr-2 h-4 w-4" /> Lifetime Pro Access Unlocked!
                </Button>
              ) : (
                <Button
                  className={`w-full flex items-center justify-center gap-2 ${
                    theme === 'dark' ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={handleLifetimePurchase}
                >
                  <CreditCard className="h-5 w-5" />
                  Pay $19.99 Once via PayPal
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Payments;