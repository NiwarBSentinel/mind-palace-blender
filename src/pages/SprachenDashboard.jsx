import { useNavigate } from 'react-router-dom'

export default function SprachenDashboard() {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
      >
        ← Zurück zur Übersicht
      </button>

      <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
        Sprachen
      </h1>
      <p className="text-center text-slate-400 mb-10">
        Wähle eine Sprache zum Lernen
      </p>

      <div className="max-w-md mx-auto">
        <div
          onClick={() => navigate('/sprachen/deutsch')}
          className="p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] border-b-2 border-b-teal-500 hover:border-teal-500/50 cursor-pointer transition-all duration-300 group flex flex-col items-center text-center hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-500/10 hover:bg-[#13132e]"
        >
          <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">🇩🇪</div>
          <h2 className="text-xl font-bold text-slate-200 group-hover:text-teal-300 transition mb-2">
            Deutsch
          </h2>
          <p className="text-slate-400 text-sm">
            C1 Vokabeltrainer + Lernkarten
          </p>
        </div>
      </div>
    </div>
  )
}
