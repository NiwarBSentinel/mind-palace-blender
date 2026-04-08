import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const EMOJIS = ['🏛️', '🏠', '🏰', '🏫', '🏢', '🏗️', '🌳', '🏔️', '🌊', '🚀', '🎭', '🎪', '📚', '🧪', '🔬', '🎨', '🎵', '⚽', '🧠', '💡', '🗺️', '🏝️', '🌌', '🔮']

export default function CreatePalace() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [beschreibung, setBeschreibung] = useState('')
  const [emoji, setEmoji] = useState('🏛️')
  const [rooms, setRooms] = useState([])
  const [roomInput, setRoomInput] = useState('')
  const [lociByRoom, setLociByRoom] = useState({})
  const [lociInput, setLociInput] = useState('')
  const [activeRoom, setActiveRoom] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function addRoom() {
    if (!roomInput.trim()) return
    setRooms([...rooms, roomInput.trim()])
    setRoomInput('')
  }

  function removeRoom(idx) {
    const newRooms = rooms.filter((_, i) => i !== idx)
    setRooms(newRooms)
    const newLoci = { ...lociByRoom }
    delete newLoci[idx]
    // Reindex
    const reindexed = {}
    newRooms.forEach((_, i) => {
      const oldIdx = i >= idx ? i + 1 : i
      if (newLoci[oldIdx]) reindexed[i] = newLoci[oldIdx]
      else if (lociByRoom[i] && i < idx) reindexed[i] = lociByRoom[i]
    })
    setLociByRoom(reindexed)
    if (activeRoom >= newRooms.length) setActiveRoom(Math.max(0, newRooms.length - 1))
  }

  function addLocus() {
    if (!lociInput.trim()) return
    const current = lociByRoom[activeRoom] || []
    setLociByRoom({ ...lociByRoom, [activeRoom]: [...current, lociInput.trim()] })
    setLociInput('')
  }

  function removeLocus(roomIdx, locusIdx) {
    const current = lociByRoom[roomIdx] || []
    setLociByRoom({ ...lociByRoom, [roomIdx]: current.filter((_, i) => i !== locusIdx) })
  }

  async function handleSave() {
    if (!user) { setError('Bitte zuerst anmelden.'); return }
    setSaving(true)
    setError(null)
    const raeume = rooms.map((roomName, i) => ({
      name: roomName,
      loci: (lociByRoom[i] || []).map((desc, j) => ({ position: j + 1, beschreibung: desc })),
    }))
    const { error: err } = await supabase.from('custom_palaces').insert({
      user_id: user.id,
      name,
      beschreibung: beschreibung.trim() || null,
      emoji,
      raeume,
    })
    if (err) { setError(err.message); setSaving(false); return }
    navigate('/bmp')
  }

  // STEP 1
  if (step === 1) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <button onClick={() => navigate('/bmp')} className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer">← Zurück</button>
        <h1 className="text-2xl font-bold text-slate-200 mb-6">Neuen Palast erstellen</h1>
        <div className="p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] space-y-5">
          <div className="text-xs text-slate-500 mb-1">Schritt 1 von 3</div>

          <div>
            <label className="text-slate-400 text-sm block mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button key={e} onClick={() => setEmoji(e)} className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition cursor-pointer ${emoji === e ? 'bg-purple-600 ring-2 ring-purple-400' : 'bg-[#1e1e3a] hover:bg-[#2a2a4a]'}`}>{e}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-sm block mb-2">Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. Meine Wohnung" className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition" />
          </div>

          <div>
            <label className="text-slate-400 text-sm block mb-2">Beschreibung</label>
            <input type="text" value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} placeholder="Optionale Beschreibung" className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition" />
          </div>

          <button onClick={() => setStep(2)} disabled={!name.trim()} className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-medium transition cursor-pointer">Weiter →</button>
        </div>
      </div>
    )
  }

  // STEP 2
  if (step === 2) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer">← Zurück</button>
        <h1 className="text-2xl font-bold text-slate-200 mb-6">{emoji} {name} — Räume</h1>
        <div className="p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] space-y-5">
          <div className="text-xs text-slate-500 mb-1">Schritt 2 von 3</div>

          <div className="flex gap-2">
            <input type="text" value={roomInput} onChange={(e) => setRoomInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addRoom()} placeholder="Raumname (z.B. Wohnzimmer)" className="flex-1 px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition" />
            <button onClick={addRoom} disabled={!roomInput.trim()} className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-medium transition cursor-pointer">+</button>
          </div>

          {rooms.length > 0 && (
            <div className="space-y-2">
              {rooms.map((room, i) => (
                <div key={`${room}_${i}`} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a1a]">
                  <span className="text-slate-200 text-sm"><span className="text-purple-400 font-mono mr-2">{i + 1}.</span>{room}</span>
                  <button onClick={() => removeRoom(i)} className="text-red-400 hover:text-red-300 text-xs cursor-pointer">×</button>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => { setActiveRoom(0); setStep(3) }} disabled={rooms.length === 0} className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-medium transition cursor-pointer">Weiter →</button>
        </div>
      </div>
    )
  }

  // STEP 3
  const currentRoomLoci = lociByRoom[activeRoom] || []
  const totalLoci = Object.values(lociByRoom).reduce((sum, l) => sum + l.length, 0)

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button onClick={() => setStep(2)} className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer">← Zurück</button>
      <h1 className="text-2xl font-bold text-slate-200 mb-6">{emoji} {name} — Loci</h1>
      <div className="p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a] space-y-5">
        <div className="text-xs text-slate-500 mb-1">Schritt 3 von 3 · {totalLoci} Loci gesamt</div>

        {/* Room tabs */}
        <div className="flex flex-wrap gap-2">
          {rooms.map((room, i) => (
            <button key={`${room}_${i}`} onClick={() => setActiveRoom(i)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${activeRoom === i ? 'bg-purple-600 text-white' : 'bg-[#1e1e3a] text-slate-400 hover:text-slate-200'}`}>
              {room} ({(lociByRoom[i] || []).length})
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input type="text" value={lociInput} onChange={(e) => setLociInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLocus()} placeholder={`Locus ${currentRoomLoci.length + 1} (z.B. Die Eingangstür)`} className="flex-1 px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition" />
          <button onClick={addLocus} disabled={!lociInput.trim()} className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-medium transition cursor-pointer">+</button>
        </div>

        {currentRoomLoci.length > 0 && (
          <div className="space-y-1">
            {currentRoomLoci.map((locus, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#0a0a1a]">
                <span className="text-slate-200 text-sm"><span className="text-purple-300 font-bold font-mono mr-2">{i + 1}.</span>{locus}</span>
                <button onClick={() => removeLocus(activeRoom, i)} className="text-red-400 hover:text-red-300 text-xs cursor-pointer">×</button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button onClick={handleSave} disabled={saving || totalLoci === 0} className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white font-medium transition cursor-pointer">
          {saving ? 'Speichert...' : 'Fertigstellen ✓'}
        </button>
      </div>
    </div>
  )
}
