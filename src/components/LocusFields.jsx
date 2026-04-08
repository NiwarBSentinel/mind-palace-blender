import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { parsePegNumber } from '../lib/pegLookup'

export default function LocusFields({ palaceId, locusId, userId }) {
  const [info, setInfo] = useState('')
  const [peg, setPeg] = useState('')
  const [loaded, setLoaded] = useState(false)
  const saveTimer = useRef(null)

  useEffect(() => {
    if (!userId) {
      // Load from localStorage for anonymous users
      try {
        const key = `locus_${palaceId}_${locusId}`
        const stored = JSON.parse(localStorage.getItem(key) || '{}')
        setInfo(stored.info || '')
        setPeg(stored.peg || '')
      } catch {}
      setLoaded(true)
      return
    }
    async function load() {
      const { data } = await supabase
        .from('locus_data')
        .select('info, peg_nummer')
        .eq('user_id', userId)
        .eq('palace_id', palaceId)
        .eq('locus_id', locusId)
        .single()
      if (data) {
        setInfo(data.info || '')
        setPeg(data.peg_nummer || '')
      }
      setLoaded(true)
    }
    load()
  }, [palaceId, locusId, userId])

  function scheduleAutoSave(newInfo, newPeg) {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => save(newInfo, newPeg), 1000)
  }

  async function save(newInfo, newPeg) {
    if (!userId) {
      const key = `locus_${palaceId}_${locusId}`
      localStorage.setItem(key, JSON.stringify({ info: newInfo, peg: newPeg }))
      return
    }
    const { error } = await supabase.from('locus_data').upsert({
      user_id: userId,
      palace_id: palaceId,
      locus_id: locusId,
      info: newInfo,
      peg_nummer: newPeg,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,palace_id,locus_id' })
    if (error) console.error('upsert locus_data error:', error)
  }

  function handleInfoChange(val) {
    setInfo(val)
    scheduleAutoSave(val, peg)
  }

  function handlePegChange(val) {
    const clean = val.replace(/\D/g, '')
    setPeg(clean)
    scheduleAutoSave(info, clean)
  }

  const pegPairs = parsePegNumber(peg)
  const hasContent = info || peg

  if (!loaded) return null

  // View mode: show content if any
  if (!hasContent) return null

  return (
    <div className="mt-2 space-y-1.5">
      {info && (
        <div className="text-slate-400 text-xs">📝 {info}</div>
      )}
      {pegPairs.length > 0 && (
        <div className="text-xs text-slate-500">
          🔢 {peg} → {pegPairs.map((p) => `${p.num}=${p.word}`).join(' | ')}
        </div>
      )}
    </div>
  )
}

export function LocusFieldsEditable({ palaceId, locusId, userId }) {
  const [info, setInfo] = useState('')
  const [peg, setPeg] = useState('')
  const [loaded, setLoaded] = useState(false)
  const saveTimer = useRef(null)

  useEffect(() => {
    if (!userId) {
      try {
        const key = `locus_${palaceId}_${locusId}`
        const stored = JSON.parse(localStorage.getItem(key) || '{}')
        setInfo(stored.info || '')
        setPeg(stored.peg || '')
      } catch {}
      setLoaded(true)
      return
    }
    async function load() {
      const { data } = await supabase
        .from('locus_data')
        .select('info, peg_nummer')
        .eq('user_id', userId)
        .eq('palace_id', palaceId)
        .eq('locus_id', locusId)
        .single()
      if (data) {
        setInfo(data.info || '')
        setPeg(data.peg_nummer || '')
      }
      setLoaded(true)
    }
    load()
  }, [palaceId, locusId, userId])

  function scheduleAutoSave(newInfo, newPeg) {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => save(newInfo, newPeg), 1000)
  }

  async function save(newInfo, newPeg) {
    if (!userId) {
      const key = `locus_${palaceId}_${locusId}`
      localStorage.setItem(key, JSON.stringify({ info: newInfo, peg: newPeg }))
      return
    }
    const { error } = await supabase.from('locus_data').upsert({
      user_id: userId,
      palace_id: palaceId,
      locus_id: locusId,
      info: newInfo,
      peg_nummer: newPeg,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,palace_id,locus_id' })
    if (error) console.error('upsert locus_data error:', error)
  }

  function handleInfoChange(val) {
    setInfo(val)
    scheduleAutoSave(val, peg)
  }

  function handlePegChange(val) {
    const clean = val.replace(/\D/g, '')
    setPeg(clean)
    scheduleAutoSave(info, clean)
  }

  const pegPairs = parsePegNumber(peg)

  if (!loaded) return null

  return (
    <div className="mt-2 space-y-2">
      <div>
        <textarea
          value={info}
          onChange={(e) => handleInfoChange(e.target.value)}
          placeholder="📝 Notiz oder Geschichte..."
          rows={2}
          className="w-full px-3 py-2 rounded-lg bg-[#12122a] border border-[#2a2a4a] text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-purple-500 transition resize-none"
        />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={peg}
            onChange={(e) => handlePegChange(e.target.value)}
            placeholder="🔢 Peg-Nummer (z.B. 0122)"
            className="w-40 px-3 py-1.5 rounded-lg bg-[#12122a] border border-[#2a2a4a] text-slate-200 placeholder-slate-600 text-xs font-mono focus:outline-none focus:border-purple-500 transition"
          />
          {pegPairs.length > 0 && (
            <span className="text-xs text-orange-400">
              {pegPairs.map((p) => `${p.num}→${p.word}`).join(' · ')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
