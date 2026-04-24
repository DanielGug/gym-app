import { useMemo } from 'react';
import { allDays, dayColors } from '../data/workoutProgram';

export default function ProgressTracker({ completedExercises, activePhase }) {
  const stats = useMemo(() => {
    return allDays.map((day) => {
      const exercises = day.phases[activePhase] || [];
      const total = exercises.length;
      const completed = exercises.filter((ex) => completedExercises.has(ex.id)).length;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { day, total, completed, pct };
    });
  }, [completedExercises, activePhase]);

  const totalCompleted = stats.reduce((acc, s) => acc + s.completed, 0);
  const totalExercises = stats.reduce((acc, s) => acc + s.total, 0);
  const overallPct = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-5">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <span className="text-lg">📊</span>
        Progres Săptămânal
      </h3>

      {/* Overall */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-sm">Total completat</span>
          <span className="text-white font-bold text-sm">{totalCompleted}/{totalExercises}</span>
        </div>
        <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <div className="text-right text-xs text-slate-500 mt-1">{overallPct}%</div>
      </div>

      {/* Per day */}
      <div className="space-y-3">
        {stats.map(({ day, total, completed, pct }) => {
          const colors = dayColors[day.id];
          return (
            <div key={day.id}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">{day.emoji}</span>
                <span className="text-slate-300 text-sm font-medium flex-1">{day.name} — {day.focus}</span>
                <span className={`text-xs font-semibold ${colors.text}`}>
                  {completed}/{total}
                </span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors.dot} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
