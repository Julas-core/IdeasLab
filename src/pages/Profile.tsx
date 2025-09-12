import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Header from "@/components/layout/Header"; // Corrected import
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from "@/utils/toast";
import { User } from "@supabase/supabase-js";

const profileFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters.").optional().or(z.literal('')),
  last_name: z.string().min(2, "Last name must be at least 2 characters.").optional().or(z.literal('')),
  skills_description: z.string().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      skills_description: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          showError("Could not load your profile.");
        } else if (profile) {
          form.reset({
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            skills_description: profile.skills_description || "",
          });
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("profiles").update({
        ...values,
        updated_at: new Date().toISOString(),
      }).eq("id", user.id);

      if (error) throw error;
      showSuccess("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      showError("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your personal information and skills.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading profile...</p>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="skills_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Skills & Background</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., I'm a software engineer with 5 years of experience..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Profile;