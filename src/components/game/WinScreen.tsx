import { Button } from "@/components/ui/button";
import { Level } from "@/data/levels";
import { Trophy, RotateCcw, Home, CheckCircle, XCircle } from "lucide-react";

interface WinScreenProps {
  level: Level;
  results: { junction: number; correct: boolean; answer: string }[];
  onRestart: () => void;
  onMainMenu: () => void;
}

export const WinScreen = ({ level, results, onRestart, onMainMenu }: WinScreenProps) => {
  const correctCount = results.filter(r => r.correct).length;
  const totalJunctions = level.junctions.length;
  const isPerfect = correctCount === totalJunctions;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(197,71%,73%)] to-[hsl(122,39%,49%)] flex items-center justify-center p-4">
      <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-scale-in">
        {/* Trophy */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mb-4 shadow-lg">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isPerfect ? "Perfect Run!" : "Level Complete!"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {level.icon} {level.title}
          </p>
        </div>

        {/* Score */}
        <div className="bg-primary/10 rounded-xl p-4 mb-6 text-center">
          <p className="text-lg text-muted-foreground">Score</p>
          <p className="text-4xl font-bold text-primary">
            {correctCount} / {totalJunctions}
          </p>
        </div>

        {/* Results summary */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-foreground">Your Answers:</h3>
          {results.map((result, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                result.correct 
                  ? "bg-green-500/20 border border-green-500/30" 
                  : "bg-red-500/20 border border-red-500/30"
              }`}
            >
              {result.correct ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div className="flex-1">
                <p className="font-medium text-foreground">{result.answer}</p>
                <p className="text-sm text-muted-foreground">
                  Junction {index + 1}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={onRestart}
            variant="outline"
            className="flex-1 gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Race Again
          </Button>
          <Button
            onClick={onMainMenu}
            className="flex-1 gap-2"
          >
            <Home className="w-4 h-4" />
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};
