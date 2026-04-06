import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { getWordsForLevel } from '../data/wordLoader'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const LEVEL_COLORS = { A1: 'green', A2: 'teal', B1: 'blue', B2: 'indigo', C1: 'purple', C2: 'red' }

export default function UserDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [progress, setProgress] = useState({})
  const [lernkarten, setLernkarten] = useState({ total: 0, due: 0 })
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchAll()
  }, [user])

  async function fetchAll() {
    setLoading(true)

    // Fetch user progress
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)

    // Group by level
    const byLevel = {}
    const now = new Date()
    for (const lv of LEVELS) {
      const levelWords = (progressData || []).filter((p) => p.level === lv)
      const learned = levelWords.filter((p) => p.repetitions > 0).length
      const due = levelWords.filter((p) => new Date(p.next_review) <= now).length
      const total = getWordsForLevel(lv).length
      byLevel[lv] = { learned, due, total }
    }
    setProgress(byLevel)

    // Fetch lernkarten
    const { data: kartenData } = await supabase
      .from('lernkarten')
      .select('next_review')
      .eq('user_id', user.id)
    const kartenTotal = (kartenData || []).length
    const kartenDue = (kartenData || []).filter((c) => new Date(c.next_review) <= now).length
    setLernkarten({ total: kartenTotal, due: kartenDue })

    // Activity: last 7 days from user_progress updated_at
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toISOString().split('T')[0])
    }
    const activeDays = new Set(
      (progressData || [])
        .filter((p) => p.updated_at)
        .map((p) => p.updated_at.split('T')[0])
    )
    setActivity(days.map((d) => ({ date: d, active: activeDays.has(d) })))

    setLoading(false)
  }

  // Streak calculation
  const streak = (() => {
    let count = 0
    for (let i = activity.length - 1; i >= 0; i--) {
      if (activity[i]?.active) count++
      else if (i < activity.length - 1) break // allow today to be inactive
    }
    return count
  })()

  const totalLearned = LEVELS.reduce((sum, lv) => sum + (progress[lv]?.learned || 0), 0)
  const totalDue = LEVELS.reduce((sum, lv) => sum + (progress[lv]?.due || 0), 0)

  // Game stats from localStorage
  const zeitdruckBest = (() => {
    try { return localStorage.getItem('zeitdruck_best') || '—' } catch { return '—' }
  })()
  const hangmanStats = (() => {
    try {
      const s = JSON.parse(localStorage.getItem('hangman_stats') || '{}')
      if (s.wins !== undefined) return `${s.wins}W / ${s.losses || 0}L`
      return '—'
    } catch { return '—' }
  })()

  const today = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-8 text-center text-slate-400">Lade Fortschritt...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer">← Zurück zur Übersicht</button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-1">
          📊 Mein Fortschritt
        </h1>
        <p className="text-slate-400 text-sm">{user.email}</p>
        <p className="text-slate-500 text-xs mt-1">{today}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="p-4 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center">
          <div className="text-2xl font-bold text-purple-400">{totalLearned}</div>
          <div className="text-xs text-slate-500 mt-1">Wörter gelernt</div>
        </div>
        <div className="p-4 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center">
          <div className="text-2xl font-bold text-green-400">{totalDue}</div>
          <div className="text-xs text-slate-500 mt-1">Heute fällig</div>
        </div>
        <div className="p-4 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center">
          <div className="text-2xl font-bold text-orange-400">{streak}</div>
          <div className="text-xs text-slate-500 mt-1">Tage Streak</div>
        </div>
        <div className="p-4 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center">
          <div className="text-2xl font-bold text-blue-400">{lernkarten.total}</div>
          <div className="text-xs text-slate-500 mt-1">Lernkarten</div>
        </div>
      </div>

      {/* Deutsch Fortschritt */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-300 mb-4">Deutsch Fortschritt</h2>
        <div className="space-y-3">
          {LEVELS.map((lv) => {
            const p = progress[lv] || { learned: 0, due: 0, total: 0 }
            const pct = p.total > 0 ? (p.learned / p.total) * 100 : 0
            const colorClass = {
              green: 'from-green-500 to-green-600', teal: 'from-teal-500 to-teal-600',
              blue: 'from-blue-500 to-blue-600', indigo: 'from-indigo-500 to-indigo-600',
              purple: 'from-purple-500 to-purple-600', red: 'from-red-500 to-red-600',
            }[LEVEL_COLORS[lv]]
            return (
              <div key={lv} className="p-3 rounded-xl bg-[#12122a] border border-[#1e1e3a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-200">{lv}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400">{p.learned} / {p.total} gelernt</span>
                    {p.due > 0 && <span className="text-green-400">{p.due} fällig</span>}
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1e1e3a] overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lernkarten */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-300 mb-4">Lernkarten</h2>
        <div className="p-4 rounded-xl bg-[#12122a] border border-[#1e1e3a] flex items-center justify-between">
          <div>
            <span className="text-slate-200 font-medium">{lernkarten.total} Karten</span>
            {lernkarten.due > 0 && <span className="text-green-400 text-sm ml-3">{lernkarten.due} heute fällig</span>}
          </div>
          <button
            onClick={() => navigate('/sprachen/deutsch/lernkarten')}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition cursor-pointer"
          >
            Jetzt üben
          </button>
        </div>
      </div>

      {/* Spiele Statistiken */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-300 mb-4">Spiele</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-[#12122a] border border-[#1e1e3a]">
            <div className="text-xs text-slate-500 mb-1">⚡ Zeitdruck Bestleistung</div>
            <div className="text-lg font-bold text-yellow-400">{zeitdruckBest}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#12122a] border border-[#1e1e3a]">
            <div className="text-xs text-slate-500 mb-1">💀 Hangman Bilanz</div>
            <div className="text-lg font-bold text-rose-400">{hangmanStats}</div>
          </div>
        </div>
      </div>

      {/* Aktivität */}
      <div>
        <h2 className="text-lg font-semibold text-slate-300 mb-4">Letzte 7 Tage</h2>
        <div className="flex gap-2 justify-center">
          {activity.map((day) => {
            const d = new Date(day.date)
            const label = d.toLocaleDateString('de-DE', { weekday: 'short' })
            return (
              <div key={day.date} className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                  day.active
                    ? 'bg-green-600/30 border border-green-500/50 text-green-300'
                    : 'bg-[#1e1e3a] border border-[#2a2a4a] text-slate-600'
                }`}>
                  {day.active ? '✓' : '·'}
                </div>
                <span className="text-[10px] text-slate-600">{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
