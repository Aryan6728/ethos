
import React, { useState, useEffect, useCallback } from 'react';
import { useInterval } from '../hooks/useInterval';
import { EthereumLogo } from './Icons';

const GRID_SIZE = 20;
const TILE_SIZE = 24; // in pixels

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const getRandomPosition = (snakeBody: Position[] = []): Position => {
  let position: Position;
  do {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snakeBody.some(segment => segment.x === position.x && segment.y === position.y));
  return position;
};

export const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>(getRandomPosition(snake));
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [speed, setSpeed] = useState<number | null>(200);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const resetGame = () => {
    const startSnake = [{ x: 10, y: 10 }];
    setSnake(startSnake);
    setFood(getRandomPosition(startSnake));
    setDirection('RIGHT');
    setSpeed(200);
    setIsGameOver(false);
    setScore(0);
  };

  const gameLoop = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setIsGameOver(true);
      setSpeed(null);
      return;
    }

    // Self collision
    for (let i = 1; i < newSnake.length; i++) {
      if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
        setIsGameOver(true);
        setSpeed(null);
        return;
      }
    }

    newSnake.unshift(head);

    // Food consumption
    if (head.x === food.x && head.y === food.y) {
      setScore(s => s + 1);
      setFood(getRandomPosition(newSnake));
      // Increase speed slightly
      setSpeed(s => (s ? Math.max(50, s * 0.95) : null));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  useInterval(gameLoop, speed);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20">
        <div className="flex justify-between items-center mb-4 w-full" style={{ width: GRID_SIZE * TILE_SIZE }}>
          <h3 className="text-xl font-bold text-gray-800">Snake Game</h3>
          <p className="text-lg font-semibold text-gray-700">Score: {score}</p>
        </div>
        <div
          className="relative bg-black/10 rounded-lg"
          style={{
            width: GRID_SIZE * TILE_SIZE,
            height: GRID_SIZE * TILE_SIZE,
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {isGameOver && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col justify-center items-center rounded-lg z-10">
              <p className="text-4xl font-bold text-white">Game Over</p>
              <p className="text-xl text-white mt-2">Final Score: {score}</p>
              <button onClick={resetGame} className="mt-6 px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition-all">
                Play Again
              </button>
            </div>
          )}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute ${index === 0 ? 'bg-green-500' : 'bg-green-400'} rounded-sm`}
              style={{
                left: segment.x * TILE_SIZE,
                top: segment.y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
                transition: 'all 0.1s linear'
              }}
            />
          ))}
          <div
            className="absolute"
            style={{
              left: food.x * TILE_SIZE,
              top: food.y * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
            }}
          >
            <EthereumLogo className="w-full h-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
