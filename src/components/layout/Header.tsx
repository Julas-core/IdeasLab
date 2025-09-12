import { Rocket } from "lucide-react";

export const Header = () => {
  return (
    <header className="p-4 border-b bg-card">
      <div className="container mx-auto flex items-center gap-2">
        <Rocket className="w-6 h-6" />
        <h1 className="text-2xl font-bold">IdeaLab</h1>
      </div>
    </header>
  );
};