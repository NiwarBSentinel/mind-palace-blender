import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="fixed top-4 right-4 z-40 px-3 py-1.5 rounded-lg bg-[#12122a] border border-[#2a2a4a] text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
      >
        Anmelden
      </button>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      <button
        onClick={() => navigate('/dashboard/user')}
        className="px-3 py-1.5 rounded-lg bg-[#12122a] border border-[#2a2a4a] text-slate-400 hover:text-purple-300 text-xs transition cursor-pointer"
      >
        📊 Fortschritt
      </button>
      <span className="text-xs text-slate-500 max-w-[120px] truncate">{user.email}</span>
      <button
        onClick={async () => { await signOut(); navigate('/') }}
        className="px-3 py-1.5 rounded-lg bg-[#12122a] border border-[#2a2a4a] text-slate-400 hover:text-red-300 text-xs transition cursor-pointer"
      >
        Abmelden
      </button>
    </div>
  )
}
