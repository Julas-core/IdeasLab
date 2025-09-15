import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Founder, TechStartup',
    content: 'Upstart helped me validate my startup idea faster than I ever thought possible. The AI analysis is spot on!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    rating: 5
  },
  {
    name: 'Mike Chen',
    role: 'Product Manager',
    content: 'The trend signals and founder fit analysis gave me the confidence to pivot my business idea. Highly recommend!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5
  },
  {
    name: 'Emma Rodriguez',
    role: 'Entrepreneur',
    content: 'From idea generation to go-to-market strategy, Upstart covers it all. Saved me weeks of research.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    rating: 5
  }
];

export function TestimonialsSectionDemo() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have discovered their next big idea with Upstart.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center mb-2">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold">{testimonial.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}