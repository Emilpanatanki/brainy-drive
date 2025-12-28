import { useState } from "react";
import { levels, Level } from "@/data/levels";
import { MainMenu } from "@/components/game/MainMenu";
import { GameCanvas } from "@/components/game/GameCanvas";
import { WinScreen } from "@/components/game/WinScreen";
import { Helmet } from "react-helmet";

type GameState = "menu" | "playing" | "complete";

interface GameData {
  level: Level;
  answers: { question: string; userAnswer: string; correct: boolean }[];
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [gameData, setGameData] = useState<GameData | null>(null);

  const handleSelectLevel = (levelId: string) => {
    const level = levels.find(l => l.id === levelId);
    if (level) {
      setGameData({ level, answers: [] });
      setGameState("playing");
    }
  };

  const handleComplete = (answers: { question: string; userAnswer: string; correct: boolean }[]) => {
    if (gameData) {
      setGameData({ ...gameData, answers });
      setGameState("complete");
    }
  };

  const handleRestart = () => {
    if (gameData) {
      setGameData({ level: gameData.level, answers: [] });
      setGameState("playing");
    }
  };

  const handleMainMenu = () => {
    setGameState("menu");
    setGameData(null);
  };

  return (
    <>
      <Helmet>
        <title>MedRace - Educational Racing Game for Medical Students</title>
        <meta name="description" content="Learn emergency medicine through an interactive racing game. Master pulmonary embolism, myocardial infarction, appendicitis, and stroke diagnosis." />
      </Helmet>
      
      {gameState === "menu" && (
        <MainMenu onSelectLevel={handleSelectLevel} />
      )}
      
      {gameState === "playing" && gameData && (
        <GameCanvas
          level={gameData.level}
          onComplete={handleComplete}
          onExit={handleMainMenu}
        />
      )}
      
      {gameState === "complete" && gameData && (
        <WinScreen
          level={gameData.level}
          answers={gameData.answers}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}
    </>
  );
};

export default Index;
