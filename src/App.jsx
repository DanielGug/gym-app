import { useState, useCallback } from 'react';
import HomeScreen from './components/HomeScreen';
import WorkoutDayView from './components/WorkoutDayView';

const STORAGE_KEY = 'gymapp_completed_v1';
const PHASE_KEY = 'gymapp_phase_v1';

function loadCompleted() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCompleted(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {}
}

function loadPhase() {
  try {
    const stored = localStorage.getItem(PHASE_KEY);
    const phase = stored ? parseInt(stored, 10) : 1;
    return [1, 2, 3].includes(phase) ? phase : 1;
  } catch {
    return 1;
  }
}

export default function App() {
  const [activePhase, setActivePhase] = useState(loadPhase);
  const [completedExercises, setCompletedExercises] = useState(loadCompleted);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleToggleComplete = useCallback((exerciseId) => {
    setCompletedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(exerciseId)) {
        next.delete(exerciseId);
      } else {
        next.add(exerciseId);
      }
      saveCompleted(next);
      return next;
    });
  }, []);

  const handlePhaseChange = useCallback((phase) => {
    setActivePhase(phase);
    localStorage.setItem(PHASE_KEY, String(phase));
  }, []);

  const handleSelectDay = useCallback((day) => {
    setSelectedDay(day);
    window.scrollTo(0, 0);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedDay(null);
    window.scrollTo(0, 0);
  }, []);

  if (selectedDay) {
    return (
      <WorkoutDayView
        day={selectedDay}
        activePhase={activePhase}
        completedExercises={completedExercises}
        onToggleComplete={handleToggleComplete}
        onBack={handleBack}
      />
    );
  }

  return (
    <HomeScreen
      activePhase={activePhase}
      completedExercises={completedExercises}
      onSelectDay={handleSelectDay}
      onPhaseChange={handlePhaseChange}
    />
  );
}
