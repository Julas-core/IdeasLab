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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  idea_title: z.string().min(2, "Title must be at least 2 characters."),
  problem: z.string().min(10, "Problem description must be at least 10 characters."),
  solution: z.string().min(10, "Solution description must be at least 10 characters."),
  market: z.string().min(2, "Target market must be at least 2 characters."),
});

export type IdeaFormValues = z.infer<typeof formSchema>;

interface IdeaFormProps {
  onSubmit: (values: IdeaFormValues) => void;
  isAnalyzing: boolean;
}

export const IdeaForm = ({ onSubmit, isAnalyzing }: IdeaFormProps) => {
  const form = useForm<IdeaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idea_title: "",
      problem: "",
      solution: "",
      market: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Capture New Idea</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="idea_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idea Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AI-powered meal planner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="problem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What problem are you solving?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="solution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solution</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How does your solution address the problem?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Market</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Busy professionals, families" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? "Analyzing..." : "Analyze Idea"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};