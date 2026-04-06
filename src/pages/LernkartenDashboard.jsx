import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { isDue, getDueCount } from '../lib/srs'
import { useAuth } from '../contexts/AuthContext'

const MAJOR_MAP = {
  '00':'Sauce','01':'Seed','02':'Sun','03':'Sumo','04':'Sir','05':'Soul','06':'Sushi','07':'Ski','08':'Sofa','09':'Soap',
  '10':'Dice','11':'Dad','12':'DNA','13':'Adam','14':'Thor','15':'Adele','16':'DJ','17':'Dog','18':'TV','19':'Tuba',
  '20':'Nose','21':'Net','22':'Nun','23':'Nemo','24':'Nero','25':'Nail','26':'Nacho','27':'Ink','28':'Knife','29':'NBA',
  '30':'Mouse','31':'Mat','32':'Moon','33':'Mummy','34':'Mario','35':'Mole','36':'Match','37':'Mickey','38':'Mafia','39':'Map',
  '40':'Rose','41':'Radio','42':'Rain','43':'Rum','44':'Error','45':'Ariel','46':'Arch','47':'Rocky','48':'Roof','49':'Harp',
  '50':'Lasso','51':'Lady','52':'Lion','53':'Lime','54':'Hillary','55':'Lily','56':'Leech','57':'Leek','58':'Lava','59':'Lip',
  '60':'Cheese','61':'Cheetah','62':'Genie','63':'Jam','64':'Cherry','65':'Chilli','66':'Yo-yo','67':'Chick','68':'Chef','69':'Ship',
  '70':'Goose','71':'Cat','72':'Gun','73':'Gum','74':'Car','75':'Koala','76':'Cage','77':'Cake','78':'Coffee','79':'Cube',
  '80':'Vase','81':'Foot','82':'Fan','83':'Foam','84':'Fire','85':'Fly','86':'Fish','87':'Fig','88':'FIFA','89':'Phoebe',
  '90':'Bus','91':'Bat','92':'Piano','93':'Beam','94':'Beer','95':'Apple','96':'Bush','97':'Book','98':'Beef','99':'Pope'
}

function getMajorHints(text) {
  const numbers = text.match(/\d+/g)
  if (!numbers) return null
  const pairs = []
  for (const num of numbers) {
    const padded = num.length % 2 === 1 ? '0' + num : num
    for (let i = 0; i < padded.length; i += 2) {
      const pair = padded.substring(i, i + 2)
      if (MAJOR_MAP[pair]) pairs.push({ num: pair, word: MAJOR_MAP[pair] })
    }
  }
  return pairs.length > 0 ? pairs : null
}

export default function LernkartenDashboard() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ frage: '', antwort: '', mnemonik: '', kategorie: '' })
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => { fetchCards() }, [user])

  async function fetchCards() {
    const { data, error } = await supabase
      .from('lernkarten')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error('fetchCards error:', error)
    setCards(data || [])
    setLoading(false)
  }

  function openNew() {
    setEditingId(null)
    setForm({ frage: '', antwort: '', mnemonik: '', kategorie: '' })
    setShowForm(true)
  }

  function openEdit(card) {
    setEditingId(card.id)
    setForm({ frage: card.frage, antwort: card.antwort, mnemonik: card.mnemonik || '', kategorie: card.kategorie || '' })
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
  }

  async function saveCard(e) {
    e.preventDefault()
    if (!form.frage.trim() || !form.antwort.trim()) return
    const payload = {
      frage: form.frage.trim(),
      antwort: form.antwort.trim(),
      mnemonik: form.mnemonik.trim() || null,
      kategorie: form.kategorie.trim() || 'Allgemein',
    }
    if (editingId) {
      const { error } = await supabase.from('lernkarten').update(payload).eq('id', editingId)
      if (error) console.error('update error:', error)
    } else {
      if (user) payload.user_id = user.id
      console.log('saveToLernkarten', { user_id: user?.id, frage: form.frage })
      const { error } = await supabase.from('lernkarten').insert(payload)
      if (error) console.error('saveToLernkarten error:', error)
    }
    setShowForm(false)
    setEditingId(null)
    await fetchCards()
  }

  async function deleteCard(id) {
    if (!confirm('Karte wirklich löschen?')) return
    await supabase.from('lernkarten').delete().eq('id', id)
    await fetchCards()
  }

  const searchLower = search.toLowerCase()
  const filteredCards = search
    ? cards.filter((c) =>
        (c.frage || '').toLowerCase().includes(searchLower) ||
        (c.antwort || '').toLowerCase().includes(searchLower) ||
        (c.mnemonik || '').toLowerCase().includes(searchLower) ||
        (c.kategorie || '').toLowerCase().includes(searchLower)
      )
    : cards

  const grouped = {}
  for (const card of filteredCards) {
    const cat = card.kategorie || 'Allgemein'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(card)
  }
  const categories = Object.keys(grouped).sort()

  const majorHints = getMajorHints(form.antwort)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
      >
        ← Zurück zur Übersicht
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Lernkarten
          </h1>
        </div>
        {!showForm && (
          <button
            onClick={openNew}
            className="px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition cursor-pointer"
          >
            Neue Karte
          </button>
        )}
      </div>

      {!loading && cards.length > 0 && (
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => navigate('/lernkarten/practice?mode=due')}
            className="px-4 py-2 rounded-lg bg-green-600/20 border border-green-500/30 text-green-300 hover:bg-green-600/30 transition cursor-pointer text-sm font-medium"
          >
            📅 Heute fällig: {getDueCount(cards)} Karten
          </button>
          <div className="px-4 py-2 rounded-lg bg-[#12122a] border border-[#1e1e3a] text-slate-400 text-sm">
            📚 Gesamt: {cards.length} Karten
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={saveCard} className="mb-8 p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] space-y-4">
          <p className="text-slate-400 text-sm">
            💡 Tipp: Eine Information pro Karte — das Gehirn merkt sich einzelne Fakten besser.
          </p>
          <input
            type="text"
            placeholder="z.B. Wer war die erste Frau im All?"
            value={form.frage}
            onChange={(e) => setForm({ ...form, frage: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-green-500 transition"
          />
          <input
            type="text"
            placeholder="z.B. Valentina Tereschkowa"
            value={form.antwort}
            onChange={(e) => setForm({ ...form, antwort: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-green-500 transition"
          />
          <input
            type="text"
            placeholder="z.B. Geschichte, ZHAW, Biologie"
            value={form.kategorie}
            onChange={(e) => setForm({ ...form, kategorie: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-green-500 transition"
          />
          <textarea
            placeholder="z.B. 19=Tuba, 63=Jam → Jim Morrison spielt Tuba für Valentina"
            value={form.mnemonik}
            onChange={(e) => setForm({ ...form, mnemonik: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-green-500 transition resize-none"
          />
          {majorHints && (
            <div className="text-slate-500 text-sm px-1">
              Major-System: {majorHints.map((h, i) => (
                <span key={i}>{i > 0 && ' · '}<span className="text-green-400/70">{h.num}</span> → {h.word}</span>
              ))}
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={cancelForm}
              className="px-4 py-2 rounded-lg text-slate-400 hover:bg-[#1e1e3a] transition cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={!form.frage.trim() || !form.antwort.trim()}
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-medium transition cursor-pointer"
            >
              Speichern
            </button>
          </div>
        </form>
      )}

      {!loading && cards.length > 0 && (
        <div className="relative mb-6">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="text"
            placeholder="Suche nach Frage, Antwort oder Mnemonik..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-green-500 transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>
      )}

      {search && !loading && (
        <p className="text-sm text-slate-400 mb-4">
          {filteredCards.length} Karten gefunden
        </p>
      )}

      {loading ? (
        <p className="text-center text-slate-400">Lade Karten...</p>
      ) : cards.length === 0 ? (
        <p className="text-center text-slate-500 py-8">Noch keine Karten. Erstelle deine erste Lernkarte!</p>
      ) : filteredCards.length === 0 ? (
        <p className="text-center text-slate-500 py-8">Keine Karten gefunden für &lsquo;{search}&rsquo;</p>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-semibold text-slate-300">{cat}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">
                  {grouped[cat].length}
                </span>
              </div>
              <div className="space-y-2">
                {grouped[cat].map((card) => (
                  <div key={card.id} className="p-4 rounded-xl bg-[#12122a] border border-[#1e1e3a] group">
                    <div className="text-slate-200 font-medium mb-1">{card.frage}</div>
                    <div className="text-green-300 mb-1">{card.antwort}</div>
                    {card.mnemonik && (
                      <div className="text-slate-500 text-sm italic mb-2">{card.mnemonik}</div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e1e3a] text-slate-400">
                          {card.kategorie || 'Allgemein'}
                        </span>
                        {(() => {
                          if (!card.repetitions && card.repetitions !== 0) {
                            return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">Neu</span>
                          }
                          if (isDue(card.next_review)) {
                            return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">Heute fällig</span>
                          }
                          const days = Math.ceil((new Date(card.next_review) - new Date()) / (1000 * 60 * 60 * 24))
                          return <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e1e3a] text-slate-500">Fällig in {days} {days === 1 ? 'Tag' : 'Tagen'}</span>
                        })()}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => openEdit(card)}
                          className="text-xs px-2 py-1 rounded text-blue-400 hover:bg-blue-500/10 transition cursor-pointer"
                        >
                          Bearbeiten
                        </button>
                        <button
                          onClick={() => deleteCard(card.id)}
                          className="text-xs px-2 py-1 rounded text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                        >
                          Löschen
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <button
              onClick={() => navigate('/lernkarten/practice')}
              className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition cursor-pointer"
            >
              Karten üben →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
