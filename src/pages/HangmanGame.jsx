import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { C1_WOERTER } from '../data/c1WordsFull'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ'.split('')
const MAX_WRONG = 6

function pickWord() {
  const w = C1_WOERTER[Math.floor(Math.random() * C1_WOERTER.length)]
  // Strip article for guessing
  const clean = w.wort.replace(/^(die|der|das)\s+/, '')
  return { ...w, guessWord: clean.toUpperCase() }
}

function HangmanSVG({ wrong }) {
  return (
    <svg viewBox="0 0 200 220" className="w-48 h-48 mx-auto">
      {/* Gallows */}
      <line x1="20" y1="210" x2="180" y2="210" stroke="#3a4a7a" strokeWidth="3" />
      <line x1="60" y1="210" x2="60" y2="20" stroke="#3a4a7a" strokeWidth="3" />
      <line x1="60" y1="20" x2="140" y2="20" stroke="#3a4a7a" strokeWidth="3" />
      <line x1="140" y1="20" x2="140" y2="50" stroke="#3a4a7a" strokeWidth="3" />
      {/* Head */}
      {wrong >= 1 && <circle cx="140" cy="70" r="20" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />}
      {/* Body */}
      {wrong >= 2 && <line x1="140" y1="90" x2="140" y2="150" stroke="#e2e8f0" strokeWidth="2.5" />}
      {/* Left arm */}
      {wrong >= 3 && <line x1="140" y1="110" x2="110" y2="135" stroke="#e2e8f0" strokeWidth="2.5" />}
      {/* Right arm */}
      {wrong >= 4 && <line x1="140" y1="110" x2="170" y2="135" stroke="#e2e8f0" strokeWidth="2.5" />}
      {/* Left leg */}
      {wrong >= 5 && <line x1="140" y1="150" x2="110" y2="185" stroke="#e2e8f0" strokeWidth="2.5" />}
      {/* Right leg */}
      {wrong >= 6 && <line x1="140" y1="150" x2="170" y2="185" stroke="#e2e8f0" strokeWidth="2.5" />}
    </svg>
  )
}

export default function HangmanGame() {
  const navigate = useNavigate()
  const [word, setWord] = useState(() => pickWord())
  const [guessed, setGuessed] = useState(new Set())

  const wrongGuesses = [...guessed].filter((l) => !word.guessWord.includes(l))
  const wrongCount = wrongGuesses.length
  const won = [...word.guessWord].every((l) => l === ' ' || guessed.has(l))
  const lost = wrongCount >= MAX_WRONG
  const gameOver = won || lost

  const handleGuess = useCallback((letter) => {
    if (gameOver || guessed.has(letter)) return
    setGuessed((prev) => new Set([...prev, letter]))
  }, [gameOver, guessed])

  function restart() {
    setWord(pickWord())
    setGuessed(new Set())
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/sprachen/deutsch')}
        className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
      >
        ← Zurück zu Deutsch
      </button>

      <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent">
        Hangman
      </h1>
      <p className="text-center text-slate-400 mb-8">
        C1 Wörter erraten
      </p>

      <div className="p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] mb-6">
        {/* Hint */}
        <div className="text-center mb-4">
          <span className="text-xs text-slate-500">Hinweis:</span>
          <div className="text-slate-300 text-sm mt-1">{word.definition}</div>
        </div>

        {/* Hangman drawing */}
        <HangmanSVG wrong={wrongCount} />

        {/* Wrong count */}
        <div className="text-center text-slate-500 text-sm mb-4">
          {wrongCount} / {MAX_WRONG} Fehlversuche
        </div>

        {/* Word blanks */}
        <div className="flex justify-center gap-1.5 flex-wrap mb-6">
          {[...word.guessWord].map((letter, i) => {
            if (letter === ' ') return <span key={i} className="w-4" />
            const revealed = guessed.has(letter) || gameOver
            return (
              <span
                key={i}
                className={`w-9 h-11 flex items-center justify-center rounded-lg text-xl font-bold border ${
                  revealed
                    ? lost && !guessed.has(letter)
                      ? 'bg-red-600/20 border-red-500/30 text-red-300'
                      : 'bg-[#0a0a1a] border-[#2a2a4a] text-slate-100'
                    : 'bg-[#0a0a1a] border-[#2a2a4a] text-transparent'
                }`}
              >
                {revealed ? letter : '_'}
              </span>
            )
          })}
        </div>

        {/* Result */}
        {gameOver && (
          <div className="text-center mb-6">
            {won ? (
              <div>
                <div className="text-2xl font-bold text-green-300 mb-2">Gewonnen! 🎉</div>
                <div className="text-blue-300 font-medium">{word.wort}</div>
                <div className="text-slate-400 text-sm mt-1">{word.definition}</div>
                {word.beispiel && <div className="text-slate-500 text-sm italic mt-1">{word.beispiel}</div>}
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold text-red-300 mb-2">Verloren! 💀</div>
                <div className="text-blue-300 font-medium">{word.wort}</div>
                <div className="text-slate-400 text-sm mt-1">{word.definition}</div>
              </div>
            )}
          </div>
        )}

        {/* Keyboard */}
        {!gameOver ? (
          <div className="flex flex-wrap justify-center gap-1.5">
            {ALPHABET.map((letter) => {
              const isGuessed = guessed.has(letter)
              const isWrong = isGuessed && !word.guessWord.includes(letter)
              const isCorrect = isGuessed && word.guessWord.includes(letter)
              return (
                <button
                  key={letter}
                  onClick={() => handleGuess(letter)}
                  disabled={isGuessed}
                  className={`w-9 h-9 rounded-lg font-bold text-sm transition cursor-pointer ${
                    isCorrect
                      ? 'bg-green-600/30 border border-green-500 text-green-300'
                      : isWrong
                        ? 'bg-red-600/20 border border-red-500/30 text-red-400 opacity-40'
                        : 'bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] border border-[#2a2a4a]'
                  }`}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={restart}
              className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition cursor-pointer"
            >
              Neues Wort
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
