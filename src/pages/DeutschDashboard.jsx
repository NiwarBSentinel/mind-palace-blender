import { useNavigate } from 'react-router-dom'

const levels = [
  { level: 'A1', name: 'Anfänger', color: 'green', active: true, vocPath: '/sprachen/deutsch/a1' },
  { level: 'A2', name: 'Grundlegende Kenntnisse', color: 'teal', active: true, vocPath: '/sprachen/deutsch/a2' },
  { level: 'B1', name: 'Mittelstufe', color: 'blue', active: true, vocPath: '/sprachen/deutsch/b1' },
  { level: 'B2', name: 'Obere Mittelstufe', color: 'indigo', active: false },
  { level: 'C1', name: 'Fortgeschritten', color: 'purple', active: true, vocPath: '/deutsch-c1', cardPath: '/sprachen/deutsch/lernkarten', quizPath: '/sprachen/deutsch/c1/quiz', spielePath: '/sprachen/deutsch/c1/spiele' },
  { level: 'C2', name: 'Experte', color: 'red', active: false },
]

const colorClasses = {
  green:  { border: 'border-b-green-500',  badge: 'bg-green-500/20 text-green-300',  text: 'text-green-400',  btn: 'bg-green-600 hover:bg-green-500' },
  teal:   { border: 'border-b-teal-500',   badge: 'bg-teal-500/20 text-teal-300',    text: 'text-teal-400',   btn: 'bg-teal-600 hover:bg-teal-500' },
  blue:   { border: 'border-b-blue-500',   badge: 'bg-blue-500/20 text-blue-300',    text: 'text-blue-400',   btn: 'bg-blue-600 hover:bg-blue-500' },
  indigo: { border: 'border-b-indigo-500', badge: 'bg-indigo-500/20 text-indigo-300', text: 'text-indigo-400', btn: 'bg-indigo-600 hover:bg-indigo-500' },
  purple: { border: 'border-b-purple-500', badge: 'bg-purple-500/20 text-purple-300', text: 'text-purple-400', btn: 'bg-purple-600 hover:bg-purple-500' },
  red:    { border: 'border-b-red-500',    badge: 'bg-red-500/20 text-red-300',      text: 'text-red-400',    btn: 'bg-red-600 hover:bg-red-500' },
}

export default function DeutschDashboard() {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/sprachen')}
        className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
      >
        ← Zurück zu Sprachen
      </button>

      <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        🇩🇪 Deutsch
      </h1>
      <p className="text-center text-slate-400 mb-10">
        Wähle dein Niveau
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {levels.map((l) => {
          const c = colorClasses[l.color]
          return (
            <div
              key={l.level}
              className={`rounded-xl bg-[#12122a] border border-[#1e1e3a] border-b-2 ${c.border} overflow-hidden ${l.active ? '' : 'opacity-60'}`}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-2xl font-extrabold ${c.text}`}>{l.level}</span>
                  {!l.active && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-500">Kommt bald</span>
                  )}
                </div>
                <div className="text-slate-200 font-medium text-sm mb-4">{l.name}</div>
                <div className="grid grid-cols-2 gap-2">
                  {l.active ? (
                    <>
                      {l.vocPath ? (
                        <button onClick={() => navigate(l.vocPath)} className={`px-3 py-2 rounded-lg ${c.btn} text-white text-xs font-medium transition cursor-pointer`}>📖 Vokabeln</button>
                      ) : (
                        <div className="px-3 py-2 rounded-lg bg-[#1e1e3a] text-slate-600 text-xs font-medium text-center">📖 Vokabeln</div>
                      )}
                      {l.cardPath ? (
                        <button onClick={() => navigate(l.cardPath)} className="px-3 py-2 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] text-xs font-medium transition cursor-pointer">🃏 Lernkarten</button>
                      ) : (
                        <div className="px-3 py-2 rounded-lg bg-[#1e1e3a] text-slate-600 text-xs font-medium text-center">🃏 Lernkarten</div>
                      )}
                      {l.quizPath ? (
                        <button onClick={() => navigate(l.quizPath)} className="px-3 py-2 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] text-xs font-medium transition cursor-pointer">🎯 Quiz</button>
                      ) : (
                        <div className="px-3 py-2 rounded-lg bg-[#1e1e3a] text-slate-600 text-xs font-medium text-center">🎯 Quiz</div>
                      )}
                      {l.spielePath ? (
                        <button onClick={() => navigate(l.spielePath)} className="px-3 py-2 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] text-xs font-medium transition cursor-pointer">🎮 Spiele</button>
                      ) : (
                        <div className="px-3 py-2 rounded-lg bg-[#1e1e3a] text-slate-600 text-xs font-medium text-center">🎮 Spiele</div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2 rounded-lg bg-[#1e1e3a] text-slate-600 text-xs font-medium text-center">📖 Vokabeln</div>
                      <div className="px-3 py-2 rounded-lg bg-[#1e1e3a] text-slate-600 text-xs font-medium text-center">🃏 Lernkarten</div>
                      <div className="px-3 py-2 rounded-lg bg-[#1e1e3a] text-slate-600 text-xs font-medium text-center">🎯 Quiz</div>
                      <div className="px-3 py-2 rounded-lg bg-[#1e1e3a] text-slate-600 text-xs font-medium text-center">🎮 Spiele</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
