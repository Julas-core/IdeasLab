import Header from "@/components/layout/Header";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Hero } from "@/components/ui/animated-hero";
import { Features } from "@/components/blocks/Features"; // Import the new Features component
import { BGPattern } from "@/components/ui/bg-pattern";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <BGPattern variant="grid" mask="fade-edges" />
      <Header />
      <main>
        <Hero />
        <Features /> {/* Use the new Features component here */}
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Landing;