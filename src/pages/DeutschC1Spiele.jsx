import { useNavigate } from 'react-router-dom'

export default function DeutschC1Spiele() {
  const navigate = useNavigate()

  const games = [
    { emoji: '💀', title: 'Hangman', desc: 'C1 Wörter erraten — 6 Versuche', path: '/sprachen/deutsch/hangman', color: 'rose' },
    { emoji: '📝', title: 'Lückentext', desc: 'Fehlende Wörter im Satz ergänzen', path: '/sprachen/deutsch/lueckentext', color: 'amber' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/sprachen/deutsch')}
        className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
      >
        ← Zurück zu Deutsch
      </button>

      <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        🎮 C1 Spiele
      </h1>
      <p className="text-center text-slate-400 mb-10">
        Spielerisch C1 Wortschatz üben
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {games.map((g) => (
          <div
            key={g.path}
            onClick={() => navigate(g.path)}
            className={`p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] border-b-2 ${
              g.color === 'rose' ? 'border-b-rose-500 hover:border-rose-500/50 hover:shadow-rose-500/10' : 'border-b-amber-500 hover:border-amber-500/50 hover:shadow-amber-500/10'
            } cursor-pointer transition-all duration-300 group hover:scale-[1.02] hover:shadow-xl hover:bg-[#13132e]`}
          >
            <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">{g.emoji}</div>
            <div className={`text-lg font-bold text-slate-200 transition ${
              g.color === 'rose' ? 'group-hover:text-rose-300' : 'group-hover:text-amber-300'
            }`}>{g.title}</div>
            <div className="text-slate-500 text-sm mt-1">{g.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
