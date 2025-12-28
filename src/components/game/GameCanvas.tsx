import { useEffect, useRef, useState, useCallback } from "react";
import { Level, Junction } from "@/data/levels";

interface GameCanvasProps {
  level: Level;
  onComplete: (answers: { question: string; userAnswer: string; correct: boolean }[]) => void;
  onExit: () => void;
}

interface Car {
  x: number;
  y: number;
  targetLane: number;
  currentLane: number;
}

export const GameCanvas = ({ level, onComplete, onExit }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentJunction, setCurrentJunction] = useState(0);
  const [car, setCar] = useState<Car>({ x: 0, y: 0, targetLane: 1, currentLane: 1 });
  const [showingChoices, setShowingChoices] = useState(true);
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string } | null>(null);
  const [answers, setAnswers] = useState<{ question: string; userAnswer: string; correct: boolean }[]>([]);
  const [roadOffset, setRoadOffset] = useState(0);
  const animationRef = useRef<number>();

  const junction = level.junctions[currentJunction];
  const numChoices = junction?.choices.length || 3;

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.4);
      skyGradient.addColorStop(0, "#0ea5e9");
      skyGradient.addColorStop(1, "#7dd3fc");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height * 0.4);

      // Grass
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(0, height * 0.4, width, height * 0.6);

      // Darker grass pattern
      ctx.fillStyle = "#16a34a";
      for (let i = 0; i < 20; i++) {
        const x = (i * 80 + roadOffset * 0.5) % (width + 80) - 40;
        ctx.beginPath();
        ctx.arc(x, height * 0.5 + Math.sin(i) * 30, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Road
      const roadWidth = width * 0.6;
      const roadX = (width - roadWidth) / 2;
      
      // Road shadow
      ctx.fillStyle = "#44403c";
      ctx.fillRect(roadX - 10, height * 0.35, roadWidth + 20, height * 0.7);
      
      // Main road
      ctx.fillStyle = "#78716c";
      ctx.fillRect(roadX, height * 0.35, roadWidth, height * 0.65);

      // Road markings (moving)
      ctx.strokeStyle = "#fef3c7";
      ctx.lineWidth = 4;
      ctx.setLineDash([40, 30]);
      ctx.lineDashOffset = -roadOffset;
      
      const laneWidth = roadWidth / numChoices;
      for (let i = 1; i < numChoices; i++) {
        ctx.beginPath();
        ctx.moveTo(roadX + laneWidth * i, height * 0.45);
        ctx.lineTo(roadX + laneWidth * i, height);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Road edges
      ctx.fillStyle = "#a16207";
      ctx.fillRect(roadX - 15, height * 0.35, 15, height * 0.65);
      ctx.fillRect(roadX + roadWidth, height * 0.35, 15, height * 0.65);

      // Car
      const carWidth = 40;
      const carHeight = 70;
      const carLaneX = roadX + (laneWidth * car.currentLane) + (laneWidth / 2) - (carWidth / 2);
      const carY = height * 0.7;

      // Car shadow
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.ellipse(carLaneX + carWidth/2 + 5, carY + carHeight + 5, carWidth/2, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Car body
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.roundRect(carLaneX, carY, carWidth, carHeight, 8);
      ctx.fill();

      // Car roof
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.roundRect(carLaneX + 5, carY + 15, carWidth - 10, 30, 5);
      ctx.fill();

      // Windshield
      ctx.fillStyle = "#7dd3fc";
      ctx.beginPath();
      ctx.roundRect(carLaneX + 8, carY + 18, carWidth - 16, 12, 3);
      ctx.fill();

      // Wheels
      ctx.fillStyle = "#1f2937";
      ctx.fillRect(carLaneX - 3, carY + 8, 8, 15);
      ctx.fillRect(carLaneX + carWidth - 5, carY + 8, 8, 15);
      ctx.fillRect(carLaneX - 3, carY + carHeight - 20, 8, 15);
      ctx.fillRect(carLaneX + carWidth - 5, carY + carHeight - 20, 8, 15);
    };

    draw();
  }, [car, roadOffset, numChoices]);

  // Animation loop
  useEffect(() => {
    if (!showingChoices && !feedback?.show) {
      const animate = () => {
        setRoadOffset(prev => prev + 5);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showingChoices, feedback?.show]);

  // Smooth lane change
  useEffect(() => {
    if (car.currentLane !== car.targetLane) {
      const interval = setInterval(() => {
        setCar(prev => {
          const diff = prev.targetLane - prev.currentLane;
          const step = Math.sign(diff) * 0.1;
          const newLane = Math.abs(diff) < 0.1 ? prev.targetLane : prev.currentLane + step;
          return { ...prev, currentLane: newLane };
        });
      }, 16);
      return () => clearInterval(interval);
    }
  }, [car.targetLane, car.currentLane]);

  const handleChoice = useCallback((choiceIndex: number) => {
    if (!showingChoices || feedback?.show) return;
    
    const choice = junction.choices[choiceIndex];
    setCar(prev => ({ ...prev, targetLane: choiceIndex }));
    
    setAnswers(prev => [...prev, {
      question: junction.question,
      userAnswer: choice.text,
      correct: choice.isCorrect
    }]);

    setTimeout(() => {
      setShowingChoices(false);
      
      if (choice.isCorrect) {
        setFeedback({ show: true, correct: true, message: choice.explanation || "Correct!" });
        setTimeout(() => {
          setFeedback(null);
          if (currentJunction < level.junctions.length - 1) {
            setCurrentJunction(prev => prev + 1);
            setCar(prev => ({ ...prev, targetLane: 1, currentLane: 1 }));
            setShowingChoices(true);
          } else {
            onComplete([...answers, {
              question: junction.question,
              userAnswer: choice.text,
              correct: true
            }]);
          }
        }, 2000);
      } else {
        setFeedback({ show: true, correct: false, message: choice.explanation || "Incorrect!" });
        setTimeout(() => {
          setFeedback(null);
          setCar(prev => ({ ...prev, targetLane: 1, currentLane: 1 }));
          setShowingChoices(true);
        }, 2500);
      }
    }, 500);
  }, [showingChoices, feedback, junction, currentJunction, level.junctions.length, answers, onComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showingChoices || feedback?.show) return;
      
      if (e.key === "ArrowLeft" || e.key === "a") {
        setCar(prev => ({ ...prev, targetLane: Math.max(0, prev.targetLane - 1) }));
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setCar(prev => ({ ...prev, targetLane: Math.min(numChoices - 1, prev.targetLane + 1) }));
      } else if (e.key === "Enter" || e.key === " ") {
        handleChoice(car.targetLane);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showingChoices, feedback, car.targetLane, numChoices, handleChoice]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-top to-sky-bottom overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center">
        <button
          onClick={onExit}
          className="btn-game bg-card/90 backdrop-blur-sm text-foreground hover:bg-card"
        >
          ← Exit
        </button>
        <div className="bg-card/90 backdrop-blur-sm rounded-xl px-4 py-2">
          <span className="font-display font-bold text-lg">
            {level.icon} {level.title}
          </span>
          <span className="ml-3 text-muted-foreground">
            Junction {currentJunction + 1}/{level.junctions.length}
          </span>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full object-cover"
      />

      {/* Question */}
      {showingChoices && !feedback?.show && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 max-w-2xl w-full px-4">
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg animate-fade-in">
            <p className="text-center font-medium text-lg">{junction.question}</p>
          </div>
        </div>
      )}

      {/* Choice Labels */}
      {showingChoices && !feedback?.show && (
        <div className="absolute bottom-32 left-0 right-0 z-10 px-4">
          <div className="flex justify-center gap-4 max-w-4xl mx-auto">
            {junction.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(index)}
                className={`floating-label flex-1 max-w-xs text-sm md:text-base ${
                  car.targetLane === index
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/50"
                    : "bg-card text-foreground hover:bg-secondary"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback?.show && (
        <div className={`absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in`}>
          <div className={`max-w-md mx-4 p-6 rounded-2xl shadow-xl ${
            feedback.correct ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
          }`}>
            <h3 className="text-2xl font-display font-bold mb-2">
              {feedback.correct ? "✓ Correct!" : "✗ Wrong!"}
            </h3>
            <p className="text-lg opacity-90">{feedback.message}</p>
            {!feedback.correct && (
              <p className="mt-2 text-sm opacity-75">Returning to try again...</p>
            )}
          </div>
        </div>
      )}

      {/* Mobile Controls */}
      <div className="absolute bottom-4 left-0 right-0 z-10 px-4 md:hidden">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setCar(prev => ({ ...prev, targetLane: Math.max(0, prev.targetLane - 1) }))}
            className="btn-game bg-card/90 backdrop-blur-sm text-foreground w-16 h-16 text-2xl"
            disabled={!showingChoices || feedback?.show}
          >
            ←
          </button>
          <button
            onClick={() => handleChoice(car.targetLane)}
            className="btn-game bg-primary text-primary-foreground w-20 h-16 text-lg"
            disabled={!showingChoices || feedback?.show}
          >
            GO
          </button>
          <button
            onClick={() => setCar(prev => ({ ...prev, targetLane: Math.min(numChoices - 1, prev.targetLane + 1) }))}
            className="btn-game bg-card/90 backdrop-blur-sm text-foreground w-16 h-16 text-2xl"
            disabled={!showingChoices || feedback?.show}
          >
            →
          </button>
        </div>
      </div>

      {/* Desktop Controls Hint */}
      <div className="absolute bottom-4 right-4 z-10 hidden md:block">
        <div className="bg-card/80 backdrop-blur-sm rounded-xl px-4 py-2 text-sm text-muted-foreground">
          ← → to move • Enter to select
        </div>
      </div>
    </div>
  );
};
