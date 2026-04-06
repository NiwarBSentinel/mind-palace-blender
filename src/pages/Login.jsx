import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
        navigate('/')
      } else {
        await signUp(email, password)
        setSuccess('Registrierung erfolgreich! Bitte bestätige deine E-Mail.')
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d24] to-[#050510] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
            <span className="text-2xl">🧩</span>
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Mind Palace Blender
          </h1>
        </div>

        <div className="p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a]">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setMode('login'); setError(null); setSuccess(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                mode === 'login' ? 'bg-purple-600 text-white' : 'bg-[#1e1e3a] text-slate-400 hover:text-slate-200'
              }`}
            >
              Anmelden
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); setSuccess(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                mode === 'register' ? 'bg-purple-600 text-white' : 'bg-[#1e1e3a] text-slate-400 hover:text-slate-200'
              }`}
            >
              Registrieren
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
            />
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-medium transition cursor-pointer"
            >
              {loading ? 'Laden...' : mode === 'login' ? 'Anmelden' : 'Registrieren'}
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 py-2 text-slate-500 hover:text-slate-300 text-sm transition cursor-pointer"
          >
            Ohne Konto fortfahren →
          </button>
        </div>
      </div>
    </div>
  )
}
