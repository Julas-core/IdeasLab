import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { BGPattern } from "@/components/ui/bg-pattern";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { User } from "@supabase/supabase-js";

interface Subscription {
  status: "free" | "pro";
  plan: string;
  price: string;
}

const Payments = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [{ isPending }] = usePayPalScriptReducer();

  const PRO_PLAN_PRICE = "19.00"; // Example price for Pro plan

  useEffect(() => {
    const fetchSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          setSubscription({ status: "free", plan: "Free", price: "$0/month" });
        } else if (profile) {
          setSubscription({
            status: profile.subscription_status === 'pro' ? 'pro' : 'free',
            plan: profile.subscription_status === 'pro' ? 'Pro' : 'Free',
            price: profile.subscription_status === 'pro' ? `$${PRO_PLAN_PRICE}/month` : "$0/month",
          });
        } else {
          setSubscription({ status: "free", plan: "Free", price: "$0/month" });
        }
      } else {
        setSubscription({ status: "free", plan: "Free", price: "$0/month" });
      }
      setLoading(false);
    };

    fetchSubscription();
  }, []);

  const createOrder = async (data: Record<string, unknown>, actions: any) => {
    try {
      const { data: orderData, error } = await supabase.functions.invoke("create-paypal-order", {
        body: { amount: PRO_PLAN_PRICE, currency: "USD" },
      });

      if (error) throw error;
      return orderData.orderID;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      showError("Failed to create PayPal order. Please try again.");
      return actions.reject(); // Reject the order creation
    }
  };

  const onApprove = async (data: Record<string, unknown>, actions: any) => {
    try {
      if (!user) {
        showError("You must be logged in to complete the payment.");
        return;
      }

      const { error } = await supabase.functions.invoke("capture-paypal-order", {
        body: { orderID: data.orderID, userId: user.id },
      });

      if (error) throw error;

      showSuccess("Payment successful! You are now a Pro member.");
      setSubscription({ status: "pro", plan: "Pro", price: `$${PRO_PLAN_PRICE}/month` });
      // Optionally redirect or refresh user session
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      showError("Failed to process payment. Please try again.");
    }
  };

  if (loading || isPending) {
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
                    <p className="text-muted-foreground text-sm">Upgrade below to unlock more features.</p>
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
                <p className="text-3xl font-bold">${PRO_PLAN_PRICE}</p>
                <p className="text-sm text-muted-foreground">one-time payment</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Everything in Free</li>
                <li>• Unlimited exports</li>
                <li>• Custom AI prompts</li>
                <li>• Team collaboration</li>
              </ul>
              {subscription?.status === "pro" ? (
                <Button disabled className="w-full">
                  Already on Pro
                </Button>
              ) : (
                <PayPalButtons
                  style={{ layout: "vertical", color: "blue" }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={(err) => {
                    console.error("PayPal Buttons Error:", err);
                    showError("PayPal payment encountered an error. Please try again.");
                  }}
                  onCancel={() => {
                    showError("PayPal payment cancelled.");
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Payments;