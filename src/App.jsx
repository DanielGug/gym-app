import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DayDetail from './pages/DayDetail';
import ExerciseDetail from './pages/ExerciseDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/day/:dayId" element={<DayDetail />} />
        <Route path="/exercise/:exerciseId" element={<ExerciseDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
