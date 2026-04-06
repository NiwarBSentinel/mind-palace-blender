import { useState, useRef, useEffect } from 'react'
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

function pickRandom(arr, n, exclude) {
  const filtered = arr.filter((x) => x !== exclude)
  return shuffle(filtered).slice(0, n)
}

function buildQuestions(mode) {
  const picked = shuffle(C1_WOERTER).slice(0, 10)
  return picked.map((word) => {
    const wrongWords = pickRandom(C1_WOERTER, 3, word)
    if (mode === 'wort-def') {
      const answers = shuffle([
        { text: word.definition, correct: true },
        ...wrongWords.map((w) => ({ text: w.definition, correct: false })),
      ])
      return { prompt: word.wort, answers, word }
    } else {
      const answers = shuffle([
        { text: word.wort, correct: true },
        ...wrongWords.map((w) => ({ text: w.wort, correct: false })),
      ])
      return { prompt: word.definition, answers, word }
    }
  })
}

function buildSynChips(word) {
  const defWords = word.definition.toLowerCase().split(/[\s,]+/).filter((w) => w.length > 4)
  const correctWords = C1_WOERTER
    .filter((w) => w.wort !== word.wort && defWords.some((d) => w.definition.toLowerCase().includes(d) || w.wort.toLowerCase().includes(d)))
  const correct = shuffle(correctWords).slice(0, Math.min(3, Math.max(2, correctWords.length)))
  const correctSet = new Set([word.wort, ...correct.map((c) => c.wort)])
  const wrong = shuffle(C1_WOERTER.filter((w) => !correctSet.has(w.wort))).slice(0, 8 - correct.length)
  return shuffle([
    ...correct.map((w) => ({ text: w.wort, correct: true })),
    ...wrong.map((w) => ({ text: w.wort, correct: false })),
  ])
}

export default function DeutschC1Quiz() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState('start')
  const [mode, setMode] = useState('wort-def')
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState([])
  const timerRef = useRef(null)

  // Synonym mode state
  const [synCards, setSynCards] = useState([])
  const [synChips, setSynChips] = useState([])
  const [selectedChips, setSelectedChips] = useState([])
  const [synRevealed, setSynRevealed] = useState(false)

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  function startQuiz(m) {
    setMode(m)
    setCurrentIdx(0)
    setSelected(null)
    setScore(0)
    setWrong([])
    setSelectedChips([])
    setSynRevealed(false)

    if (m === 'synonym') {
      const cards = shuffle(C1_WOERTER).slice(0, 10)
      setSynCards(cards)
      setSynChips(buildSynChips(cards[0]))
    } else {
      setQuestions(buildQuestions(m))
    }
    setScreen('game')
  }

  function handleAnswer(answer) {
    if (selected !== null) return
    setSelected(answer)
    const q = questions[currentIdx]
    if (answer.correct) {
      setScore((s) => s + 1)
    } else {
      setWrong((w) => [...w, q.word])
    }
    const delay = answer.correct ? 1000 : 1500
    timerRef.current = setTimeout(() => {
      if (currentIdx >= questions.length - 1) {
        setScreen('results')
      } else {
        setCurrentIdx((i) => i + 1)
        setSelected(null)
      }
    }, delay)
  }

  function handleSynReveal() {
    setSynRevealed(true)
    const card = synCards[currentIdx]
    const chips = synChips
    const correctChips = chips.filter((c) => c.correct).map((c) => c.text)
    const selectedCorrect = selectedChips.filter((s) => correctChips.includes(s))
    const selectedWrong = selectedChips.filter((s) => !correctChips.includes(s))
    if (selectedWrong.length === 0 && selectedCorrect.length >= correctChips.length) {
      setScore((s) => s + 1)
    } else {
      setWrong((w) => [...w, card])
    }
  }

  function handleSynNext() {
    if (currentIdx >= synCards.length - 1) {
      setScreen('results')
      return
    }
    const nextIdx = currentIdx + 1
    setCurrentIdx(nextIdx)
    setSynRevealed(false)
    setSelectedChips([])
    setSynChips(buildSynChips(synCards[nextIdx]))
  }

  const totalQ = mode === 'synonym' ? synCards.length : questions.length

  // START SCREEN
  if (screen === 'start') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/sprachen/deutsch')}
          className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
        >
          ← Zurück zu Deutsch
        </button>

        <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          C1 Vokabel-Quiz
        </h1>
        <p className="text-center text-slate-400 mb-10">
          10 Fragen · Wie gut kennst du die C1 Wörter?
        </p>

        <div className="p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] space-y-4">
          <p className="text-slate-400 text-sm text-center mb-2">Modus wählen</p>
          <button
            onClick={() => startQuiz('wort-def')}
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-lg transition cursor-pointer"
          >
            📖 Wort → Definition
          </button>
          <button
            onClick={() => startQuiz('def-wort')}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-lg transition cursor-pointer"
          >
            🔤 Definition → Wort
          </button>
          <button
            onClick={() => startQuiz('synonym')}
            className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-lg transition cursor-pointer"
          >
            🔗 Synonyme zuordnen
          </button>
        </div>
      </div>
    )
  }

  // GAME SCREEN
  if (screen === 'game') {
    const progress = ((currentIdx + (selected !== null || synRevealed ? 1 : 0)) / totalQ) * 100

    // Synonym mode
    if (mode === 'synonym') {
      const card = synCards[currentIdx]
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Frage {currentIdx + 1} / {totalQ}</span>
            <span className="text-green-400 font-medium">{score} ✓</span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#1e1e3a] mb-6 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <div className="p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center mb-6">
            <div className="text-xs text-slate-500 mb-3">Welche Wörter sind verwandt?</div>
            <div className="text-2xl font-bold text-teal-300 mb-6">{card.wort}</div>

            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {synChips.map((chip) => {
                const isSelected = selectedChips.includes(chip.text)
                let chipClass = 'bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] border-[#2a2a4a]'
                if (synRevealed) {
                  if (chip.correct && isSelected) chipClass = 'bg-green-600/30 border-green-500 text-green-300'
                  else if (chip.correct && !isSelected) chipClass = 'bg-yellow-600/20 border-yellow-500 text-yellow-300'
                  else if (!chip.correct && isSelected) chipClass = 'bg-red-600/30 border-red-500 text-red-300'
                  else chipClass = 'bg-[#1e1e3a] text-slate-500 opacity-50 border-[#1e1e3a]'
                } else if (isSelected) {
                  chipClass = 'bg-teal-600/30 border-teal-500 text-teal-300'
                }
                return (
                  <button
                    key={chip.text}
                    onClick={() => {
                      if (synRevealed) return
                      setSelectedChips((prev) => prev.includes(chip.text) ? prev.filter((c) => c !== chip.text) : [...prev, chip.text])
                    }}
                    disabled={synRevealed}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition cursor-pointer ${chipClass}`}
                  >
                    {synRevealed && chip.correct && isSelected && '✅ '}
                    {synRevealed && chip.correct && !isSelected && '⚠️ '}
                    {synRevealed && !chip.correct && isSelected && '❌ '}
                    {chip.text}
                  </button>
                )
              })}
            </div>

            {!synRevealed ? (
              <button
                onClick={handleSynReveal}
                disabled={selectedChips.length === 0}
                className="px-8 py-3 rounded-lg bg-teal-600/20 border border-teal-500/30 text-teal-300 hover:bg-teal-600/30 disabled:opacity-30 transition cursor-pointer text-lg"
              >
                Auflösen
              </button>
            ) : (
              <div className="space-y-3">
                <div className="text-slate-500 text-sm italic">{card.definition}</div>
                <button
                  onClick={handleSynNext}
                  className="px-8 py-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium transition cursor-pointer"
                >
                  {currentIdx >= synCards.length - 1 ? 'Ergebnis →' : 'Weiter →'}
                </button>
              </div>
            )}
          </div>
        </div>
      )
    }

    // Standard quiz modes (wort-def / def-wort)
    const q = questions[currentIdx]
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-400 text-sm">Frage {currentIdx + 1} / {totalQ}</span>
          <span className="text-green-400 font-medium">{score} ✓</span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#1e1e3a] mb-6 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] mb-6">
          <div className="text-xs text-slate-500 mb-3">
            {mode === 'wort-def' ? 'Welche Definition passt?' : 'Welches Wort passt?'}
          </div>
          <p className={`font-bold leading-relaxed ${mode === 'wort-def' ? 'text-2xl text-purple-300' : 'text-lg text-slate-100'}`}>
            {q.prompt}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {q.answers.map((answer, i) => {
            let btnClass = 'bg-[#12122a] border border-[#2a2a4a] text-slate-200 hover:border-purple-500/50 hover:bg-[#16163a]'
            if (selected !== null) {
              if (answer.correct) {
                btnClass = 'bg-green-600/20 border border-green-500 text-green-300'
              } else if (answer === selected) {
                btnClass = 'bg-red-600/20 border border-red-500 text-red-300'
              } else {
                btnClass = 'bg-[#12122a] border border-[#1e1e3a] text-slate-500 opacity-50'
              }
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(answer)}
                disabled={selected !== null}
                className={`p-4 rounded-xl font-medium text-left transition cursor-pointer text-sm ${btnClass}`}
              >
                {selected !== null && answer.correct && '✅ '}
                {selected !== null && answer === selected && !answer.correct && '❌ '}
                {answer.text}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // RESULTS SCREEN
  const pct = totalQ > 0 ? (score / totalQ) * 100 : 0
  const emoji = pct > 80 ? '🎉' : pct > 50 ? '👍' : '💪'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="p-12 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-4xl font-bold text-slate-100 mb-2">{score} / {totalQ}</h2>
        <p className="text-slate-400 mb-8">
          {pct > 80 ? 'Ausgezeichnet!' : pct > 50 ? 'Gut gemacht!' : 'Weiter üben!'}
        </p>

        {wrong.length > 0 && (
          <div className="text-left mb-8">
            <h3 className="text-slate-400 text-sm font-medium mb-3">Falsche Antworten:</h3>
            <ul className="space-y-2">
              {wrong.map((w, i) => (
                <li key={i} className="p-3 rounded-lg bg-red-600/10 border border-red-500/20">
                  <div className="text-purple-300 font-medium text-sm">{w.wort}</div>
                  <div className="text-slate-400 text-sm mt-1">{w.definition}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => startQuiz(mode)}
            className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition cursor-pointer"
          >
            Nochmal
          </button>
          <button
            onClick={() => setScreen('start')}
            className="px-6 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer"
          >
            Neue Runde
          </button>
          <button
            onClick={() => navigate('/sprachen/deutsch')}
            className="px-6 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer"
          >
            ← Zurück
          </button>
        </div>
      </div>
    </div>
  )
}
