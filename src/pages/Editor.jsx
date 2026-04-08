import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [palace, setPalace] = useState(null)
  const [rooms, setRooms] = useState([])
  const [expandedRoom, setExpandedRoom] = useState(null)
  const [loci, setLoci] = useState({})
  const [newRoomName, setNewRoomName] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingLocus, setEditingLocus] = useState(null)
  const [locusForm, setLocusForm] = useState({
    position: '', person: '', action: '', object: '', major_zahl: '', major_zahl_2: '', notiz: ''
  })
  const [editingRoomId, setEditingRoomId] = useState(null)
  const [editingRoomName, setEditingRoomName] = useState('')

  useEffect(() => {
    fetchPalace()
    fetchRooms()
  }, [id])

  async function fetchPalace() {
    const { data, error } = await supabase.from('palaces').select('*').eq('id', id).single()
    if (error) console.error('fetchPalace error:', error)
    setPalace(data)
  }

  async function fetchRooms() {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('palace_id', id)
      .order('reihenfolge')
    if (error) console.error('fetchRooms error:', error)
    setRooms(data || [])
    setLoading(false)
  }

  async function fetchLoci(roomId) {
    const { data, error } = await supabase
      .from('loci')
      .select('*')
      .eq('room_id', roomId)
      .order('position')
    if (error) console.error('fetchLoci error:', error)
    setLoci((prev) => ({ ...prev, [roomId]: data || [] }))
  }

  async function addRoom(e) {
    e.preventDefault()
    if (!newRoomName.trim()) return
    const reihenfolge = rooms.length + 1
    const { error } = await supabase
      .from('rooms')
      .insert({ palace_id: id, name: newRoomName.trim(), reihenfolge })
    if (error) console.error('addRoom error:', error)
    if (!error) {
      setNewRoomName('')
      await fetchRooms()
    }
  }

  async function deleteRoom(roomId, e) {
    e.stopPropagation()
    if (!confirm('Raum und alle Loci löschen?')) return
    await supabase.from('loci').delete().eq('room_id', roomId)
    await supabase.from('rooms').delete().eq('id', roomId)
    if (expandedRoom === roomId) setExpandedRoom(null)
    await fetchRooms()
  }

  async function toggleRoom(roomId) {
    if (expandedRoom === roomId) {
      setExpandedRoom(null)
    } else {
      setExpandedRoom(roomId)
      if (!loci[roomId]) await fetchLoci(roomId)
    }
  }

  function startEditRoom(room, e) {
    e.stopPropagation()
    setEditingRoomId(room.id)
    setEditingRoomName(room.name)
  }

  async function saveRoomName(roomId) {
    if (!editingRoomName.trim()) { setEditingRoomId(null); return }
    await supabase.from('rooms').update({ name: editingRoomName.trim() }).eq('id', roomId)
    setEditingRoomId(null)
    await fetchRooms()
  }

  function startAddLocus(roomId) {
    const roomLoci = loci[roomId] || []
    const nextPos = roomLoci.length > 0
      ? Math.max(...roomLoci.map((l) => l.position)) + 1
      : 1
    setEditingLocus({ roomId, isNew: true })
    setLocusForm({
      position: String(nextPos), person: '', action: '', object: '', major_zahl: '', major_zahl_2: '', notiz: ''
    })
  }

  function startEditLocus(locus, roomId) {
    setEditingLocus({ id: locus.id, roomId, isNew: false })
    setLocusForm({
      position: String(locus.position || ''),
      person: locus.person || '',
      action: locus.action || '',
      object: locus.object || '',
      major_zahl: locus.major_zahl || '',
      major_zahl_2: locus.major_zahl_2 || '',
      notiz: locus.notiz || '',
    })
  }

  async function saveLocus(e) {
    e.preventDefault()
    const payload = {
      position: parseInt(locusForm.position) || 0,
      person: locusForm.person,
      action: locusForm.action,
      object: locusForm.object,
      major_zahl: locusForm.major_zahl,
      major_zahl_2: locusForm.major_zahl_2,
      notiz: locusForm.notiz,
    }

    if (editingLocus.isNew) {
      payload.room_id = editingLocus.roomId
      const { error } = await supabase.from('loci').insert(payload)
      if (error) console.error('insert locus error:', error)
    } else {
      const { error } = await supabase.from('loci').update(payload).eq('id', editingLocus.id)
      if (error) console.error('update locus error:', error)
    }

    await fetchLoci(editingLocus.roomId)
    setEditingLocus(null)
  }

  async function deleteLocus(locusId, roomId) {
    if (!confirm('Locus löschen?')) return
    await supabase.from('loci').delete().eq('id', locusId)
    await fetchLoci(roomId)
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400">Lade...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/palaces')}
            className="text-slate-400 hover:text-slate-200 transition text-sm mb-2 cursor-pointer"
          >
            ← Alle Paläste
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {palace?.name}
          </h1>
          {palace?.beschreibung && (
            <p className="text-slate-400 text-sm mt-1">{palace.beschreibung}</p>
          )}
        </div>
        <button
          onClick={() => navigate(`/practice/${id}`)}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition cursor-pointer"
        >
          Üben →
        </button>
      </div>

      <form onSubmit={addRoom} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Neuer Raum..."
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg bg-[#12122a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
        />
        <button
          type="submit"
          disabled={!newRoomName.trim()}
          className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-medium transition cursor-pointer"
        >
          Raum hinzufügen
        </button>
      </form>

      {rooms.length === 0 ? (
        <p className="text-center text-slate-500 py-8">
          Noch keine Räume. Füge deinen ersten Raum hinzu!
        </p>
      ) : (
        <div className="space-y-3">
          {rooms.map((room) => (
            <div key={room.id} className="rounded-xl bg-[#12122a] border border-[#1e1e3a] overflow-hidden">
              <div
                onClick={() => toggleRoom(room.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#16163a] transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 text-sm font-mono w-6">{room.reihenfolge}</span>
                  <span className={`transition text-sm ${expandedRoom === room.id ? 'rotate-90' : ''}`}>▶</span>
                  {editingRoomId === room.id ? (
                    <input
                      type="text"
                      value={editingRoomName}
                      onChange={(e) => setEditingRoomName(e.target.value)}
                      onBlur={() => saveRoomName(room.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveRoomName(room.id); if (e.key === 'Escape') setEditingRoomId(null) }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="px-2 py-1 rounded bg-[#0a0a1a] border border-purple-500/50 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition"
                    />
                  ) : (
                    <span
                      className="text-slate-200 font-medium hover:text-purple-300 transition"
                      onClick={(e) => startEditRoom(room, e)}
                      title="Klicken zum Umbenennen"
                    >
                      {room.name}
                    </span>
                  )}
                  <span className="text-slate-500 text-sm">
                    {loci[room.id] ? `${loci[room.id].length} Loci` : ''}
                  </span>
                </div>
                <button
                  onClick={(e) => deleteRoom(room.id, e)}
                  className="text-sm text-red-400 hover:bg-red-500/10 px-2 py-1 rounded transition cursor-pointer"
                >
                  Löschen
                </button>
              </div>

              {expandedRoom === room.id && (
                <div className="border-t border-[#1e1e3a] p-4">
                  {(loci[room.id] || []).length === 0 && !editingLocus && (
                    <p className="text-slate-500 text-sm text-center py-2">Keine Loci vorhanden.</p>
                  )}

                  <div className="space-y-2">
                    {(loci[room.id] || []).map((locus) =>
                      editingLocus && editingLocus.id === locus.id ? (
                        <LocusFormComponent
                          key={locus.id}
                          form={locusForm}
                          setForm={setLocusForm}
                          onSave={saveLocus}
                          onCancel={() => setEditingLocus(null)}
                        />
                      ) : (
                        <div
                          key={locus.id}
                          className="p-3 rounded-lg bg-[#0a0a1a] group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 grid grid-cols-6 gap-2 text-sm">
                              <div>
                                <span className="text-slate-500 text-xs">Pos</span>
                                <div className="text-purple-300 font-bold">{locus.position}</div>
                              </div>
                              <div>
                                <span className="text-slate-500 text-xs">Person</span>
                                <div className="text-slate-200">{locus.person || '–'}</div>
                              </div>
                              <div>
                                <span className="text-slate-500 text-xs">Aktion</span>
                                <div className="text-slate-200">{locus.action || '–'}</div>
                              </div>
                              <div>
                                <span className="text-slate-500 text-xs">Objekt</span>
                                <div className="text-slate-200">{locus.object || '–'}</div>
                              </div>
                              <div>
                                <span className="text-slate-500 text-xs">Major 1</span>
                                <div className="text-blue-300 font-mono">{locus.major_zahl || '–'}</div>
                              </div>
                              <div>
                                <span className="text-slate-500 text-xs">Major 2</span>
                                <div className="text-blue-300 font-mono">{locus.major_zahl_2 || '–'}</div>
                              </div>
                            </div>
                            <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition">
                              <button
                                onClick={() => startEditLocus(locus, room.id)}
                                className="text-xs px-2 py-1 rounded text-blue-400 hover:bg-blue-500/10 transition cursor-pointer"
                              >
                                Bearbeiten
                              </button>
                              <button
                                onClick={() => deleteLocus(locus.id, room.id)}
                                className="text-xs px-2 py-1 rounded text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                              >
                                Löschen
                              </button>
                            </div>
                          </div>
                          {locus.notiz && (
                            <div className="mt-2 pt-2 border-t border-[#1e1e3a]">
                              <span className="text-slate-500 text-xs">Notiz</span>
                              <div className="text-slate-400 text-sm whitespace-pre-wrap">{locus.notiz}</div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  {editingLocus && editingLocus.isNew && editingLocus.roomId === room.id ? (
                    <div className="mt-3">
                      <LocusFormComponent
                        form={locusForm}
                        setForm={setLocusForm}
                        onSave={saveLocus}
                        onCancel={() => setEditingLocus(null)}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => startAddLocus(room.id)}
                      className="mt-3 w-full py-2 rounded-lg border border-dashed border-[#2a2a4a] text-slate-400 hover:text-purple-300 hover:border-purple-500/30 transition text-sm cursor-pointer"
                    >
                      + Locus hinzufügen
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function LocusFormComponent({ form, setForm, onSave, onCancel }) {
  function autoResize(e) {
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  return (
    <form onSubmit={onSave} className="p-3 rounded-lg bg-[#0a0a1a] border border-purple-500/20 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <input
          type="number"
          placeholder="Position"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          className="px-3 py-2 rounded bg-[#12122a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition"
        />
        <input
          type="text"
          placeholder="Person"
          value={form.person}
          onChange={(e) => setForm({ ...form, person: e.target.value })}
          className="px-3 py-2 rounded bg-[#12122a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition"
        />
        <input
          type="text"
          placeholder="Aktion"
          value={form.action}
          onChange={(e) => setForm({ ...form, action: e.target.value })}
          className="px-3 py-2 rounded bg-[#12122a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Objekt"
          value={form.object}
          onChange={(e) => setForm({ ...form, object: e.target.value })}
          className="px-3 py-2 rounded bg-[#12122a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition"
        />
        <input
          type="text"
          placeholder="Major 1"
          value={form.major_zahl}
          onChange={(e) => setForm({ ...form, major_zahl: e.target.value })}
          className="px-3 py-2 rounded bg-[#12122a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition"
        />
        <input
          type="text"
          placeholder="Major 2"
          value={form.major_zahl_2}
          onChange={(e) => setForm({ ...form, major_zahl_2: e.target.value })}
          className="px-3 py-2 rounded bg-[#12122a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition"
        />
      </div>
      <textarea
        placeholder="Notiz"
        value={form.notiz}
        onChange={(e) => { setForm({ ...form, notiz: e.target.value }); autoResize(e) }}
        onFocus={autoResize}
        rows={2}
        className="w-full px-3 py-2 rounded bg-[#12122a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition resize-none"
      />
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1.5 rounded text-sm text-slate-400 hover:bg-[#1e1e3a] transition cursor-pointer"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-sm transition cursor-pointer"
        >
          Speichern
        </button>
      </div>
    </form>
  )
}
