import { useState, useMemo, Fragment } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LESEN_C1 } from '../data/leseTexteC1'

// Goethe C1 Leseverstehen — Prüfungssimulation mit 4 Teilen.
// Flow: Auswahl → Intro (Modus wählen) → Teil 1–4 → Auswertung.
// Zwei Modi:
//   practice — sofortiges Feedback nach jeder Antwort (für Einsteiger)
//   exam     — Auswertung erst am Ende (echte Prüfungsbedingungen)

const TEIL_INFO = [
  { key: 'teil1', label: 'Teil 1', kurz: 'Lückentext', emoji: '🧩', erklaerung: 'Wähle für jede Lücke im Text das passende Wort.' },
  { key: 'teil2', label: 'Teil 2', kurz: 'Leseverstehen', emoji: '📄', erklaerung: 'Lies den Text und beantworte Fragen dazu.' },
  { key: 'teil3', label: 'Teil 3', kurz: 'Zuordnung', emoji: '🔀', erklaerung: 'Ordne jeder Person das passende Angebot zu.' },
  { key: 'teil4', label: 'Teil 4', kurz: 'Meinungen', emoji: '💬', erklaerung: 'Erkenne, ob eine Aussage positiv, negativ oder neutral ist.' },
]

const POS_LABEL = { positiv: '👍 positiv', negativ: '👎 negativ', neutral: '😐 neutral' }

const CARD = 'rounded-2xl bg-[#12122a] border border-[#1e1e3a]'

function countFragen(s) {
  return s.teil1.luecken.length + s.teil2.fragen.length + s.teil3.personen.length + s.teil4.aussagen.length
}
function schaetzMinuten(s) {
  return Math.max(5, Math.round(countFragen(s) * 0.7))
}

export default function DeutschC1Lesen() {
  const navigate = useNavigate()
  const { level = 'c1' } = useParams()
  const lv = level.toLowerCase()
  const uv = level.toUpperCase()

  const [satzId, setSatzId] = useState(null)
  const [mode, setMode] = useState(null) // null = Intro, 'practice', 'exam'
  const [teilIdx, setTeilIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)

  const satz = useMemo(() => LESEN_C1.find((s) => s.id === satzId) || null, [satzId])
  const practice = mode === 'practice'

  function openSatz(id) {
    setSatzId(id); setMode(null); setAnswers({}); setTeilIdx(0); setFinished(false)
    window.scrollTo({ top: 0 })
  }
  function beginMode(m) {
    setMode(m); setAnswers({}); setTeilIdx(0); setFinished(false)
    window.scrollTo({ top: 0 })
  }
  function setAnswer(teilKey, itemKey, value) {
    setAnswers((prev) => ({ ...prev, [teilKey]: { ...(prev[teilKey] || {}), [itemKey]: value } }))
  }
  function goTeil(idx) {
    setTeilIdx(idx)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---- Scoring ----
  const scores = useMemo(() => {
    if (!satz) return null
    const t1 = satz.teil1.luecken
    const t1c = t1.filter((l) => answers.teil1?.[l.nr] === l.richtig).length
    const t2 = satz.teil2.fragen
    const t2c = t2.filter((f, i) => answers.teil2?.[i] === f.richtig).length
    const t3 = satz.teil3.personen
    const t3c = t3.filter((p) => answers.teil3?.[p.id] === satz.teil3.loesung[p.id]).length
    const t4 = satz.teil4.aussagen
    const t4c = t4.filter((a, i) => answers.teil4?.[i] === a.richtig).length
    const total = t1.length + t2.length + t3.length + t4.length
    const correct = t1c + t2c + t3c + t4c
    return {
      teil1: { correct: t1c, total: t1.length },
      teil2: { correct: t2c, total: t2.length },
      teil3: { correct: t3c, total: t3.length },
      teil4: { correct: t4c, total: t4.length },
      total: { correct, total },
    }
  }, [satz, answers])

  // ============ 1) AUSWAHL-SCREEN ============
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
          <p className="text-slate-400">Bereite dich gezielt auf die Goethe-Prüfung vor</p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            {TEIL_INFO.map((t) => (
              <span key={t.key} className="text-xs px-3 py-1.5 rounded-full bg-[#12122a] border border-[#1e1e3a] text-slate-400">
                {t.emoji} {t.kurz}
              </span>
            ))}
          </div>
        </div>

        <p className="text-slate-300 text-sm font-semibold mb-3">Wähle einen Übungssatz</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LESEN_C1.map((s, i) => (
            <button
              key={s.id}
              onClick={() => openSatz(s.id)}
              className={`text-left p-6 ${CARD} border-b-2 border-b-emerald-500 hover:border-emerald-500/50 cursor-pointer transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/5 hover:bg-[#13132e]`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl transition-transform duration-300 group-hover:scale-110">📖</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-medium">Satz {i + 1}</span>
              </div>
              <div className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition">{s.titel}</div>
              <div className="text-slate-500 text-sm mt-1">{s.thema}</div>
              <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
                <span>⏱ ca. {schaetzMinuten(s)} Min</span>
                <span>·</span>
                <span>📝 {countFragen(s)} Fragen</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ============ 2) INTRO-SCREEN (Modus wählen) ============
  if (!mode) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => { setSatzId(null); window.scrollTo({ top: 0 }) }} className="text-slate-400 hover:text-slate-200 transition text-sm mb-6 cursor-pointer">
          ← Alle Übungssätze
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-100">{satz.titel}</h1>
          <p className="text-slate-500">{satz.thema}</p>
          <div className="flex items-center justify-center gap-3 mt-3 text-sm text-slate-400">
            <span>⏱ ca. {schaetzMinuten(satz)} Min</span>
            <span>·</span>
            <span>📝 {countFragen(satz)} Fragen</span>
          </div>
        </div>

        {/* Was dich erwartet */}
        <div className={`p-5 ${CARD} mb-8`}>
          <p className="text-slate-300 text-sm font-semibold mb-3">Diese Übung hat 4 Teile:</p>
          <div className="space-y-2.5">
            {TEIL_INFO.map((t) => (
              <div key={t.key} className="flex items-start gap-3">
                <span className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-500/10 text-lg">{t.emoji}</span>
                <div>
                  <div className="text-slate-200 text-sm font-medium">{t.label} — {t.kurz}</div>
                  <div className="text-slate-500 text-xs">{t.erklaerung}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modus wählen */}
        <p className="text-slate-300 text-sm font-semibold mb-3">Wie möchtest du üben?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => beginMode('practice')}
            className={`text-left p-6 ${CARD} border-b-2 border-b-emerald-500 hover:border-emerald-500/50 hover:-translate-y-0.5 hover:bg-[#13132e] transition-all duration-300 cursor-pointer group`}
          >
            <div className="text-3xl mb-2">✏️</div>
            <div className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition">Üben</div>
            <p className="text-slate-500 text-sm mt-1">Sofort sehen, ob die Antwort stimmt — mit Lösung. Ideal zum Lernen.</p>
            <div className="mt-3 text-xs text-emerald-400 font-medium">Empfohlen für den Anfang</div>
          </button>
          <button
            onClick={() => beginMode('exam')}
            className={`text-left p-6 ${CARD} border-b-2 border-b-blue-500 hover:border-blue-500/50 hover:-translate-y-0.5 hover:bg-[#13132e] transition-all duration-300 cursor-pointer group`}
          >
            <div className="text-3xl mb-2">🎓</div>
            <div className="text-lg font-bold text-slate-100 group-hover:text-blue-300 transition">Prüfung</div>
            <p className="text-slate-500 text-sm mt-1">Erst alles beantworten, dann die Auswertung — wie in der echten Prüfung.</p>
            <div className="mt-3 text-xs text-blue-400 font-medium">Für den Ernstfall</div>
          </button>
        </div>
      </div>
    )
  }

  // ============ 4) AUSWERTUNG ============
  if (finished && scores) {
    const pct = Math.round((scores.total.correct / scores.total.total) * 100)
    const bestanden = pct >= 60
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => { setMode(null); window.scrollTo({ top: 0 }) }} className="text-slate-400 hover:text-slate-200 transition text-sm mb-6 cursor-pointer">
          ← Zur Übersicht
        </button>

        <div className={`p-8 ${CARD} text-center mb-6`}>
          <ScoreRing pct={pct} bestanden={bestanden} />
          <h2 className="text-2xl font-bold text-slate-100 mt-4 mb-1">
            {scores.total.correct} von {scores.total.total} richtig
          </h2>
          <p className={`text-sm font-medium ${bestanden ? 'text-emerald-400' : 'text-amber-400'}`}>
            {pct >= 90 ? '🌟 Hervorragend!' : bestanden ? '🎉 Bestanden — gut gemacht!' : '💪 Fast geschafft — bleib dran!'}
          </p>
        </div>

        <div className={`p-5 ${CARD} mb-8 space-y-4`}>
          {TEIL_INFO.map((t) => {
            const sc = scores[t.key]
            const p = Math.round((sc.correct / sc.total) * 100)
            const tone = sc.correct === sc.total ? 'emerald' : sc.correct === 0 ? 'red' : 'amber'
            const bar = { emerald: 'bg-emerald-500', red: 'bg-red-500', amber: 'bg-amber-500' }[tone]
            const txt = { emerald: 'text-emerald-400', red: 'text-red-400', amber: 'text-amber-400' }[tone]
            return (
              <div key={t.key}>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="text-slate-300">{t.emoji} {t.label} · <span className="text-slate-500">{t.kurz}</span></span>
                  <span className={`font-bold ${txt}`}>{sc.correct}/{sc.total}</span>
                </div>
                <div className="h-2 rounded-full bg-[#0a0a1a] overflow-hidden">
                  <div className={`h-full rounded-full ${bar} transition-all duration-700`} style={{ width: `${p}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        <details className="mb-8 group">
          <summary className="cursor-pointer text-slate-300 font-semibold text-sm select-none flex items-center gap-2 mb-2">
            <span className="text-emerald-400 group-open:rotate-90 transition-transform inline-block">▸</span>
            Lösungen im Detail ansehen
          </summary>
          <div className="mt-3">
            <SolutionReview satz={satz} answers={answers} />
          </div>
        </details>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => beginMode(mode)} className="flex-1 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition cursor-pointer">
            🔁 Nochmal
          </button>
          <button onClick={() => { setMode(null); window.scrollTo({ top: 0 }) }} className="flex-1 px-6 py-3 rounded-xl bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer">
            Modus wechseln
          </button>
          <button onClick={() => { setSatzId(null); window.scrollTo({ top: 0 }) }} className="flex-1 px-6 py-3 rounded-xl bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer">
            Andere Übung
          </button>
        </div>
      </div>
    )
  }

  // ============ 3) AKTIVER TEIL ============
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
  function teilCount(idx) {
    const key = TEIL_INFO[idx].key
    const a = answers[key] || {}
    if (key === 'teil1') return { done: satz.teil1.luecken.filter((l) => a[l.nr] !== undefined).length, total: satz.teil1.luecken.length }
    if (key === 'teil2') return { done: satz.teil2.fragen.filter((_, i) => a[i] !== undefined).length, total: satz.teil2.fragen.length }
    if (key === 'teil3') return { done: satz.teil3.personen.filter((p) => a[p.id] !== undefined).length, total: satz.teil3.personen.length }
    return { done: satz.teil4.aussagen.filter((_, i) => a[i] !== undefined).length, total: satz.teil4.aussagen.length }
  }

  const count = teilCount(teilIdx)
  const answeredTotal = TEIL_INFO.reduce((sum, _, i) => sum + teilCount(i).done, 0)
  const grandTotal = scores.total.total
  const overallPct = Math.round((answeredTotal / grandTotal) * 100)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Kopfzeile mit Modus + Abbrechen */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => { setMode(null); window.scrollTo({ top: 0 }) }} className="text-slate-400 hover:text-slate-200 transition text-sm cursor-pointer">
          ← Abbrechen
        </button>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${practice ? 'bg-emerald-500/15 text-emerald-300' : 'bg-blue-500/15 text-blue-300'}`}>
          {practice ? '✏️ Übungsmodus' : '🎓 Prüfungsmodus'}
        </span>
      </div>

      {/* Gesamtfortschritt */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span>{satz.titel}</span>
          <span>{answeredTotal} / {grandTotal} beantwortet{practice ? ` · ✓ ${scores.total.correct} richtig` : ''}</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#1e1e3a] overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-7">
        {TEIL_INFO.map((t, i) => {
          const done = teilComplete(i)
          const active = i === teilIdx
          const reachable = i <= teilIdx || teilComplete(i - 1)
          return (
            <Fragment key={t.key}>
              <button
                onClick={() => reachable && goTeil(i)}
                disabled={!reachable}
                title={`${t.label} — ${t.kurz}`}
                className={`flex flex-col items-center gap-1.5 shrink-0 ${reachable ? 'cursor-pointer group' : 'cursor-not-allowed'}`}
              >
                <span className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 ${
                  active
                    ? 'bg-emerald-600 border-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/20'
                    : done
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 group-hover:bg-emerald-500/25'
                      : 'bg-[#12122a] border-[#2a2a4a] text-slate-500'
                }`}>
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

      {/* Teil-Kopf mit Erklärung */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100">{teil.emoji} {teil.label} — {teil.kurz}</h2>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${count.done === count.total ? 'bg-emerald-500/15 text-emerald-300' : 'bg-[#1e1e3a] text-slate-400'}`}>
            {count.done}/{count.total}
          </span>
        </div>
        <p className="text-slate-500 text-sm mt-1">{teil.erklaerung}</p>
      </div>

      {teilKey === 'teil1' && <Teil1 data={satz.teil1} answers={answers.teil1 || {}} onAnswer={(nr, v) => setAnswer('teil1', nr, v)} practice={practice} />}
      {teilKey === 'teil2' && <Teil2 data={satz.teil2} answers={answers.teil2 || {}} onAnswer={(i, v) => setAnswer('teil2', i, v)} practice={practice} />}
      {teilKey === 'teil3' && <Teil3 data={satz.teil3} answers={answers.teil3 || {}} onAnswer={(id, v) => setAnswer('teil3', id, v)} practice={practice} />}
      {teilKey === 'teil4' && <Teil4 data={satz.teil4} answers={answers.teil4 || {}} onAnswer={(i, v) => setAnswer('teil4', i, v)} practice={practice} />}

      {/* Navigation */}
      <div className="flex gap-3 justify-between mt-8">
        <button
          onClick={() => goTeil(Math.max(0, teilIdx - 1))}
          disabled={teilIdx === 0}
          className="px-5 py-3 rounded-xl bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Zurück
        </button>
        {isLast ? (
          <button
            onClick={() => { setFinished(true); window.scrollTo({ top: 0 }) }}
            disabled={!teilComplete(teilIdx)}
            className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/10"
          >
            {practice ? 'Ergebnis ansehen ✓' : 'Auswerten ✓'}
          </button>
        ) : (
          <button
            onClick={() => goTeil(Math.min(TEIL_INFO.length - 1, teilIdx + 1))}
            disabled={!teilComplete(teilIdx)}
            className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Weiter →
          </button>
        )}
      </div>

      {!teilComplete(teilIdx) && (
        <p className="text-center text-slate-600 text-xs mt-3">Beantworte alle Aufgaben, um fortzufahren.</p>
      )}
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
        <circle cx="65" cy="65" r={r} fill="none" stroke={stroke} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-slate-100">{pct}%</span>
        <span className="text-[10px] uppercase tracking-wide text-slate-500">Ergebnis</span>
      </div>
    </div>
  )
}

// ---------- Feedback-Banner (Übungsmodus) ----------
function Feedback({ correct, loesung }) {
  return (
    <div className={`mt-3 text-xs rounded-lg px-3 py-2 ${correct ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
      {correct ? '✓ Richtig!' : <>✗ Leider falsch. Richtig: <span className="font-semibold">{loesung}</span></>}
    </div>
  )
}

// ---------- Teil 1: Lückentext ----------
function Teil1({ data, answers, onAnswer, practice }) {
  const segments = data.text.split(/(\{\d+\})/g)
  return (
    <div className={`p-6 ${CARD} text-[15px] leading-[2.6] text-slate-200`}>
      {segments.map((seg, idx) => {
        const m = seg.match(/^\{(\d+)\}$/)
        if (!m) return <span key={idx}>{seg}</span>
        const nr = Number(m[1])
        const luecke = data.luecken.find((l) => l.nr === nr)
        if (!luecke) return <span key={idx}>{seg}</span>
        const val = answers[nr]
        const filled = val !== undefined
        const correct = val === luecke.richtig
        const locked = practice && filled
        const color = !filled
          ? 'border-emerald-500/40 text-slate-400'
          : practice
            ? (correct ? 'border-emerald-500 text-emerald-200' : 'border-red-500 text-red-300')
            : 'border-emerald-500 text-emerald-200 font-medium'
        return (
          <span key={idx} className="inline-flex items-center align-middle mx-0.5">
            <span className={`inline-flex items-center justify-center w-5 h-5 mr-1 rounded-full text-[10px] font-bold ${filled ? (practice && !correct ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white') : 'bg-[#2a2a4a] text-slate-400'}`}>{nr}</span>
            <select
              value={filled ? val : ''}
              disabled={locked}
              onChange={(e) => onAnswer(nr, Number(e.target.value))}
              className={`px-2 py-1.5 rounded-lg bg-[#0a0a1a] border text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition disabled:cursor-default ${color}`}
            >
              <option value="" disabled>auswählen …</option>
              {luecke.optionen.map((opt, oi) => (<option key={oi} value={oi}>{opt}</option>))}
            </select>
            {practice && filled && !correct && (
              <span className="ml-1 text-xs text-emerald-300 font-medium">→ {luecke.optionen[luecke.richtig]}</span>
            )}
          </span>
        )
      })}
    </div>
  )
}

// ---------- Teil 2: Multiple Choice ----------
function Teil2({ data, answers, onAnswer, practice }) {
  return (
    <div>
      <div className={`p-6 ${CARD} mb-5 text-slate-200 whitespace-pre-line leading-relaxed text-[15px]`}>
        {data.text}
      </div>
      <div className="space-y-5">
        {data.fragen.map((f, i) => {
          const answered = answers[i] !== undefined
          const locked = practice && answered
          return (
            <div key={i} className={`p-5 ${CARD}`}>
              <p className="text-slate-100 font-medium mb-3 flex gap-2">
                <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold">{i + 1}</span>
                <span>{f.frage}</span>
              </p>
              <div className="space-y-2">
                {f.optionen.map((opt, oi) => {
                  const sel = answers[i] === oi
                  const isCorrect = oi === f.richtig
                  let cls = 'bg-[#0a0a1a] border-[#2a2a4a] text-slate-300 hover:border-emerald-500/40 hover:bg-[#0d0d20]'
                  let badge = 'border-slate-600 text-slate-500'
                  if (practice && answered) {
                    if (isCorrect) { cls = 'bg-emerald-500/15 border-emerald-500 text-emerald-100'; badge = 'border-emerald-400 bg-emerald-500 text-white' }
                    else if (sel) { cls = 'bg-red-500/15 border-red-500 text-red-100'; badge = 'border-red-400 bg-red-500 text-white' }
                    else { cls = 'bg-[#0a0a1a] border-[#2a2a4a] text-slate-500 opacity-60' }
                  } else if (sel) {
                    cls = 'bg-emerald-500/15 border-emerald-500 text-emerald-100'; badge = 'border-emerald-400 bg-emerald-500 text-white'
                  }
                  return (
                    <label key={oi} className={`flex items-start gap-3 p-3 rounded-xl border transition ${locked ? 'cursor-default' : 'cursor-pointer'} ${cls}`}>
                      <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${badge}`}>
                        {practice && answered && isCorrect ? '✓' : practice && answered && sel ? '✗' : String.fromCharCode(97 + oi)}
                      </span>
                      <input type="radio" name={`f${i}`} checked={sel} disabled={locked} onChange={() => onAnswer(i, oi)} className="sr-only" />
                      <span className="text-sm">{opt}</span>
                    </label>
                  )
                })}
              </div>
              {practice && answered && <Feedback correct={answers[i] === f.richtig} loesung={f.optionen[f.richtig]} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------- Teil 3: Zuordnung ----------
function Teil3({ data, answers, onAnswer, practice }) {
  return (
    <div>
      <h3 className="text-slate-400 text-xs uppercase tracking-wide mb-2">Angebote</h3>
      <div className="space-y-2 mb-6">
        {data.anzeigen.map((a) => (
          <div key={a.id} className="p-4 rounded-xl bg-[#0a0a1a] border border-[#2a2a4a]">
            <div className="text-emerald-300 font-medium text-sm">{a.titel}</div>
            <div className="text-slate-400 text-sm mt-0.5 leading-relaxed">{a.text}</div>
          </div>
        ))}
      </div>

      <h3 className="text-slate-400 text-xs uppercase tracking-wide mb-2">Personen — passendes Angebot wählen</h3>
      <div className="space-y-3">
        {data.personen.map((p) => {
          const val = answers[p.id]
          const filled = val !== undefined
          const correctId = data.loesung[p.id]
          const correct = val === correctId
          const locked = practice && filled
          const color = !filled
            ? 'border-emerald-500/40 text-slate-400'
            : practice
              ? (correct ? 'border-emerald-500 text-emerald-200' : 'border-red-500 text-red-300')
              : 'border-emerald-500 text-emerald-200 font-medium'
          return (
            <div key={p.id} className={`p-4 ${CARD}`}>
              <div className="text-slate-100 font-medium text-sm mb-1">{p.name}</div>
              <p className="text-slate-400 text-sm mb-3 leading-relaxed">{p.beschreibung}</p>
              <select
                value={filled ? val : ''}
                disabled={locked}
                onChange={(e) => onAnswer(p.id, Number(e.target.value))}
                className={`w-full px-3 py-2.5 rounded-xl bg-[#0a0a1a] border text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition disabled:cursor-default ${color}`}
              >
                <option value="" disabled>Passendes Angebot wählen …</option>
                {data.anzeigen.map((a) => (<option key={a.id} value={a.id}>{a.titel}</option>))}
              </select>
              {practice && filled && (
                <Feedback correct={correct} loesung={data.anzeigen.find((a) => a.id === correctId)?.titel} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------- Teil 4: Meinungen ----------
function Teil4({ data, answers, onAnswer, practice }) {
  return (
    <div className="space-y-3">
      {data.aussagen.map((a, i) => {
        const answered = answers[i] !== undefined
        const locked = practice && answered
        return (
          <div key={i} className={`p-5 ${CARD}`}>
            <div className="text-emerald-300 font-medium text-sm mb-2">{a.person}</div>
            <p className="text-slate-300 text-sm mb-4 italic leading-relaxed">„{a.text}“</p>
            <div className="grid grid-cols-3 gap-2">
              {a.optionen.map((opt, oi) => {
                const sel = answers[i] === oi
                const isCorrect = oi === a.richtig
                let cls = 'bg-[#0a0a1a] border-[#2a2a4a] text-slate-300 hover:border-emerald-500/40 hover:bg-[#0d0d20]'
                if (practice && answered) {
                  if (isCorrect) cls = 'bg-emerald-500/15 border-emerald-500 text-emerald-100'
                  else if (sel) cls = 'bg-red-500/15 border-red-500 text-red-100'
                  else cls = 'bg-[#0a0a1a] border-[#2a2a4a] text-slate-500 opacity-60'
                } else if (sel) {
                  cls = 'bg-emerald-500/15 border-emerald-500 text-emerald-100'
                }
                return (
                  <button key={oi} onClick={() => !locked && onAnswer(i, oi)} disabled={locked}
                    className={`px-2 py-2.5 rounded-xl border text-sm font-medium transition ${locked ? 'cursor-default' : 'cursor-pointer'} ${cls}`}>
                    {POS_LABEL[opt] || opt}
                  </button>
                )
              })}
            </div>
            {practice && answered && <Feedback correct={answers[i] === a.richtig} loesung={POS_LABEL[a.optionen[a.richtig]] || a.optionen[a.richtig]} />}
          </div>
        )
      })}
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
  return (
    <div className="space-y-6">
      <SolSection emoji="🧩" title="Teil 1 — Lückentext">
        {satz.teil1.luecken.map((l) => {
          const your = answers.teil1?.[l.nr]
          return <SolRow key={l.nr} ok={your === l.richtig} label={`Lücke ${l.nr}`} your={your === undefined ? '—' : l.optionen[your]} correct={l.optionen[l.richtig]} />
        })}
      </SolSection>

      <SolSection emoji="📄" title="Teil 2 — Leseverstehen">
        {satz.teil2.fragen.map((f, i) => {
          const your = answers.teil2?.[i]
          return <SolRow key={i} ok={your === f.richtig} label={`${i + 1}. ${f.frage}`} your={your === undefined ? '—' : f.optionen[your]} correct={f.optionen[f.richtig]} />
        })}
      </SolSection>

      <SolSection emoji="🔀" title="Teil 3 — Zuordnung">
        {satz.teil3.personen.map((p) => {
          const your = answers.teil3?.[p.id]
          const correctId = satz.teil3.loesung[p.id]
          const titelOf = (id) => satz.teil3.anzeigen.find((a) => a.id === id)?.titel || '—'
          return <SolRow key={p.id} ok={your === correctId} label={p.name} your={your === undefined ? '—' : titelOf(your)} correct={titelOf(correctId)} />
        })}
      </SolSection>

      <SolSection emoji="💬" title="Teil 4 — Meinungen">
        {satz.teil4.aussagen.map((a, i) => {
          const your = answers.teil4?.[i]
          return <SolRow key={i} ok={your === a.richtig} label={a.person} your={your === undefined ? '—' : (POS_LABEL[a.optionen[your]] || a.optionen[your])} correct={POS_LABEL[a.optionen[a.richtig]] || a.optionen[a.richtig]} />
        })}
      </SolSection>
    </div>
  )
}
