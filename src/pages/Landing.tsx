import { Header } from "@/components/layout/Header";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Hero } from "@/components/ui/animated-hero";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Landing;