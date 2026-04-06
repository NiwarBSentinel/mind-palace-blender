import { useNavigate } from 'react-router-dom'

export default function DeutschDashboard() {
  const navigate = useNavigate()

  const modes = [
    {
      emoji: '📖',
      title: 'C1 Vokabeltrainer',
      desc: '204 Wörter mit SRS, Synonymen und Grammatik',
      path: '/deutsch-c1',
      color: 'blue',
    },
    {
      emoji: '🃏',
      title: 'Lernkarten Deutsch',
      desc: 'Alle Deutsch-Lernkarten an einem Ort',
      path: '/sprachen/deutsch/lernkarten',
      color: 'green',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/sprachen')}
        className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
      >
        ← Zurück zu Sprachen
      </button>

      <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
        🇩🇪 Deutsch
      </h1>
      <p className="text-center text-slate-400 mb-10">
        C1 Niveau Wortschatz und Lernkarten
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {modes.map((mode) => (
          <div
            key={mode.path}
            onClick={() => navigate(mode.path)}
            className={`p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] border-b-2 ${
              mode.color === 'blue' ? 'border-b-blue-500 hover:border-blue-500/50 hover:shadow-blue-500/10' : 'border-b-green-500 hover:border-green-500/50 hover:shadow-green-500/10'
            } cursor-pointer transition-all duration-300 group flex flex-col items-center text-center hover:scale-[1.02] hover:shadow-xl hover:bg-[#13132e]`}
          >
            <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">{mode.emoji}</div>
            <h2 className={`text-xl font-bold text-slate-200 transition mb-2 ${
              mode.color === 'blue' ? 'group-hover:text-blue-300' : 'group-hover:text-green-300'
            }`}>
              {mode.title}
            </h2>
            <p className="text-slate-400 text-sm">{mode.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
