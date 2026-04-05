import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PalaceDashboard from './pages/PalaceDashboard'
import Editor from './pages/Editor'
import Practice from './pages/Practice'
import BMPDashboard from './pages/BMPDashboard'
import BMPEditor from './pages/BMPEditor'
import BMPPractice from './pages/BMPPractice'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/palaces" element={<PalaceDashboard />} />
        <Route path="/palace/:id" element={<Editor />} />
        <Route path="/practice/:id" element={<Practice />} />
        <Route path="/bmp" element={<BMPDashboard />} />
        <Route path="/bmp/:personId" element={<BMPEditor />} />
        <Route path="/bmp/:personId/practice" element={<BMPPractice />} />
      </Routes>
    </div>
  )
}
