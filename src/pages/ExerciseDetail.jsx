import { useParams, useNavigate } from 'react-router-dom';
import { getExerciseById } from '../data/program';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Timer from '../components/Timer';

const PHASE_COLORS = {
  activation: 'text-blue-400 bg-blue-500/20',
  main: 'text-orange-400 bg-orange-500/20',
  stretching: 'text-green-400 bg-green-500/20',
};

const PHASE_LABELS = {
  activation: 'Activare',
  main: 'Antrenament',
  stretching: 'Stretching',
};

export default function ExerciseDetail() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const exercise = getExerciseById(exerciseId);
  const [completed, setCompleted] = useLocalStorage('gymapp_completed', []);

  if (!exercise) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      Exercițiul nu a fost găsit
    </div>
  );

  const isDone = completed.includes(exercise.id);
  const colorClass = PHASE_COLORS[exercise.phase] || PHASE_COLORS.activation;

  const toggleComplete = () => {
    setCompleted(prev =>
      prev.includes(exercise.id)
        ? prev.filter(id => id !== exercise.id)
        : [...prev, exercise.id]
    );
  };

  const handleTimerComplete = () => {
    if (!isDone) {
      setCompleted(prev => [...prev, exercise.id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-lg mx-auto px-4 pb-8">
        {/* Header */}
        <div className="pt-6 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            ← Înapoi
          </button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className={`text-xs px-2 py-1 rounded-full font-medium mb-2 inline-block ${colorClass}`}>
                {PHASE_LABELS[exercise.phase] || exercise.phaseName}
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">{exercise.name}</h1>
            </div>
            <button
              onClick={toggleComplete}
              className={`ml-4 mt-6 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                isDone ? 'bg-green-500 border-green-500' : 'border-gray-600 hover:border-green-400'
              }`}
            >
              {isDone && <span className="text-white">✓</span>}
            </button>
          </div>
        </div>

        {/* Video */}
        <div className="mb-5 rounded-2xl overflow-hidden bg-gray-800">
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${exercise.videoId}?rel=0&modestbranding=1`}
              title={exercise.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-5 flex-wrap">
          {exercise.sets && (
            <div className="bg-gray-800 rounded-xl px-4 py-3 flex-1 min-w-0 border border-gray-700 text-center">
              <p className="text-gray-400 text-xs mb-1">Seturi</p>
              <p className="text-white font-bold text-lg">{exercise.sets}</p>
            </div>
          )}
          <div className="bg-gray-800 rounded-xl px-4 py-3 flex-1 min-w-0 border border-gray-700 text-center">
            <p className="text-gray-400 text-xs mb-1">{exercise.phase === 'stretching' ? 'Durată' : 'Repetări'}</p>
            <p className="text-white font-bold text-lg">{exercise.reps}</p>
          </div>
          {exercise.rest > 0 && (
            <div className="bg-gray-800 rounded-xl px-4 py-3 flex-1 min-w-0 border border-gray-700 text-center">
              <p className="text-gray-400 text-xs mb-1">Pauză</p>
              <p className="text-white font-bold text-lg">{exercise.rest}s</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 rounded-2xl p-4 mb-5 border border-gray-700">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Instrucțiuni</h3>
          <p className="text-white leading-relaxed">{exercise.instructions}</p>
        </div>

        {/* Timer for stretching */}
        {exercise.phase === 'stretching' && exercise.duration && (
          <div className="bg-gray-800 rounded-2xl p-4 border border-green-500/30">
            <h3 className="text-green-400 text-xs uppercase tracking-wider mb-2 text-center">⏱ Timer Stretching</h3>
            <Timer duration={exercise.duration} onComplete={handleTimerComplete} />
          </div>
        )}

        {/* Mark done button */}
        <button
          onClick={toggleComplete}
          className={`w-full mt-4 py-4 rounded-2xl font-semibold text-lg transition-all ${
            isDone
              ? 'bg-green-600/20 text-green-400 border-2 border-green-500/40'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isDone ? '✓ Marcat ca terminat' : 'Marchează ca terminat'}
        </button>
      </div>
    </div>
  );
}
