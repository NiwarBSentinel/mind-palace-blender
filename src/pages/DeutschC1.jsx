import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { C1_WOERTER } from '../data/c1WordsFull'

const STORAGE_KEY = 'c1_srs_data'

function loadSRS() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch { return {} }
}

function saveSRS(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function calculateSRS(quality, srs) {
  const rep = srs?.repetitions || 0
  const int = srs?.interval || 1
  const ef = srs?.easeFactor || 2.5
  let newInterval, newEF, newRep

  if (quality < 3) {
    newRep = 0
    newInterval = 1
  } else {
    newRep = rep + 1
    if (rep === 0) newInterval = 1
    else if (rep === 1) newInterval = 6
    else newInterval = Math.round(int * ef)
  }
  newEF = Math.max(1.3, ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  const next = new Date()
  next.setDate(next.getDate() + newInterval)

  return { easeFactor: newEF, interval: newInterval, repetitions: newRep, nextReview: next.toISOString() }
}

function isDue(srs) {
  if (!srs?.nextReview) return true
  return new Date(srs.nextReview) <= new Date()
}

function formatInterval(days) {
  if (days === 1) return 'morgen'
  if (days < 7) return `${days} Tage`
  if (days < 30) return `${Math.round(days / 7)} Wochen`
  return `${Math.round(days / 30)} Monate`
}

function previewIntervals(srs) {
  const s = calculateSRS(0, srs)
  const o = calculateSRS(3, srs)
  const e = calculateSRS(5, srs)
  return { schwer: formatInterval(s.interval), ok: formatInterval(o.interval), einfach: formatInterval(e.interval) }
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function DeutschC1() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('lernen')
  const [search, setSearch] = useState('')
  const [srsData, setSrsData] = useState(loadSRS)
  const [toast, setToast] = useState(null)
  const [wordStack, setWordStack] = useState([])
  const [stackIdx, setStackIdx] = useState(-1)
  const [stackData, setStackData] = useState({})
  const [detailLoading, setDetailLoading] = useState(false)
  const [grammarLoading, setGrammarLoading] = useState(false)
  const [slideDir, setSlideDir] = useState('right')
  const stackRef = useRef({ stack: [], idx: -1 })

  // Practice state
  const [practiceCards, setPracticeCards] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [finished, setFinished] = useState(false)
  const [direction, setDirection] = useState('forward')
  const [results, setResults] = useState({ schwer: [], ok: [], einfach: [] })

  const dueCount = C1_WOERTER.filter((w) => isDue(srsData[w.wort])).length
  const learnedCount = C1_WOERTER.filter((w) => srsData[w.wort]?.repetitions > 0).length

  function startPractice() {
    const due = C1_WOERTER.filter((w) => isDue(srsData[w.wort]))
    if (due.length === 0) return
    setPracticeCards(shuffle(due))
    setCurrentIdx(0)
    setRevealed(false)
    setFinished(false)
    setDirection(Math.random() > 0.5 ? 'forward' : 'backward')
    setResults({ schwer: [], ok: [], einfach: [] })
    setTab('ueben')
  }

  function handleSRSAnswer(quality) {
    const card = practiceCards[currentIdx]
    const updated = calculateSRS(quality, srsData[card.wort])
    const newData = { ...srsData, [card.wort]: updated }
    setSrsData(newData)
    saveSRS(newData)

    const key = quality === 0 ? 'schwer' : quality === 3 ? 'ok' : 'einfach'
    setResults((prev) => ({ ...prev, [key]: [...prev[key], card.wort] }))

    if (currentIdx >= practiceCards.length - 1) {
      setFinished(true)
      return
    }
    setRevealed(false)
    setCurrentIdx(currentIdx + 1)
    setDirection(Math.random() > 0.5 ? 'forward' : 'backward')
  }

  async function saveToLernkarten(w) {
    const { error } = await supabase.from('lernkarten').insert({
      frage: w.wort,
      antwort: w.definition,
      kategorie: 'Deutsch C1',
      mnemonik: w.beispiel,
    })
    if (error) console.error('save error:', error)
    setToast('Lernkarte gespeichert!')
    setTimeout(() => setToast(null), 2500)
  }

  function findSimilarWords(word) {
    const clean = word.replace(/^(die|der|das)\s+/, '').toLowerCase()
    const prefix = clean.substring(0, 3)
    const len = clean.length
    return C1_WOERTER
      .filter((w) => {
        if (w.wort === word) return false
        const other = w.wort.replace(/^(die|der|das)\s+/, '').toLowerCase()
        return other.startsWith(prefix) || (other[0] === clean[0] && Math.abs(other.length - len) <= 2)
      })
      .slice(0, 8)
  }

  function parseWikiGrammar(wikitext, wordType, word) {
    try {
      const cleanWord = (word || '').replace(/^(die|der|das)\s+/, '')

      // 1. Verb detection — highest priority
      const isVerb = wordType === 'Verb'
        || /Wortart\|Verb/.test(wikitext)
        || /Konjugation/.test(wikitext)
        || cleanWord.endsWith('en')
        || cleanWord.endsWith('ieren')
      if (isVerb && wordType !== 'Substantiv' && wordType !== 'Adjektiv') {
        let praesIch = null, praeteritum = null, partizipII = null
        const praesMatch = wikitext.match(/\|Präsens_ich=([^\n|]+)/)
        if (praesMatch) praesIch = praesMatch[1].trim()
        const praetMatch = wikitext.match(/\|Präteritum_ich=([^\n|]+)/)
        if (praetMatch) praeteritum = praetMatch[1].trim()
        const partMatch = wikitext.match(/\|Partizip II=([^\n|]+)/)
        if (partMatch) partizipII = partMatch[1].trim()
        return { type: 'Verb', praesIch, praeteritum, partizipII }
      }

      // 2. Adjektiv detection
      if (wordType === 'Adjektiv' || /Wortart\|Adjektiv/.test(wikitext)) {
        let komparativ = null, superlativ = null
        const kompMatch = wikitext.match(/\|Komparativ=([^\n|]+)/)
        if (kompMatch) komparativ = kompMatch[1].trim()
        const supMatch = wikitext.match(/\|Superlativ=([^\n|]+)/)
        if (supMatch) superlativ = supMatch[1].trim()
        return { type: 'Adjektiv', komparativ, superlativ }
      }

      // 3. Substantiv detection
      if (wordType === 'Substantiv' || /Wortart\|Substantiv/.test(wikitext) || /\|Genus=/.test(wikitext)) {
        let genus = null, genSg = null, nomPl = null
        const genusMatch = wikitext.match(/\|Genus=([mfn])/i)
        if (genusMatch) {
          genus = genusMatch[1] === 'm' ? 'der' : genusMatch[1] === 'f' ? 'die' : 'das'
        }
        const genSgMatch = wikitext.match(/\|Genitiv Singular=([^\n|]+)/)
        if (genSgMatch) genSg = genSgMatch[1].trim()
        const nomPlMatch = wikitext.match(/\|Nominativ Plural=([^\n|]+)/)
        if (nomPlMatch) nomPl = nomPlMatch[1].trim()
        if (genus || genSg || nomPl) {
          return { type: 'Substantiv', genus, genSg, nomPl }
        }
      }
    } catch {}
    return null
  }

  async function fetchWordData(word) {
    const clean = word.replace(/^(die|der|das)\s+/, '')
    const encoded = encodeURIComponent(clean)

    const [thesaurusRes, snippetRes, freqRes, wikiRes] = await Promise.allSettled([
      fetch(`https://www.openthesaurus.de/synonyme/search?q=${encoded}&format=application/json&similar=true`).then((r) => r.json()),
      fetch(`https://www.dwds.de/api/wb/snippet?q=${encoded}`).then((r) => r.json()),
      fetch(`https://www.dwds.de/api/frequency/?q=${encoded}`).then((r) => r.json()),
      fetch(`https://de.wiktionary.org/w/api.php?action=parse&page=${encoded}&prop=wikitext&format=json&origin=*`).then((r) => r.json()),
    ])

    const result = { synonyms: [], similarTerms: [], wortart: null, frequency: null, grammar: null }

    if (thesaurusRes.status === 'fulfilled') {
      const data = thesaurusRes.value
      result.synonyms = (data.synsets || [])
        .flatMap((s) => s.terms.map((t) => t.term))
        .filter((t, i, arr) => arr.indexOf(t) === i)
        .slice(0, 10)
      result.similarTerms = (data.similarterms || []).map((t) => t.term).slice(0, 5)
    }

    if (snippetRes.status === 'fulfilled' && Array.isArray(snippetRes.value) && snippetRes.value.length > 0) {
      result.wortart = snippetRes.value[0].pos || null
    }

    if (freqRes.status === 'fulfilled' && freqRes.value?.frequency !== undefined) {
      result.frequency = freqRes.value.frequency
    }

    if (wikiRes.status === 'fulfilled' && wikiRes.value?.parse?.wikitext?.['*']) {
      const wikitext = wikiRes.value.parse.wikitext['*']
      result.grammar = parseWikiGrammar(wikitext, result.wortart, word)
    }

    return result
  }

  function updateStack(newStack, newIdx) {
    stackRef.current = { stack: newStack, idx: newIdx }
    setWordStack(newStack)
    setStackIdx(newIdx)
  }

  async function openDetail(w) {
    const wordObj = typeof w === 'string'
      ? C1_WOERTER.find((c) => c.wort === w) || { wort: w, definition: '', beispiel: '' }
      : w
    setSlideDir('right')
    updateStack([wordObj], 0)
    setDetailLoading(true)
    setGrammarLoading(true)
    const data = await fetchWordData(wordObj.wort)
    setStackData({ [wordObj.wort]: data })
    setDetailLoading(false)
    setGrammarLoading(false)
  }

  async function navigateToWord(word) {
    const wordObj = C1_WOERTER.find((c) => c.wort === word) || { wort: word, definition: '', beispiel: '' }
    setSlideDir('right')
    const { stack, idx } = stackRef.current
    const newStack = [...stack.slice(0, idx + 1), wordObj]
    const newIdx = newStack.length - 1
    updateStack(newStack, newIdx)
    if (!stackData[word]) {
      setDetailLoading(true)
      setGrammarLoading(true)
      const data = await fetchWordData(word)
      setStackData((prev) => ({ ...prev, [word]: data }))
      setDetailLoading(false)
      setGrammarLoading(false)
    }
  }

  function goBack() {
    const { idx } = stackRef.current
    if (idx > 0) {
      setSlideDir('left')
      updateStack(stackRef.current.stack, idx - 1)
    }
  }

  function goForward() {
    const { stack, idx } = stackRef.current
    if (idx < stack.length - 1) {
      setSlideDir('right')
      updateStack(stack, idx + 1)
    }
  }

  function jumpTo(i) {
    const { idx } = stackRef.current
    setSlideDir(i > idx ? 'right' : 'left')
    updateStack(stackRef.current.stack, i)
  }

  function closeDetail() {
    updateStack([], -1)
    setStackData({})
  }

  const detailWord = wordStack[stackIdx] || null
  const currentData = detailWord ? stackData[detailWord.wort] : null
  const isInC1List = detailWord ? C1_WOERTER.some((c) => c.wort === detailWord.wort) : false

  // Filter for browse mode
  const searchLower = search.toLowerCase()
  const filtered = search
    ? C1_WOERTER.filter((w) =>
        w.wort.toLowerCase().includes(searchLower) ||
        w.definition.toLowerCase().includes(searchLower)
      )
    : C1_WOERTER

  // Practice mode - active card
  const current = practiceCards[currentIdx]
  const total = practiceCards.length
  const progress = total > 0 ? ((currentIdx + (revealed ? 1 : 0)) / total) * 100 : 0
  const intervals = current ? previewIntervals(srsData[current.wort]) : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
      >
        ← Zurück zur Übersicht
      </button>

      <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Deutsch C1
      </h1>
      <p className="text-center text-slate-400 mb-2">
        Wortschatz systematisch lernen
      </p>
      <p className="text-center text-slate-500 text-sm mb-8">
        {C1_WOERTER.length} Wörter · {learnedCount} gelernt · {dueCount} heute fällig
      </p>

      {/* Tab selector */}
      <div className="flex gap-2 justify-center mb-8">
        <button
          onClick={() => setTab('lernen')}
          className={`px-5 py-2.5 rounded-lg font-medium transition cursor-pointer ${
            tab === 'lernen'
              ? 'bg-blue-600 text-white'
              : 'bg-[#12122a] border border-[#2a2a4a] text-slate-400 hover:border-blue-500/50'
          }`}
        >
          📖 Lernen
        </button>
        <button
          onClick={() => dueCount > 0 ? startPractice() : null}
          className={`px-5 py-2.5 rounded-lg font-medium transition cursor-pointer ${
            tab === 'ueben'
              ? 'bg-blue-600 text-white'
              : dueCount > 0
                ? 'bg-[#12122a] border border-[#2a2a4a] text-slate-400 hover:border-blue-500/50'
                : 'bg-[#12122a] border border-[#2a2a4a] text-slate-600 cursor-not-allowed'
          }`}
        >
          🎯 Üben {dueCount > 0 && `(${dueCount})`}
        </button>
      </div>

      {/* LERNEN TAB */}
      {tab === 'lernen' && (
        <>
          <div className="relative mb-6">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              placeholder="Wort oder Definition suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
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
            <p className="text-sm text-slate-400 mb-4">{filtered.length} Wörter gefunden</p>
          )}

          <div className="space-y-3">
            {filtered.map((w) => {
              const srs = srsData[w.wort]
              const due = isDue(srs)
              return (
                <div key={w.wort} onClick={() => openDetail(w)} className="p-5 rounded-xl bg-[#12122a] border border-[#1e1e3a] group cursor-pointer hover:border-blue-500/30 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-lg font-bold text-blue-300 mb-1">{w.wort}</div>
                      <div className="text-slate-200 text-sm mb-2">{w.definition}</div>
                      <div className="text-slate-500 text-sm italic">{w.beispiel}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {srs?.repetitions > 0 ? (
                        due
                          ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">Fällig</span>
                          : <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e1e3a] text-slate-500">Gelernt</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">Neu</span>
                      )}
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

      {/* ÜBEN TAB */}
      {tab === 'ueben' && (
        <>
          {dueCount === 0 || practiceCards.length === 0 ? (
            <div className="p-12 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-slate-200 mb-2">Alle Wörter für heute erledigt!</h2>
              <p className="text-slate-400 mb-6">{learnedCount} / {C1_WOERTER.length} Wörter gelernt</p>
              <button
                onClick={() => setTab('lernen')}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition cursor-pointer"
              >
                Wörter durchstöbern
              </button>
            </div>
          ) : finished ? (
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

              {results.schwer.length > 0 && (
                <div className="text-left mb-8">
                  <h3 className="text-slate-400 text-sm font-medium mb-3">Schwere Wörter:</h3>
                  <ul className="space-y-2">
                    {results.schwer.map((wort) => (
                      <li key={wort} className="text-slate-300 text-sm p-2 rounded-lg bg-red-600/10 border border-red-500/20">
                        {wort}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={startPractice}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition cursor-pointer"
                >
                  Weiter üben
                </button>
                <button
                  onClick={() => setTab('lernen')}
                  className="px-6 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer"
                >
                  Zurück
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 text-sm">
                  {currentIdx + 1} / {total}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                  {direction === 'forward' ? 'Wort → Definition' : 'Definition → Wort'}
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-[#1e1e3a] mb-6 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center mb-8">
                {direction === 'forward' ? (
                  <>
                    <div className="text-2xl font-bold text-blue-300 mb-6">{current.wort}</div>
                    {revealed ? (
                      <div className="space-y-3">
                        <div className="text-xl text-slate-100">{current.definition}</div>
                        <div className="text-slate-500 text-sm italic">{current.beispiel}</div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRevealed(true)}
                        className="px-8 py-3 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition cursor-pointer text-lg"
                      >
                        Definition aufdecken
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-lg text-slate-200 mb-6">{current.definition}</div>
                    {revealed ? (
                      <div className="space-y-3">
                        <div className="text-2xl font-bold text-blue-300">{current.wort}</div>
                        <div className="text-slate-500 text-sm italic">{current.beispiel}</div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRevealed(true)}
                        className="px-8 py-3 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition cursor-pointer text-lg"
                      >
                        Wort aufdecken
                      </button>
                    )}
                  </>
                )}
              </div>

              {revealed && intervals && (
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => handleSRSAnswer(0)}
                    className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition cursor-pointer text-center"
                  >
                    <div>😰 Schwer</div>
                    <div className="text-xs opacity-70 mt-0.5">→ {intervals.schwer}</div>
                  </button>
                  <button
                    onClick={() => handleSRSAnswer(3)}
                    className="flex-1 px-4 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-medium transition cursor-pointer text-center"
                  >
                    <div>😐 Ok</div>
                    <div className="text-xs opacity-70 mt-0.5">→ {intervals.ok}</div>
                  </button>
                  <button
                    onClick={() => handleSRSAnswer(5)}
                    className="flex-1 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition cursor-pointer text-center"
                  >
                    <div>😊 Einfach</div>
                    <div className="text-xs opacity-70 mt-0.5">→ {intervals.einfach}</div>
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Detail Modal */}
      {detailWord && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={closeDetail}>
          <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-xl bg-[#12122a] border border-[#1e1e3a]" onClick={(e) => e.stopPropagation()}>
            {/* Navigation bar */}
            <div className="p-4 border-b border-[#1e1e3a] shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={goBack}
                    disabled={stackIdx <= 0}
                    className="text-xs px-2 py-1 rounded text-slate-400 hover:bg-[#1e1e3a] disabled:opacity-30 disabled:cursor-default transition cursor-pointer"
                  >
                    ← Zurück
                  </button>
                  <button
                    onClick={goForward}
                    disabled={stackIdx >= wordStack.length - 1}
                    className="text-xs px-2 py-1 rounded text-slate-400 hover:bg-[#1e1e3a] disabled:opacity-30 disabled:cursor-default transition cursor-pointer"
                  >
                    Weiter →
                  </button>
                  <span className="text-xs text-slate-600 ml-1">{stackIdx + 1} / {wordStack.length}</span>
                </div>
                <button
                  onClick={closeDetail}
                  className="text-slate-500 hover:text-slate-300 transition cursor-pointer text-xl leading-none"
                >
                  ×
                </button>
              </div>
              {wordStack.length > 1 && (
                <div className="flex items-center gap-1 flex-wrap text-xs">
                  {wordStack.map((w, i) => (
                    <span key={i} className="flex items-center">
                      {i > 0 && <span className="text-slate-600 mx-1">→</span>}
                      <button
                        onClick={() => jumpTo(i)}
                        className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                          i === stackIdx
                            ? 'text-blue-300 bg-blue-500/20'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {w.wort.replace(/^(die|der|das)\s+/, '')}
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content area with slide animation */}
            <div
              className={`overflow-y-auto p-6 space-y-5 ${slideDir === 'right' ? 'slide-right' : 'slide-left'}`}
              key={`${detailWord.wort}-${stackIdx}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-2xl font-bold text-blue-300">{detailWord.wort}</div>
                {!isInC1List && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 shrink-0">nicht in C1 Liste</span>
                )}
              </div>

              {!detailLoading && currentData && (currentData.wortart || currentData.frequency !== null) && (
                <div className="flex flex-wrap items-center gap-2">
                  {currentData.wortart && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300">
                      {currentData.wortart === 'Substantiv' ? '📚' : currentData.wortart === 'Verb' ? '🔤' : currentData.wortart === 'Adjektiv' ? '🎨' : '📝'} {currentData.wortart}
                    </span>
                  )}
                  {currentData.frequency !== null && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#1e1e3a] text-slate-300 flex items-center gap-1.5">
                      Häufigkeit: <span className="font-mono tracking-tight">{('█').repeat(Math.max(1, currentData.frequency))}{'░'.repeat(Math.max(0, 6 - currentData.frequency))}</span>
                      <span className="text-slate-500">({currentData.frequency}/6 · {currentData.frequency <= 1 ? 'sehr selten' : currentData.frequency <= 2 ? 'selten' : currentData.frequency <= 3 ? 'mittel' : currentData.frequency <= 4 ? 'häufig' : 'sehr häufig'})</span>
                    </span>
                  )}
                </div>
              )}

              {detailWord.definition && <div className="text-slate-200">{detailWord.definition}</div>}
              {detailWord.beispiel && <div className="text-slate-500 text-sm italic">{detailWord.beispiel}</div>}

              <div>
                <h3 className="text-slate-400 text-sm font-medium mb-2">Grammatik</h3>
                {grammarLoading ? (
                  <div className="text-slate-500 text-sm">Lade...</div>
                ) : currentData?.grammar ? (
                  <div className="p-3 rounded-lg bg-[#0a0a1a] text-sm space-y-1">
                    {currentData.grammar.type === 'Substantiv' && (
                      <div className="text-slate-200">
                        <span className="mr-1">{currentData.grammar.genus === 'der' ? '🟢' : currentData.grammar.genus === 'die' ? '🔵' : currentData.grammar.genus === 'das' ? '🟡' : '⚪'}</span>
                        {currentData.grammar.genus && <span className="font-medium">{currentData.grammar.genus} </span>}
                        {detailWord.wort.replace(/^(die|der|das)\s+/, '')}
                        {currentData.grammar.genSg && <><span className="text-slate-400 mx-2">|</span>Gen: <span className="text-slate-300">{currentData.grammar.genSg}</span></>}
                        {currentData.grammar.nomPl && <><span className="text-slate-400 mx-2">|</span>Pl: <span className="text-slate-300">{currentData.grammar.nomPl}</span></>}
                      </div>
                    )}
                    {currentData.grammar.type === 'Verb' && (
                      <div className="text-slate-200">
                        <span className="text-slate-400 mr-1">⚫</span>
                        <span className="font-medium">{detailWord.wort.replace(/^(die|der|das)\s+/, '')}</span>
                        {currentData.grammar.praesIch && <><span className="text-slate-400 mx-2">|</span>ich {currentData.grammar.praesIch}</>}
                        {currentData.grammar.praeteritum && <><span className="text-slate-400 mx-2">|</span>Prät: {currentData.grammar.praeteritum}</>}
                        {currentData.grammar.partizipII && <><span className="text-slate-400 mx-2">|</span>Part. II: <span className="text-slate-300">{currentData.grammar.partizipII}</span></>}
                      </div>
                    )}
                    {currentData.grammar.type === 'Adjektiv' && (
                      <div className="text-slate-200">
                        <span className="text-yellow-400 mr-1">🟡</span>
                        <span className="font-medium">{detailWord.wort.replace(/^(die|der|das)\s+/, '')}</span>
                        {currentData.grammar.komparativ && <><span className="text-slate-400 mx-2">|</span><span className="text-slate-300">{currentData.grammar.komparativ}</span></>}
                        {currentData.grammar.superlativ && <><span className="text-slate-400 mx-2">|</span>am <span className="text-slate-300">{currentData.grammar.superlativ}en</span></>}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={`https://de.wiktionary.org/wiki/${encodeURIComponent(detailWord.wort.replace(/^(die|der|das)\s+/, ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 text-sm hover:underline"
                  >
                    Im Wiktionary nachschlagen →
                  </a>
                )}
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-600">
                  <span>🔵 die (Fem.)</span>
                  <span>🟢 der (Mask.)</span>
                  <span>🟡 das (Neutr.)</span>
                  <span>⚫ Verb</span>
                  <span>🟡 Adjektiv</span>
                </div>
              </div>

              <div>
                <h3 className="text-slate-400 text-sm font-medium mb-2">Synonyme</h3>
                {detailLoading ? (
                  <div className="text-slate-500 text-sm">Lade...</div>
                ) : currentData?.synonyms?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentData.synonyms.map((s) => (
                      <button
                        key={s}
                        onClick={() => navigateToWord(s)}
                        className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-600 text-sm">Keine Synonyme gefunden</div>
                )}
              </div>

              {!detailLoading && currentData?.similarTerms?.length > 0 && (
                <div>
                  <h3 className="text-slate-400 text-sm font-medium mb-2">Ähnliche Begriffe (OpenThesaurus)</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentData.similarTerms.map((s) => (
                      <button
                        key={s}
                        onClick={() => navigateToWord(s)}
                        className="text-xs px-2.5 py-1 rounded-full bg-[#1e1e3a] text-slate-400 hover:bg-[#2a2a4a] hover:text-slate-200 transition cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-slate-400 text-sm font-medium mb-2">Ähnlich klingende Wörter</h3>
                {(() => {
                  const similar = findSimilarWords(detailWord.wort)
                  return similar.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {similar.map((w) => (
                        <button
                          key={w.wort}
                          onClick={() => navigateToWord(w.wort)}
                          className="text-xs px-2.5 py-1 rounded-full bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer"
                        >
                          {w.wort}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-600 text-sm">Keine ähnlichen Wörter gefunden</div>
                  )
                })()}
              </div>

              <div className="pt-2 flex items-center gap-3">
                {isInC1List && (
                  <button
                    onClick={(e) => { e.stopPropagation(); saveToLernkarten(detailWord) }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition cursor-pointer"
                  >
                    💾 Als Lernkarte speichern
                  </button>
                )}
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
