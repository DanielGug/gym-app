import { phases } from '../data/workoutProgram';

export default function PhaseSelector({ activePhase, onChange }) {
  return (
    <div className="space-y-2">
      {phases.map((phase) => (
        <button
          key={phase.id}
          onClick={() => onChange(phase.id)}
          className={`w-full text-left rounded-xl p-4 border transition-all duration-200 ${
            activePhase === phase.id
              ? `${phase.bg} ${phase.border} shadow-lg`
              : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  activePhase === phase.id ? phase.badge : 'bg-slate-700'
                } text-white`}
              >
                {phase.name}
              </span>
              <div>
                <div className="font-semibold text-white text-sm">{phase.subtitle}</div>
                <div className="text-slate-400 text-xs">Săptămânile {phase.weeks}</div>
              </div>
            </div>
            {activePhase === phase.id && (
              <svg className={`w-5 h-5 ${phase.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <p className={`text-xs mt-2 leading-relaxed ${activePhase === phase.id ? 'text-slate-300' : 'text-slate-500'}`}>
            {phase.description}
          </p>
        </button>
      ))}
    </div>
  );
}
