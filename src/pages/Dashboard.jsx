import { useNavigate } from 'react-router-dom'

const groups = [
  {
    key: 'mnemotechnik',
    emoji: '🧠',
    title: 'Mnemotechnik',
    desc: 'Gedächtnispalast, Body Memory Palace, Routen & Peg List',
    color: 'purple',
    path: '/mnemotechnik',
  },
  {
    key: 'lernkarten',
    emoji: '🃏',
    title: 'Lernkarten',
    desc: 'Fragen & Antworten mit Mnemonik und Major-System Hilfe',
    color: 'green',
    path: '/lernkarten',
  },
  {
    key: 'sprachen',
    emoji: '🌍',
    title: 'Sprachen',
    desc: 'Vokabeln und Grammatik lernen',
    color: 'teal',
    path: '/sprachen',
  },
  {
    key: 'trivia',
    emoji: '🎯',
    title: 'Trivia',
    desc: 'Allgemeinwissen testen mit tausenden Fragen',
    color: 'red',
    path: '/trivia',
  },
  {
    key: 'raetsel',
    emoji: '🧩',
    title: 'Rätsel',
    desc: 'Logikrätsel & Scherzfragen zum Knobeln',
    color: 'orange',
    path: '/raetsel',
  },
  {
    key: 'geographie',
    emoji: '🌐',
    title: 'Geographie',
    desc: 'Hauptstädte, Flaggen & Weltkarte interaktiv lernen',
    color: 'cyan',
    path: '/geographie',
  },
]

const colorMap = {
  purple: {
    border: 'border-b-purple-500',
    hoverBorder: 'hover:border-purple-500/50',
    hoverText: 'group-hover:text-purple-300',
    shadow: 'hover:shadow-purple-500/20',
  },
  green: {
    border: 'border-b-green-500',
    hoverBorder: 'hover:border-green-500/50',
    hoverText: 'group-hover:text-green-300',
    shadow: 'hover:shadow-green-500/20',
  },
  red: {
    border: 'border-b-red-500',
    hoverBorder: 'hover:border-red-500/50',
    hoverText: 'group-hover:text-red-300',
    shadow: 'hover:shadow-red-500/20',
  },
  orange: {
    border: 'border-b-orange-500',
    hoverBorder: 'hover:border-orange-500/50',
    hoverText: 'group-hover:text-orange-300',
    shadow: 'hover:shadow-orange-500/20',
  },
  cyan: {
    border: 'border-b-cyan-500',
    hoverBorder: 'hover:border-cyan-500/50',
    hoverText: 'group-hover:text-cyan-300',
    shadow: 'hover:shadow-cyan-500/20',
  },
  teal: {
    border: 'border-b-teal-500',
    hoverBorder: 'hover:border-teal-500/50',
    hoverText: 'group-hover:text-teal-300',
    shadow: 'hover:shadow-teal-500/20',
  },
}

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d24] to-[#050510] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/25">
            <span className="text-3xl">🧩</span>
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-center mb-3 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
          Mind Palace Blender
        </h1>
        <p className="text-center text-slate-400 text-lg mb-16 tracking-wide">
          Dein persönliches Gedächtnissystem
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {groups.map((g) => {
            const c = colorMap[g.color]
            return (
              <div
                key={g.key}
                onClick={() => navigate(g.path)}
                className={`relative p-8 rounded-2xl bg-[#0f0f25]/80 backdrop-blur border border-[#1e1e3a] border-b-2 ${c.border} ${c.hoverBorder} cursor-pointer transition-all duration-300 group flex flex-col items-center text-center hover:scale-[1.03] hover:shadow-xl ${c.shadow} hover:bg-[#13132e]`}
              >
                <div className="text-5xl mb-5 transition-transform duration-300 group-hover:scale-110">
                  {g.emoji}
                </div>
                <h2 className={`text-xl font-bold text-slate-200 ${c.hoverText} transition mb-2`}>
                  {g.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {g.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <footer className="text-center pb-6 text-slate-600 text-xs tracking-wider">
        mind-palace-blender.vercel.app
      </footer>
    </div>
  )
}
