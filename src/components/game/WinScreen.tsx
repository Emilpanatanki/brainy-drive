import { Level } from "@/data/levels";
import { CheckCircle, XCircle, RotateCcw, Home, Trophy } from "lucide-react";

interface WinScreenProps {
  level: Level;
  answers: { question: string; userAnswer: string; correct: boolean }[];
  onRestart: () => void;
  onMainMenu: () => void;
}

export const WinScreen = ({ level, answers, onRestart, onMainMenu }: WinScreenProps) => {
  const correctCount = answers.filter(a => a.correct).length;
  const totalQuestions = level.junctions.length;
  const perfectScore = correctCount === totalQuestions;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-top to-grass flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Trophy Card */}
        <div className="bg-card rounded-3xl shadow-xl p-8 mb-6 text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-warning to-yellow-400 mb-4 shadow-lg">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            {perfectScore ? "Perfect Run!" : "Level Complete!"}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-4">
            {level.icon} {level.title}
          </p>
          
          <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-6 py-3">
            <span className="text-2xl font-display font-bold text-foreground">
              {correctCount}/{totalQuestions}
            </span>
            <span className="text-muted-foreground">correct answers</span>
          </div>
        </div>

        {/* Answers Summary */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-display font-bold mb-4 text-foreground">Answer Summary</h2>
          <div className="space-y-4">
            {answers.map((answer, index) => {
              const junction = level.junctions[index];
              const correctAnswer = junction.choices.find(c => c.isCorrect);
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl ${
                    answer.correct 
                      ? "bg-success/10 border-2 border-success/20" 
                      : "bg-destructive/10 border-2 border-destructive/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {answer.correct ? (
                      <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm mb-1">
                        Q{index + 1}: {answer.question}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Your answer: </span>
                        <span className={answer.correct ? "text-success" : "text-destructive"}>
                          {answer.userAnswer}
                        </span>
                      </p>
                      {!answer.correct && correctAnswer && (
                        <p className="text-sm mt-1">
                          <span className="text-muted-foreground">Correct: </span>
                          <span className="text-success">{correctAnswer.text}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <button
            onClick={onRestart}
            className="btn-game flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          <button
            onClick={onMainMenu}
            className="btn-game flex-1 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
