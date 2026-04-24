import { useState, useEffect, useRef } from 'react';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Timer({ duration, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            onComplete && onComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const progress = (duration - timeLeft) / duration;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const handleStart = () => {
    setStarted(true);
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);
  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setStarted(false);
    setTimeLeft(duration);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}s`;
  };

  const isComplete = timeLeft === 0;

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60" cy="60" r={RADIUS}
            fill="none"
            stroke="#374151"
            strokeWidth="8"
          />
          <circle
            cx="60" cy="60" r={RADIUS}
            fill="none"
            stroke={isComplete ? '#22c55e' : '#3b82f6'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {isComplete ? '✓' : formatTime(timeLeft)}
          </span>
          {!isComplete && (
            <span className="text-xs text-gray-400 mt-1">
              / {formatTime(duration)}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        {!started && !isComplete && (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors"
          >
            ▶ Start
          </button>
        )}
        {started && !isComplete && (
          <>
            {isRunning ? (
              <button
                onClick={handlePause}
                className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full font-semibold transition-colors"
              >
                ⏸ Pauză
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors"
              >
                ▶ Continuă
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-semibold transition-colors"
            >
              ↺
            </button>
          </>
        )}
        {isComplete && (
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-colors"
          >
            ↺ Din nou
          </button>
        )}
      </div>
    </div>
  );
}
