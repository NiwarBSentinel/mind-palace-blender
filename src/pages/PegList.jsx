import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const PEGS = [
  [0,'Sauce'],[1,'Seed'],[2,'Sun'],[3,'Sumo'],[4,'Sir'],[5,'Soul'],[6,'Sushi'],[7,'Ski'],[8,'Sofa'],[9,'Soap'],
  [10,'Dice'],[11,'Dad'],[12,'DNA'],[13,'Adam'],[14,'Thor'],[15,'Adele'],[16,'DJ'],[17,'Dog'],[18,'TV'],[19,'Tuba'],
  [20,'Nose'],[21,'Net'],[22,'Nun'],[23,'Nemo'],[24,'Nero'],[25,'Nail'],[26,'Nacho'],[27,'Ink'],[28,'Knife'],[29,'NBA'],
  [30,'Mouse'],[31,'Mat'],[32,'Moon'],[33,'Mummy'],[34,'Mario'],[35,'Mole'],[36,'Match'],[37,'Mickey'],[38,'Mafia'],[39,'Map'],
  [40,'Rose'],[41,'Radio'],[42,'Rain'],[43,'Rum'],[44,'Error'],[45,'Ariel'],[46,'Arch'],[47,'Rocky'],[48,'Roof'],[49,'Harp'],
  [50,'Lasso'],[51,'Lady'],[52,'Lion'],[53,'Lime'],[54,'Hillary'],[55,'Lily'],[56,'Leech'],[57,'Leek'],[58,'Lava'],[59,'Lip'],
  [60,'Cheese'],[61,'Cheetah'],[62,'Genie'],[63,'Jam'],[64,'Cherry'],[65,'Chilli'],[66,'Yo-yo'],[67,'Chick'],[68,'Chef'],[69,'Ship'],
  [70,'Goose'],[71,'Cat'],[72,'Gun'],[73,'Gum'],[74,'Car'],[75,'Koala'],[76,'Cage'],[77,'Cake'],[78,'Coffee'],[79,'Cube'],
  [80,'Vase'],[81,'Foot'],[82,'Fan'],[83,'Foam'],[84,'Fire'],[85,'Fly'],[86,'Fish'],[87,'Fig'],[88,'FIFA'],[89,'Phoebe'],
  [90,'Bus'],[91,'Bat'],[92,'Piano'],[93,'Beam'],[94,'Beer'],[95,'Apple'],[96,'Bush'],[97,'Book'],[98,'Beef'],[99,'Pope'],
  [100,'Daisies'],
]

const PEG_MAP = Object.fromEntries(PEGS.map(([n, w]) => [n, w]))

function splitIntoPairs(str) {
  const digits = str.replace(/\D/g, '')
  if (!digits) return []
  // Pad odd length with leading 0 on last digit
  const padded = digits.length % 2 === 1
    ? digits.slice(0, -1) + '0' + digits.slice(-1)
    : digits
  const pairs = []
  for (let i = 0; i < padded.length; i += 2) {
    const num = parseInt(padded.substring(i, i + 2), 10)
    if (num <= 100 && PEG_MAP[num] !== undefined) {
      pairs.push({ num, padded: padded.substring(i, i + 2), word: PEG_MAP[num] })
    }
  }
  return pairs
}

export default function PegList() {
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [bezeichnung, setBezeichnung] = useState('')
  const [notiz, setNotiz] = useState('')
  const [saved, setSaved] = useState([])
  const navigate = useNavigate()

  useEffect(() => { fetchSaved() }, [])

  async function fetchSaved() {
    const { data, error } = await supabase
      .from('peg_sequenzen')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error('fetchSaved error:', error)
    setSaved(data || [])
  }

  async function handleSave() {
    if (!input || pairs.length === 0) return
    const payload = {
      zahl: input,
      pegs: pairs.map((p) => p.word).join(' → '),
      bezeichnung: bezeichnung.trim() || null,
      notiz: notiz.trim() || null,
    }
    const { error } = await supabase.from('peg_sequenzen').insert(payload)
    if (error) console.error('save error:', error)
    setBezeichnung('')
    setNotiz('')
    await fetchSaved()
  }

  async function handleDelete(id) {
    if (!confirm('Eintrag wirklich löschen?')) return
    await supabase.from('peg_sequenzen').delete().eq('id', id)
    await fetchSaved()
  }

  const pairs = input ? splitIntoPairs(input) : []

  const searchLower = search.toLowerCase()
  const filtered = search
    ? PEGS.filter(([n, word]) =>
        String(n).includes(search) ||
        String(n).padStart(2, '0').includes(search) ||
        word.toLowerCase().includes(searchLower)
      )
    : PEGS

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
      >
        ← Zurück zur Übersicht
      </button>

      <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
        Peg List
      </h1>
      <p className="text-center text-slate-400 mb-8">
        Major System 00–100
      </p>

      {/* Quick lookup */}
      <div className="mb-8 p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center">
        <label className="text-slate-400 text-sm block mb-3">Nummer eingeben</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="z.B. 1963"
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/[^\d]/g, ''))}
          className="w-48 text-center text-3xl font-mono px-4 py-3 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-orange-300 placeholder-slate-600 focus:outline-none focus:border-orange-500 transition"
        />
        {pairs.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {pairs.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-slate-500 text-lg">→</span>}
                  <div className="px-4 py-3 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a]">
                    <div className="text-orange-400 text-sm font-mono">{p.padded}</div>
                    <div className="text-xl font-bold text-slate-100">{p.word}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-slate-400 text-sm">
              Deine Geschichte: <span className="text-slate-200 font-medium">{pairs.map((p) => p.word).join(' + ')}</span>
            </p>
          </div>
        )}
        {input && pairs.length === 0 && (
          <p className="mt-4 text-slate-500 text-sm">Bitte eine gültige Zahl eingeben</p>
        )}

        {/* Save form */}
        {pairs.length > 0 && (
          <div className="mt-6 pt-6 border-t border-[#1e1e3a] space-y-3">
            <input
              type="text"
              placeholder="Bezeichnung (z.B. Erster Weltkrieg)"
              value={bezeichnung}
              onChange={(e) => setBezeichnung(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
            />
            <textarea
              placeholder="Notiz (optional)"
              value={notiz}
              onChange={(e) => setNotiz(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition resize-none"
            />
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition cursor-pointer"
            >
              Speichern
            </button>
          </div>
        )}
      </div>

      {/* Saved sequences */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-300 mb-3">Gespeicherte Zahlen</h2>
        {saved.length === 0 ? (
          <p className="text-slate-500 text-sm py-4">Noch keine Zahlen gespeichert</p>
        ) : (
          <div className="space-y-2">
            {saved.map((entry) => (
              <div key={entry.id} className="p-4 rounded-xl bg-[#12122a] border border-[#1e1e3a] group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {entry.bezeichnung && (
                      <div className="text-slate-200 font-medium mb-1">{entry.bezeichnung}</div>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono font-bold px-2 py-0.5 rounded-md bg-orange-500/15 text-orange-400">
                        {entry.zahl}
                      </span>
                      <span className="text-slate-400 text-sm">{entry.pegs}</span>
                    </div>
                    {entry.notiz && (
                      <div className="text-slate-500 text-sm mt-1">{entry.notiz}</div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-xs px-2 py-1 rounded text-red-400 hover:bg-red-500/10 transition cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search + full list */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          type="text"
          placeholder="Suche nach Nummer oder Wort..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
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

      {search && (
        <p className="text-sm text-slate-400 mb-3">{filtered.length} Einträge gefunden</p>
      )}

      <div className="rounded-xl bg-[#12122a] border border-[#1e1e3a] overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-500 py-8">Keine Einträge gefunden für &lsquo;{search}&rsquo;</p>
        ) : (
          filtered.map(([num, word], i) => (
            <div
              key={num}
              className={`flex items-center gap-4 px-4 py-3 ${i % 2 === 0 ? 'bg-[#12122a]' : 'bg-[#0f0f22]'}`}
            >
              <span className="w-12 text-center text-sm font-mono font-bold px-2 py-1 rounded-md bg-orange-500/15 text-orange-400">
                {String(num).padStart(2, '0')}
              </span>
              <span className="text-slate-200 font-medium">{word}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
