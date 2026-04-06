import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import UserMenu from './components/UserMenu'
import Dashboard from './pages/Dashboard'
import PalaceDashboard from './pages/PalaceDashboard'
import Editor from './pages/Editor'
import Practice from './pages/Practice'
import BMPDashboard from './pages/BMPDashboard'
import BMPEditor from './pages/BMPEditor'
import BMPPractice from './pages/BMPPractice'
import LernkartenDashboard from './pages/LernkartenDashboard'
import LernkartenPractice from './pages/LernkartenPractice'
import PegList from './pages/PegList'
import Trivia from './pages/Trivia'
import DeutschC1 from './pages/DeutschC1'
import SprachenDashboard from './pages/SprachenDashboard'
import DeutschDashboard from './pages/DeutschDashboard'
import DeutschLernkarten from './pages/DeutschLernkarten'
import DeutschLernkartenPractice from './pages/DeutschLernkartenPractice'
import DeutschC1Quiz from './pages/DeutschC1Quiz'
import GoetheLevel from './pages/GoetheLevel'
import HangmanGame from './pages/HangmanGame'
import DeutschC1Spiele from './pages/DeutschC1Spiele'
import LueckentextGame from './pages/LueckentextGame'
import MemoryGame from './pages/MemoryGame'
import ZeitdruckQuiz from './pages/ZeitdruckQuiz'
import ArtikelTrainer from './pages/ArtikelTrainer'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0a0a1a]">
        <UserMenu />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/palaces" element={<PalaceDashboard />} />
          <Route path="/palace/:id" element={<Editor />} />
          <Route path="/practice/:id" element={<Practice />} />
          <Route path="/bmp" element={<BMPDashboard />} />
          <Route path="/bmp/:personId" element={<BMPEditor />} />
          <Route path="/bmp/:personId/practice" element={<BMPPractice />} />
          <Route path="/lernkarten" element={<LernkartenDashboard />} />
          <Route path="/lernkarten/practice" element={<LernkartenPractice />} />
          <Route path="/peglist" element={<PegList />} />
          <Route path="/trivia" element={<Trivia />} />
          <Route path="/sprachen" element={<SprachenDashboard />} />
          <Route path="/sprachen/deutsch" element={<DeutschDashboard />} />
          <Route path="/sprachen/deutsch/lernkarten" element={<DeutschLernkarten />} />
          <Route path="/sprachen/deutsch/lernkarten/practice" element={<DeutschLernkartenPractice />} />
          <Route path="/sprachen/deutsch/artikel" element={<ArtikelTrainer />} />
          <Route path="/sprachen/deutsch/c1" element={<DeutschC1 />} />
          <Route path="/sprachen/deutsch/:level/quiz" element={<DeutschC1Quiz />} />
          <Route path="/sprachen/deutsch/:level/spiele" element={<DeutschC1Spiele />} />
          <Route path="/sprachen/deutsch/:level/hangman" element={<HangmanGame />} />
          <Route path="/sprachen/deutsch/:level/lueckentext" element={<LueckentextGame />} />
          <Route path="/sprachen/deutsch/:level/memory" element={<MemoryGame />} />
          <Route path="/sprachen/deutsch/:level/zeitdruck" element={<ZeitdruckQuiz />} />
          <Route path="/sprachen/deutsch/:level" element={<GoetheLevel />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
