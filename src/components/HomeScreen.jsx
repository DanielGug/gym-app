import { allDays, dayColors, weeklySchedule, phases } from '../data/workoutProgram';

export default function HomeScreen({ activePhase, completedExercises, onSelectDay, onPhaseChange }) {
  const activePhaseInfo = phases.find((p) => p.id === activePhase);

  const getDayStats = (day) => {
    const exercises = day.phases[activePhase] || [];
    const total = exercises.length;
    const completed = exercises.filter((ex) => completedExercises.has(ex.id)).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pct, isDone: total > 0 && completed === total };
  };

  const totalCompleted = allDays.reduce((acc, day) => {
    const exercises = day.phases[activePhase] || [];
    return acc + exercises.filter((ex) => completedExercises.has(ex.id)).length;
  }, 0);

  const totalExercises = allDays.reduce((acc, day) => {
    return acc + (day.phases[activePhase] || []).length;
  }, 0);

  const weeklyPct = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 pt-8 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">💪 GymApp</h1>
              <p className="text-slate-400 text-sm mt-0.5">Recuperare & Performanță</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{weeklyPct}%</div>
              <div className="text-slate-500 text-xs">această săptămână</div>
            </div>
          </div>

          {/* Weekly progress bar */}
          <div className="mt-4">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${weeklyPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 max-w-2xl mx-auto w-full space-y-6">

        {/* Phase selector */}
        <div>
          <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Faza Curentă</h2>
          <div className="flex gap-2">
            {phases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => onPhaseChange(phase.id)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  activePhase === phase.id
                    ? `${phase.badge} text-white border-transparent shadow-lg`
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div>{phase.name}</div>
                <div className="font-normal opacity-70 mt-0.5">S{phase.weeks}</div>
              </button>
            ))}
          </div>
          {activePhaseInfo && (
            <div className={`mt-3 p-3 rounded-xl ${activePhaseInfo.bg} border ${activePhaseInfo.border}`}>
              <p className={`text-sm font-semibold ${activePhaseInfo.text}`}>{activePhaseInfo.subtitle}</p>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">{activePhaseInfo.description}</p>
            </div>
          )}
        </div>

        {/* Weekly schedule */}
        <div>
          <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Program Săptămânal</h2>
          <div className="space-y-2">
            {weeklySchedule.map(({ day, workout }) => {
              if (!workout) {
                return (
                  <div key={day} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-800">
                    <div className="w-2 h-2 rounded-full bg-slate-700 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{day}</span>
                    <span className="text-slate-700 text-xs ml-auto">Zi de odihnă</span>
                  </div>
                );
              }

              const stats = getDayStats(workout);
              const colors = dayColors[workout.id];

              return (
                <button
                  key={day}
                  onClick={() => onSelectDay(workout)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all active:scale-98 ${
                    stats.isDone
                      ? 'bg-slate-800/30 border-slate-700/50 opacity-70'
                      : `${colors.bg} ${colors.border} hover:border-opacity-80`
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${stats.isDone ? 'bg-green-500' : colors.dot}`} />
                  <span className="text-slate-300 text-sm font-medium">{day}</span>
                  <span className="text-xl ml-1">{workout.emoji}</span>
                  <div className="flex-1 min-w-0 text-left">
                    <div className={`text-sm font-semibold ${stats.isDone ? 'text-slate-500' : 'text-white'} truncate`}>
                      {workout.focus}
                    </div>
                    <div className="text-slate-500 text-xs">{workout.durationMin} min • {stats.total} exerciții</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {stats.isDone ? (
                      <span className="text-green-500 text-lg">✓</span>
                    ) : stats.completed > 0 ? (
                      <span className={`text-xs font-bold ${colors.text}`}>{stats.pct}%</span>
                    ) : null}
                    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick access to workout days */}
        <div>
          <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Antrenamente Rapide</h2>
          <div className="grid grid-cols-2 gap-3">
            {allDays.map((day) => {
              const stats = getDayStats(day);
              const colors = dayColors[day.id];

              return (
                <button
                  key={day.id}
                  onClick={() => onSelectDay(day)}
                  className={`relative text-left p-4 rounded-2xl border transition-all active:scale-95 ${colors.bg} ${colors.border}`}
                >
                  <div className="text-2xl mb-2">{day.emoji}</div>
                  <div className="text-white font-bold text-sm">{day.name}</div>
                  <div className="text-slate-400 text-xs mt-0.5 leading-tight">{day.focus}</div>
                  <div className="mt-3">
                    <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors.dot} rounded-full transition-all duration-500`}
                        style={{ width: `${stats.pct}%` }}
                      />
                    </div>
                    <div className={`text-xs mt-1 ${stats.isDone ? 'text-green-400' : colors.text}`}>
                      {stats.isDone ? '✓ Completat' : `${stats.completed}/${stats.total}`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Medical notice */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 pb-8">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">ℹ️ Profil Medical</p>
          <ul className="text-slate-500 text-xs space-y-1.5">
            <li>• <span className="text-amber-400">Prioritate 0:</span> Activare fesier drept inhibat</li>
            <li>• <span className="text-amber-400">Prioritate 1:</span> Reducerea durerii lombosacrate</li>
            <li>• <span className="text-amber-400">Prioritate 2:</span> Corectare asimetrie + postura</li>
            <li>• <span className="text-amber-400">Prioritate 3:</span> Hipertrofie & energie</li>
          </ul>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <p className="text-red-400 text-xs font-semibold">⛔ INTERZIS:</p>
            <p className="text-slate-500 text-xs mt-1">Squats cu bara, Deadlift clasic, Presă militară în picioare, Hiperextensii lombare</p>
          </div>
        </div>
      </div>
    </div>
  );
}
