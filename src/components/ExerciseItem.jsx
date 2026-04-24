import { useState } from 'react';
import { typeConfig } from '../data/workoutProgram';
import RestTimer from './RestTimer';

export default function ExerciseItem({ exercise, isCompleted, onToggleComplete, phaseColor }) {
  const [expanded, setExpanded] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const typeConf = typeConfig[exercise.type] || typeConfig.strength;

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/);
    return match ? match[1] : null;
  };

  const ytId = getYouTubeId(exercise.videoUrl);
  const ytThumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;

  const setsRepsLabel = () => {
    if (exercise.duration) {
      const mins = Math.floor(exercise.duration / 60);
      const secs = exercise.duration % 60;
      const timeStr = mins > 0 ? `${mins}min ${secs > 0 ? secs + 's' : ''}` : `${secs}s`;
      const base = `${exercise.sets} × ${timeStr}`;
      return exercise.side ? `${base} per parte` : base;
    }
    if (exercise.reps) {
      const base = `${exercise.sets} × ${exercise.reps} rep`;
      return exercise.side ? `${base} per parte` : base;
    }
    return `${exercise.sets} seturi`;
  };

  return (
    <>
      <div
        className={`rounded-xl border transition-all duration-200 overflow-hidden ${
          isCompleted
            ? 'bg-slate-800/30 border-slate-700/50 opacity-60'
            : exercise.priority
            ? 'bg-slate-800 border-amber-500/40 shadow-lg shadow-amber-500/5'
            : 'bg-slate-800 border-slate-700'
        }`}
      >
        {/* Priority banner */}
        {exercise.priority && !isCompleted && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-1.5">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
              ⭐ Prioritate medicală
            </span>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={() => onToggleComplete(exercise.id)}
              className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                isCompleted
                  ? 'bg-green-500 border-green-500'
                  : 'border-slate-500 hover:border-slate-400'
              }`}
            >
              {isCompleted && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-semibold text-sm leading-tight ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                  {exercise.name}
                </h3>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-slate-400 hover:text-white transition-colors flex-shrink-0 mt-0.5"
                >
                  <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <p className="text-slate-400 text-xs mt-0.5">{exercise.muscles}</p>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {/* Sets/reps badge */}
                <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full font-medium">
                  {setsRepsLabel()}
                </span>
                {/* Type badge */}
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${typeConf.color}`}>
                  {typeConf.label}
                </span>
                {/* Rest time */}
                {exercise.restTime > 0 && (
                  <span className="text-slate-500 text-xs">
                    Pauză: {exercise.restTime}s
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Expanded details */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
              {/* Notes */}
              {exercise.notes && (
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    💡 {exercise.notes}
                  </p>
                </div>
              )}

              {/* Warning */}
              {exercise.warning && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm leading-relaxed">
                    ⚠️ {exercise.warning}
                  </p>
                </div>
              )}

              {/* Video thumbnail */}
              {ytThumbnail && (
                <div className="mt-2">
                  <button
                    onClick={() => setShowVideo(true)}
                    className="relative w-full rounded-xl overflow-hidden group"
                  >
                    <img
                      src={ytThumbnail}
                      alt={exercise.name}
                      className="w-full h-36 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                      YouTube
                    </div>
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                {exercise.restTime > 0 && (
                  <button
                    onClick={() => setShowTimer(true)}
                    className="flex-1 py-2 text-sm font-medium rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 transition-colors"
                  >
                    ⏱ Timer {exercise.restTime}s
                  </button>
                )}
                {!isCompleted && (
                  <button
                    onClick={() => onToggleComplete(exercise.id)}
                    className="flex-1 py-2 text-sm font-medium rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30 transition-colors"
                  >
                    ✓ Completat
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rest Timer Modal */}
      {showTimer && (
        <RestTimer seconds={exercise.restTime} onClose={() => setShowTimer(false)} />
      )}

      {/* Video Modal */}
      {showVideo && ytId && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">{exercise.name}</h3>
              <button
                onClick={() => setShowVideo(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                title={exercise.name}
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            </div>
            <p className="text-slate-400 text-xs mt-3 text-center">Apasă în afara ferestrei pentru a închide</p>
          </div>
        </div>
      )}
    </>
  );
}
