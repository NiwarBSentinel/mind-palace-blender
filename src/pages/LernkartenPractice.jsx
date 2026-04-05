import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { calculateNextReview, isDue, getNextDueDate, previewIntervals } from '../lib/srs'

export default function LernkartenPractice() {
  const [allCards, setAllCards] = useState([])
  const [filteredCards, setFilteredCards] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState('Alle')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [finished, setFinished] = useState(false)
  const [results, setResults] = useState({ schwer: [], ok: [], einfach: [] })
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') === 'all' ? 'all' : 'due')
  const navigate = useNavigate()

  useEffect(() => { fetchCards() }, [])

  async function fetchCards() {
    const { data, error } = await supabase
      .from('lernkarten')
      .select('*')
      .order('created_at')
    if (error) console.error('fetchCards error:', error)
    const cards = data || []
    setAllCards(cards)
    applyFilters(cards, mode, 'Alle')
    const cats = [...new Set(cards.map((c) => c.kategorie || 'Allgemein'))].sort()
    setCategories(cats)
    setLoading(false)
  }

  function applyFilters(cards, m, cat) {
    let filtered = cards
    if (m === 'due') {
      filtered = filtered.filter((c) => isDue(c.next_review))
    }
    if (cat !== 'Alle') {
      filtered = filtered.filter((c) => (c.kategorie || 'Allgemein') === cat)
    }
    setFilteredCards(filtered)
    setCurrentIdx(0)
    setRevealed(false)
    setFinished(false)
    setResults({ schwer: [], ok: [], einfach: [] })
  }

  function handleModeChange(m) {
    setMode(m)
    applyFilters(allCards, m, selectedCat)
  }

  function handleCatChange(cat) {
    setSelectedCat(cat)
    applyFilters(allCards, mode, cat)
  }

  const current = filteredCards[currentIdx]
  const total = filteredCards.length
  const progress = total > 0 ? ((currentIdx + (revealed ? 1 : 0)) / total) * 100 : 0

  async function handleSRS(quality) {
    const card = filteredCards[currentIdx]
    const update = calculateNextReview(
      quality,
      card.repetitions || 0,
      card.interval_days || 1,
      card.ease_factor || 2.5
    )
    await supabase.from('lernkarten').update(update).eq('id', card.id)

    const key = quality === 0 ? 'schwer' : quality === 3 ? 'ok' : 'einfach'
    setResults((prev) => ({ ...prev, [key]: [...prev[key], card.id] }))

    if (currentIdx >= total - 1) {
      setFinished(true)
      return
    }
    setRevealed(false)
    setCurrentIdx(currentIdx + 1)
  }

  function restart() {
    setCurrentIdx(0)
    setRevealed(false)
    setFinished(false)
    setResults({ schwer: [], ok: [], einfach: [] })
  }

  function restartSchwer() {
    const schwerCards = filteredCards.filter((c) => results.schwer.includes(c.id))
    setFilteredCards(schwerCards)
    setCurrentIdx(0)
    setRevealed(false)
    setFinished(false)
    setResults({ schwer: [], ok: [], einfach: [] })
  }

  const intervals = current ? previewIntervals(current) : null

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-8 text-center text-slate-400">Lade Karten...</div>
  }

  // No due cards
  if (mode === 'due' && total === 0 && allCards.length > 0) {
    const nextDate = getNextDueDate(allCards)
    const formatted = nextDate
      ? nextDate.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })
      : null
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="p-12 rounded-xl bg-[#12122a] border border-[#1e1e3a]">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Alle Karten erledigt!</h2>
          {formatted && (
            <p className="text-slate-400 mb-6">Nächste Karte fällig: {formatted}</p>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleModeChange('all')}
              className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition cursor-pointer"
            >
              Alle Karten üben
            </button>
            <button
              onClick={() => navigate('/lernkarten')}
              className="px-6 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer"
            >
              Zurück
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (total === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-400 mb-6">Keine Karten zum Üben vorhanden.</p>
        <button
          onClick={() => navigate('/lernkarten')}
          className="px-5 py-2 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer"
        >
          Zurück zu Lernkarten
        </button>
      </div>
    )
  }

  if (finished) {
    const schwerCards = filteredCards.filter((c) => results.schwer.includes(c.id))
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="p-12 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center">
          <h2 className="text-3xl font-bold text-slate-200 mb-8">🎉 Fertig!</h2>

          <div className="flex gap-3 justify-center mb-8">
            <div className="flex-1 p-4 rounded-lg bg-red-600/20 border border-red-500/30">
              <div className="text-red-300 font-bold">Schwer</div>
              <div className="text-red-400 text-2xl mt-1">{results.schwer.length}</div>
            </div>
            <div className="flex-1 p-4 rounded-lg bg-yellow-600/20 border border-yellow-500/30">
              <div className="text-yellow-300 font-bold">Ok</div>
              <div className="text-yellow-400 text-2xl mt-1">{results.ok.length}</div>
            </div>
            <div className="flex-1 p-4 rounded-lg bg-green-600/20 border border-green-500/30">
              <div className="text-green-300 font-bold">Einfach</div>
              <div className="text-green-400 text-2xl mt-1">{results.einfach.length}</div>
            </div>
          </div>

          {schwerCards.length > 0 && (
            <div className="text-left mb-8">
              <h3 className="text-slate-400 text-sm font-medium mb-3">Schwere Karten:</h3>
              <ul className="space-y-2">
                {schwerCards.map((card) => (
                  <li key={card.id} className="text-slate-300 text-sm p-2 rounded-lg bg-red-600/10 border border-red-500/20">
                    {card.frage}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={restart}
              className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition cursor-pointer"
            >
              Nochmal alle
            </button>
            {schwerCards.length > 0 && (
              <button
                onClick={restartSchwer}
                className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition cursor-pointer"
              >
                Nur schwere üben
              </button>
            )}
            <button
              onClick={() => navigate('/lernkarten')}
              className="px-6 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer"
            >
              Zurück
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/lernkarten')}
          className="text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          ← Zurück zu Lernkarten
        </button>
        <span className="text-slate-500 text-sm">
          {currentIdx + 1} / {total}
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-[#1e1e3a] mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => handleModeChange('due')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
            mode === 'due'
              ? 'bg-green-600 text-white'
              : 'bg-[#12122a] border border-[#2a2a4a] text-slate-400 hover:border-green-500/50'
          }`}
        >
          📅 Fällige Karten
        </button>
        <button
          onClick={() => handleModeChange('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
            mode === 'all'
              ? 'bg-green-600 text-white'
              : 'bg-[#12122a] border border-[#2a2a4a] text-slate-400 hover:border-green-500/50'
          }`}
        >
          🃏 Alle Karten
        </button>
        <select
          value={selectedCat}
          onChange={(e) => handleCatChange(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#12122a] border border-[#2a2a4a] text-slate-300 text-sm focus:outline-none focus:border-green-500 transition cursor-pointer"
        >
          <option value="Alle">Alle Kategorien</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center mb-8">
        <div className="text-xs text-slate-500 mb-4">
          {current.kategorie || 'Allgemein'}
        </div>
        <div className="text-xl text-slate-200 font-medium mb-8">
          {current.frage}
        </div>

        {revealed ? (
          <div className="space-y-3">
            <div className="text-2xl font-bold text-green-300">
              {current.antwort}
            </div>
            {current.mnemonik && (
              <div className="text-slate-500 italic text-sm">
                {current.mnemonik}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="px-8 py-3 rounded-lg bg-green-600/20 border border-green-500/30 text-green-300 hover:bg-green-600/30 transition cursor-pointer text-lg"
          >
            Antwort anzeigen
          </button>
        )}
      </div>

      {revealed && intervals && (
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => handleSRS(0)}
            className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition cursor-pointer text-center"
          >
            <div>😰 Schwer</div>
            <div className="text-xs opacity-70 mt-0.5">→ {intervals.schwer}</div>
          </button>
          <button
            onClick={() => handleSRS(3)}
            className="flex-1 px-4 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-medium transition cursor-pointer text-center"
          >
            <div>😐 Ok</div>
            <div className="text-xs opacity-70 mt-0.5">→ {intervals.ok}</div>
          </button>
          <button
            onClick={() => handleSRS(5)}
            className="flex-1 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition cursor-pointer text-center"
          >
            <div>😊 Einfach</div>
            <div className="text-xs opacity-70 mt-0.5">→ {intervals.einfach}</div>
          </button>
        </div>
      )}
    </div>
  )
}
