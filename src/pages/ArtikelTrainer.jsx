import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { C1_WOERTER } from '../data/c1WordsFull'
import { GOETHE_A1_WORDS } from '../data/goetheA1Words'
import { GOETHE_A2_WORDS } from '../data/goetheA2Words'
import { GOETHE_B1_WORDS } from '../data/goetheB1Words'

// Collect all nouns with articles from all word lists
function getAllNouns() {
  const allWords = [...GOETHE_A1_WORDS, ...GOETHE_A2_WORDS, ...GOETHE_B1_WORDS, ...C1_WOERTER]
  const nouns = []
  const seen = new Set()
  for (const w of allWords) {
    const match = w.wort.match(/^(der|die|das)\s+(.+)/)
    if (match && !seen.has(w.wort.toLowerCase())) {
      seen.add(w.wort.toLowerCase())
      nouns.push({ artikel: match[1], nomen: match[2], full: w.wort })
    }
  }
  return nouns
}

const ALL_NOUNS = getAllNouns()

function pickNoun() {
  return ALL_NOUNS[Math.floor(Math.random() * ALL_NOUNS.length)]
}

export default function ArtikelTrainer() {
  const navigate = useNavigate()
  const [noun, setNoun] = useState(() => pickNoun())
  const [selected, setSelected] = useState(null)
  const [correct, setCorrect] = useState(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  function handleGuess(artikel) {
    if (selected) return
    setSelected(artikel)
    const isCorrect = artikel === noun.artikel
    setCorrect(isCorrect)
    setTotal((t) => t + 1)
    if (isCorrect) {
      setScore((s) => s + 1)
      setStreak((s) => {
        const next = s + 1
        setBestStreak((b) => Math.max(b, next))
        return next
      })
    } else {
      setStreak(0)
    }
    timerRef.current = setTimeout(() => {
      setNoun(pickNoun())
      setSelected(null)
      setCorrect(null)
    }, isCorrect ? 600 : 1500)
  }

  function restart() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setNoun(pickNoun())
    setSelected(null)
    setCorrect(null)
    setScore(0)
    setTotal(0)
    setStreak(0)
    setBestStreak(0)
  }

  const artikelButtons = [
    { text: 'der', color: 'green' },
    { text: 'die', color: 'blue' },
    { text: 'das', color: 'yellow' },
  ]

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/sprachen/deutsch')}
        className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
      >
        ← Zurück zu Deutsch
      </button>

      <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
        Artikel-Trainer
      </h1>
      <p className="text-center text-slate-400 mb-8">
        der, die oder das?
      </p>

      <div className="flex justify-center gap-4 text-sm text-slate-500 mb-6">
        <span>{score} / {total} richtig</span>
        <span>🔥 {streak} Streak</span>
        {bestStreak > 0 && <span>Best: {bestStreak}</span>}
      </div>

      <div className="p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center mb-6">
        <div className="text-xs text-slate-500 mb-4">Welcher Artikel?</div>
        <div className={`text-3xl font-bold mb-8 transition-colors duration-300 ${
          selected
            ? correct ? 'text-green-300' : 'text-red-300'
            : 'text-slate-100'
        }`}>
          {selected && (
            <span className={`text-lg mr-2 ${correct ? 'text-green-400' : 'text-red-400'}`}>
              {correct ? selected : noun.artikel}
            </span>
          )}
          {noun.nomen}
        </div>

        <div className="flex gap-3 justify-center">
          {artikelButtons.map(({ text, color }) => {
            let btnClass = ''
            if (selected) {
              if (text === noun.artikel) {
                btnClass = 'bg-green-600 border-green-500 text-white'
              } else if (text === selected && !correct) {
                btnClass = 'bg-red-600/30 border-red-500 text-red-300'
              } else {
                btnClass = 'bg-[#1e1e3a] border-[#2a2a4a] text-slate-600'
              }
            } else {
              btnClass = color === 'green'
                ? 'bg-[#1e1e3a] border-green-500/30 text-green-300 hover:bg-green-600/20'
                : color === 'blue'
                  ? 'bg-[#1e1e3a] border-blue-500/30 text-blue-300 hover:bg-blue-600/20'
                  : 'bg-[#1e1e3a] border-yellow-500/30 text-yellow-300 hover:bg-yellow-600/20'
            }
            return (
              <button
                key={text}
                onClick={() => handleGuess(text)}
                disabled={selected !== null}
                className={`px-8 py-3 rounded-xl text-xl font-bold border-2 transition cursor-pointer ${btnClass}`}
              >
                {text}
              </button>
            )
          })}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={restart}
          className="px-5 py-2 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] text-sm transition cursor-pointer"
        >
          Neu starten
        </button>
      </div>
    </div>
  )
}
