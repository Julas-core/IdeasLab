import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah J.",
    title: "Founder of TechStart",
    quote: "This tool has revolutionized how we generate and validate ideas. The AI analysis is spot-on and has saved us countless hours of research.",
    avatar: "SJ",
  },
  {
    name: "Mike R.",
    title: "Indie Hacker",
    quote: "As a solo founder, I'm always looking for an edge. This platform is my secret weapon for finding untapped markets and building products people actually want.",
    avatar: "MR",
  },
  {
    name: "Elena K.",
    title: "Product Manager",
    quote: "The go-to-market strategies are incredibly detailed and actionable. It's like having a world-class marketing team in your pocket.",
    avatar: "EK",
  },
];

export function Testimonials() {
  return (
    <section className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from innovators and creators who are building the future with our platform.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="text-left">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{testimonial.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}