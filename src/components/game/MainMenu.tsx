import { Level } from "@/data/levels";
import { LevelCard } from "./LevelCard";

interface MainMenuProps {
  levels: Level[];
  onSelectLevel: (level: Level) => void;
}

export const MainMenu = ({ levels, onSelectLevel }: MainMenuProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(197,71%,73%)] to-[hsl(122,39%,49%)]">
      {/* Header */}
      <header className="pt-12 pb-8 text-center">
        <div className="text-6xl mb-4">🏎️</div>
        <h1 className="text-5xl font-bold text-foreground mb-2 drop-shadow-lg">
          MedRace 3D
        </h1>
        <p className="text-xl text-foreground/80 max-w-md mx-auto px-4">
          Race through medical decisions in 3D! Steer your car toward the correct answer at each junction.
        </p>
      </header>

      {/* Level Selection */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
          Choose Your Topic
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {levels.map((level) => (
            <LevelCard
              key={level.id}
              level={level}
              onClick={() => onSelectLevel(level)}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-card/80 backdrop-blur-sm rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            How to Play
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">⬅️ ➡️</span>
              <p className="text-sm">Use Arrow Keys or A/D to steer left/right</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">⬆️</span>
              <p className="text-sm">Hold Up Arrow or W to accelerate faster</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">🎯</span>
              <p className="text-sm">Drive toward the correct answer lane!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
