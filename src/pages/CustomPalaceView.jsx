import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import LocusFields, { LocusFieldsEditable } from '../components/LocusFields'
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const EMOJIS = ['🏛️', '🏠', '🏰', '🏫', '🏢', '🏗️', '🌳', '🏔️', '🌊', '🚀', '🎭', '🎪', '📚', '🧪', '🔬', '🎨', '🎵', '⚽', '🧠', '💡', '🗺️', '🏝️', '🌌', '🔮']

function SortableLocus({ locus, locusIdx, roomIdx, editing, id: palaceId, userId, onUpdate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `locus-${roomIdx}-${locusIdx}` })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} className="p-3 rounded-lg bg-[#0a0a1a] flex items-start gap-3">
      {editing && (
        <button {...attributes} {...listeners} className="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing shrink-0 mt-1 touch-none" title="Ziehen zum Verschieben">⠿</button>
      )}
      <span className="text-purple-300 font-bold text-lg font-mono w-8 shrink-0">{locusIdx + 1}</span>
      <div className="flex-1">
        {editing ? (
          <input type="text" value={locus.beschreibung} onChange={(e) => onUpdate(roomIdx, locusIdx, e.target.value)} className="w-full bg-transparent text-slate-200 border-b border-[#2a2a4a] focus:outline-none focus:border-purple-500 text-sm" />
        ) : (
          <span className="text-slate-200">{locus.beschreibung}</span>
        )}
        {editing ? (
          <LocusFieldsEditable palaceId={`custom_${palaceId}`} locusId={`${roomIdx}_${locusIdx}`} userId={userId} />
        ) : (
          <LocusFields palaceId={`custom_${palaceId}`} locusId={`${roomIdx}_${locusIdx}`} userId={userId} />
        )}
      </div>
      {editing && (
        <button onClick={() => onDelete(roomIdx, locusIdx)} className="text-red-400 hover:text-red-300 text-xs cursor-pointer shrink-0">×</button>
      )}
    </div>
  )
}

export default function CustomPalaceView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [palace, setPalace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedRoom, setExpandedRoom] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmoji, setEditEmoji] = useState('')
  const [editRaeume, setEditRaeume] = useState([])
  const [saving, setSaving] = useState(false)
  const [newRoomInput, setNewRoomInput] = useState('')
  const [newLocusInputs, setNewLocusInputs] = useState({})

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('custom_palaces')
        .select('*')
        .eq('id', id)
        .single()
      if (error) console.error('fetch palace error:', error)
      setPalace(data)
      setLoading(false)
    }
    load()
  }, [id])

  function startEditing() {
    setEditName(palace.name)
    setEditEmoji(palace.emoji || '🏛️')
    setEditRaeume(JSON.parse(JSON.stringify(palace.raeume || [])))
    setNewRoomInput('')
    setNewLocusInputs({})
    setEditing(true)
  }

  function cancelEditing() {
    setEditing(false)
  }

  // Edit room name
  function updateRoomName(idx, name) {
    const r = [...editRaeume]
    r[idx] = { ...r[idx], name }
    setEditRaeume(r)
  }

  // Delete room
  function deleteRoom(idx) {
    setEditRaeume(editRaeume.filter((_, i) => i !== idx))
  }

  // Add room
  function addRoom() {
    if (!newRoomInput.trim()) return
    setEditRaeume([...editRaeume, { name: newRoomInput.trim(), loci: [] }])
    setNewRoomInput('')
  }

  // Update locus text
  function updateLocus(roomIdx, locusIdx, text) {
    const r = [...editRaeume]
    const loci = [...(r[roomIdx].loci || [])]
    loci[locusIdx] = { ...loci[locusIdx], beschreibung: text }
    r[roomIdx] = { ...r[roomIdx], loci }
    setEditRaeume(r)
  }

  // Delete locus
  function deleteLocus(roomIdx, locusIdx) {
    const r = [...editRaeume]
    const loci = (r[roomIdx].loci || []).filter((_, i) => i !== locusIdx).map((l, i) => ({ ...l, position: i + 1 }))
    r[roomIdx] = { ...r[roomIdx], loci }
    setEditRaeume(r)
  }

  // Add locus to room
  function addLocus(roomIdx) {
    const text = (newLocusInputs[roomIdx] || '').trim()
    if (!text) return
    const r = [...editRaeume]
    const loci = [...(r[roomIdx].loci || []), { position: (r[roomIdx].loci || []).length + 1, beschreibung: text }]
    r[roomIdx] = { ...r[roomIdx], loci }
    setEditRaeume(r)
    setNewLocusInputs({ ...newLocusInputs, [roomIdx]: '' })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  function handleDragEnd(roomIdx, event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = parseInt(active.id.split('-')[2])
    const newIndex = parseInt(over.id.split('-')[2])
    const r = [...editRaeume]
    const loci = [...(r[roomIdx].loci || [])]
    const [moved] = loci.splice(oldIndex, 1)
    loci.splice(newIndex, 0, moved)
    // Update positions
    const updated = loci.map((l, i) => ({ ...l, position: i + 1 }))
    r[roomIdx] = { ...r[roomIdx], loci: updated }
    setEditRaeume(r)
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase
      .from('custom_palaces')
      .update({ name: editName, emoji: editEmoji, raeume: editRaeume })
      .eq('id', id)
    if (error) console.error('save error:', error)
    setPalace({ ...palace, name: editName, emoji: editEmoji, raeume: editRaeume })
    setEditing(false)
    setSaving(false)
  }

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400">Lade...</div>
  if (!palace) return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      <p className="text-slate-400 mb-4">Palast nicht gefunden.</p>
      <button onClick={() => navigate('/bmp')} className="px-5 py-2 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer">← Zurück</button>
    </div>
  )

  const raeume = editing ? editRaeume : (palace.raeume || [])
  const totalLoci = raeume.reduce((sum, r) => sum + (r.loci?.length || 0), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/bmp')} className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer">← Zurück</button>

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          {editing ? (
            <>
              <div className="flex flex-wrap gap-1">
                {EMOJIS.map((e) => (
                  <button key={e} onClick={() => setEditEmoji(e)} className={`w-8 h-8 rounded text-lg flex items-center justify-center cursor-pointer ${editEmoji === e ? 'bg-purple-600 ring-1 ring-purple-400' : 'bg-[#1e1e3a] hover:bg-[#2a2a4a]'}`}>{e}</button>
                ))}
              </div>
            </>
          ) : (
            <span className="text-4xl">{palace.emoji || '🏛️'}</span>
          )}
        </div>
        {!editing && (
          <button onClick={startEditing} className="px-3 py-1.5 rounded-lg bg-[#1e1e3a] text-slate-400 hover:text-purple-300 text-xs transition cursor-pointer">✏️ Bearbeiten</button>
        )}
      </div>

      {editing ? (
        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="text-2xl font-bold bg-transparent text-slate-200 border-b border-purple-500/50 focus:outline-none focus:border-purple-400 mb-2 w-full" />
      ) : (
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">{palace.name}</h1>
      )}
      {palace.beschreibung && !editing && <p className="text-slate-400 text-sm mb-2">{palace.beschreibung}</p>}
      <p className="text-slate-500 text-sm mb-8">{raeume.length} Räume · {totalLoci} Loci</p>

      {/* Rooms */}
      <div className="space-y-3">
        {raeume.map((room, roomIdx) => (
          <div key={roomIdx} className="rounded-xl bg-[#12122a] border border-[#1e1e3a] overflow-hidden">
            <div
              onClick={() => !editing && setExpandedRoom(expandedRoom === roomIdx ? null : roomIdx)}
              className={`flex items-center justify-between p-4 ${!editing ? 'cursor-pointer hover:bg-[#16163a]' : ''} transition`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-purple-400 text-sm font-mono w-6">{roomIdx + 1}</span>
                {!editing && <span className={`transition text-sm ${expandedRoom === roomIdx ? 'rotate-90' : ''}`}>▶</span>}
                {editing ? (
                  <input type="text" value={room.name} onChange={(e) => updateRoomName(roomIdx, e.target.value)} className="flex-1 bg-transparent text-slate-200 border-b border-[#2a2a4a] focus:outline-none focus:border-purple-500 text-sm" />
                ) : (
                  <span className="text-slate-200 font-medium">{room.name}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">{room.loci?.length || 0} Loci</span>
                {editing && (
                  <button onClick={() => deleteRoom(roomIdx)} className="text-red-400 hover:text-red-300 text-xs cursor-pointer ml-2">🗑️</button>
                )}
              </div>
            </div>

            {(expandedRoom === roomIdx || editing) && (
              <div className="border-t border-[#1e1e3a] p-4 space-y-2">
                {editing ? (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(roomIdx, e)}>
                    <SortableContext items={(room.loci || []).map((_, i) => `locus-${roomIdx}-${i}`)} strategy={verticalListSortingStrategy}>
                      {(room.loci || []).map((locus, locusIdx) => (
                        <SortableLocus
                          key={`locus-${roomIdx}-${locusIdx}`}
                          locus={locus}
                          locusIdx={locusIdx}
                          roomIdx={roomIdx}
                          editing={true}
                          id={id}
                          userId={user?.id}
                          onUpdate={updateLocus}
                          onDelete={deleteLocus}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
                  (room.loci || []).map((locus, locusIdx) => (
                    <div key={locusIdx} className="p-3 rounded-lg bg-[#0a0a1a] flex items-start gap-3">
                      <span className="text-purple-300 font-bold text-lg font-mono w-8 shrink-0">{locus.position}</span>
                      <div className="flex-1">
                        <span className="text-slate-200">{locus.beschreibung}</span>
                        <LocusFields palaceId={`custom_${id}`} locusId={`${roomIdx}_${locusIdx}`} userId={user?.id} />
                      </div>
                    </div>
                  ))
                )}
                {!editing && (room.loci || []).length === 0 && (
                  <p className="text-slate-600 text-sm italic">Keine Loci in diesem Raum</p>
                )}
                {editing && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newLocusInputs[roomIdx] || ''}
                      onChange={(e) => setNewLocusInputs({ ...newLocusInputs, [roomIdx]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && addLocus(roomIdx)}
                      placeholder={`Locus ${(room.loci || []).length + 1} hinzufügen...`}
                      className="flex-1 px-3 py-2 rounded-lg bg-[#12122a] border border-[#2a2a4a] text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500 transition"
                    />
                    <button onClick={() => addLocus(roomIdx)} className="px-3 py-2 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 text-sm transition cursor-pointer">＋</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add room + Save buttons in edit mode */}
      {editing && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newRoomInput}
              onChange={(e) => setNewRoomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRoom()}
              placeholder="Neuen Raum hinzufügen..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
            />
            <button onClick={addRoom} disabled={!newRoomInput.trim()} className="px-5 py-2.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 disabled:opacity-30 transition cursor-pointer">＋ Raum</button>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving || !editName.trim()} className="flex-1 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white font-medium transition cursor-pointer">
              {saving ? 'Speichert...' : '💾 Speichern'}
            </button>
            <button onClick={cancelEditing} className="px-6 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer">Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  )
}
