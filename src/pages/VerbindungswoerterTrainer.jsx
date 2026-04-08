import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { verbindungswoerter } from '../data/verbindungswoerter'

const ROUND_SIZE = 10

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const filters = ['Alle', 'Konjunktionen', 'Subjunktionen', 'Konjunktionaladverbien']
const filterMap = { Konjunktionen: 'Konjunktion', Subjunktionen: 'Subjunktion', Konjunktionaladverbien: 'Konjunktionaladverb' }

const typBadge = {
  Konjunktion: 'bg-blue-500/15 text-blue-400',
  Subjunktion: 'bg-purple-500/15 text-purple-400',
  Konjunktionaladverb: 'bg-amber-500/15 text-amber-400',
}

const hints = {
  Konjunktion: 'Position 0 — keine Wortstellungsänderung (und, aber, oder, denn, sondern)',
  Subjunktion: 'Nebensatz — Verb geht ans Ende (weil, obwohl, dass, wenn, als, damit, ob, bis, nachdem)',
  Konjunktionaladverb: 'Position 1 — Verb folgt direkt (deshalb, trotzdem, daher, dennoch, außerdem)',
}

export default function VerbindungswoerterTrainer() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('Alle')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [roundKey, setRoundKey] = useState(0)

  const filtered = useMemo(() => {
    const list = filter === 'Alle' ? verbindungswoerter : verbindungswoerter.filter((v) => v.typ === filterMap[filter])
    return shuffle(list).slice(0, ROUND_SIZE)
  }, [filter, roundKey])

  const done = index >= filtered.length
  const current = filtered[index]

  const shuffledOptions = useMemo(() => {
    if (done) return []
    return shuffle(current.optionen)
  }, [index, filtered, done])

  function handleSelect(opt) {
    if (selected !== null) return
    setSelected(opt)
    if (opt === current.antwort) setScore((s) => s + 1)
  }

  function handleNext() { setSelected(null); setIndex((i) => i + 1) }

  function handleRestart() { setSelected(null); setIndex(0); setScore(0); setRoundKey((k) => k + 1) }

  function handleFilterChange(f) { setFilter(f); setSelected(null); setIndex(0); setScore(0); setRoundKey((k) => k + 1) }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d24] to-[#050510] px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/sprachen/deutsch')} className="text-slate-400 hover:text-slate-200 text-sm mb-6 inline-block transition">← Zurück</button>

        <h1 className="text-3xl font-bold text-slate-100 mb-2">Verbindungswörter</h1>
        <p className="text-slate-400 mb-6">Konjunktionen, Subjunktionen & Konjunktionaladverbien</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button key={f} onClick={() => handleFilterChange(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${filter === f ? 'bg-teal-600 text-white' : 'bg-[#1e1e3a] text-slate-400 hover:text-slate-200 hover:bg-[#2a2a4a]'}`}>
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-slate-500 text-center py-12">Keine Aufgaben für diesen Filter.</p>
        ) : done ? (
          <div className="bg-[#12122a] border border-[#1e1e3a] rounded-xl p-10 text-center">
            <div className="text-5xl mb-4">{score === filtered.length ? '🎉' : score >= filtered.length * 0.7 ? '👍' : '📚'}</div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">{score} / {filtered.length} richtig</h2>
            <p className="text-slate-400 mb-6">{score === filtered.length ? 'Perfekt!' : score >= filtered.length * 0.7 ? 'Gut gemacht!' : 'Weiter üben!'}</p>
            <button onClick={handleRestart} className="px-6 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-500 transition">Nochmal</button>
          </div>
        ) : (
          <div className="bg-[#12122a] border border-[#1e1e3a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-500">{index + 1} / {filtered.length}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typBadge[current.typ]}`}>{current.typ}</span>
            </div>

            <p className="text-slate-200 text-lg mb-6 leading-relaxed">{current.satz}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {shuffledOptions.map((opt) => {
                let cls = 'bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 hover:border-teal-500/50 hover:bg-[#16163a]'
                if (selected !== null) {
                  if (opt === current.antwort) cls = 'bg-green-600/20 border border-green-500 text-green-300'
                  else if (opt === selected) cls = 'bg-red-600/20 border border-red-500 text-red-300'
                  else cls = 'bg-[#0a0a1a] border border-[#1e1e3a] text-slate-500'
                }
                return (
                  <button key={opt} onClick={() => handleSelect(opt)} disabled={selected !== null}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition cursor-pointer disabled:cursor-default ${cls}`}>
                    {opt}
                  </button>
                )
              })}
            </div>

            {/* Hint */}
            <p className="text-xs text-slate-600 bg-[#0a0a1a] border border-[#1e1e3a] rounded-lg px-3 py-2 mb-3">
              {hints[current.typ]}
            </p>

            {selected !== null && (
              <div className="space-y-3 mt-4">
                <p className={`text-sm font-medium ${selected === current.antwort ? 'text-green-400' : 'text-red-400'}`}>
                  {selected === current.antwort ? 'Richtig!' : `Falsch — richtig: ${current.antwort}`}
                </p>
                <p className="text-sm text-slate-400 bg-[#0a0a1a] border border-[#1e1e3a] rounded-lg p-3">{current.erklaerung}</p>
                <div className="flex justify-end">
                  <button onClick={handleNext} className="px-5 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-500 transition">Weiter</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
