import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LernkartenPractice() {
  const [allCards, setAllCards] = useState([])
  const [filteredCards, setFilteredCards] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState('Alle')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [finished, setFinished] = useState(false)
  const [gewusst, setGewusst] = useState([])
  const [nichtGewusst, setNichtGewusst] = useState([])
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
    setFilteredCards(cards)
    const cats = [...new Set(cards.map((c) => c.kategorie || 'Allgemein'))].sort()
    setCategories(cats)
    setLoading(false)
  }

  function handleCatChange(cat) {
    setSelectedCat(cat)
    setCurrentIdx(0)
    setRevealed(false)
    setFinished(false)
    setGewusst([])
    setNichtGewusst([])
    if (cat === 'Alle') {
      setFilteredCards(allCards)
    } else {
      setFilteredCards(allCards.filter((c) => (c.kategorie || 'Allgemein') === cat))
    }
  }

  const current = filteredCards[currentIdx]
  const total = filteredCards.length
  const progress = total > 0 ? ((currentIdx + (revealed ? 1 : 0)) / total) * 100 : 0

  function handleResult(knew) {
    const card = filteredCards[currentIdx]
    if (knew) {
      setGewusst((prev) => [...prev, card.id])
    } else {
      setNichtGewusst((prev) => [...prev, card.id])
    }
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
    setGewusst([])
    setNichtGewusst([])
  }

  function restartWrong() {
    const wrongCards = filteredCards.filter((c) => nichtGewusst.includes(c.id))
    setFilteredCards(wrongCards)
    setCurrentIdx(0)
    setRevealed(false)
    setFinished(false)
    setGewusst([])
    setNichtGewusst([])
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-8 text-center text-slate-400">Lade Karten...</div>
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
    const nichtGewusstCards = filteredCards.filter((c) => nichtGewusst.includes(c.id))
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="p-12 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center">
          <h2 className="text-3xl font-bold text-slate-200 mb-8">🎉 Fertig!</h2>

          <div className="flex gap-4 justify-center mb-8">
            <div className="flex-1 p-4 rounded-lg bg-green-600/20 border border-green-500/30">
              <div className="text-green-300 font-bold text-xl">Gewusst</div>
              <div className="text-green-400 text-2xl mt-1">{gewusst.length} / {total}</div>
            </div>
            <div className="flex-1 p-4 rounded-lg bg-red-600/20 border border-red-500/30">
              <div className="text-red-300 font-bold text-xl">Nicht gewusst</div>
              <div className="text-red-400 text-2xl mt-1">{nichtGewusst.length} / {total}</div>
            </div>
          </div>

          {nichtGewusstCards.length > 0 && (
            <div className="text-left mb-8">
              <h3 className="text-slate-400 text-sm font-medium mb-3">Zum Wiederholen:</h3>
              <ul className="space-y-2">
                {nichtGewusstCards.map((card) => (
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
            {nichtGewusstCards.length > 0 && (
              <button
                onClick={restartWrong}
                className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition cursor-pointer"
              >
                Nur falsche üben
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

      <div className="flex justify-center mb-6">
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

      {revealed && (
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => handleResult(true)}
            className="flex-1 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium text-lg transition cursor-pointer"
          >
            ✅ Gewusst
          </button>
          <button
            onClick={() => handleResult(false)}
            className="flex-1 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-lg transition cursor-pointer"
          >
            ❌ Nicht gewusst
          </button>
        </div>
      )}
    </div>
  )
}
