import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const formSchema = z.object({
  keyword: z.string().min(2, "Please enter a topic with at least 2 characters."),
});

export type KeywordFormValues = z.infer<typeof formSchema>;

interface KeywordFormProps {
  onSubmit: (values: KeywordFormValues) => void;
  isGenerating: boolean;
}

export const KeywordForm = ({ onSubmit, isGenerating }: KeywordFormProps) => {
  const form = useForm<KeywordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Idea Generator</CardTitle>
        <CardDescription>Enter a topic and let the AI find an opportunity.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic / Keyword</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., sustainable fashion, meal planning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isGenerating} className="w-full">
              {isGenerating ? "Generating..." : "Generate Idea"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};