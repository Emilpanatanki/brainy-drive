import { useState } from "react";
import { Helmet } from "react-helmet";
import { MainMenu } from "@/components/game/MainMenu";
import { Game3D } from "@/components/game/Game3D";
import { WinScreen } from "@/components/game/WinScreen";
import { levels, Level } from "@/data/levels";

type GameState = "menu" | "playing" | "complete";

interface GameResult {
  junction: number;
  correct: boolean;
  answer: string;
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [results, setResults] = useState<GameResult[]>([]);

  const handleStartLevel = (level: Level) => {
    setSelectedLevel(level);
    setResults([]);
    setGameState("playing");
  };

  const handleComplete = (gameResults: GameResult[]) => {
    setResults(gameResults);
    setGameState("complete");
  };

  const handleRestart = () => {
    setResults([]);
    setGameState("playing");
  };

  const handleMainMenu = () => {
    setSelectedLevel(null);
    setResults([]);
    setGameState("menu");
  };

  return (
    <>
      <Helmet>
        <title>MedRace 3D - Medical Education Racing Game</title>
        <meta 
          name="description" 
          content="Learn medicine through an exciting 3D racing game. Navigate through medical scenarios and make the right diagnostic and treatment decisions!" 
        />
      </Helmet>

      {gameState === "menu" && (
        <MainMenu levels={levels} onSelectLevel={handleStartLevel} />
      )}

      {gameState === "playing" && selectedLevel && (
        <Game3D
          level={selectedLevel}
          onComplete={handleComplete}
          onRestart={handleRestart}
        />
      )}

      {gameState === "complete" && selectedLevel && (
        <WinScreen
          level={selectedLevel}
          results={results}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}
    </>
  );
};

export default Index;
