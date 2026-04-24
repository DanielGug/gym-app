import { useState, useEffect, useRef } from 'react';

export default function RestTimer({ seconds, onClose }) {
  const [remaining, setRemaining] = useState(seconds);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            // Vibrate if supported
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const progress = ((seconds - remaining) / seconds) * 100;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl border border-slate-700">
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-6">
          Pauză Recuperare
        </p>

        {/* Circular progress */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <svg width="128" height="128" className="-rotate-90">
            <circle
              cx="64" cy="64" r="54"
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
            />
            <circle
              cx="64" cy="64" r="54"
              fill="none"
              stroke={remaining === 0 ? '#22c55e' : '#3b82f6'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-4xl font-bold text-white">
              {mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : secs}
            </span>
            {remaining === 0 && (
              <div className="text-green-400 text-sm font-semibold mt-1">✓ Gata!</div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {remaining > 0 ? (
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex-1 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              {isRunning ? '⏸ Pauză' : '▶ Continuă'}
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold text-white bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            {remaining === 0 ? '✓ Continuă' : '✕ Skip'}
          </button>
        </div>

        {/* Quick adjust */}
        {remaining > 0 && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setRemaining((r) => Math.max(0, r - 15))}
              className="flex-1 py-2 text-sm text-slate-400 hover:text-white bg-slate-700/50 rounded-lg transition-colors"
            >
              −15s
            </button>
            <button
              onClick={() => setRemaining((r) => r + 15)}
              className="flex-1 py-2 text-sm text-slate-400 hover:text-white bg-slate-700/50 rounded-lg transition-colors"
            >
              +15s
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
