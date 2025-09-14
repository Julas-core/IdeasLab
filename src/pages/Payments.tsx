import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { BGPattern } from "@/components/ui/bg-pattern";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { User } from "@supabase/supabase-js";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const Payments = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ideaId = searchParams.get("ideaId");
  const [ideaToPurchase, setIdeaToPurchase] = useState<{ idea_title: string } | null>(null);

  useEffect(() => {
    const fetchUserAndSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

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

    const fetchIdeaToPurchase = async () => {
      if (ideaId) {
        const { data, error } = await supabase
          .from('daily_ideas')
          .select('idea_data, status')
          .eq('id', ideaId)
          .single();
        
        if (error || !data || data.status !== 'available') {
          showError("The idea you're trying to purchase is no longer available.");
          navigate('/dashboard');
        } else {
          setIdeaToPurchase({ idea_title: data.idea_data.idea.idea_title });
        }
      }
    };

    fetchUserAndSubscription();
    fetchIdeaToPurchase();
  }, [ideaId, navigate]);

  const createOrder = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: { amount: '29.99' }
      });
      if (error) throw new Error(error.message);
      if (!data.orderID) throw new Error("OrderID not returned from function");
      return data.orderID;
    } catch (err) {
      showError("Failed to create PayPal order. Please try again.");
      console.error(err);
      return '';
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    if (!user) {
      showError("You must be logged in to complete a purchase.");
      return;
    }
    try {
      const { data: responseData, error } = await supabase.functions.invoke('capture-paypal-order', {
        body: { 
          orderID: data.orderID, 
          userId: user.id,
          ideaId: ideaId 
        }
      });
      if (error) throw error;

      if (ideaId && responseData.newIdeaId) {
        showSuccess("Payment successful! You now own this idea and have lifetime Pro access.");
        navigate(`/idea/${responseData.newIdeaId}`);
      } else {
        showSuccess("Payment successful! You now have lifetime Pro access.");
        setSubscriptionStatus('pro');
      }
    } catch (err) {
      showError("Payment failed. Please try again or contact support.");
      console.error(err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Button className="w-full" disabled>Loading status...</Button>;
    }
    if (subscriptionStatus === 'pro' && !ideaId) {
      return (
        <Button className="w-full" disabled variant="secondary">
          <CheckCircle className="mr-2 h-4 w-4" /> You already have Pro Access!
        </Button>
      );
    }
    if (!PAYPAL_CLIENT_ID) {
        return (
            <div className="text-center p-4 bg-destructive/10 rounded-md">
                <p className="text-destructive font-semibold">Payment system is not configured.</p>
                <p className="text-xs text-muted-foreground">Administrator needs to set the PayPal Client ID.</p>
            </div>
        )
    }
    return (
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
            showError("An error occurred with the PayPal transaction.");
            console.error("PayPal error:", err);
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background relative">
      <BGPattern variant="grid" mask="fade-edges" />
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="max-w-2xl w-full text-center mb-8">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            {ideaToPurchase ? `Own This Idea` : `Upgrade to Pro`}
          </h2>
          <p className="text-lg text-muted-foreground">
            {ideaToPurchase 
              ? `Gain exclusive ownership of "${ideaToPurchase.idea_title}" and unlock all Pro features.`
              : `Unlock all advanced features, AI builders, and go-to-market helpers to supercharge your startup ideas.`
            }
          </p>
        </div>
        <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID || "test", currency: "USD" }}>
            <Card className="w-full max-w-md border-primary/50 bg-primary/5">
            <CardHeader className="text-center">
                <Crown className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold">{ideaToPurchase ? `Exclusive Idea` : "Pro Plan"}</CardTitle>
                <CardDescription className="text-5xl font-extrabold text-primary mt-2">
                $29.99<span className="text-lg text-muted-foreground"> Lifetime</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <ul className="space-y-2 text-left text-muted-foreground">
                {ideaToPurchase && <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Exclusive ownership of the idea</li>}
                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> One-time payment, lifetime access</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> AI Analysis & Trend Signals</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Founder Fit Analysis</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Go-to-Market Helpers</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Ready to Build? Prompts</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> View & Manage Owned Ideas</li>
                </ul>

                <div className="pt-4 border-t border-border">
                    {renderContent()}
                </div>
            </CardContent>
            </Card>
        </PayPalScriptProvider>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Payments;