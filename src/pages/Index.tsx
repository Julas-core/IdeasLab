import Header from "@/components/layout/Header";
import { Hero } from "@/components/ui/animated-hero";
import { Features } from "@/components/blocks/Features";
import { BGPattern } from "@/components/ui/bg-pattern";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <BGPattern variant="grid" mask="fade-edges" />
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  );
};

export default Index;