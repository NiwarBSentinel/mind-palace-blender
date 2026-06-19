import { useState, useMemo } from 'react'
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

export default function DeutschC1Lesen() {
  const navigate = useNavigate()
  const { level = 'c1' } = useParams()
  const lv = level.toLowerCase()
  const uv = level.toUpperCase()

  const [satzId, setSatzId] = useState(null)
  const [teilIdx, setTeilIdx] = useState(0)
  const [answers, setAnswers] = useState({}) // { teil1: {1:0,...}, teil2: {0:1,...}, teil3: {a:0,...}, teil4: {0:1,...} }
  const [finished, setFinished] = useState(false)

  const satz = useMemo(() => LESEN_C1.find((s) => s.id === satzId) || null, [satzId])

  function startSatz(id) {
    setSatzId(id)
    setTeilIdx(0)
    setAnswers({})
    setFinished(false)
  }

  function setAnswer(teilKey, itemKey, value) {
    setAnswers((prev) => ({
      ...prev,
      [teilKey]: { ...(prev[teilKey] || {}), [itemKey]: value },
    }))
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate(`/sprachen/deutsch/${lv}`)} className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer">
          ← Zurück zu Deutsch {uv}
        </button>
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          📚 {uv} Leseverstehen
        </h1>
        <p className="text-center text-slate-400 mb-2">Goethe-Prüfungssimulation</p>
        <p className="text-center text-slate-500 text-sm mb-10">
          4 Teile: Lückentext · Multiple Choice · Zuordnung · Meinungen
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LESEN_C1.map((s) => (
            <div
              key={s.id}
              onClick={() => startSatz(s.id)}
              className="p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] border-b-2 border-b-emerald-500 hover:border-emerald-500/50 cursor-pointer transition-all duration-300 group hover:scale-[1.02] hover:bg-[#13132e]"
            >
              <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">📖</div>
              <div className="text-lg font-bold text-slate-200 group-hover:text-emerald-300 transition">{s.titel}</div>
              <div className="text-slate-500 text-sm mt-1">{s.thema}</div>
            </div>
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
        <button onClick={() => setSatzId(null)} className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer">
          ← Zur Übersicht
        </button>

        <div className="p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center mb-6">
          <div className="text-5xl mb-3">{bestanden ? '🎉' : '💪'}</div>
          <h2 className="text-2xl font-bold text-slate-100 mb-1">{scores.total.correct} / {scores.total.total} richtig</h2>
          <p className={`text-lg font-medium ${bestanden ? 'text-emerald-400' : 'text-amber-400'}`}>
            {pct}% {bestanden ? '— bestanden' : '— weiter üben'}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {TEIL_INFO.map((t) => {
            const sc = scores[t.key]
            const full = sc.correct === sc.total
            return (
              <div key={t.key} className="flex items-center justify-between p-4 rounded-xl bg-[#12122a] border border-[#1e1e3a]">
                <span className="text-slate-300 text-sm">{t.emoji} {t.label} — {t.kurz}</span>
                <span className={`text-sm font-bold ${full ? 'text-emerald-400' : sc.correct === 0 ? 'text-red-400' : 'text-amber-400'}`}>
                  {sc.correct} / {sc.total}
                </span>
              </div>
            )
          })}
        </div>

        {/* Lösungen */}
        <h3 className="text-lg font-semibold text-slate-300 mb-4">Lösungen</h3>
        <SolutionReview satz={satz} answers={answers} />

        <div className="flex gap-3 justify-center mt-8">
          <button onClick={() => startSatz(satz.id)} className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition cursor-pointer">
            Nochmal
          </button>
          <button onClick={() => setSatzId(null)} className="px-6 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer">
            Anderer Satz
          </button>
        </div>
      </div>
    )
  }

  // ---- Aktiver Teil ----
  const teilKey = TEIL_INFO[teilIdx].key
  const isLast = teilIdx === TEIL_INFO.length - 1

  // Ist der aktuelle Teil vollständig beantwortet?
  function teilComplete(idx) {
    const key = TEIL_INFO[idx].key
    const a = answers[key] || {}
    if (key === 'teil1') return satz.teil1.luecken.every((l) => a[l.nr] !== undefined)
    if (key === 'teil2') return satz.teil2.fragen.every((_, i) => a[i] !== undefined)
    if (key === 'teil3') return satz.teil3.personen.every((p) => a[p.id] !== undefined)
    if (key === 'teil4') return satz.teil4.aussagen.every((_, i) => a[i] !== undefined)
    return false
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => setSatzId(null)} className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer">
        ← Übung abbrechen
      </button>

      <h1 className="text-2xl font-bold text-center mb-1 text-slate-100">{satz.titel}</h1>
      <p className="text-center text-slate-500 text-sm mb-6">{satz.thema}</p>

      {/* Teil-Fortschritt */}
      <div className="flex gap-2 justify-center mb-8">
        {TEIL_INFO.map((t, i) => (
          <div
            key={t.key}
            className={`flex-1 max-w-[120px] text-center py-2 rounded-lg border text-xs font-medium transition ${
              i === teilIdx
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : teilComplete(i)
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-[#12122a] border-[#2a2a4a] text-slate-500'
            }`}
          >
            <div>{t.emoji} {t.label}</div>
            <div className="text-[10px] opacity-70 mt-0.5">{t.kurz}</div>
          </div>
        ))}
      </div>

      {teilKey === 'teil1' && <Teil1 data={satz.teil1} answers={answers.teil1 || {}} onAnswer={(nr, v) => setAnswer('teil1', nr, v)} />}
      {teilKey === 'teil2' && <Teil2 data={satz.teil2} answers={answers.teil2 || {}} onAnswer={(i, v) => setAnswer('teil2', i, v)} />}
      {teilKey === 'teil3' && <Teil3 data={satz.teil3} answers={answers.teil3 || {}} onAnswer={(id, v) => setAnswer('teil3', id, v)} />}
      {teilKey === 'teil4' && <Teil4 data={satz.teil4} answers={answers.teil4 || {}} onAnswer={(i, v) => setAnswer('teil4', i, v)} />}

      {/* Navigation */}
      <div className="flex gap-3 justify-between mt-8">
        <button
          onClick={() => setTeilIdx((i) => Math.max(0, i - 1))}
          disabled={teilIdx === 0}
          className="px-5 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Zurück
        </button>
        {isLast ? (
          <button
            onClick={() => setFinished(true)}
            disabled={!teilComplete(teilIdx)}
            className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Auswerten ✓
          </button>
        ) : (
          <button
            onClick={() => setTeilIdx((i) => Math.min(TEIL_INFO.length - 1, i + 1))}
            disabled={!teilComplete(teilIdx)}
            className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Weiter →
          </button>
        )}
      </div>
    </div>
  )
}

// ---------- Teil 1: Lückentext ----------
function Teil1({ data, answers, onAnswer }) {
  // Text in Segmente zerlegen, {n} durch Auswahl-Dropdowns ersetzen.
  const segments = data.text.split(/(\{\d+\})/g)
  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">{data.anleitung}</p>
      <div className="p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] leading-loose text-slate-200">
        {segments.map((seg, idx) => {
          const m = seg.match(/^\{(\d+)\}$/)
          if (!m) return <span key={idx}>{seg}</span>
          const nr = Number(m[1])
          const luecke = data.luecken.find((l) => l.nr === nr)
          if (!luecke) return <span key={idx}>{seg}</span>
          const val = answers[nr]
          return (
            <select
              key={idx}
              value={val === undefined ? '' : val}
              onChange={(e) => onAnswer(nr, Number(e.target.value))}
              className={`mx-1 my-1 px-2 py-1 rounded-md bg-[#0a0a1a] border text-sm cursor-pointer focus:outline-none ${
                val === undefined ? 'border-emerald-500/40 text-slate-400' : 'border-emerald-500 text-emerald-200'
              }`}
            >
              <option value="" disabled>({nr}) …</option>
              {luecke.optionen.map((opt, oi) => (
                <option key={oi} value={oi}>{opt}</option>
              ))}
            </select>
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
      <div className="p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] mb-6 text-slate-200 whitespace-pre-line leading-relaxed">
        {data.text}
      </div>
      <div className="space-y-5">
        {data.fragen.map((f, i) => (
          <div key={i}>
            <p className="text-slate-200 font-medium mb-2">{i + 1}. {f.frage}</p>
            <div className="space-y-2">
              {f.optionen.map((opt, oi) => (
                <label
                  key={oi}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    answers[i] === oi
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-100'
                      : 'bg-[#0a0a1a] border-[#2a2a4a] text-slate-300 hover:border-emerald-500/40'
                  }`}
                >
                  <input type="radio" name={`f${i}`} checked={answers[i] === oi} onChange={() => onAnswer(i, oi)} className="mt-1 accent-emerald-500" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
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
          <div key={a.id} className="p-3 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a]">
            <div className="text-emerald-300 font-medium text-sm">{a.titel}</div>
            <div className="text-slate-400 text-sm mt-0.5">{a.text}</div>
          </div>
        ))}
      </div>

      <h3 className="text-slate-400 text-xs uppercase tracking-wide mb-2">Personen</h3>
      <div className="space-y-4">
        {data.personen.map((p) => (
          <div key={p.id} className="p-4 rounded-xl bg-[#12122a] border border-[#1e1e3a]">
            <div className="text-slate-200 font-medium text-sm mb-1">{p.name}</div>
            <p className="text-slate-400 text-sm mb-3">{p.beschreibung}</p>
            <select
              value={answers[p.id] === undefined ? '' : answers[p.id]}
              onChange={(e) => onAnswer(p.id, Number(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg bg-[#0a0a1a] border text-sm cursor-pointer focus:outline-none ${
                answers[p.id] === undefined ? 'border-emerald-500/40 text-slate-400' : 'border-emerald-500 text-emerald-200'
              }`}
            >
              <option value="" disabled>Passende Anzeige wählen …</option>
              {data.anzeigen.map((a) => (
                <option key={a.id} value={a.id}>{a.titel}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- Teil 4: Meinungen ----------
function Teil4({ data, answers, onAnswer }) {
  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">{data.anleitung}</p>
      <div className="space-y-4">
        {data.aussagen.map((a, i) => (
          <div key={i} className="p-4 rounded-xl bg-[#12122a] border border-[#1e1e3a]">
            <div className="text-emerald-300 font-medium text-sm mb-1">{a.person}</div>
            <p className="text-slate-300 text-sm mb-3 italic">„{a.text}“</p>
            <div className="flex gap-2">
              {a.optionen.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => onAnswer(i, oi)}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition cursor-pointer ${
                    answers[i] === oi
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-100'
                      : 'bg-[#0a0a1a] border-[#2a2a4a] text-slate-300 hover:border-emerald-500/40'
                  }`}
                >
                  {POS_LABEL[opt] || opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- Lösungsübersicht (Auswertung) ----------
function SolutionReview({ satz, answers }) {
  const Row = ({ ok, label, your, correct }) => (
    <div className={`p-3 rounded-lg border text-sm ${ok ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
      <div className="flex items-start gap-2">
        <span>{ok ? '✅' : '❌'}</span>
        <div className="flex-1">
          <div className="text-slate-300">{label}</div>
          {!ok && (
            <div className="text-xs mt-1 space-y-0.5">
              <div className="text-red-300">Deine Antwort: {your}</div>
              <div className="text-emerald-300">Richtig: {correct}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Teil 1 */}
      <div>
        <h4 className="text-slate-400 text-sm font-medium mb-2">🧩 Teil 1 — Lückentext</h4>
        <div className="space-y-2">
          {satz.teil1.luecken.map((l) => {
            const your = answers.teil1?.[l.nr]
            const ok = your === l.richtig
            return (
              <Row
                key={l.nr}
                ok={ok}
                label={`Lücke ${l.nr}`}
                your={your === undefined ? '—' : l.optionen[your]}
                correct={l.optionen[l.richtig]}
              />
            )
          })}
        </div>
      </div>

      {/* Teil 2 */}
      <div>
        <h4 className="text-slate-400 text-sm font-medium mb-2">📄 Teil 2 — Multiple Choice</h4>
        <div className="space-y-2">
          {satz.teil2.fragen.map((f, i) => {
            const your = answers.teil2?.[i]
            const ok = your === f.richtig
            return (
              <Row
                key={i}
                ok={ok}
                label={`${i + 1}. ${f.frage}`}
                your={your === undefined ? '—' : f.optionen[your]}
                correct={f.optionen[f.richtig]}
              />
            )
          })}
        </div>
      </div>

      {/* Teil 3 */}
      <div>
        <h4 className="text-slate-400 text-sm font-medium mb-2">🔀 Teil 3 — Zuordnung</h4>
        <div className="space-y-2">
          {satz.teil3.personen.map((p) => {
            const your = answers.teil3?.[p.id]
            const correctId = satz.teil3.loesung[p.id]
            const ok = your === correctId
            const titelOf = (id) => satz.teil3.anzeigen.find((a) => a.id === id)?.titel || '—'
            return (
              <Row
                key={p.id}
                ok={ok}
                label={p.name}
                your={your === undefined ? '—' : titelOf(your)}
                correct={titelOf(correctId)}
              />
            )
          })}
        </div>
      </div>

      {/* Teil 4 */}
      <div>
        <h4 className="text-slate-400 text-sm font-medium mb-2">💬 Teil 4 — Meinungen</h4>
        <div className="space-y-2">
          {satz.teil4.aussagen.map((a, i) => {
            const your = answers.teil4?.[i]
            const ok = your === a.richtig
            return (
              <Row
                key={i}
                ok={ok}
                label={a.person}
                your={your === undefined ? '—' : (POS_LABEL[a.optionen[your]] || a.optionen[your])}
                correct={POS_LABEL[a.optionen[a.richtig]] || a.optionen[a.richtig]}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
