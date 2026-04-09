import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navLinks = [
  { label: 'Mnemotechnik', path: '/mnemotechnik', emoji: '🧠' },
  { label: 'Lernkarten', path: '/lernkarten', emoji: '🃏' },
  { label: 'Sprachen', path: '/sprachen', emoji: '🌍' },
  { label: 'Trivia', path: '/trivia', emoji: '🎯' },
  { label: 'Rätsel', path: '/raetsel', emoji: '🧩' },
  { label: 'Geographie', path: '/geographie', emoji: '🌐' },
]

export default function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isHome = location.pathname === '/'

  function go(path) {
    navigate(path)
    setMobileOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-lg border-b border-[#1e1e3a]/60">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => go('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <span className="text-sm">🧩</span>
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hidden sm:inline">
              Mind Palace
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname.startsWith(link.path)
              return (
                <button
                  key={link.path}
                  onClick={() => go(link.path)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    active
                      ? 'bg-purple-500/15 text-purple-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e1e3a]/60'
                  }`}
                >
                  <span className="mr-1">{link.emoji}</span>
                  {link.label}
                </button>
              )
            })}
          </nav>

          {/* Right side: auth + hamburger */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => go('/dashboard/user')}
                  className="px-3 py-1.5 rounded-lg bg-[#12122a] border border-[#2a2a4a] text-slate-400 hover:text-purple-300 text-xs transition cursor-pointer"
                >
                  📊
                </button>
                <span className="text-xs text-slate-500 max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                <button
                  onClick={async () => { await signOut(); go('/') }}
                  className="px-3 py-1.5 rounded-lg bg-[#12122a] border border-[#2a2a4a] text-slate-400 hover:text-red-300 text-xs transition cursor-pointer"
                >
                  Abmelden
                </button>
              </div>
            ) : (
              <button
                onClick={() => go('/login')}
                className="hidden sm:block px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition cursor-pointer"
              >
                Anmelden
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1e1e3a]/60 transition cursor-pointer"
            >
              {mobileOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-down menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute top-14 left-0 right-0 bg-[#0f0f25]/95 backdrop-blur-lg border-b border-[#1e1e3a] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="p-4 space-y-1">
              {navLinks.map((link) => {
                const active = location.pathname.startsWith(link.path)
                return (
                  <button
                    key={link.path}
                    onClick={() => go(link.path)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer flex items-center gap-3 ${
                      active
                        ? 'bg-purple-500/15 text-purple-300'
                        : 'text-slate-300 hover:bg-[#1e1e3a]/60'
                    }`}
                  >
                    <span className="text-lg">{link.emoji}</span>
                    {link.label}
                  </button>
                )
              })}
            </nav>

            <div className="border-t border-[#1e1e3a] p-4 flex items-center justify-between">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => go('/dashboard/user')}
                      className="px-3 py-2 rounded-lg bg-[#12122a] border border-[#2a2a4a] text-slate-400 hover:text-purple-300 text-xs transition cursor-pointer"
                    >
                      📊 Fortschritt
                    </button>
                    <span className="text-xs text-slate-500 truncate max-w-[120px]">{user.email?.split('@')[0]}</span>
                  </div>
                  <button
                    onClick={async () => { await signOut(); go('/') }}
                    className="px-3 py-2 rounded-lg bg-[#12122a] border border-[#2a2a4a] text-red-400 hover:text-red-300 text-xs transition cursor-pointer"
                  >
                    Abmelden
                  </button>
                </>
              ) : (
                <button
                  onClick={() => go('/login')}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition cursor-pointer"
                >
                  Anmelden
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
