import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden'))
    reader.readAsDataURL(file)
  })
}

export default function VociImport() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pairs, setPairs] = useState([])
  const [flipped, setFlipped] = useState(new Set())
  const [kategorie, setKategorie] = useState('Voci')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleFile(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setError('')
    setPairs([])
    setFlipped(new Set())
    setSaved(false)
  }

  async function analyze() {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const base64 = await fileToBase64(file)
      const res = await fetch('/api/ocr-vocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mediaType: file.type || 'image/jpeg' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Fehler bei der OCR-Analyse')
      if (!Array.isArray(data.pairs) || data.pairs.length === 0) {
        throw new Error('Keine Wortpaare im Bild gefunden.')
      }
      setPairs(data.pairs)
      setFlipped(new Set())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function toggleFlip(i) {
    setFlipped((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  function shuffleCards() {
    setPairs((prev) => [...prev].sort(() => Math.random() - 0.5))
    setFlipped(new Set())
  }

  function updatePair(i, key, value) {
    setPairs((prev) => prev.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)))
  }

  function removePair(i) {
    setPairs((prev) => prev.filter((_, idx) => idx !== i))
    setFlipped((prev) => {
      const next = new Set()
      prev.forEach((idx) => {
        if (idx < i) next.add(idx)
        else if (idx > i) next.add(idx - 1)
      })
      return next
    })
  }

  async function saveAll() {
    const valid = pairs.filter((p) => p.a.trim() && p.b.trim())
    if (valid.length === 0) return
    setSaving(true)
    try {
      const rows = valid.map((p) => ({
        frage: p.a.trim(),
        antwort: p.b.trim(),
        kategorie: kategorie.trim() || 'Voci',
        ...(user ? { user_id: user.id } : {}),
      }))
      const { error: insErr } = await supabase.from('lernkarten').insert(rows)
      if (insErr) throw insErr
      setSaved(true)
    } catch (err) {
      setError('Speichern fehlgeschlagen: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  function reset() {
    setFile(null)
    setPreviewUrl('')
    setPairs([])
    setFlipped(new Set())
    setError('')
    setSaved(false)
  }

  const learnedCount = flipped.size
  const progressPct = pairs.length > 0 ? Math.round((learnedCount / pairs.length) * 100) : 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/lernkarten')}
        className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
      >
        ← Zurück zu den Lernkarten
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Voci aus Bild
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Foto einer Wortliste hochladen — Claude erkennt die Paare automatisch.
        </p>
      </div>

      {/* Upload */}
      {!pairs.length && (
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center p-10 rounded-xl border-2 border-dashed border-[#2a2a4a] hover:border-green-500/40 cursor-pointer transition bg-[#12122a] group">
            <div className="text-4xl mb-2 opacity-60 group-hover:opacity-100 transition">🖼️</div>
            <div className="text-slate-300 font-medium">Bild auswählen oder Kamera öffnen</div>
            <div className="text-slate-500 text-xs mt-1">JPG, PNG, HEIC — Schulblätter, Listen, handgeschrieben</div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          {previewUrl && (
            <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#12122a] border border-[#1e1e3a]">
              <img
                src={previewUrl}
                alt="Vorschau"
                className="max-h-64 rounded-lg border border-[#2a2a4a] object-contain"
              />
              <div className="flex gap-2">
                <button
                  onClick={reset}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] disabled:opacity-40 transition cursor-pointer text-sm"
                >
                  Anderes Bild
                </button>
                <button
                  onClick={analyze}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white font-medium transition cursor-pointer text-sm"
                >
                  {loading ? 'Analysiere…' : 'Wörter erkennen ↗'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              ❌ {error}
            </div>
          )}
        </div>
      )}

      {/* Pairs review */}
      {pairs.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-300 font-medium">
                {pairs.length} Paare erkannt
              </span>
              <span className="text-slate-500 text-xs hidden sm:inline">Klicken zum Umdrehen</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={shuffleCards}
                className="px-3 py-1.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer text-xs"
              >
                Mischen
              </button>
              <button
                onClick={reset}
                className="px-3 py-1.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer text-xs"
              >
                Neues Bild
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 whitespace-nowrap">
              {learnedCount} / {pairs.length} umgedreht
            </span>
            <div className="flex-1 h-1 rounded-full bg-[#1e1e3a] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <button
              onClick={() => setFlipped(new Set())}
              className="px-2 py-1 rounded text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Flashcards grid */}
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {pairs.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleFlip(i)}
                className="relative group text-left"
                style={{ perspective: '900px' }}
              >
                <div
                  className="relative w-full h-36 transition-transform duration-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flipped.has(i) ? 'rotateY(180deg)' : 'none',
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-xl border border-[#2a2a4a] bg-[#12122a] flex flex-col items-center justify-center p-3 gap-1"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Seite A</span>
                    <span className="text-slate-100 font-medium text-lg text-center break-words">{p.a}</span>
                  </div>
                  <div
                    className="absolute inset-0 rounded-xl border border-green-500/20 bg-[#0a2a1a] flex flex-col items-center justify-center p-3 gap-1"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <span className="text-[10px] uppercase tracking-widest text-green-400/70">Seite B</span>
                    <span className="text-green-200 font-medium text-lg text-center break-words">{p.b}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Edit list */}
          <details className="rounded-xl bg-[#12122a] border border-[#1e1e3a]">
            <summary className="px-4 py-3 cursor-pointer text-slate-300 text-sm font-medium select-none">
              Paare bearbeiten / entfernen
            </summary>
            <div className="px-4 pb-4 space-y-2">
              {pairs.map((p, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-xs text-slate-500 w-6 shrink-0 text-right">{i + 1}</span>
                  <input
                    type="text"
                    value={p.a}
                    onChange={(e) => updatePair(i, 'a', e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 text-sm focus:outline-none focus:border-green-500 transition"
                  />
                  <span className="text-slate-600">→</span>
                  <input
                    type="text"
                    value={p.b}
                    onChange={(e) => updatePair(i, 'b', e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 text-sm focus:outline-none focus:border-green-500 transition"
                  />
                  <button
                    onClick={() => removePair(i)}
                    className="px-2 py-1 rounded text-red-400 hover:bg-red-500/10 transition cursor-pointer text-xs"
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </details>

          {/* Save as Lernkarten */}
          <div className="p-4 rounded-xl bg-[#12122a] border border-[#1e1e3a] space-y-3">
            <div className="text-slate-300 text-sm font-medium">Als Lernkarten speichern</div>
            <div className="flex flex-wrap gap-2 items-center">
              <label className="text-xs text-slate-500">Kategorie:</label>
              <input
                type="text"
                value={kategorie}
                onChange={(e) => setKategorie(e.target.value)}
                placeholder="z.B. Französisch Lektion 5"
                className="flex-1 min-w-[160px] px-3 py-1.5 rounded bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 text-sm focus:outline-none focus:border-green-500 transition"
              />
              <button
                onClick={saveAll}
                disabled={saving || saved || pairs.length === 0 || !user}
                className="px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-sm font-medium transition cursor-pointer"
              >
                {saved ? '✓ Gespeichert' : saving ? 'Speichere…' : `${pairs.length} Karten speichern`}
              </button>
            </div>
            {!user && (
              <p className="text-xs text-amber-400">
                Bitte einloggen, um Karten dauerhaft zu speichern.
              </p>
            )}
            {saved && (
              <div className="flex items-center gap-3">
                <p className="text-xs text-green-300">Karten wurden zu deinen Lernkarten hinzugefügt.</p>
                <button
                  onClick={() => navigate('/lernkarten')}
                  className="text-xs text-green-400 hover:text-green-300 underline cursor-pointer"
                >
                  Zur Übersicht →
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              ❌ {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
