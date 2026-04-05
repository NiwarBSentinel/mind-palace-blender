import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const modes = [
  {
    key: 'palaces',
    path: '/palaces',
    emoji: '🏛️',
    title: 'Gedächtnispalast',
    desc: 'Erstelle eigene Paläste mit eigenen Räumen und Loci',
    table: 'palaces',
    statLabel: 'Paläste',
    color: 'purple',
  },
  {
    key: 'bmp',
    path: '/bmp',
    emoji: '🧠',
    title: 'Body Memory Palace',
    desc: '10 vordefinierte Personen mit je 50 festen Loci',
    table: 'bmp_persons',
    statLabel: 'Personen',
    color: 'blue',
  },
  {
    key: 'lernkarten',
    path: '/lernkarten',
    emoji: '🃏',
    title: 'Lernkarten',
    desc: 'Fragen & Antworten mit Mnemonik und Major-System Hilfe',
    table: 'lernkarten',
    statLabel: 'Karten',
    color: 'green',
  },
  {
    key: 'peglist',
    path: '/peglist',
    emoji: '🔢',
    title: 'Peg List',
    desc: 'Major System Nachschlagewerk 00-100',
    table: null,
    statLabel: 'Einträge',
    color: 'orange',
  },
  {
    key: 'trivia',
    path: '/trivia',
    emoji: '🎯',
    title: 'Trivia',
    desc: 'Allgemeinwissen testen mit tausenden Fragen',
    table: null,
    statLabel: null,
    color: 'red',
  },
]

const colorMap = {
  purple: {
    border: 'border-b-purple-500',
    hoverBorder: 'hover:border-purple-500/50',
    hoverText: 'group-hover:text-purple-300',
    shadow: 'hover:shadow-purple-500/20',
    stat: 'text-purple-400',
    statBg: 'bg-purple-500/10',
  },
  blue: {
    border: 'border-b-blue-500',
    hoverBorder: 'hover:border-blue-500/50',
    hoverText: 'group-hover:text-blue-300',
    shadow: 'hover:shadow-blue-500/20',
    stat: 'text-blue-400',
    statBg: 'bg-blue-500/10',
  },
  green: {
    border: 'border-b-green-500',
    hoverBorder: 'hover:border-green-500/50',
    hoverText: 'group-hover:text-green-300',
    shadow: 'hover:shadow-green-500/20',
    stat: 'text-green-400',
    statBg: 'bg-green-500/10',
  },
  orange: {
    border: 'border-b-orange-500',
    hoverBorder: 'hover:border-orange-500/50',
    hoverText: 'group-hover:text-orange-300',
    shadow: 'hover:shadow-orange-500/20',
    stat: 'text-orange-400',
    statBg: 'bg-orange-500/10',
  },
  red: {
    border: 'border-b-red-500',
    hoverBorder: 'hover:border-red-500/50',
    hoverText: 'group-hover:text-red-300',
    shadow: 'hover:shadow-red-500/20',
    stat: 'text-red-400',
    statBg: 'bg-red-500/10',
  },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({})

  const [dueCount, setDueCount] = useState(0)

  useEffect(() => {
    async function fetchStats() {
      const results = await Promise.all(
        modes.map(async (m) => {
          if (!m.table) return [m.key, 101]
          const { count } = await supabase
            .from(m.table)
            .select('*', { count: 'exact', head: true })
          return [m.key, count ?? 0]
        })
      )
      setStats(Object.fromEntries(results))

      // Fetch due lernkarten count
      const { data } = await supabase
        .from('lernkarten')
        .select('next_review')
      const now = new Date()
      const due = (data || []).filter((c) => new Date(c.next_review) <= now).length
      setDueCount(due)
    }
    fetchStats()
  }, [])

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full max-w-6xl">
          {modes.map((mode) => {
            const c = colorMap[mode.color]
            const count = stats[mode.key]
            return (
              <div
                key={mode.key}
                onClick={() => navigate(mode.path)}
                className={`relative p-8 rounded-2xl bg-[#0f0f25]/80 backdrop-blur border border-[#1e1e3a] border-b-2 ${c.border} ${c.hoverBorder} cursor-pointer transition-all duration-300 group flex flex-col items-center text-center hover:scale-[1.03] hover:shadow-xl ${c.shadow} hover:bg-[#13132e]`}
              >
                <div className="text-5xl mb-5 transition-transform duration-300 group-hover:scale-110">
                  {mode.emoji}
                </div>
                <h2 className={`text-xl font-bold text-slate-200 ${c.hoverText} transition mb-2`}>
                  {mode.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">
                  {mode.desc}
                </p>
                <div className={`mt-auto px-3 py-1.5 rounded-full text-xs font-medium ${c.stat} ${c.statBg}`}>
                  {mode.key === 'lernkarten' && dueCount > 0
                    ? `${dueCount} heute fällig`
                    : mode.statLabel
                      ? (count !== undefined ? `${count} ${mode.statLabel}` : '...')
                      : 'Spielen'
                  }
                </div>
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
