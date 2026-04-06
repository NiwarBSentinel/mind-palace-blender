import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { C1_WOERTER } from '../data/c1WordsFull'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRound() {
  const word = C1_WOERTER[Math.floor(Math.random() * C1_WOERTER.length)]
  const correctSyns = shuffle(word.synonyme || []).slice(0, 3)
  const correctSet = new Set([word.wort, ...correctSyns])
  const allOtherSyns = [...new Set(
    C1_WOERTER.filter((w) => w.wort !== word.wort)
      .flatMap((w) => w.synonyme || [])
      .filter((s) => !correctSet.has(s))
  )]
  const wrong = shuffle(allOtherSyns).slice(0, 8 - correctSyns.length)
  const chips = shuffle([
    ...correctSyns.map((s) => ({ text: s, correct: true })),
    ...wrong.map((s) => ({ text: s, correct: false })),
  ])
  return { word, chips, correctCount: correctSyns.length }
}

export default function ZeitdruckQuiz() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState('start')
  const [round, setRound] = useState(null)
  const [selected, setSelected] = useState([])
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [history, setHistory] = useState([])
  const [timeLeft, setTimeLeft] = useState(60)
  const timerRef = useRef(null)

  const startGame = useCallback(() => {
    setRound(buildRound())
    setSelected([])
    setScore(0)
    setAnswered(0)
    setHistory([])
    setTimeLeft(60)
    setScreen('game')
  }, [])

  useEffect(() => {
    if (screen !== 'game') return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setScreen('results')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [screen])

  function toggleChip(text) {
    setSelected((prev) => prev.includes(text) ? prev.filter((s) => s !== text) : [...prev, text])
  }

  function confirm() {
    if (!round || selected.length === 0) return
    let roundScore = 0
    const correctChips = round.chips.filter((c) => c.correct).map((c) => c.text)
    const correctSelected = selected.filter((s) => correctChips.includes(s))
    const wrongSelected = selected.filter((s) => !correctChips.includes(s))
    const missed = correctChips.filter((s) => !selected.includes(s))
    for (const chip of round.chips) {
      if (selected.includes(chip.text)) {
        roundScore += chip.correct ? 1 : -0.5
      }
    }
    setScore((s) => Math.max(0, s + roundScore))
    setAnswered((a) => a + 1)
    setHistory((h) => [...h, { wort: round.word.wort, correctSelected, wrongSelected, missed }])
    nextRound()
  }

  function nextRound() {
    setRound(buildRound())
    setSelected([])
  }

  // START
  if (screen === 'start') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/sprachen/deutsch/c1/spiele')}
          className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
        >
          ← Zurück zu Spiele
        </button>

        <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Zeitdruck-Quiz
        </h1>
        <p className="text-center text-slate-400 mb-10">
          Finde so viele Synonyme wie möglich in 60 Sekunden
        </p>

        <div className="p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center">
          <div className="text-6xl font-bold text-slate-200 mb-2">60</div>
          <div className="text-slate-400 mb-8">Sekunden</div>
          <button
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-lg transition cursor-pointer"
          >
            Start
          </button>
        </div>
      </div>
    )
  }

  // GAME
  if (screen === 'game' && round) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-slate-400 text-sm">{answered} Wörter · {Math.round(score * 10) / 10} Punkte</span>
          <span className={`text-2xl font-bold font-mono ${timeLeft <= 10 ? 'text-red-400' : 'text-yellow-400'}`}>
            {timeLeft}s
          </span>
        </div>

        {/* Timer bar */}
        <div className="w-full h-2 rounded-full bg-[#1e1e3a] mb-8 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-red-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'}`}
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          />
        </div>

        <div className="p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center mb-6">
          <div className="text-xs text-slate-500 mb-3">Wähle {round.correctCount} richtige Synonyme</div>
          <div className="text-2xl font-bold text-yellow-300 mb-6">{round.word.wort}</div>

          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {round.chips.map((chip) => {
              const isSelected = selected.includes(chip.text)
              return (
                <button
                  key={chip.text}
                  onClick={() => toggleChip(chip.text)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition cursor-pointer ${
                    isSelected
                      ? 'bg-yellow-600/30 border-yellow-500 text-yellow-300'
                      : 'bg-[#1e1e3a] border-[#2a2a4a] text-slate-300 hover:bg-[#2a2a4a]'
                  }`}
                >
                  {chip.text}
                </button>
              )
            })}
          </div>

          <button
            onClick={confirm}
            disabled={selected.length === 0}
            className="px-8 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-500 disabled:opacity-30 text-white font-medium transition cursor-pointer"
          >
            Bestätigen →
          </button>
        </div>
      </div>
    )
  }

  // RESULTS
  const finalScore = Math.round(score * 10) / 10
  const totalCorrect = history.reduce((sum, h) => sum + h.correctSelected.length, 0)
  const totalWrong = history.reduce((sum, h) => sum + h.wrongSelected.length, 0)
  const totalPossible = history.reduce((sum, h) => sum + h.correctSelected.length + h.missed.length, 0)
  const accuracy = totalPossible > 0 ? Math.round((totalCorrect / totalPossible) * 100) : 0
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center mb-6">
        <div className="text-5xl mb-4">⏱️</div>
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Zeit abgelaufen!</h2>
        <div className="text-4xl font-bold text-yellow-400 mb-1">{finalScore} Punkte</div>
        <p className="text-slate-400 mb-1">{answered} Wörter in 60 Sekunden</p>
        <p className="text-slate-500 text-sm mb-6">Genauigkeit: {accuracy}% ({totalCorrect} richtig, {totalWrong} falsch)</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={startGame}
            className="px-6 py-2.5 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-medium transition cursor-pointer"
          >
            Nochmal
          </button>
          <button
            onClick={() => navigate('/sprachen/deutsch/c1/spiele')}
            className="px-6 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer"
          >
            ← Zurück
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Zusammenfassung</h3>
          {history.map((h, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#12122a] border border-[#1e1e3a]">
              <div className="text-blue-300 font-medium text-sm mb-1.5">{h.wort}</div>
              <div className="flex flex-wrap gap-1.5">
                {h.correctSelected.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-green-600/20 border border-green-500/30 text-green-300">✅ {s}</span>
                ))}
                {h.wrongSelected.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-300">❌ {s}</span>
                ))}
                {h.missed.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-yellow-600/20 border border-yellow-500/30 text-yellow-300">⚠️ {s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
