import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'
import Practice from './pages/Practice'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/palace/:id" element={<Editor />} />
        <Route path="/practice/:id" element={<Practice />} />
      </Routes>
    </div>
  )
}
