import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Mind Palace
      </h1>
      <p className="text-center text-slate-400 mb-12">
        Wähle deinen Modus
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/palaces')}
          className="p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] hover:border-purple-500/50 cursor-pointer transition group flex flex-col items-center text-center"
        >
          <div className="text-5xl mb-4">🏛️</div>
          <h2 className="text-xl font-semibold text-slate-200 group-hover:text-purple-300 transition mb-2">
            Gedächtnispalast
          </h2>
          <p className="text-slate-400 text-sm">
            Erstelle eigene Paläste mit eigenen Räumen und Loci
          </p>
        </div>

        <div
          onClick={() => navigate('/bmp')}
          className="p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] hover:border-blue-500/50 cursor-pointer transition group flex flex-col items-center text-center"
        >
          <div className="text-5xl mb-4">🧠</div>
          <h2 className="text-xl font-semibold text-slate-200 group-hover:text-blue-300 transition mb-2">
            Body Memory Palace
          </h2>
          <p className="text-slate-400 text-sm">
            10 vordefinierte Personen mit je 50 festen Loci
          </p>
        </div>

        <div
          onClick={() => navigate('/lernkarten')}
          className="p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] hover:border-green-500/50 cursor-pointer transition group flex flex-col items-center text-center"
        >
          <div className="text-5xl mb-4">📇</div>
          <h2 className="text-xl font-semibold text-slate-200 group-hover:text-green-300 transition mb-2">
            Lernkarten
          </h2>
          <p className="text-slate-400 text-sm">
            Fragen & Antworten mit Mnemonik und Major-System Hilfe
          </p>
        </div>
      </div>
    </div>
  )
}
