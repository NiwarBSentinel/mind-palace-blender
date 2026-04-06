import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchGoetheWords } from '../data/goetheWordLists'
import { supabase } from '../lib/supabase'

const LEVEL_NAMES = { A1: 'Anfänger', A2: 'Grundlegende Kenntnisse', B1: 'Mittelstufe', B2: 'Obere Mittelstufe', C2: 'Experte' }

function loadSRS(level) {
  try { return JSON.parse(localStorage.getItem(`srs_${level}`)) || {} } catch { return {} }
}
function saveSRS(level, data) {
  localStorage.setItem(`srs_${level}`, JSON.stringify(data))
}

function calculateSRS(quality, srs) {
  const rep = srs?.repetitions || 0
  const int = srs?.interval || 1
  const ef = srs?.easeFactor || 2.5
  let newInterval, newEF, newRep
  if (quality < 3) { newRep = 0; newInterval = 1 }
  else { newRep = rep + 1; if (rep === 0) newInterval = 1; else if (rep === 1) newInterval = 6; else newInterval = Math.round(int * ef) }
  newEF = Math.max(1.3, ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  const next = new Date(); next.setDate(next.getDate() + newInterval)
  return { easeFactor: newEF, interval: newInterval, repetitions: newRep, nextReview: next.toISOString() }
}

function isDue(srs) { if (!srs?.nextReview) return true; return new Date(srs.nextReview) <= new Date() }

function formatInterval(days) {
  if (days === 1) return 'morgen'
  if (days < 7) return `${days} Tage`
  if (days < 30) return `${Math.round(days / 7)} Wochen`
  return `${Math.round(days / 30)} Monate`
}

function previewIntervals(srs) {
  const s = calculateSRS(0, srs), o = calculateSRS(3, srs), e = calculateSRS(5, srs)
  return { schwer: formatInterval(s.interval), ok: formatInterval(o.interval), einfach: formatInterval(e.interval) }
}

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }; return a
}

const POS_BADGES = { Substantiv: '📚', Verb: '🔤', Adjektiv: '🎨', Adverb: '📝', Präposition: '🔗', Konjunktion: '🔗', Partikel: '📝' }

function parseWikiGrammar(wikitext, wordType, word) {
  try {
    const cleanWord = (word || '').replace(/^(die|der|das)\s+/, '')
    let type = wordType
    if (!type) {
      if (/Wortart\|Verb/.test(wikitext)) type = 'Verb'
      else if (/Wortart\|Adjektiv/.test(wikitext)) type = 'Adjektiv'
      else if (/Wortart\|Substantiv/.test(wikitext)) type = 'Substantiv'
    }
    const isVerb = type === 'Verb' || /Konjugation/.test(wikitext) || cleanWord.endsWith('en') || cleanWord.endsWith('ieren')
    if (isVerb && type !== 'Substantiv' && type !== 'Adjektiv') {
      return { type: 'Verb', praesIch: wikitext.match(/\|Präsens_ich=([^\n|]+)/)?.[1]?.trim() || null, praeteritum: wikitext.match(/\|Präteritum_ich=([^\n|]+)/)?.[1]?.trim() || null, partizipII: wikitext.match(/\|Partizip II=([^\n|]+)/)?.[1]?.trim() || null }
    }
    if (type === 'Adjektiv') {
      return { type: 'Adjektiv', komparativ: wikitext.match(/\|Komparativ=([^\n|]+)/)?.[1]?.trim() || null, superlativ: wikitext.match(/\|Superlativ=([^\n|]+)/)?.[1]?.trim() || null }
    }
    if (type === 'Substantiv' || !type) {
      const gm = wikitext.match(/\|Genus=([mfn])/i)
      const genus = gm ? (gm[1] === 'm' ? 'der' : gm[1] === 'f' ? 'die' : 'das') : null
      const genSg = wikitext.match(/\|Genitiv Singular=([^\n|]+)/)?.[1]?.trim() || null
      const nomPl = wikitext.match(/\|Nominativ Plural=([^\n|]+)/)?.[1]?.trim() || null
      if (genus || genSg || nomPl) return { type: 'Substantiv', genus, genSg, nomPl }
    }
  } catch {}
  return null
}

export default function GoetheLevel() {
  const { level } = useParams()
  const upperLevel = level.toUpperCase()
  const navigate = useNavigate()
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('lernen')
  const [search, setSearch] = useState('')
  const [srsData, setSrsData] = useState(() => loadSRS(upperLevel))

  // Practice state
  const [practiceCards, setPracticeCards] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [finished, setFinished] = useState(false)
  const [results, setResults] = useState({ schwer: [], ok: [], einfach: [] })

  // Detail modal state
  const [detailWord, setDetailWord] = useState(null)
  const [detailData, setDetailData] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGoetheWords(upperLevel)
        setWords(data)
      } catch (err) {
        setError(err.message)
      }
      setLoading(false)
    }
    load()
  }, [upperLevel])

  const dueCount = words.filter((w) => isDue(srsData[w.wort])).length
  const learnedCount = words.filter((w) => srsData[w.wort]?.repetitions > 0).length

  // Search filter
  const searchLower = search.toLowerCase()
  const filtered = search ? words.filter((w) => w.wort.toLowerCase().includes(searchLower) || w.pos.toLowerCase().includes(searchLower)) : words

  async function saveToLernkarten(w) {
    const { error } = await supabase.from('lernkarten').insert({
      frage: w.wort,
      antwort: w.definition || detailData?.definition || w.wort,
      kategorie: `Deutsch ${upperLevel}`,
      mnemonik: w.beispiel || null,
    })
    if (error) console.error('save error:', error)
    setToast('Lernkarte gespeichert!')
    setTimeout(() => setToast(null), 2500)
  }

  // Detail modal
  async function openDetail(w) {
    setDetailWord(w)
    setDetailData(null)
    setDetailLoading(true)
    const clean = w.wort.replace(/^(die|der|das)\s+/, '')
    const encoded = encodeURIComponent(clean)
    const [thesRes, snippetRes, freqRes, wikiRes] = await Promise.allSettled([
      fetch(`https://www.openthesaurus.de/synonyme/search?q=${encoded}&format=application/json&similar=true`).then((r) => r.json()),
      fetch(`https://www.dwds.de/api/wb/snippet?q=${encoded}`).then((r) => r.json()),
      fetch(`https://www.dwds.de/api/frequency/?q=${encoded}`).then((r) => r.json()),
      fetch(`https://de.wiktionary.org/w/api.php?action=parse&page=${encoded}&prop=wikitext&format=json&origin=*`).then((r) => r.json()),
    ])
    const result = { synonyms: [], wortart: null, frequency: null, definition: null, grammar: null }
    if (thesRes.status === 'fulfilled') {
      result.synonyms = (thesRes.value.synsets || []).flatMap((s) => s.terms.map((t) => t.term)).filter((t, i, a) => a.indexOf(t) === i).slice(0, 10)
    }
    if (snippetRes.status === 'fulfilled' && Array.isArray(snippetRes.value) && snippetRes.value[0]) {
      result.wortart = snippetRes.value[0].pos || null
      if (snippetRes.value[0].definition) result.definition = snippetRes.value[0].definition
    }
    if (freqRes.status === 'fulfilled' && freqRes.value?.frequency !== undefined) {
      result.frequency = freqRes.value.frequency
    }
    if (wikiRes.status === 'fulfilled' && wikiRes.value?.parse?.wikitext?.['*']) {
      result.grammar = parseWikiGrammar(wikiRes.value.parse.wikitext['*'], result.wortart, w.wort)
    }
    setDetailData(result)
    setDetailLoading(false)
  }

  // Practice
  function startPractice() {
    const due = words.filter((w) => isDue(srsData[w.wort]))
    if (due.length === 0) return
    setPracticeCards(shuffle(due))
    setCurrentIdx(0)
    setRevealed(false)
    setFinished(false)
    setResults({ schwer: [], ok: [], einfach: [] })
    setTab('ueben')
  }

  function handleSRSAnswer(quality) {
    const card = practiceCards[currentIdx]
    const updated = calculateSRS(quality, srsData[card.wort])
    const newData = { ...srsData, [card.wort]: updated }
    setSrsData(newData)
    saveSRS(upperLevel, newData)
    const key = quality === 0 ? 'schwer' : quality === 3 ? 'ok' : 'einfach'
    setResults((prev) => ({ ...prev, [key]: [...prev[key], card.wort] }))
    if (currentIdx >= practiceCards.length - 1) { setFinished(true); return }
    setRevealed(false)
    setCurrentIdx(currentIdx + 1)
  }

  function restart() {
    setCurrentIdx(0); setRevealed(false); setFinished(false); setResults({ schwer: [], ok: [], einfach: [] })
  }

  const current = practiceCards[currentIdx]
  const total = practiceCards.length
  const progress = total > 0 ? ((currentIdx + (revealed ? 1 : 0)) / total) * 100 : 0
  const intervals = current ? previewIntervals(srsData[current.wort]) : null

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8 text-center text-slate-400">Lade {upperLevel} Wortliste...</div>
  if (error) return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-center">
      <p className="text-red-400 mb-4">{error}</p>
      <button onClick={() => navigate('/sprachen/deutsch')} className="px-5 py-2 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer">← Zurück</button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/sprachen/deutsch')} className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer">← Zurück zu Deutsch</button>

      <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        🇩🇪 Deutsch {upperLevel}
      </h1>
      <p className="text-center text-slate-400 mb-2">{LEVEL_NAMES[upperLevel] || upperLevel}</p>
      <p className="text-center text-slate-500 text-sm mb-8">
        {words.length} Wörter · {learnedCount} gelernt · {dueCount} heute fällig
      </p>

      <div className="flex gap-2 justify-center mb-8">
        <button onClick={() => setTab('lernen')} className={`px-5 py-2.5 rounded-lg font-medium transition cursor-pointer ${tab === 'lernen' ? 'bg-blue-600 text-white' : 'bg-[#12122a] border border-[#2a2a4a] text-slate-400 hover:border-blue-500/50'}`}>📖 Lernen</button>
        <button onClick={() => dueCount > 0 ? startPractice() : null} className={`px-5 py-2.5 rounded-lg font-medium transition cursor-pointer ${tab === 'ueben' ? 'bg-blue-600 text-white' : dueCount > 0 ? 'bg-[#12122a] border border-[#2a2a4a] text-slate-400 hover:border-blue-500/50' : 'bg-[#12122a] border border-[#2a2a4a] text-slate-600 cursor-not-allowed'}`}>
          🎯 Üben {dueCount > 0 && `(${dueCount})`}
        </button>
      </div>

      {/* LERNEN */}
      {tab === 'lernen' && (
        <>
          <div className="relative mb-6">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input type="text" placeholder="Wort suchen..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer text-lg leading-none">×</button>}
          </div>
          {search && <p className="text-sm text-slate-400 mb-4">{filtered.length} Wörter</p>}
          <div className="space-y-3">
            {filtered.map((w) => {
              const srs = srsData[w.wort]
              const due = isDue(srs)
              return (
                <div key={w.wort} onClick={() => openDetail(w)} className="p-5 rounded-xl bg-[#12122a] border border-[#1e1e3a] group cursor-pointer hover:border-blue-500/30 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-lg font-bold text-blue-300 mb-1">{w.wort}</div>
                      {w.definition && <div className="text-slate-200 text-sm mb-2">{w.definition}</div>}
                      {w.beispiel && <div className="text-slate-500 text-sm italic">{w.beispiel}</div>}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {w.pos && <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e1e3a] text-slate-500">{POS_BADGES[w.pos] || '📝'} {w.pos}</span>}
                      {srs?.repetitions > 0 ? (
                        due ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">Fällig</span>
                             : <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e1e3a] text-slate-500">Gelernt</span>
                      ) : <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">Neu</span>}
                    </div>
                  </div>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => { e.stopPropagation(); saveToLernkarten(w) }}
                      className="text-xs px-3 py-1 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition cursor-pointer"
                    >
                      💾 Als Lernkarte speichern
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* ÜBEN */}
      {tab === 'ueben' && (
        <>
          {dueCount === 0 || practiceCards.length === 0 ? (
            <div className="p-12 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-slate-200 mb-2">Alle Wörter für heute erledigt!</h2>
              <p className="text-slate-400 mb-6">{learnedCount} / {words.length} Wörter gelernt</p>
              <button onClick={() => setTab('lernen')} className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition cursor-pointer">Wörter durchstöbern</button>
            </div>
          ) : finished ? (
            <div className="p-12 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center">
              <h2 className="text-3xl font-bold text-slate-200 mb-8">🎉 Fertig!</h2>
              <div className="flex gap-3 justify-center mb-8">
                <div className="flex-1 p-4 rounded-lg bg-red-600/20 border border-red-500/30"><div className="text-red-300 font-bold">Schwer</div><div className="text-red-400 text-2xl mt-1">{results.schwer.length}</div></div>
                <div className="flex-1 p-4 rounded-lg bg-yellow-600/20 border border-yellow-500/30"><div className="text-yellow-300 font-bold">Ok</div><div className="text-yellow-400 text-2xl mt-1">{results.ok.length}</div></div>
                <div className="flex-1 p-4 rounded-lg bg-green-600/20 border border-green-500/30"><div className="text-green-300 font-bold">Einfach</div><div className="text-green-400 text-2xl mt-1">{results.einfach.length}</div></div>
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={startPractice} className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition cursor-pointer">Weiter üben</button>
                <button onClick={() => setTab('lernen')} className="px-6 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer">Zurück</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 text-sm">{currentIdx + 1} / {total}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#1e1e3a] mb-6 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <div className="p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center mb-8">
                <div className="text-xs text-slate-500 mb-2">{current.pos}</div>
                <div className="text-2xl font-bold text-blue-300 mb-6">{current.wort}</div>
                {revealed ? (
                  <p className="text-slate-400 text-sm italic">Hast du das Wort gewusst?</p>
                ) : (
                  <button onClick={() => setRevealed(true)} className="px-8 py-3 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition cursor-pointer text-lg">Aufdecken</button>
                )}
              </div>
              {revealed && intervals && (
                <div className="flex gap-3 justify-center">
                  <button onClick={() => handleSRSAnswer(0)} className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition cursor-pointer text-center">
                    <div>😰 Schwer</div><div className="text-xs opacity-70 mt-0.5">→ {intervals.schwer}</div>
                  </button>
                  <button onClick={() => handleSRSAnswer(3)} className="flex-1 px-4 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-medium transition cursor-pointer text-center">
                    <div>😐 Ok</div><div className="text-xs opacity-70 mt-0.5">→ {intervals.ok}</div>
                  </button>
                  <button onClick={() => handleSRSAnswer(5)} className="flex-1 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition cursor-pointer text-center">
                    <div>😊 Einfach</div><div className="text-xs opacity-70 mt-0.5">→ {intervals.einfach}</div>
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Detail Modal */}
      {detailWord && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setDetailWord(null)}>
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div className="text-2xl font-bold text-blue-300">{detailWord.wort}</div>
              <button onClick={() => setDetailWord(null)} className="text-slate-500 hover:text-slate-300 transition cursor-pointer text-xl leading-none ml-4">×</button>
            </div>

            {detailWord.definition && <div className="text-slate-200">{detailWord.definition}</div>}
            {detailWord.beispiel && <div className="text-slate-500 text-sm italic">{detailWord.beispiel}</div>}

            {detailLoading ? (
              <div className="text-slate-500 text-sm">Lade Grammatik, Synonyme und mehr...</div>
            ) : detailData && (
              <>
                {(detailData.wortart || detailData.frequency !== null || detailWord.pos) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {(detailData.wortart || detailWord.pos) && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300">
                        {(() => { const p = detailData.wortart || detailWord.pos; return p === 'Substantiv' ? '📚' : p === 'Verb' ? '🔤' : p === 'Adjektiv' ? '🎨' : '📝' })()}{' '}{detailData.wortart || detailWord.pos}
                      </span>
                    )}
                    {detailData.frequency !== null && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[#1e1e3a] text-slate-300 flex items-center gap-1.5">
                        Häufigkeit: <span className="font-mono tracking-tight">{'█'.repeat(Math.max(1, detailData.frequency))}{'░'.repeat(Math.max(0, 6 - detailData.frequency))}</span>
                        <span className="text-slate-500">({detailData.frequency}/6)</span>
                      </span>
                    )}
                  </div>
                )}

                {detailData.grammar && (
                  <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-2">Grammatik</h3>
                    <div className="p-3 rounded-lg bg-[#0a0a1a] text-sm">
                      {detailData.grammar.type === 'Substantiv' && (
                        <div className="text-slate-200">
                          <span className="mr-1">{detailData.grammar.genus === 'der' ? '🟢' : detailData.grammar.genus === 'die' ? '🔵' : detailData.grammar.genus === 'das' ? '🟡' : '⚪'}</span>
                          {detailData.grammar.genus && <span className="font-medium">{detailData.grammar.genus} </span>}
                          {detailWord.wort.replace(/^(die|der|das)\s+/, '')}
                          {detailData.grammar.genSg && <><span className="text-slate-400 mx-2">|</span>Gen: <span className="text-slate-300">{detailData.grammar.genSg}</span></>}
                          {detailData.grammar.nomPl && <><span className="text-slate-400 mx-2">|</span>Pl: <span className="text-slate-300">{detailData.grammar.nomPl}</span></>}
                        </div>
                      )}
                      {detailData.grammar.type === 'Verb' && (
                        <div className="text-slate-200">
                          <span className="text-slate-400 mr-1">⚫</span>
                          <span className="font-medium">{detailWord.wort.replace(/^(die|der|das)\s+/, '')}</span>
                          {detailData.grammar.praesIch && <><span className="text-slate-400 mx-2">|</span>ich {detailData.grammar.praesIch}</>}
                          {detailData.grammar.praeteritum && <><span className="text-slate-400 mx-2">|</span>Prät: {detailData.grammar.praeteritum}</>}
                          {detailData.grammar.partizipII && <><span className="text-slate-400 mx-2">|</span>Part. II: <span className="text-slate-300">{detailData.grammar.partizipII}</span></>}
                        </div>
                      )}
                      {detailData.grammar.type === 'Adjektiv' && (
                        <div className="text-slate-200">
                          <span className="text-yellow-400 mr-1">🟡</span>
                          <span className="font-medium">{detailWord.wort.replace(/^(die|der|das)\s+/, '')}</span>
                          {detailData.grammar.komparativ && <><span className="text-slate-400 mx-2">|</span><span className="text-slate-300">{detailData.grammar.komparativ}</span></>}
                          {detailData.grammar.superlativ && <><span className="text-slate-400 mx-2">|</span>am <span className="text-slate-300">{detailData.grammar.superlativ}en</span></>}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {detailData.synonyms.length > 0 && (
                  <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-2">Synonyme (OpenThesaurus)</h3>
                    <div className="flex flex-wrap gap-2">
                      {detailData.synonyms.map((s) => (
                        <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {detailWord.synonyme?.length > 0 && (
                  <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-2">Synonyme</h3>
                    <div className="flex flex-wrap gap-2">
                      {detailWord.synonyme.map((s) => (
                        <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-green-500/20 text-green-300">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {detailWord.aehnlich?.length > 0 && (
                  <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-2">Ähnliche Wörter</h3>
                    <div className="flex flex-wrap gap-2">
                      {detailWord.aehnlich.map((s) => (
                        <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-[#1e1e3a] text-slate-300">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={(e) => { e.stopPropagation(); saveToLernkarten(detailWord) }}
                className="text-xs px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition cursor-pointer"
              >
                💾 Als Lernkarte speichern
              </button>
              <a
                href={`https://www.dwds.de/wb/${encodeURIComponent(detailWord.wort.replace(/^(die|der|das)\s+/, ''))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition"
              >
                Im DWDS nachschlagen →
              </a>
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
