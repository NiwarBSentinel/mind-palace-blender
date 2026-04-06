import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { C1_WOERTER } from '../data/c1WordsFull'

function pickWord() {
  // Only pick words that have a beispiel containing the word
  const candidates = C1_WOERTER.filter((w) => {
    if (!w.beispiel) return false
    const clean = w.wort.replace(/^(die|der|das)\s+/, '')
    return w.beispiel.toLowerCase().includes(clean.toLowerCase())
  })
  if (candidates.length === 0) return C1_WOERTER[Math.floor(Math.random() * C1_WOERTER.length)]
  return candidates[Math.floor(Math.random() * candidates.length)]
}

function buildSentence(word) {
  const clean = word.wort.replace(/^(die|der|das)\s+/, '')
  const beispiel = word.beispiel
  // Find the word in the sentence (case-insensitive)
  const regex = new RegExp(`(${clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i')
  const match = beispiel.match(regex)
  if (!match) return { before: beispiel, after: '', answer: clean }
  const idx = match.index
  return {
    before: beispiel.substring(0, idx),
    after: beispiel.substring(idx + match[1].length),
    answer: match[1],
  }
}

export default function LueckentextGame() {
  const navigate = useNavigate()
  const [word, setWord] = useState(() => pickWord())
  const [sentence, setSentence] = useState(() => buildSentence(pickWord()))
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  // Initialize properly
  useState(() => {
    const w = pickWord()
    setWord(w)
    setSentence(buildSentence(w))
  })

  function check() {
    if (!input.trim()) return
    const isCorrect = input.trim().toLowerCase() === sentence.answer.toLowerCase()
    setCorrect(isCorrect)
    setChecked(true)
    setTotal((t) => t + 1)
    if (isCorrect) setScore((s) => s + 1)
  }

  function next() {
    const w = pickWord()
    setWord(w)
    setSentence(buildSentence(w))
    setInput('')
    setChecked(false)
    setCorrect(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      if (checked) next()
      else check()
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/sprachen/deutsch/c1/spiele')}
        className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
      >
        ← Zurück zu Spiele
      </button>

      <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
        Lückentext
      </h1>
      <p className="text-center text-slate-400 mb-2">
        Ergänze das fehlende C1 Wort
      </p>
      {total > 0 && (
        <p className="text-center text-slate-500 text-sm mb-8">
          {score} / {total} richtig
        </p>
      )}

      <div className="p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] mb-6">
        {/* Hint */}
        <div className="mb-6">
          <span className="text-xs text-slate-500">Definition:</span>
          <div className="text-slate-300 text-sm mt-1">{word.definition}</div>
        </div>

        {/* Sentence with blank */}
        <div className="text-lg text-slate-200 leading-relaxed mb-6">
          <span>{sentence.before}</span>
          {checked ? (
            <span className={`font-bold px-1 rounded ${correct ? 'text-green-300 bg-green-600/20' : 'text-red-300 bg-red-600/20'}`}>
              {correct ? sentence.answer : input.trim()}
            </span>
          ) : (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="..."
              className="inline-block w-40 px-2 py-1 mx-1 rounded-lg bg-[#0a0a1a] border-b-2 border-amber-500 text-amber-300 font-bold text-center focus:outline-none"
            />
          )}
          <span>{sentence.after}</span>
        </div>

        {/* Result */}
        {checked && (
          <div className="mb-6">
            {correct ? (
              <div className="text-green-300 font-bold text-lg">Richtig! ✅</div>
            ) : (
              <div>
                <div className="text-red-300 font-bold text-lg mb-1">Falsch ❌</div>
                <div className="text-slate-400 text-sm">Richtige Antwort: <span className="text-green-300 font-medium">{sentence.answer}</span></div>
              </div>
            )}
            {word.synonyme?.length > 0 && (
              <div className="mt-3">
                <span className="text-slate-500 text-xs">Synonyme:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {word.synonyme.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!checked ? (
            <button
              onClick={check}
              disabled={!input.trim()}
              className="px-6 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-30 text-white font-medium transition cursor-pointer"
            >
              Prüfen
            </button>
          ) : (
            <button
              onClick={next}
              className="px-6 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition cursor-pointer"
            >
              Nächstes Wort →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
