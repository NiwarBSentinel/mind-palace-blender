import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { TRIVIA_DE } from '../data/triviaDE'

const EN_CATEGORIES = [
  { label: 'Alle Kategorien', value: '' },
  { label: 'Allgemeinwissen', value: '9' },
  { label: 'Bücher', value: '10' },
  { label: 'Film', value: '11' },
  { label: 'Musik', value: '12' },
  { label: 'Wissenschaft', value: '17' },
  { label: 'Computer', value: '18' },
  { label: 'Mathematik', value: '19' },
  { label: 'Natur', value: '20' },
  { label: 'Sport', value: '21' },
  { label: 'Geografie', value: '22' },
  { label: 'Geschichte', value: '23' },
  { label: 'Politik', value: '24' },
]

const DE_CATEGORIES = [
  { label: 'Alle Kategorien', value: '' },
  { label: 'Geografie', value: 'Geografie' },
  { label: 'Geschichte', value: 'Geschichte' },
  { label: 'Wissenschaft', value: 'Wissenschaft' },
  { label: 'Kultur & Kunst', value: 'Kultur & Kunst' },
  { label: 'Sport', value: 'Sport' },
  { label: 'Schweiz', value: 'Schweiz' },
]

const DIFFICULTIES = [
  { label: 'Einfach', value: 'easy' },
  { label: 'Mittel', value: 'medium' },
  { label: 'Schwer', value: 'hard' },
]

const DIFF_MAP_DE = { easy: 'einfach', medium: 'mittel', hard: 'schwer' }

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Trivia() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [lang, setLang] = useState(() => localStorage.getItem('trivia_lang') || 'de')
  const [screen, setScreen] = useState('start')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [amount, setAmount] = useState(10)
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saveModal, setSaveModal] = useState(null)
  const [saveKategorie, setSaveKategorie] = useState('')
  const [saveMnemonik, setSaveMnemonik] = useState('')
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  function openSaveModal(question, correct, category) {
    if (timerRef.current) clearTimeout(timerRef.current)
    setSaveModal({ question, correct, category })
    setSaveKategorie(category)
    setSaveMnemonik('')
  }

  function closeSaveModal() {
    setSaveModal(null)
    // Resume auto-advance if in game screen
    if (screen === 'game' && selected !== null) {
      timerRef.current = setTimeout(() => {
        if (currentIdx >= questions.length - 1) {
          setScreen('results')
        } else {
          setCurrentIdx((i) => i + 1)
          setSelected(null)
        }
      }, 500)
    }
  }

  async function handleSaveCard() {
    if (!saveModal) return
    const payload = {
      frage: saveModal.question,
      antwort: saveModal.correct,
      kategorie: saveKategorie.trim() || 'Trivia',
      mnemonik: saveMnemonik.trim() || null,
    }
    if (user) payload.user_id = user.id
    console.log('saveToLernkarten', { user_id: user?.id, frage: saveModal.question })
    const { error: err } = await supabase.from('lernkarten').insert(payload)
    if (err) console.error('saveToLernkarten error:', err)
    setSaveModal(null)
    setToast('Lernkarte gespeichert!')
    setTimeout(() => setToast(null), 2500)
    // Resume auto-advance if in game screen
    if (screen === 'game' && selected !== null) {
      timerRef.current = setTimeout(() => {
        if (currentIdx >= questions.length - 1) {
          setScreen('results')
        } else {
          setCurrentIdx((i) => i + 1)
          setSelected(null)
        }
      }, 500)
    }
  }

  function switchLang(l) {
    setLang(l)
    localStorage.setItem('trivia_lang', l)
    setCategory('')
  }

  async function startGame() {
    setLoading(true)
    setError(null)

    if (lang === 'de') {
      const deDiff = DIFF_MAP_DE[difficulty]
      let pool = TRIVIA_DE.filter((q) => q.schwierigkeit === deDiff)
      if (category) pool = pool.filter((q) => q.kategorie === category)
      if (pool.length < amount) pool = category ? TRIVIA_DE.filter((q) => q.kategorie === category) : [...TRIVIA_DE]
      const picked = shuffle(pool).slice(0, amount)
      if (picked.length === 0) {
        setError('Nicht genug Fragen verfügbar.')
        setLoading(false)
        return
      }
      const parsed = picked.map((q) => ({
        question: q.frage,
        correct: q.richtig,
        answers: shuffle([q.richtig, ...q.falsch]),
        category: q.kategorie,
        difficulty: q.schwierigkeit,
      }))
      setQuestions(parsed)
      setCurrentIdx(0)
      setSelected(null)
      setScore(0)
      setWrong([])
      setScreen('game')
      setLoading(false)
      return
    }

    // English: use opentdb API
    const catParam = category ? `&category=${category}` : ''
    const url = `https://opentdb.com/api.php?amount=${amount}${catParam}&difficulty=${difficulty}&type=multiple&encode=url3986`
    try {
      const res = await fetch(url)
      const data = await res.json()
      if (data.response_code !== 0 || !data.results?.length) {
        setError('Nicht genug Fragen verfügbar. Versuche andere Einstellungen.')
        setLoading(false)
        return
      }
      const parsed = data.results.map((q) => ({
        question: decodeURIComponent(q.question),
        correct: decodeURIComponent(q.correct_answer),
        answers: shuffle([
          decodeURIComponent(q.correct_answer),
          ...q.incorrect_answers.map((a) => decodeURIComponent(a)),
        ]),
        category: decodeURIComponent(q.category),
        difficulty: q.difficulty,
      }))
      setQuestions(parsed)
      setCurrentIdx(0)
      setSelected(null)
      setScore(0)
      setWrong([])
      setScreen('game')
    } catch {
      setError('API-Fehler. Bitte versuche es erneut.')
    }
    setLoading(false)
  }

  function handleAnswer(answer) {
    if (selected !== null) return
    setSelected(answer)
    const current = questions[currentIdx]
    const isCorrect = answer === current.correct
    if (isCorrect) {
      setScore((s) => s + 1)
    } else {
      setWrong((w) => [...w, { question: current.question, correct: current.correct }])
    }
    timerRef.current = setTimeout(() => {
      if (currentIdx >= questions.length - 1) {
        setScreen('results')
      } else {
        setCurrentIdx((i) => i + 1)
        setSelected(null)
      }
    }, 1000)
  }

  const diffLabel = DIFFICULTIES.find((d) => d.value === difficulty)?.label || difficulty

  // START SCREEN
  if (screen === 'start') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
        >
          ← Zurück zur Übersicht
        </button>

        <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
          Trivia
        </h1>
        <p className="text-center text-slate-400 mb-10">
          Teste dein Allgemeinwissen
        </p>

        <div className="p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] space-y-5">
          <div>
            <label className="text-slate-400 text-sm block mb-2">Sprache</label>
            <div className="flex gap-2">
              <button onClick={() => switchLang('de')} className={`flex-1 py-2.5 rounded-lg font-medium transition cursor-pointer ${lang === 'de' ? 'bg-red-600 text-white' : 'bg-[#0a0a1a] border border-[#2a2a4a] text-slate-400 hover:border-red-500/50'}`}>🇩🇪 Deutsch</button>
              <button onClick={() => switchLang('en')} className={`flex-1 py-2.5 rounded-lg font-medium transition cursor-pointer ${lang === 'en' ? 'bg-red-600 text-white' : 'bg-[#0a0a1a] border border-[#2a2a4a] text-slate-400 hover:border-red-500/50'}`}>🇬🇧 English</button>
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-sm block mb-2">Kategorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 focus:outline-none focus:border-red-500 transition cursor-pointer"
            >
              {(lang === 'de' ? DE_CATEGORIES : EN_CATEGORIES).map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-sm block mb-2">Schwierigkeit</label>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition cursor-pointer ${
                    difficulty === d.value
                      ? 'bg-red-600 text-white'
                      : 'bg-[#0a0a1a] border border-[#2a2a4a] text-slate-400 hover:border-red-500/50'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-sm block mb-2">Anzahl Fragen</label>
            <div className="flex gap-2">
              {[10, 20, 30].map((n) => (
                <button
                  key={n}
                  onClick={() => setAmount(n)}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition cursor-pointer ${
                    amount === n
                      ? 'bg-red-600 text-white'
                      : 'bg-[#0a0a1a] border border-[#2a2a4a] text-slate-400 hover:border-red-500/50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            onClick={startGame}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-lg transition cursor-pointer"
          >
            {loading ? 'Lade Fragen...' : 'Spiel starten'}
          </button>
        </div>
      </div>
    )
  }

  // GAME SCREEN
  if (screen === 'game') {
    const current = questions[currentIdx]
    const progress = ((currentIdx + (selected !== null ? 1 : 0)) / questions.length) * 100

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-400 text-sm">
            Frage {currentIdx + 1} / {questions.length}
          </span>
          <span className="text-green-400 font-medium">
            {score} ✓
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#1e1e3a] mb-6 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex gap-2 mb-6">
          <span className="text-xs px-2 py-1 rounded-full bg-[#1e1e3a] text-slate-400">
            {current.category}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300">
            {diffLabel}
          </span>
        </div>

        <div className="p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] mb-6">
          <p className="text-xl font-bold text-slate-100 leading-relaxed">
            {current.question}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {current.answers.map((answer, i) => {
            let btnClass = 'bg-[#12122a] border border-[#2a2a4a] text-slate-200 hover:border-red-500/50 hover:bg-[#16163a]'
            if (selected !== null) {
              if (answer === current.correct) {
                btnClass = 'bg-green-600/20 border border-green-500 text-green-300'
              } else if (answer === selected) {
                btnClass = 'bg-red-600/20 border border-red-500 text-red-300'
              } else {
                btnClass = 'bg-[#12122a] border border-[#1e1e3a] text-slate-500 opacity-50'
              }
            }
            return (
              <button
                key={answer}
                onClick={() => handleAnswer(answer)}
                disabled={selected !== null}
                className={`p-4 rounded-xl font-medium text-left transition cursor-pointer ${btnClass}`}
              >
                {selected !== null && answer === current.correct && '✅ '}
                {selected !== null && answer === selected && answer !== current.correct && '❌ '}
                {answer}
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div className="text-center mt-4">
            <button
              onClick={() => openSaveModal(current.question, current.correct, current.category)}
              className="text-sm px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition cursor-pointer"
            >
              💾 Als Lernkarte speichern
            </button>
          </div>
        )}

        {/* Save Modal */}
        {saveModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={closeSaveModal}>
            <div className="w-full max-w-md p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] space-y-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-slate-200">Als Lernkarte speichern</h3>
              <div>
                <label className="text-slate-400 text-xs block mb-1">Frage</label>
                <div className="px-3 py-2 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-300 text-sm">{saveModal.question}</div>
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1">Antwort</label>
                <div className="px-3 py-2 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-green-300 text-sm">{saveModal.correct}</div>
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1">Kategorie</label>
                <input
                  type="text"
                  value={saveKategorie}
                  onChange={(e) => setSaveKategorie(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1">Mnemonik (optional)</label>
                <textarea
                  value={saveMnemonik}
                  onChange={(e) => setSaveMnemonik(e.target.value)}
                  placeholder="Eselsbrücke oder Merkhilfe..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500 transition resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={closeSaveModal}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:bg-[#1e1e3a] transition cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSaveCard}
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition cursor-pointer"
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-lg bg-green-600 text-white font-medium shadow-lg z-50">
            ✅ {toast}
          </div>
        )}
      </div>
    )
  }

  // RESULTS SCREEN
  const pct = questions.length > 0 ? (score / questions.length) * 100 : 0
  const emoji = pct > 80 ? '🎉' : pct > 50 ? '👍' : '💪'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="p-12 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-4xl font-bold text-slate-100 mb-2">
          {score} / {questions.length}
        </h2>
        <p className="text-slate-400 mb-8">
          {pct > 80 ? 'Ausgezeichnet!' : pct > 50 ? 'Gut gemacht!' : 'Weiter üben!'}
        </p>

        {wrong.length > 0 && (
          <div className="text-left mb-8">
            <h3 className="text-slate-400 text-sm font-medium mb-3">Falsche Antworten:</h3>
            <ul className="space-y-2">
              {wrong.map((w, i) => (
                <li key={`${w.question}_${i}`} className="p-3 rounded-lg bg-red-600/10 border border-red-500/20">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-slate-300 text-sm">{w.question}</div>
                      <div className="text-green-400 text-sm mt-1">→ {w.correct}</div>
                    </div>
                    <button
                      onClick={() => openSaveModal(w.question, w.correct, 'Trivia')}
                      className="text-xs px-2 py-1 rounded text-purple-400 hover:bg-purple-500/10 transition cursor-pointer shrink-0"
                    >
                      💾 Speichern
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={startGame}
            className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition cursor-pointer"
          >
            Nochmal
          </button>
          <button
            onClick={() => { setScreen('start'); setError(null) }}
            className="px-6 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer"
          >
            Neue Runde
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer"
          >
            Zurück
          </button>
        </div>
      </div>

      {/* Save Modal */}
      {saveModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={closeSaveModal}>
          <div className="w-full max-w-md p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-200">Als Lernkarte speichern</h3>
            <div>
              <label className="text-slate-400 text-xs block mb-1">Frage</label>
              <div className="px-3 py-2 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-300 text-sm">{saveModal.question}</div>
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-1">Antwort</label>
              <div className="px-3 py-2 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-green-300 text-sm">{saveModal.correct}</div>
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-1">Kategorie</label>
              <input
                type="text"
                value={saveKategorie}
                onChange={(e) => setSaveKategorie(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-1">Mnemonik (optional)</label>
              <textarea
                value={saveMnemonik}
                onChange={(e) => setSaveMnemonik(e.target.value)}
                placeholder="Eselsbrücke oder Merkhilfe..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500 transition resize-none"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={closeSaveModal}
                className="px-4 py-2 rounded-lg text-slate-400 hover:bg-[#1e1e3a] transition cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSaveCard}
                className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition cursor-pointer"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-lg bg-green-600 text-white font-medium shadow-lg z-50">
          ✅ {toast}
        </div>
      )}
    </div>
  )
}
