import { useState } from 'react';
import ExerciseItem from './ExerciseItem';
import { dayColors } from '../data/workoutProgram';

export default function WorkoutDayView({ day, activePhase, completedExercises, onToggleComplete, onBack }) {
  const [showWarnings, setShowWarnings] = useState(true);
  const exercises = day.phases[activePhase] || [];
  const colors = dayColors[day.id];
  const completedCount = exercises.filter((ex) => completedExercises.has(ex.id)).length;
  const totalCount = exercises.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllDone = completedCount === totalCount && totalCount > 0;

  const handleMarkAll = () => {
    exercises.forEach((ex) => {
      if (!completedExercises.has(ex.id)) {
        onToggleComplete(ex.id);
      }
    });
  };

  const handleResetDay = () => {
    exercises.forEach((ex) => {
      if (completedExercises.has(ex.id)) {
        onToggleComplete(ex.id);
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className={`sticky top-0 z-30 ${colors.bg} backdrop-blur-sm border-b ${colors.border} px-4 py-3`}>
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{day.emoji}</span>
              <h1 className="text-white font-bold text-base truncate">{day.name} — {day.focus}</h1>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">{day.durationMin} min • {totalCount} exerciții</p>
          </div>
          <div className={`text-sm font-bold ${isAllDone ? 'text-green-400' : colors.text}`}>
            {pct}%
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-700 mt-2 rounded-full overflow-hidden max-w-2xl mx-auto">
          <div
            className={`h-full ${colors.dot} transition-all duration-300 rounded-full`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 max-w-2xl mx-auto w-full">

        {/* Warmup note */}
        {day.warmupNote && showWarnings && (
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4 mb-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-amber-400 font-semibold text-sm mb-1">🔥 Încălzire Obligatorie</p>
                <p className="text-amber-200/80 text-sm leading-relaxed">{day.warmupNote}</p>
              </div>
              <button
                onClick={() => setShowWarnings(false)}
                className="text-amber-500/60 hover:text-amber-400 flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Medical rules */}
        {showWarnings && (
          <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-4 mb-4">
            <p className="text-red-400 font-semibold text-sm mb-2">⛔ Reguli Medicale</p>
            <ul className="text-red-300/70 text-xs space-y-1">
              <li>• INTERZIS: genuflexiuni cu bara pe spate, îndreptări clasice grele</li>
              <li>• INTERZIS: presă militară în picioare, hiperextensii clasice</li>
              <li>• Dacă apare durere nouă — STOP și consultă medicul</li>
            </ul>
          </div>
        )}

        {/* Completion banner */}
        {isAllDone && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 mb-4 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-green-400 font-bold">Antrenament Completat!</p>
            <p className="text-slate-400 text-sm mt-1">Excelent! Zi de odihnă bine meritată.</p>
          </div>
        )}

        {/* Exercises */}
        <div className="space-y-3">
          {exercises.map((exercise) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              isCompleted={completedExercises.has(exercise.id)}
              onToggleComplete={onToggleComplete}
              phaseColor={colors}
            />
          ))}
        </div>

        {/* Bottom actions */}
        <div className="flex gap-3 mt-6 pb-8">
          <button
            onClick={handleMarkAll}
            disabled={isAllDone}
            className="flex-1 py-3 rounded-xl font-semibold text-sm text-white bg-green-600 hover:bg-green-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ✓ Marchează tot
          </button>
          <button
            onClick={handleResetDay}
            className="py-3 px-4 rounded-xl font-semibold text-sm text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  );
}
