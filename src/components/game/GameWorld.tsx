import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { Level } from '@/data/levels';

interface GameWorldProps {
  level: Level;
  onComplete: (results: { junction: number; correct: boolean; answer: string }[]) => void;
  onRestart: () => void;
}

interface JunctionZone {
  position: number; // Z position where junction appears
  choices: { text: string; isCorrect: boolean; lane: number }[];
  passed: boolean;
}

export const GameWorld = ({ level, onComplete, onRestart }: GameWorldProps) => {
  const carRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  // Car state
  const [carPosition, setCarPosition] = useState({ x: 0, z: 0 });
  const [carLane, setCarLane] = useState(0); // -1 = left, 0 = center, 1 = right
  const [speed, setSpeed] = useState(0);
  const [isAccelerating, setIsAccelerating] = useState(false);
  
  // Game state
  const [currentJunction, setCurrentJunction] = useState(0);
  const [results, setResults] = useState<{ junction: number; correct: boolean; answer: string }[]>([]);
  const [crashed, setCrashed] = useState(false);
  const [crashMessage, setCrashMessage] = useState('');
  const [showingCrash, setShowingCrash] = useState(false);
  
  // Track configuration
  const laneWidth = 4;
  const junctionSpacing = 80;
  const startZ = 0;
  
  // Create junctions from level data
  const junctions: JunctionZone[] = level.junctions.map((junction, index) => {
    const shuffledChoices = [...junction.choices].sort(() => Math.random() - 0.5);
    const lanes = shuffledChoices.length === 3 ? [-1, 0, 1] : [-1, 1];
    
    return {
      position: startZ - (index + 1) * junctionSpacing,
      choices: shuffledChoices.map((choice, i) => ({
        text: choice.text,
        isCorrect: choice.isCorrect,
        lane: lanes[i],
      })),
      passed: false,
    };
  });
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (crashed || showingCrash) return;
      
      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          setCarLane(prev => Math.max(prev - 1, -1));
          break;
        case 'arrowright':
        case 'd':
          setCarLane(prev => Math.min(prev + 1, 1));
          break;
        case 'arrowup':
        case 'w':
          setIsAccelerating(true);
          break;
        case 'arrowdown':
        case 's':
          setSpeed(prev => Math.max(prev - 0.5, 0));
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'arrowup' || e.key.toLowerCase() === 'w') {
        setIsAccelerating(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [crashed, showingCrash]);
  
  // Reset game
  const resetGame = useCallback(() => {
    setCarPosition({ x: 0, z: 0 });
    setCarLane(0);
    setSpeed(0);
    setCurrentJunction(0);
    setResults([]);
    setCrashed(false);
    setCrashMessage('');
    setShowingCrash(false);
  }, []);
  
  // Handle crash
  const handleCrash = useCallback((message: string) => {
    setCrashed(true);
    setCrashMessage(message);
    setSpeed(0);
    setShowingCrash(true);
    
    setTimeout(() => {
      resetGame();
    }, 2000);
  }, [resetGame]);
  
  // Game loop
  useFrame((state, delta) => {
    if (crashed) return;
    
    // Auto-accelerate slightly, manual acceleration adds more
    const targetSpeed = isAccelerating ? 25 : 12;
    setSpeed(prev => THREE.MathUtils.lerp(prev, targetSpeed, 0.05));
    
    // Update car position
    const targetX = carLane * laneWidth;
    setCarPosition(prev => ({
      x: THREE.MathUtils.lerp(prev.x, targetX, 0.1),
      z: prev.z - speed * delta,
    }));
    
    // Update car mesh position
    if (carRef.current) {
      carRef.current.position.x = carPosition.x;
      carRef.current.position.z = carPosition.z;
      
      // Slight tilt when turning
      const targetRotation = (carPosition.x - targetX) * 0.1;
      carRef.current.rotation.z = THREE.MathUtils.lerp(carRef.current.rotation.z, targetRotation, 0.1);
    }
    
    // Update camera to follow car
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, carPosition.x, 0.05);
    camera.position.z = carPosition.z + 15;
    camera.position.y = 6;
    camera.lookAt(carPosition.x, 1, carPosition.z - 10);
    
    // Check junction collisions
    const currentJunctionData = junctions[currentJunction];
    if (currentJunctionData && !currentJunctionData.passed) {
      const junctionZ = currentJunctionData.position;
      
      // Check if car reached the junction decision point
      if (carPosition.z <= junctionZ + 5 && carPosition.z > junctionZ - 10) {
        // Determine which lane the car is in
        const chosenChoice = currentJunctionData.choices.find(c => c.lane === carLane);
        
        if (chosenChoice) {
          currentJunctionData.passed = true;
          
          if (chosenChoice.isCorrect) {
            // Correct choice - continue
            setResults(prev => [...prev, {
              junction: currentJunction,
              correct: true,
              answer: chosenChoice.text,
            }]);
            setCurrentJunction(prev => prev + 1);
            
            // Check if level complete
            if (currentJunction >= level.junctions.length - 1) {
              setTimeout(() => {
                onComplete([...results, {
                  junction: currentJunction,
                  correct: true,
                  answer: chosenChoice.text,
                }]);
              }, 1000);
            }
          } else {
            // Wrong choice - crash
            handleCrash(`Wrong! "${chosenChoice.text}" is incorrect.`);
          }
        }
      }
    }
  });
  
  // Calculate track length
  const trackLength = (level.junctions.length + 2) * junctionSpacing;
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Sky */}
      <Sky sunPosition={[100, 20, 100]} />
      
      {/* Ground - Grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -trackLength / 2]} receiveShadow>
        <planeGeometry args={[200, trackLength + 100]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
      
      {/* Main Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -trackLength / 2]} receiveShadow>
        <planeGeometry args={[laneWidth * 3 + 2, trackLength + 50]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      
      {/* Road markings */}
      {Array.from({ length: Math.floor(trackLength / 10) }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -i * 10]} receiveShadow>
          <planeGeometry args={[0.3, 4]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}
      
      {/* Guardrails */}
      <Guardrail position={[-(laneWidth * 1.5 + 1.5), 0, -trackLength / 2]} length={trackLength + 50} />
      <Guardrail position={[(laneWidth * 1.5 + 1.5), 0, -trackLength / 2]} length={trackLength + 50} />
      
      {/* Car */}
      <group ref={carRef} position={[0, 0.5, 0]}>
        <Car />
      </group>
      
      {/* Junctions with floating labels */}
      {junctions.map((junction, jIndex) => (
        <group key={jIndex} position={[0, 0, junction.position]}>
          {/* Junction road splits */}
          {junction.choices.map((choice, cIndex) => (
            <group key={cIndex}>
              {/* Lane path indicator */}
              <mesh 
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[choice.lane * laneWidth, 0.02, 0]}
              >
                <planeGeometry args={[laneWidth - 0.5, 20]} />
                <meshStandardMaterial 
                  color={currentJunction > jIndex ? (choice.isCorrect ? '#4CAF50' : '#666666') : '#777777'} 
                />
              </mesh>
              
              {/* Floating label */}
              {currentJunction === jIndex && (
                <group position={[choice.lane * laneWidth, 4, -5]}>
                  {/* Label background */}
                  <mesh>
                    <boxGeometry args={[6, 2, 0.2]} />
                    <meshStandardMaterial color="#1a1a2e" />
                  </mesh>
                  {/* Label text */}
                  <Text
                    position={[0, 0, 0.15]}
                    fontSize={0.4}
                    maxWidth={5}
                    textAlign="center"
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {choice.text}
                  </Text>
                </group>
              )}
              
              {/* Wrong path barrier (always visible before entering a wrong lane) */}
{!choice.isCorrect && (
  <mesh
    position={[
      choice.lane * laneWidth,      // X = lane position
      1,                            // Y height
      junctionZ - 8                 // Z placed just inside the wrong path
    ]}
    castShadow
  >
    <boxGeometry args={[laneWidth * 0.9, 1.5, 0.6]} />  {/* width, height, depth */}
    <meshStandardMaterial color="#A30000" />            {/* 🚧 warning red */}
  </mesh>
)}

            </group>
          ))}
          
          {/* Junction question display */}
          {currentJunction === jIndex && (
            <Text
              position={[0, 6, 10]}
              fontSize={0.5}
              maxWidth={15}
              textAlign="center"
              color="#1a1a2e"
              anchorX="center"
              anchorY="middle"
            >
              {level.junctions[jIndex].question}
            </Text>
          )}
        </group>
      ))}
      
      {/* Finish line */}
      <group position={[0, 0, -(level.junctions.length + 1) * junctionSpacing]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <planeGeometry args={[laneWidth * 3, 2]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        <Text
          position={[0, 3, 0]}
          fontSize={1}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          🏁 FINISH 🏁
        </Text>
      </group>
      
      {/* Crash message overlay */}
      {showingCrash && (
        <Text
          position={[carPosition.x, 5, carPosition.z - 5]}
          fontSize={0.8}
          color="#FF0000"
          anchorX="center"
          anchorY="middle"
        >
          {crashMessage}
        </Text>
      )}
    </>
  );
};

// Car component
const Car = () => {
  return (
    <group>
      {/* Car body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.5, 0.6, 3]} />
        <meshStandardMaterial color="#E53935" />
      </mesh>
      {/* Car cabin */}
      <mesh position={[0, 0.7, 0.2]} castShadow>
        <boxGeometry args={[1.2, 0.5, 1.5]} />
        <meshStandardMaterial color="#C62828" />
      </mesh>
      {/* Wheels */}
      <Wheel position={[-0.7, 0, 1]} />
      <Wheel position={[0.7, 0, 1]} />
      <Wheel position={[-0.7, 0, -1]} />
      <Wheel position={[0.7, 0, -1]} />
    </group>
  );
};

// Wheel component
const Wheel = ({ position }: { position: [number, number, number] }) => {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
  );
};

// Guardrail component
const Guardrail = ({ position, length }: { position: [number, number, number]; length: number }) => {
  return (
    <group position={position}>
      {/* Posts */}
      {Array.from({ length: Math.floor(length / 5) }).map((_, i) => (
        <mesh key={i} position={[0, 0.5, -i * 5 + length / 2]} castShadow>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      ))}
      {/* Rail */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.3, 0.3, length]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
    </group>
  );
};
