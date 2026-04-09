import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { laender } from '../data/geographieData'
import { alleLaender } from '../data/alleLaender'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const ROUND_SIZE = 10
const TABS = ['Hauptstädte', 'Flaggen', 'Karte', 'Alle Länder']
const KONTINENTE = ['Alle Kontinente', 'Europa', 'Asien', 'Afrika', 'Amerika', 'Ozeanien']
const TIMER_OPTIONS = [
  { label: '5 Min', seconds: 300 },
  { label: '10 Min', seconds: 600 },
  { label: '15 Min', seconds: 900 },
  { label: 'Unbegrenzt', seconds: 0 },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickOptions(correct, pool, key, count = 4) {
  const others = shuffle(pool.filter((l) => l[key] !== correct[key])).slice(0, count - 1)
  return shuffle([correct, ...others])
}

export default function Geographie() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('Hauptstädte')
  const [kontinent, setKontinent] = useState('Alle Kontinente')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [roundKey, setRoundKey] = useState(0)
  // Karte mode state
  const [clickedGeo, setClickedGeo] = useState(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [mapZoom, setMapZoom] = useState(1)
  const [mapCenter, setMapCenter] = useState([0, 20])

  // Alle Länder mode state
  const [alInput, setAlInput] = useState('')
  const [alFound, setAlFound] = useState(new Set())
  const [alStarted, setAlStarted] = useState(false)
  const [alDone, setAlDone] = useState(false)
  const [alTimerOption, setAlTimerOption] = useState(null)
  const [alElapsed, setAlElapsed] = useState(0)
  const alInputRef = useRef(null)
  const alTimerRef = useRef(null)
  const alFoundMapNames = useMemo(() => {
    const names = new Set()
    alFound.forEach((de) => {
      const entry = alleLaender.find((l) => l.de === de)
      if (entry) names.add(entry.name)
    })
    return names
  }, [alFound])

  const pool = useMemo(() => {
    return kontinent === 'Alle Kontinente' ? laender : laender.filter((l) => l.kontinent === kontinent)
  }, [kontinent])

  const questions = useMemo(() => {
    return shuffle(pool).slice(0, ROUND_SIZE)
  }, [pool, roundKey])

  const done = index >= questions.length
  const current = questions[index]

  const options = useMemo(() => {
    if (done || tab === 'Karte') return []
    if (tab === 'Hauptstädte') return pickOptions(current, laender, 'hauptstadt')
    return pickOptions(current, laender, 'de')
  }, [index, questions, done, tab])

  function reset() {
    setSelected(null)
    setClickedGeo(null)
    setShowCorrect(false)
    setIndex(0)
    setScore(0)
    setRoundKey((k) => k + 1)
  }

  function handleFilterChange(k) {
    setKontinent(k)
    reset()
  }

  function handleTabChange(t) {
    setTab(t)
    reset()
  }

  function handleSelect(opt) {
    if (selected !== null) return
    setSelected(opt)
    const correct = tab === 'Hauptstädte' ? current.hauptstadt : current.de
    if ((tab === 'Hauptstädte' && opt.hauptstadt === correct) || (tab === 'Flaggen' && opt.de === correct)) {
      setScore((s) => s + 1)
    }
  }

  function handleNext() {
    setSelected(null)
    setClickedGeo(null)
    setShowCorrect(false)
    setIndex((i) => i + 1)
  }

  // Karte click handler
  const handleGeoClick = useCallback((geo) => {
    if (done || clickedGeo !== null) return
    const clickedName = geo.properties.name
    setClickedGeo(clickedName)
    if (clickedName === current.name) {
      setScore((s) => s + 1)
      setShowCorrect(true)
    } else {
      setTimeout(() => setShowCorrect(true), 800)
    }
  }, [done, clickedGeo, current])

  function getGeoFill(geoName) {
    if (!current) return '#334155'
    if (tab !== 'Karte') return '#334155'
    // After answer: show correct country in green
    if (showCorrect && geoName === current.name) return '#22c55e'
    // Wrong click: flash red (before showCorrect reveals green)
    if (clickedGeo === geoName && geoName !== current.name && !showCorrect) return '#ef4444'
    // No pre-highlighting — user must find the country blind
    return '#334155'
  }

  // Alle Länder: start game
  function alStart(timerOpt) {
    setAlTimerOption(timerOpt)
    setAlFound(new Set())
    setAlInput('')
    setAlElapsed(0)
    setAlDone(false)
    setAlStarted(true)
    clearInterval(alTimerRef.current)
    alTimerRef.current = setInterval(() => {
      setAlElapsed((prev) => {
        const next = prev + 1
        if (timerOpt.seconds > 0 && next >= timerOpt.seconds) {
          clearInterval(alTimerRef.current)
          setAlDone(true)
        }
        return next
      })
    }, 1000)
    setTimeout(() => alInputRef.current?.focus(), 100)
  }

  function alReset() {
    clearInterval(alTimerRef.current)
    setAlStarted(false)
    setAlDone(false)
    setAlFound(new Set())
    setAlInput('')
    setAlElapsed(0)
    setAlTimerOption(null)
  }

  // Check if input matches any country
  function alHandleInput(val) {
    setAlInput(val)
    const lower = val.trim().toLowerCase()
    if (!lower) return
    for (const entry of alleLaender) {
      if (alFound.has(entry.de)) continue
      const matches = [entry.de, ...entry.aliases]
      if (matches.some((m) => m.toLowerCase() === lower)) {
        setAlFound((prev) => new Set([...prev, entry.de]))
        setAlInput('')
        // Check if all found
        if (alFound.size + 1 >= alleLaender.length) {
          clearInterval(alTimerRef.current)
          setAlDone(true)
        }
        return
      }
    }
  }

  // Cleanup timer
  useEffect(() => () => clearInterval(alTimerRef.current), [])

  // Reset alleländer when switching tabs
  useEffect(() => { if (tab !== 'Alle Länder') alReset() }, [tab])

  function getAlGeoFill(geoName) {
    if (alFoundMapNames.has(geoName)) return '#22c55e'
    return '#334155'
  }

  function formatTime(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const alSorted = useMemo(() => [...alFound].sort((a, b) => a.localeCompare(b, 'de')), [alFound])
  const alMissed = useMemo(() => alleLaender.filter((l) => !alFound.has(l.de)).map((l) => l.de).sort((a, b) => a.localeCompare(b, 'de')), [alFound])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d24] to-[#050510] px-4 pb-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-200 text-sm mb-4 inline-block transition">
          ← Zurück
        </button>

        <h1 className="text-3xl font-bold text-slate-100 mb-2">Geographie</h1>
        <p className="text-slate-400 mb-5">Hauptstädte, Flaggen & Weltkarte</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                tab === t ? 'bg-cyan-600 text-white' : 'bg-[#1e1e3a] text-slate-400 hover:text-slate-200 hover:bg-[#2a2a4a]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Kontinent filter (not for Alle Länder) */}
        {tab !== 'Alle Länder' && <div className="flex flex-wrap gap-2 mb-6">
          {KONTINENTE.map((k) => (
            <button
              key={k}
              onClick={() => handleFilterChange(k)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                kontinent === k ? 'bg-slate-600 text-white' : 'bg-[#1e1e3a] text-slate-500 hover:text-slate-300 hover:bg-[#2a2a4a]'
              }`}
            >
              {k}
            </button>
          ))}
        </div>}

        {tab !== 'Alle Länder' && (questions.length === 0 ? (
          <p className="text-slate-500 text-center py-12">Keine Länder für diesen Filter.</p>
        ) : done ? (
          <div className="bg-[#12122a] border border-[#1e1e3a] rounded-xl p-10 text-center">
            <div className="text-5xl mb-4">
              {score === questions.length ? '🎉' : score >= questions.length * 0.7 ? '🌍' : '📚'}
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              {score} / {questions.length} richtig
            </h2>
            <p className="text-slate-400 mb-6">
              {score === questions.length ? 'Perfekt!' : score >= questions.length * 0.7 ? 'Gut gemacht!' : 'Weiter üben!'}
            </p>
            <button onClick={reset} className="px-6 py-2.5 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500 transition">
              Nochmal
            </button>
          </div>
        ) : (
          <div className="bg-[#12122a] border border-[#1e1e3a] rounded-xl p-6">
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-500">{index + 1} / {questions.length}</span>
              <span className="text-xs text-cyan-400 font-medium">{score} richtig</span>
            </div>

            {/* === HAUPTSTÄDTE === */}
            {tab === 'Hauptstädte' && (
              <>
                <p className="text-slate-300 text-sm mb-1">Was ist die Hauptstadt von:</p>
                <div className="flex items-center gap-3 mb-6">
                  <img src={`https://flagcdn.com/w40/${current.flagge}.png`} alt={current.de} style={{width:40,height:'auto',borderRadius:4}} />
                  <h3 className="text-2xl font-bold text-cyan-300">{current.de}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {options.map((opt) => {
                    let cls = 'bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 hover:border-cyan-500/50 hover:bg-[#16163a]'
                    if (selected !== null) {
                      if (opt.hauptstadt === current.hauptstadt) cls = 'bg-green-600/20 border border-green-500 text-green-300'
                      else if (opt === selected) cls = 'bg-red-600/20 border border-red-500 text-red-300'
                      else cls = 'bg-[#0a0a1a] border border-[#1e1e3a] text-slate-500'
                    }
                    return (
                      <button key={opt.hauptstadt} onClick={() => handleSelect(opt)} disabled={selected !== null}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition cursor-pointer disabled:cursor-default ${cls}`}>
                        {opt.hauptstadt}
                      </button>
                    )
                  })}
                </div>
                {selected !== null && (
                  <div className="flex items-center justify-between mt-4">
                    <p className={`text-sm font-medium ${selected.hauptstadt === current.hauptstadt ? 'text-green-400' : 'text-red-400'}`}>
                      {selected.hauptstadt === current.hauptstadt ? 'Richtig!' : `Falsch — richtig: ${current.hauptstadt}`}
                    </p>
                    <button onClick={handleNext} className="px-5 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-500 transition">Weiter</button>
                  </div>
                )}
              </>
            )}

            {/* === FLAGGEN === */}
            {tab === 'Flaggen' && (
              <>
                <p className="text-slate-300 text-sm mb-3">Welches Land hat diese Flagge?</p>
                <img src={`https://flagcdn.com/w160/${current.flagge}.png`} alt={current.de} style={{width:160,height:'auto',borderRadius:6,marginBottom:'1rem'}} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {options.map((opt) => {
                    let cls = 'bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 hover:border-cyan-500/50 hover:bg-[#16163a]'
                    if (selected !== null) {
                      if (opt.de === current.de) cls = 'bg-green-600/20 border border-green-500 text-green-300'
                      else if (opt === selected) cls = 'bg-red-600/20 border border-red-500 text-red-300'
                      else cls = 'bg-[#0a0a1a] border border-[#1e1e3a] text-slate-500'
                    }
                    return (
                      <button key={opt.de} onClick={() => handleSelect(opt)} disabled={selected !== null}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition cursor-pointer disabled:cursor-default ${cls}`}>
                        {opt.de}
                      </button>
                    )
                  })}
                </div>
                {selected !== null && (
                  <div className="flex items-center justify-between mt-4">
                    <p className={`text-sm font-medium ${selected.de === current.de ? 'text-green-400' : 'text-red-400'}`}>
                      {selected.de === current.de ? 'Richtig!' : `Falsch — richtig: ${current.de}`}
                    </p>
                    <button onClick={handleNext} className="px-5 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-500 transition">Weiter</button>
                  </div>
                )}
              </>
            )}

            {/* === KARTE === */}
            {tab === 'Karte' && (
              <>
                <p className="text-slate-300 text-sm mb-1">Finde dieses Land auf der Karte:</p>
                <div className="flex items-center gap-3 mb-4">
                  <img src={`https://flagcdn.com/w40/${current.flagge}.png`} alt={current.de} style={{width:40,height:'auto',borderRadius:4}} />
                  <h3 className="text-2xl font-bold text-orange-400">{current.de}</h3>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-[#1e1e3a] bg-[#0a0a1a]" style={{ height: 400 }}>
                  <ComposableMap
                    projectionConfig={{ scale: 147 }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <ZoomableGroup
                      zoom={mapZoom}
                      center={mapCenter}
                      minZoom={1}
                      maxZoom={8}
                      onMoveEnd={({ zoom, coordinates }) => { setMapZoom(zoom); setMapCenter(coordinates) }}
                    >
                      <Geographies geography={GEO_URL}>
                        {({ geographies }) =>
                          geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onClick={() => handleGeoClick(geo)}
                              style={{
                                default: { fill: getGeoFill(geo.properties.name), stroke: '#1e1e3a', strokeWidth: 0.5, outline: 'none' },
                                hover: { fill: clickedGeo === null && geo.properties.name !== current.name ? '#475569' : getGeoFill(geo.properties.name), stroke: '#1e1e3a', strokeWidth: 0.5, outline: 'none', cursor: clickedGeo === null ? 'pointer' : 'default' },
                                pressed: { fill: getGeoFill(geo.properties.name), stroke: '#1e1e3a', strokeWidth: 0.5, outline: 'none' },
                              }}
                            />
                          ))
                        }
                      </Geographies>
                    </ZoomableGroup>
                  </ComposableMap>
                  {/* Zoom controls */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1">
                    <button
                      onClick={() => setMapZoom((z) => Math.min(z * 1.5, 8))}
                      className="w-8 h-8 rounded-lg bg-[#12122a]/90 border border-[#2a2a4a] text-slate-300 hover:text-white hover:bg-[#1e1e3a] text-sm font-bold transition"
                    >+</button>
                    <button
                      onClick={() => setMapZoom((z) => Math.max(z / 1.5, 1))}
                      className="w-8 h-8 rounded-lg bg-[#12122a]/90 border border-[#2a2a4a] text-slate-300 hover:text-white hover:bg-[#1e1e3a] text-sm font-bold transition"
                    >−</button>
                    <button
                      onClick={() => { setMapZoom(1); setMapCenter([0, 20]) }}
                      className="w-8 h-8 rounded-lg bg-[#12122a]/90 border border-[#2a2a4a] text-slate-300 hover:text-white hover:bg-[#1e1e3a] text-xs transition"
                      title="Zurücksetzen"
                    >⌂</button>
                  </div>
                </div>
                {clickedGeo !== null && (
                  <div className="flex items-center justify-between mt-4">
                    <p className={`text-sm font-medium ${clickedGeo === current.name ? 'text-green-400' : 'text-red-400'}`}>
                      {clickedGeo === current.name ? 'Richtig!' : `Falsch — das war ${clickedGeo}`}
                    </p>
                    {showCorrect && (
                      <button onClick={handleNext} className="px-5 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-500 transition">Weiter</button>
                    )}
                  </div>
                )}
                {clickedGeo === null && (
                  <p className="text-slate-500 text-xs mt-2">Klicke auf das Land auf der Karte. Zoome mit +/− oder Scrollrad.</p>
                )}
              </>
            )}
          </div>
        ))}

        {/* === ALLE LÄNDER === */}
        {tab === 'Alle Länder' && (
          <>
            {!alStarted ? (
              <div className="bg-[#12122a] border border-[#1e1e3a] rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">🌍</div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">Alle Länder tippen</h2>
                <p className="text-slate-400 text-sm mb-6">Wie viele der {alleLaender.length} Länder kannst du aus dem Kopf?</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {TIMER_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => alStart(opt)}
                      className="px-5 py-2.5 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500 transition"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : alDone ? (
              <div className="bg-[#12122a] border border-[#1e1e3a] rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">{alFound.size >= alleLaender.length ? '🎉' : alFound.size >= 100 ? '🌍' : '📚'}</div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">{alFound.size} / {alleLaender.length} Länder</h2>
                <p className="text-slate-400 mb-1">Zeit: {formatTime(alElapsed)}</p>
                <p className="text-slate-400 mb-6">{alFound.size >= alleLaender.length ? 'Perfekt — alle gefunden!' : alFound.size >= 150 ? 'Beeindruckend!' : alFound.size >= 100 ? 'Gut gemacht!' : 'Weiter üben!'}</p>
                <button onClick={alReset} className="px-6 py-2.5 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500 transition mb-6">
                  Nochmal
                </button>
                {alMissed.length > 0 && (
                  <div className="mt-4 text-left">
                    <p className="text-sm text-red-400 font-medium mb-2">Fehlende Länder ({alMissed.length}):</p>
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                      {alMissed.map((name) => (
                        <span key={name} className="px-2 py-0.5 rounded text-xs bg-red-500/10 text-red-400">{name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header: timer + progress */}
                <div className="flex items-center justify-between bg-[#12122a] border border-[#1e1e3a] rounded-xl px-5 py-3">
                  <div className="flex items-center gap-4">
                    <span className="text-cyan-400 font-mono text-lg font-bold">{formatTime(alElapsed)}</span>
                    {alTimerOption.seconds > 0 && (
                      <span className="text-slate-500 text-xs">/ {formatTime(alTimerOption.seconds)}</span>
                    )}
                  </div>
                  <span className="text-slate-300 text-sm font-medium">{alFound.size} / {alleLaender.length} Länder</span>
                  <button onClick={() => { clearInterval(alTimerRef.current); setAlDone(true) }} className="text-xs text-slate-500 hover:text-red-400 transition">Beenden</button>
                </div>

                {/* Input */}
                <input
                  ref={alInputRef}
                  type="text"
                  placeholder="Land eingeben..."
                  value={alInput}
                  onChange={(e) => alHandleInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#12122a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 text-lg focus:outline-none focus:border-cyan-500 transition"
                  autoComplete="off"
                />

                {/* Map */}
                <div className="relative rounded-xl overflow-hidden border border-[#1e1e3a] bg-[#0a0a1a]" style={{ height: 350 }}>
                  <ComposableMap projectionConfig={{ scale: 147 }} style={{ width: '100%', height: '100%' }}>
                    <ZoomableGroup zoom={mapZoom} center={mapCenter} minZoom={1} maxZoom={8}
                      onMoveEnd={({ zoom, coordinates }) => { setMapZoom(zoom); setMapCenter(coordinates) }}>
                      <Geographies geography={GEO_URL}>
                        {({ geographies }) =>
                          geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              style={{
                                default: { fill: getAlGeoFill(geo.properties.name), stroke: '#1e1e3a', strokeWidth: 0.5, outline: 'none' },
                                hover: { fill: getAlGeoFill(geo.properties.name) === '#22c55e' ? '#22c55e' : '#475569', stroke: '#1e1e3a', strokeWidth: 0.5, outline: 'none' },
                                pressed: { fill: getAlGeoFill(geo.properties.name), stroke: '#1e1e3a', strokeWidth: 0.5, outline: 'none' },
                              }}
                            />
                          ))
                        }
                      </Geographies>
                    </ZoomableGroup>
                  </ComposableMap>
                  <div className="absolute top-3 right-3 flex flex-col gap-1">
                    <button onClick={() => setMapZoom((z) => Math.min(z * 1.5, 8))} className="w-8 h-8 rounded-lg bg-[#12122a]/90 border border-[#2a2a4a] text-slate-300 hover:text-white hover:bg-[#1e1e3a] text-sm font-bold transition">+</button>
                    <button onClick={() => setMapZoom((z) => Math.max(z / 1.5, 1))} className="w-8 h-8 rounded-lg bg-[#12122a]/90 border border-[#2a2a4a] text-slate-300 hover:text-white hover:bg-[#1e1e3a] text-sm font-bold transition">−</button>
                    <button onClick={() => { setMapZoom(1); setMapCenter([0, 20]) }} className="w-8 h-8 rounded-lg bg-[#12122a]/90 border border-[#2a2a4a] text-slate-300 hover:text-white hover:bg-[#1e1e3a] text-xs transition" title="Zurücksetzen">⌂</button>
                  </div>
                </div>

                {/* Found countries */}
                {alSorted.length > 0 && (
                  <div className="bg-[#12122a] border border-[#1e1e3a] rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-2">Gefunden:</p>
                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                      {alSorted.map((name) => (
                        <span key={name} className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-400">{name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
