import { Level } from "@/data/levels";
import { Play } from "lucide-react";

interface LevelCardProps {
  level: Level;
  onClick: () => void;
}

export const LevelCard = ({ level, onClick }: LevelCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card hover:bg-card/90 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
          {level.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
            {level.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-2">
            {level.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="bg-secondary px-2 py-1 rounded-full">
              {level.junctions.length} junctions
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          <Play className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
};
