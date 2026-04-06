import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getWordsForLevel } from '../data/wordLoader'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildCards(words) {
  const picked = shuffle(words).slice(0, 6)
  const cards = picked.flatMap((w, i) => [
    { id: `w${i}`, pairId: i, type: 'wort', text: w.wort, flipped: false, matched: false },
    { id: `d${i}`, pairId: i, type: 'definition', text: w.definition, flipped: false, matched: false },
  ])
  return shuffle(cards)
}

export default function MemoryGame() {
  const navigate = useNavigate()
  const { level = 'C1' } = useParams()
  const words = getWordsForLevel(level)
  const [cards, setCards] = useState(() => buildCards(words))
  const [flipped, setFlipped] = useState([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const timerRef = useRef(null)

  const matched = cards.filter((c) => c.matched).length / 2

  function handleFlip(idx) {
    if (won) return
    const card = cards[idx]
    if (card.flipped || card.matched || flipped.length >= 2) return

    const newCards = cards.map((c, i) => i === idx ? { ...c, flipped: true } : c)
    const newFlipped = [...flipped, idx]
    setCards(newCards)
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1)
      const [a, b] = newFlipped
      if (newCards[a].pairId === newCards[b].pairId) {
        // Match
        const matchedCards = newCards.map((c) =>
          c.pairId === newCards[a].pairId ? { ...c, matched: true, flipped: true } : c
        )
        setCards(matchedCards)
        setFlipped([])
        if (matchedCards.filter((c) => c.matched).length === matchedCards.length) {
          setWon(true)
        }
      } else {
        // No match — flip back
        timerRef.current = setTimeout(() => {
          setCards((prev) => prev.map((c, i) =>
            i === a || i === b ? { ...c, flipped: false } : c
          ))
          setFlipped([])
        }, 1000)
      }
    }
  }

  function restart() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setCards(buildCards(words))
    setFlipped([])
    setMoves(0)
    setWon(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(`/sprachen/deutsch/${level.toLowerCase()}/spiele`)}
        className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
      >
        ← Zurück zu Spiele
      </button>

      <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        Memory
      </h1>
      <p className="text-center text-slate-400 mb-2">
        Finde die passenden Wort-Definition-Paare
      </p>
      <div className="flex justify-center gap-4 text-sm text-slate-500 mb-8">
        <span>{moves} Züge</span>
        <span>{matched} / 6 Paare</span>
      </div>

      {won ? (
        <div className="p-12 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center mb-6">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Gewonnen!</h2>
          <p className="text-slate-400 mb-6">{moves} Züge gebraucht</p>
          <button
            onClick={restart}
            className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition cursor-pointer"
          >
            Neues Spiel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {cards.map((card, i) => (
            <button
              key={card.id}
              onClick={() => handleFlip(i)}
              className={`aspect-[3/4] rounded-xl text-sm font-medium p-2 flex items-center justify-center text-center transition-all duration-300 cursor-pointer border ${
                card.matched
                  ? 'bg-green-600/20 border-green-500/50 text-green-300'
                  : card.flipped
                    ? 'bg-[#1a1a3a] border-blue-500/50 text-slate-200'
                    : 'bg-[#12122a] border-[#2a2a4a] text-transparent hover:border-blue-500/30 hover:bg-[#16163a]'
              }`}
            >
              {card.flipped || card.matched ? (
                <span className={card.type === 'wort' ? 'text-blue-300 font-bold' : 'text-slate-300 text-xs leading-tight'}>
                  {card.text}
                </span>
              ) : (
                <span className="text-2xl">?</span>
              )}
            </button>
          ))}
        </div>
      )}

      {!won && (
        <div className="text-center">
          <button
            onClick={restart}
            className="px-5 py-2 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] text-sm transition cursor-pointer"
          >
            Neues Spiel
          </button>
        </div>
      )}
    </div>
  )
}
