import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { laender } from '../data/geographieData'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const ROUND_SIZE = 10
const TABS = ['Hauptstädte', 'Flaggen', 'Karte']
const KONTINENTE = ['Alle Kontinente', 'Europa', 'Asien', 'Afrika', 'Amerika', 'Ozeanien']

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
    if (showCorrect && geoName === current.name) return '#22c55e'
    if (clickedGeo === geoName && geoName !== current.name) return '#ef4444'
    if (clickedGeo === null && geoName === current.name) return '#f97316'
    if (clickedGeo !== null && geoName === current.name && !showCorrect) return '#f97316'
    return '#334155'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d24] to-[#050510] px-4 pt-14 pb-6">
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

        {/* Kontinent filter */}
        <div className="flex flex-wrap gap-2 mb-6">
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
        </div>

        {questions.length === 0 ? (
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
                <div className="rounded-xl overflow-hidden border border-[#1e1e3a] bg-[#0a0a1a]" style={{ height: 400 }}>
                  <ComposableMap
                    projectionConfig={{ scale: 147 }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <ZoomableGroup>
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
                  <p className="text-slate-500 text-xs mt-2">Klicke auf das orange markierte Land oder suche es auf der Karte.</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
