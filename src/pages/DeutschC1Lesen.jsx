import { useState, useMemo, Fragment } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LESEN_C1 } from '../data/leseTexteC1'

// Goethe C1 Leseverstehen — Prüfungssimulation mit 4 Teilen.
// Ablauf: Übungssatz wählen → Teil 1–4 nacheinander → Auswertung.

const TEIL_INFO = [
  { key: 'teil1', label: 'Teil 1', kurz: 'Lückentext', emoji: '🧩' },
  { key: 'teil2', label: 'Teil 2', kurz: 'Multiple Choice', emoji: '📄' },
  { key: 'teil3', label: 'Teil 3', kurz: 'Zuordnung', emoji: '🔀' },
  { key: 'teil4', label: 'Teil 4', kurz: 'Meinungen', emoji: '💬' },
]

const POS_LABEL = { positiv: '👍 positiv', negativ: '👎 negativ', neutral: '😐 neutral' }

const CARD = 'rounded-2xl bg-[#12122a] border border-[#1e1e3a]'

export default function DeutschC1Lesen() {
  const navigate = useNavigate()
  const { level = 'c1' } = useParams()
  const lv = level.toLowerCase()
  const uv = level.toUpperCase()

  const [satzId, setSatzId] = useState(null)
  const [teilIdx, setTeilIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)

  const satz = useMemo(() => LESEN_C1.find((s) => s.id === satzId) || null, [satzId])

  function startSatz(id) {
    setSatzId(id)
    setTeilIdx(0)
    setAnswers({})
    setFinished(false)
    window.scrollTo({ top: 0 })
  }

  function setAnswer(teilKey, itemKey, value) {
    setAnswers((prev) => ({
      ...prev,
      [teilKey]: { ...(prev[teilKey] || {}), [itemKey]: value },
    }))
  }

  function goTeil(idx) {
    setTeilIdx(idx)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---- Scoring ----
  const scores = useMemo(() => {
    if (!satz) return null
    const t1 = satz.teil1.luecken
    const t1correct = t1.filter((l) => answers.teil1?.[l.nr] === l.richtig).length
    const t2 = satz.teil2.fragen
    const t2correct = t2.filter((f, i) => answers.teil2?.[i] === f.richtig).length
    const t3 = satz.teil3.personen
    const t3correct = t3.filter((p) => answers.teil3?.[p.id] === satz.teil3.loesung[p.id]).length
    const t4 = satz.teil4.aussagen
    const t4correct = t4.filter((a, i) => answers.teil4?.[i] === a.richtig).length
    const total = t1.length + t2.length + t3.length + t4.length
    const correct = t1correct + t2correct + t3correct + t4correct
    return {
      teil1: { correct: t1correct, total: t1.length },
      teil2: { correct: t2correct, total: t2.length },
      teil3: { correct: t3correct, total: t3.length },
      teil4: { correct: t4correct, total: t4.length },
      total: { correct, total },
    }
  }, [satz, answers])

  // ---- Übungssatz-Auswahl ----
  if (!satz) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => navigate(`/sprachen/deutsch/${lv}`)} className="text-slate-400 hover:text-slate-200 transition text-sm mb-6 cursor-pointer">
          ← Zurück zu Deutsch {uv}
        </button>

        <div className="text-center mb-10">
          <div className="text-5xl mb-3">📚</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            {uv} Leseverstehen
          </h1>
          <p className="text-slate-400">Goethe-Prüfungssimulation</p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {TEIL_INFO.map((t) => (
              <span key={t.key} className="text-xs px-3 py-1 rounded-full bg-[#12122a] border border-[#1e1e3a] text-slate-400">
                {t.emoji} {t.kurz}
              </span>
            ))}
          </div>
        </div>

        <p className="text-slate-400 text-sm font-medium mb-3">Wähle einen Übungssatz</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LESEN_C1.map((s, i) => (
            <button
              key={s.id}
              onClick={() => startSatz(s.id)}
              className={`text-left p-6 ${CARD} border-b-2 border-b-emerald-500 hover:border-emerald-500/50 cursor-pointer transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/5 hover:bg-[#13132e]`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl transition-transform duration-300 group-hover:scale-110">📖</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-medium">Satz {i + 1}</span>
              </div>
              <div className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition">{s.titel}</div>
              <div className="text-slate-500 text-sm mt-1">{s.thema}</div>
              <div className="mt-4 text-xs text-emerald-400/0 group-hover:text-emerald-400 transition flex items-center gap-1">
                Starten <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ---- Auswertung ----
  if (finished && scores) {
    const pct = Math.round((scores.total.correct / scores.total.total) * 100)
    const bestanden = pct >= 60
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => { setSatzId(null); window.scrollTo({ top: 0 }) }} className="text-slate-400 hover:text-slate-200 transition text-sm mb-6 cursor-pointer">
          ← Zur Übersicht
        </button>

        {/* Score-Ring */}
        <div className={`p-8 ${CARD} text-center mb-6`}>
          <ScoreRing pct={pct} bestanden={bestanden} />
          <h2 className="text-2xl font-bold text-slate-100 mt-4 mb-1">
            {scores.total.correct} von {scores.total.total} richtig
          </h2>
          <p className={`text-sm font-medium ${bestanden ? 'text-emerald-400' : 'text-amber-400'}`}>
            {bestanden ? '🎉 Bestanden — sehr gut!' : '💪 Noch nicht ganz — weiter üben!'}
          </p>
        </div>

        {/* Teil-Aufschlüsselung mit Balken */}
        <div className={`p-5 ${CARD} mb-8 space-y-4`}>
          {TEIL_INFO.map((t) => {
            const sc = scores[t.key]
            const p = Math.round((sc.correct / sc.total) * 100)
            const tone = sc.correct === sc.total ? 'emerald' : sc.correct === 0 ? 'red' : 'amber'
            const barColor = { emerald: 'bg-emerald-500', red: 'bg-red-500', amber: 'bg-amber-500' }[tone]
            const txtColor = { emerald: 'text-emerald-400', red: 'text-red-400', amber: 'text-amber-400' }[tone]
            return (
              <div key={t.key}>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="text-slate-300">{t.emoji} {t.label} · <span className="text-slate-500">{t.kurz}</span></span>
                  <span className={`font-bold ${txtColor}`}>{sc.correct}/{sc.total}</span>
                </div>
                <div className="h-2 rounded-full bg-[#0a0a1a] overflow-hidden">
                  <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{ width: `${p}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Lösungen */}
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Lösungen im Detail</h3>
        <SolutionReview satz={satz} answers={answers} />

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button onClick={() => startSatz(satz.id)} className="flex-1 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition cursor-pointer">
            🔁 Nochmal üben
          </button>
          <button onClick={() => { setSatzId(null); window.scrollTo({ top: 0 }) }} className="flex-1 px-6 py-3 rounded-xl bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer">
            Anderer Satz
          </button>
        </div>
      </div>
    )
  }

  // ---- Aktiver Teil ----
  const teil = TEIL_INFO[teilIdx]
  const teilKey = teil.key
  const isLast = teilIdx === TEIL_INFO.length - 1

  function teilComplete(idx) {
    const key = TEIL_INFO[idx].key
    const a = answers[key] || {}
    if (key === 'teil1') return satz.teil1.luecken.every((l) => a[l.nr] !== undefined)
    if (key === 'teil2') return satz.teil2.fragen.every((_, i) => a[i] !== undefined)
    if (key === 'teil3') return satz.teil3.personen.every((p) => a[p.id] !== undefined)
    if (key === 'teil4') return satz.teil4.aussagen.every((_, i) => a[i] !== undefined)
    return false
  }

  // Anzahl beantwortet im aktuellen Teil
  function teilCount(idx) {
    const key = TEIL_INFO[idx].key
    const a = answers[key] || {}
    if (key === 'teil1') return { done: satz.teil1.luecken.filter((l) => a[l.nr] !== undefined).length, total: satz.teil1.luecken.length }
    if (key === 'teil2') return { done: satz.teil2.fragen.filter((_, i) => a[i] !== undefined).length, total: satz.teil2.fragen.length }
    if (key === 'teil3') return { done: satz.teil3.personen.filter((p) => a[p.id] !== undefined).length, total: satz.teil3.personen.length }
    return { done: satz.teil4.aussagen.filter((_, i) => a[i] !== undefined).length, total: satz.teil4.aussagen.length }
  }

  const count = teilCount(teilIdx)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => { setSatzId(null); window.scrollTo({ top: 0 }) }} className="text-slate-400 hover:text-slate-200 transition text-sm mb-5 cursor-pointer">
        ← Übung abbrechen
      </button>

      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-slate-100">{satz.titel}</h1>
        <p className="text-slate-500 text-sm">{satz.thema}</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {TEIL_INFO.map((t, i) => {
          const done = teilComplete(i)
          const active = i === teilIdx
          const reachable = i <= teilIdx || teilComplete(i - 1)
          return (
            <Fragment key={t.key}>
              <button
                onClick={() => reachable && goTeil(i)}
                disabled={!reachable}
                className={`flex flex-col items-center gap-1.5 shrink-0 ${reachable ? 'cursor-pointer group' : 'cursor-not-allowed'}`}
              >
                <span
                  className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 ${
                    active
                      ? 'bg-emerald-600 border-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/20'
                      : done
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 group-hover:bg-emerald-500/25'
                        : 'bg-[#12122a] border-[#2a2a4a] text-slate-500'
                  }`}
                >
                  {done && !active ? '✓' : t.emoji}
                </span>
                <span className={`text-[10px] font-medium transition ${active ? 'text-emerald-300' : 'text-slate-500'}`}>{t.label}</span>
              </button>
              {i < TEIL_INFO.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 -mt-5 rounded-full transition-colors duration-300 ${teilComplete(i) ? 'bg-emerald-500/40' : 'bg-[#2a2a4a]'}`} />
              )}
            </Fragment>
          )
        })}
      </div>

      {/* Teil-Kopf */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">{teil.emoji} {teil.label} — {teil.kurz}</h2>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${count.done === count.total ? 'bg-emerald-500/15 text-emerald-300' : 'bg-[#1e1e3a] text-slate-400'}`}>
          {count.done}/{count.total} beantwortet
        </span>
      </div>

      {teilKey === 'teil1' && <Teil1 data={satz.teil1} answers={answers.teil1 || {}} onAnswer={(nr, v) => setAnswer('teil1', nr, v)} />}
      {teilKey === 'teil2' && <Teil2 data={satz.teil2} answers={answers.teil2 || {}} onAnswer={(i, v) => setAnswer('teil2', i, v)} />}
      {teilKey === 'teil3' && <Teil3 data={satz.teil3} answers={answers.teil3 || {}} onAnswer={(id, v) => setAnswer('teil3', id, v)} />}
      {teilKey === 'teil4' && <Teil4 data={satz.teil4} answers={answers.teil4 || {}} onAnswer={(i, v) => setAnswer('teil4', i, v)} />}

      {/* Navigation */}
      <div className="flex gap-3 justify-between mt-8">
        <button
          onClick={() => goTeil(Math.max(0, teilIdx - 1))}
          disabled={teilIdx === 0}
          className="px-5 py-2.5 rounded-xl bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Zurück
        </button>
        {isLast ? (
          <button
            onClick={() => { setFinished(true); window.scrollTo({ top: 0 }) }}
            disabled={!teilComplete(teilIdx)}
            className="px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/10"
          >
            Auswerten ✓
          </button>
        ) : (
          <button
            onClick={() => goTeil(Math.min(TEIL_INFO.length - 1, teilIdx + 1))}
            disabled={!teilComplete(teilIdx)}
            className="px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Weiter →
          </button>
        )}
      </div>
    </div>
  )
}

// ---------- Score-Ring (SVG) ----------
function ScoreRing({ pct, bestanden }) {
  const r = 52
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  const stroke = bestanden ? '#10b981' : '#f59e0b'
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="130" height="130" className="-rotate-90">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#1e1e3a" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={r} fill="none" stroke={stroke} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-slate-100">{pct}%</span>
        <span className="text-[10px] uppercase tracking-wide text-slate-500">Ergebnis</span>
      </div>
    </div>
  )
}

// ---------- Teil 1: Lückentext ----------
function Teil1({ data, answers, onAnswer }) {
  const segments = data.text.split(/(\{\d+\})/g)
  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">{data.anleitung}</p>
      <div className={`p-6 ${CARD} text-[15px] leading-[2.4] text-slate-200`}>
        {segments.map((seg, idx) => {
          const m = seg.match(/^\{(\d+)\}$/)
          if (!m) return <span key={idx}>{seg}</span>
          const nr = Number(m[1])
          const luecke = data.luecken.find((l) => l.nr === nr)
          if (!luecke) return <span key={idx}>{seg}</span>
          const val = answers[nr]
          const filled = val !== undefined
          return (
            <span key={idx} className="inline-flex items-center align-middle mx-0.5">
              <span className={`inline-flex items-center justify-center w-5 h-5 mr-1 rounded-full text-[10px] font-bold ${filled ? 'bg-emerald-500 text-white' : 'bg-[#2a2a4a] text-slate-400'}`}>{nr}</span>
              <select
                value={filled ? val : ''}
                onChange={(e) => onAnswer(nr, Number(e.target.value))}
                className={`px-2 py-1 rounded-lg bg-[#0a0a1a] border text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition ${
                  filled ? 'border-emerald-500 text-emerald-200 font-medium' : 'border-emerald-500/40 text-slate-400'
                }`}
              >
                <option value="" disabled>auswählen …</option>
                {luecke.optionen.map((opt, oi) => (
                  <option key={oi} value={oi}>{opt}</option>
                ))}
              </select>
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ---------- Teil 2: Multiple Choice ----------
function Teil2({ data, answers, onAnswer }) {
  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">{data.anleitung}</p>
      <div className={`p-6 ${CARD} mb-6 text-slate-200 whitespace-pre-line leading-relaxed text-[15px]`}>
        {data.text}
      </div>
      <div className="space-y-5">
        {data.fragen.map((f, i) => (
          <div key={i} className={`p-5 ${CARD}`}>
            <p className="text-slate-100 font-medium mb-3 flex gap-2">
              <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold">{i + 1}</span>
              <span>{f.frage}</span>
            </p>
            <div className="space-y-2">
              {f.optionen.map((opt, oi) => {
                const sel = answers[i] === oi
                return (
                  <label
                    key={oi}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      sel
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-100'
                        : 'bg-[#0a0a1a] border-[#2a2a4a] text-slate-300 hover:border-emerald-500/40 hover:bg-[#0d0d20]'
                    }`}
                  >
                    <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${sel ? 'border-emerald-400 bg-emerald-500 text-white' : 'border-slate-600 text-slate-500'}`}>
                      {String.fromCharCode(97 + oi)}
                    </span>
                    <input type="radio" name={`f${i}`} checked={sel} onChange={() => onAnswer(i, oi)} className="sr-only" />
                    <span className="text-sm">{opt}</span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- Teil 3: Zuordnung ----------
function Teil3({ data, answers, onAnswer }) {
  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">{data.anleitung}</p>

      <h3 className="text-slate-400 text-xs uppercase tracking-wide mb-2">Anzeigen</h3>
      <div className="space-y-2 mb-6">
        {data.anzeigen.map((a) => (
          <div key={a.id} className="p-4 rounded-xl bg-[#0a0a1a] border border-[#2a2a4a]">
            <div className="text-emerald-300 font-medium text-sm">{a.titel}</div>
            <div className="text-slate-400 text-sm mt-0.5 leading-relaxed">{a.text}</div>
          </div>
        ))}
      </div>

      <h3 className="text-slate-400 text-xs uppercase tracking-wide mb-2">Personen — passende Anzeige wählen</h3>
      <div className="space-y-3">
        {data.personen.map((p) => {
          const filled = answers[p.id] !== undefined
          return (
            <div key={p.id} className={`p-4 ${CARD}`}>
              <div className="text-slate-100 font-medium text-sm mb-1">{p.name}</div>
              <p className="text-slate-400 text-sm mb-3 leading-relaxed">{p.beschreibung}</p>
              <select
                value={filled ? answers[p.id] : ''}
                onChange={(e) => onAnswer(p.id, Number(e.target.value))}
                className={`w-full px-3 py-2.5 rounded-xl bg-[#0a0a1a] border text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition ${
                  filled ? 'border-emerald-500 text-emerald-200 font-medium' : 'border-emerald-500/40 text-slate-400'
                }`}
              >
                <option value="" disabled>Passende Anzeige wählen …</option>
                {data.anzeigen.map((a) => (
                  <option key={a.id} value={a.id}>{a.titel}</option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------- Teil 4: Meinungen ----------
function Teil4({ data, answers, onAnswer }) {
  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">{data.anleitung}</p>
      <div className="space-y-3">
        {data.aussagen.map((a, i) => (
          <div key={i} className={`p-5 ${CARD}`}>
            <div className="text-emerald-300 font-medium text-sm mb-2">{a.person}</div>
            <p className="text-slate-300 text-sm mb-4 italic leading-relaxed">„{a.text}“</p>
            <div className="grid grid-cols-3 gap-2">
              {a.optionen.map((opt, oi) => {
                const sel = answers[i] === oi
                return (
                  <button
                    key={oi}
                    onClick={() => onAnswer(i, oi)}
                    className={`px-2 py-2.5 rounded-xl border text-sm font-medium transition cursor-pointer ${
                      sel
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-100'
                        : 'bg-[#0a0a1a] border-[#2a2a4a] text-slate-300 hover:border-emerald-500/40 hover:bg-[#0d0d20]'
                    }`}
                  >
                    {POS_LABEL[opt] || opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- Lösungsübersicht (Auswertung) ----------
function SolRow({ ok, label, your, correct }) {
  return (
    <div className={`p-3 rounded-xl border text-sm ${ok ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
      <div className="flex items-start gap-2.5">
        <span className="shrink-0">{ok ? '✅' : '❌'}</span>
        <div className="flex-1 min-w-0">
          <div className="text-slate-300">{label}</div>
          {!ok && (
            <div className="text-xs mt-1.5 space-y-1">
              <div className="text-red-300"><span className="text-slate-500">deine Antwort:</span> {your}</div>
              <div className="text-emerald-300"><span className="text-slate-500">richtig:</span> {correct}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SolSection({ emoji, title, children }) {
  return (
    <div>
      <h4 className="text-slate-300 text-sm font-semibold mb-2 flex items-center gap-1.5">{emoji} {title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function SolutionReview({ satz, answers }) {
  const Row = SolRow
  const Section = SolSection
  return (
    <div className="space-y-6">
      <Section emoji="🧩" title="Teil 1 — Lückentext">
        {satz.teil1.luecken.map((l) => {
          const your = answers.teil1?.[l.nr]
          return (
            <Row key={l.nr} ok={your === l.richtig} label={`Lücke ${l.nr}`} your={your === undefined ? '—' : l.optionen[your]} correct={l.optionen[l.richtig]} />
          )
        })}
      </Section>

      <Section emoji="📄" title="Teil 2 — Multiple Choice">
        {satz.teil2.fragen.map((f, i) => {
          const your = answers.teil2?.[i]
          return (
            <Row key={i} ok={your === f.richtig} label={`${i + 1}. ${f.frage}`} your={your === undefined ? '—' : f.optionen[your]} correct={f.optionen[f.richtig]} />
          )
        })}
      </Section>

      <Section emoji="🔀" title="Teil 3 — Zuordnung">
        {satz.teil3.personen.map((p) => {
          const your = answers.teil3?.[p.id]
          const correctId = satz.teil3.loesung[p.id]
          const titelOf = (id) => satz.teil3.anzeigen.find((a) => a.id === id)?.titel || '—'
          return (
            <Row key={p.id} ok={your === correctId} label={p.name} your={your === undefined ? '—' : titelOf(your)} correct={titelOf(correctId)} />
          )
        })}
      </Section>

      <Section emoji="💬" title="Teil 4 — Meinungen">
        {satz.teil4.aussagen.map((a, i) => {
          const your = answers.teil4?.[i]
          return (
            <Row key={i} ok={your === a.richtig} label={a.person} your={your === undefined ? '—' : (POS_LABEL[a.optionen[your]] || a.optionen[your])} correct={POS_LABEL[a.optionen[a.richtig]] || a.optionen[a.richtig]} />
          )
        })}
      </Section>
    </div>
  )
}
