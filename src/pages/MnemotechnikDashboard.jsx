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
    key: 'routes',
    path: '/routes',
    emoji: '🗺️',
    title: 'Routen',
    desc: 'Historische Routen auf der Karte mit Loci und Ereignissen',
    table: 'routes',
    statLabel: 'Routen',
    color: 'amber',
  },
  {
    key: 'peglist',
    path: '/peglist',
    emoji: '🔢',
    title: 'Peg List',
    desc: 'Major System Nachschlagewerk 00-100',
    table: null,
    statLabel: null,
    color: 'orange',
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
  amber: {
    border: 'border-b-amber-500',
    hoverBorder: 'hover:border-amber-500/50',
    hoverText: 'group-hover:text-amber-300',
    shadow: 'hover:shadow-amber-500/20',
    stat: 'text-amber-400',
    statBg: 'bg-amber-500/10',
  },
  orange: {
    border: 'border-b-orange-500',
    hoverBorder: 'hover:border-orange-500/50',
    hoverText: 'group-hover:text-orange-300',
    shadow: 'hover:shadow-orange-500/20',
    stat: 'text-orange-400',
    statBg: 'bg-orange-500/10',
  },
}

export default function MnemotechnikDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({})

  useEffect(() => {
    async function fetchStats() {
      const results = await Promise.all(
        modes.map(async (m) => {
          if (!m.table) return [m.key, null]
          const { count, error } = await supabase
            .from(m.table)
            .select('*', { count: 'exact', head: true })
          if (error) return [m.key, 0]
          return [m.key, count ?? 0]
        })
      )
      setStats(Object.fromEntries(results))
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d24] to-[#050510] px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-200 text-sm mb-6 inline-block transition">
          ← Zurück
        </button>

        <h1 className="text-3xl font-bold text-slate-100 mb-2">Mnemotechnik</h1>
        <p className="text-slate-400 mb-8">Gedächtnistechniken und Merksysteme</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  {mode.key === 'peglist'
                    ? '101 Einträge'
                    : mode.statLabel
                      ? (count !== undefined ? `${count} ${mode.statLabel}` : '...')
                      : ''
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
