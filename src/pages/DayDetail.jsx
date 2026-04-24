import { useParams, useNavigate } from 'react-router-dom';
import { getDayById } from '../data/program';
import { useLocalStorage } from '../hooks/useLocalStorage';

const PHASE_COLORS = {
  activation: { border: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-300', dot: 'bg-blue-500' },
  main: { border: 'border-orange-500/30', badge: 'bg-orange-500/20 text-orange-300', dot: 'bg-orange-500' },
  stretching: { border: 'border-green-500/30', badge: 'bg-green-500/20 text-green-300', dot: 'bg-green-500' },
};

export default function DayDetail() {
  const { dayId } = useParams();
  const navigate = useNavigate();
  const day = getDayById(dayId);
  const [completed, setCompleted] = useLocalStorage('gymapp_completed', []);

  if (!day) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Ziua nu a fost găsită</div>;

  const allExercises = day.phases.flatMap(p => p.exercises);
  const doneCount = allExercises.filter(e => completed.includes(e.id)).length;
  const progressPct = allExercises.length > 0 ? (doneCount / allExercises.length) * 100 : 0;

  const toggleComplete = (e, exId) => {
    e.stopPropagation();
    setCompleted(prev =>
      prev.includes(exId) ? prev.filter(id => id !== exId) : [...prev, exId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-lg mx-auto px-4 pb-8">
        {/* Header */}
        <div className="pt-6 pb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            ← Înapoi
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{day.emoji}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{day.day}</h1>
              <p className="text-gray-400 text-sm">{day.focus}</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-gray-800 rounded-2xl p-4 mb-6 border border-gray-700">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progres</span>
            <span className="text-white font-semibold">{doneCount} / {allExercises.length} exerciții</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressPct === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-6">
          {day.phases.map((phase) => {
            const colors = PHASE_COLORS[phase.color] || PHASE_COLORS.activation;
            return (
              <div key={phase.id}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  <h2 className="font-semibold text-white">{phase.label}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                    {phase.exercises.length} ex.
                  </span>
                </div>

                <div className="space-y-2">
                  {phase.exercises.map((ex) => {
                    const isDone = completed.includes(ex.id);
                    return (
                      <div
                        key={ex.id}
                        className={`flex items-center gap-3 bg-gray-800 rounded-xl p-4 border cursor-pointer hover:border-gray-500 transition-all ${
                          isDone ? 'border-green-500/40 bg-green-900/10' : `border-gray-700 ${colors.border}`
                        }`}
                        onClick={() => navigate(`/exercise/${ex.id}`)}
                      >
                        <button
                          onClick={(e) => toggleComplete(e, ex.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isDone ? 'bg-green-500 border-green-500' : 'border-gray-600 hover:border-green-400'
                          }`}
                        >
                          {isDone && <span className="text-white text-xs">✓</span>}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${isDone ? 'text-gray-400 line-through' : 'text-white'}`}>
                            {ex.name}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {ex.sets ? `${ex.sets} seturi × ` : ''}{ex.reps}
                            {ex.rest > 0 ? ` · ${ex.rest}s pauză` : ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {ex.phase === 'stretching' && (
                            <span className="text-green-400 text-xs">⏱</span>
                          )}
                          <span className="text-gray-600">›</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
