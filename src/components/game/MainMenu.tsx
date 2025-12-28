import { levels } from "@/data/levels";
import { LevelCard } from "./LevelCard";
import { Stethoscope, Gamepad2 } from "lucide-react";

interface MainMenuProps {
  onSelectLevel: (levelId: string) => void;
}

export const MainMenu = ({ onSelectLevel }: MainMenuProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 pt-16 pb-12">
          <div className="text-center max-w-2xl mx-auto">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg mb-6 animate-scale-in">
              <div className="relative">
                <Stethoscope className="w-10 h-10 text-primary-foreground" />
                <Gamepad2 className="w-5 h-5 text-primary-foreground absolute -bottom-1 -right-1" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-4 animate-fade-in">
              MedRace
            </h1>
            <p className="text-xl text-muted-foreground mb-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Learn medicine at full speed! 🏎️
            </p>
            <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Navigate through clinical scenarios, make the right choices, and master emergency medicine.
            </p>
          </div>
        </div>
      </div>

      {/* Levels Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">
            Choose Your Track
          </h2>
          
          <div className="space-y-4">
            {levels.map((level, index) => (
              <LevelCard
                key={level.id}
                level={level}
                onClick={() => onSelectLevel(level.id)}
                delay={0.1 * index}
              />
            ))}
          </div>

          {/* How to Play */}
          <div className="mt-12 bg-card rounded-2xl p-6 shadow-sm animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <h3 className="text-lg font-display font-bold text-foreground mb-4">How to Play</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-display font-bold text-primary">1</span>
                <p className="text-muted-foreground">Use arrow keys or tap to switch lanes</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-display font-bold text-primary">2</span>
                <p className="text-muted-foreground">Read the question and choose the correct answer</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-display font-bold text-primary">3</span>
                <p className="text-muted-foreground">Complete all junctions to finish the level</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
