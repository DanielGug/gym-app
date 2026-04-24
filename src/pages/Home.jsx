import { useNavigate } from 'react-router-dom';
import { program } from '../data/program';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DAYS_OF_WEEK = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];

export default function Home() {
  const navigate = useNavigate();
  const [completed] = useLocalStorage('gymapp_completed', []);

  const getDayProgress = (day) => {
    const allExercises = day.phases.flatMap(p => p.exercises);
    const done = allExercises.filter(e => completed.includes(e.id)).length;
    return { done, total: allExercises.length };
  };

  const todayIndex = new Date().getDay();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-lg mx-auto px-4 pb-8">
        {/* Header */}
        <div className="pt-8 pb-6">
          <h1 className="text-2xl font-bold text-white">💪 Gym Recovery</h1>
          <p className="text-gray-400 text-sm mt-1">Program 4 zile / săptămână</p>
        </div>

        {/* Today banner */}
        <div className="bg-gray-800 rounded-2xl p-4 mb-6 border border-gray-700">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Astăzi</p>
          <p className="text-white font-semibold">{DAYS_OF_WEEK[todayIndex]}</p>
        </div>

        {/* Day Cards */}
        <div className="space-y-4">
          {program.map((day) => {
            const { done, total } = getDayProgress(day);
            const progressPct = total > 0 ? (done / total) * 100 : 0;
            const isComplete = done === total && total > 0;

            return (
              <button
                key={day.id}
                onClick={() => navigate(`/day/${day.id}`)}
                className="w-full text-left bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-gray-500 transition-all active:scale-98"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{day.emoji}</span>
                      <span className="font-bold text-white text-lg">{day.day}</span>
                      {isComplete && <span className="text-green-400 text-lg">✓</span>}
                    </div>
                    <p className="text-gray-400 text-sm">{day.focus}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-400">{done}/{total}</span>
                  </div>
                </div>

                {/* Phase labels */}
                <div className="flex gap-2 flex-wrap mb-3">
                  {day.phases.map(phase => (
                    <span
                      key={phase.id}
                      className={`text-xs px-2 py-0.5 rounded-full bg-gray-700 ${
                        phase.color === 'blue' ? 'text-blue-400' :
                        phase.color === 'orange' ? 'text-orange-400' :
                        'text-green-400'
                      }`}
                    >
                      {phase.label}
                    </span>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Rest days note */}
        <div className="mt-6 bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
          <p className="text-gray-500 text-sm text-center">
            🛌 Zile libere: Marți, Joi, Duminică
          </p>
        </div>
      </div>
    </div>
  );
}
