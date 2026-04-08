import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
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

  // Image map state
  const [markers, setMarkers] = useState([])
  const [uploading, setUploading] = useState(false)
  const [highlightedRoom, setHighlightedRoom] = useState(null)
  const [dragging, setDragging] = useState(null)
  const imgRef = useRef(null)

  useEffect(() => {
    fetchPalace()
    fetchRooms()
    fetchMarkers()
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

  async function fetchMarkers() {
    const { data } = await supabase
      .from('palace_markers')
      .select('*')
      .eq('palace_id', id)
      .order('room_index')
    setMarkers(data || [])
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    // Use a fixed filename per palace to avoid orphaned files
    const path = `${id}`
    const { error: upErr } = await supabase.storage
      .from('palace-images')
      .upload(path, file, { upsert: true, contentType: file.type })
    if (upErr) { console.error('upload error:', upErr); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('palace-images').getPublicUrl(path)
    const image_url = urlData.publicUrl
    console.log('Saved image_url:', image_url)
    const { error: dbErr } = await supabase.from('palaces').update({ image_url }).eq('id', id)
    if (dbErr) console.error('save image_url error:', dbErr)
    setPalace((p) => ({ ...p, image_url }))
    setUploading(false)
  }

  // Track if a drag actually moved so we don't fire click after drag
  const didDrag = useRef(false)

  async function handleImageClick(e) {
    if (dragging !== null || didDrag.current) return
    const rect = imgRef.current.getBoundingClientRect()
    const clientX = e.clientX ?? e.changedTouches?.[0]?.clientX
    const clientY = e.clientY ?? e.changedTouches?.[0]?.clientY
    if (clientX == null || clientY == null) return
    const x_percent = ((clientX - rect.left) / rect.width) * 100
    const y_percent = ((clientY - rect.top) / rect.height) * 100
    const nextIndex = markers.length > 0 ? Math.max(...markers.map((m) => m.room_index)) + 1 : 1
    if (nextIndex > rooms.length) return
    const { data, error } = await supabase
      .from('palace_markers')
      .insert({ palace_id: id, room_index: nextIndex, x_percent, y_percent })
      .select()
      .single()
    if (!error && data) setMarkers((prev) => [...prev, data])
  }

  function handleMarkerPointerDown(e, marker) {
    e.stopPropagation()
    e.preventDefault()
    didDrag.current = false
    setDragging(marker.id)

    // Recalculate rect on every move so scroll changes don't break positioning
    function getPos(ev) {
      const rect = imgRef.current.getBoundingClientRect()
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX
      const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY
      return {
        x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
        y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
      }
    }

    function onMove(ev) {
      ev.preventDefault()
      ev.stopPropagation()
      didDrag.current = true
      const { x, y } = getPos(ev)
      setMarkers((prev) => prev.map((m) =>
        m.id === marker.id ? { ...m, x_percent: x, y_percent: y } : m
      ))
    }

    function onUp(ev) {
      ev.preventDefault()
      ev.stopPropagation()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
      window.removeEventListener('touchcancel', onUp)
      document.body.style.overflow = ''
      setDragging(null)
      // persist
      setMarkers((prev) => {
        const m = prev.find((mk) => mk.id === marker.id)
        if (m) {
          supabase.from('palace_markers')
            .update({ x_percent: m.x_percent, y_percent: m.y_percent })
            .eq('id', m.id)
            .then(({ error }) => {
              if (error) console.error('update marker position error:', error)
            })
        }
        return prev
      })
      // reset didDrag after a tick so click handler can check it
      setTimeout(() => { didDrag.current = false }, 50)
    }

    // Lock page scroll while dragging on touch
    document.body.style.overflow = 'hidden'

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp, { passive: false })
    window.addEventListener('touchcancel', onUp)
  }

  async function deleteMarker(markerId, e) {
    e.stopPropagation()
    await supabase.from('palace_markers').delete().eq('id', markerId)
    setMarkers((prev) => prev.filter((m) => m.id !== markerId))
  }

  function handleMarkerClick(marker, e) {
    e.stopPropagation()
    const room = rooms[marker.room_index - 1]
    if (room) {
      setHighlightedRoom(room.id)
      setExpandedRoom(room.id)
      if (!loci[room.id]) fetchLoci(room.id)
      setTimeout(() => setHighlightedRoom(null), 2000)
    }
  }

  const [sharing, setSharing] = useState(false)

  async function shareAsTemplate() {
    if (!user || !palace) return
    setSharing(true)
    // 1. Create template
    const { data: tmpl, error: tmplErr } = await supabase
      .from('palace_templates')
      .insert({
        created_by: user.id,
        title: palace.name,
        description: palace.beschreibung || '',
        image_url: palace.image_url || '',
        category: 'Allgemein',
        copy_count: 0,
      })
      .select()
      .single()
    if (tmplErr || !tmpl) { console.error('share template error:', tmplErr); setSharing(false); return }

    // 2. Copy rooms and loci
    for (const room of rooms) {
      const { data: tRoom } = await supabase
        .from('template_rooms')
        .insert({ template_id: tmpl.id, name: room.name, position: room.reihenfolge })
        .select()
        .single()
      if (!tRoom) continue

      // Fetch loci for this room if not already loaded
      let roomLoci = loci[room.id]
      if (!roomLoci) {
        const { data } = await supabase.from('loci').select('*').eq('room_id', room.id).order('position')
        roomLoci = data || []
      }

      if (roomLoci.length > 0) {
        const lociInserts = roomLoci.map((l) => ({
          room_id: tRoom.id,
          position: l.position,
          person: l.person || '',
          aktion: l.action || '',
          objekt: l.object || '',
          major: l.major_zahl || '',
          notiz: l.notiz || '',
        }))
        await supabase.from('template_loci').insert(lociInserts)
      }
    }

    setSharing(false)
    alert('Vorlage wurde veröffentlicht!')
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
    <div className="max-w-7xl mx-auto px-4 pt-14 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate('/palaces')}
            className="text-slate-400 hover:text-slate-200 transition text-sm mb-2 cursor-pointer"
          >
            ← Alle Paläste
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {palace?.name}
          </h1>
          {palace?.beschreibung && (
            <p className="text-slate-400 text-sm mt-1">{palace.beschreibung}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {user && rooms.length > 0 && (
            <button
              onClick={shareAsTemplate}
              disabled={sharing}
              className="px-4 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] text-sm font-medium transition cursor-pointer disabled:opacity-40"
            >
              {sharing ? 'Teile...' : 'Als Vorlage teilen'}
            </button>
          )}
          <button
            onClick={() => navigate(`/practice/${id}`)}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition cursor-pointer"
          >
            Üben →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Mobile: Image map first */}
        <div className="lg:hidden">
          <ImageMapSection
            palace={palace}
            markers={markers}
            rooms={rooms}
            imgRef={imgRef}
            uploading={uploading}
            dragging={dragging}
            highlightedRoom={highlightedRoom}
            handleImageClick={handleImageClick}
            handleMarkerPointerDown={handleMarkerPointerDown}
            handleMarkerClick={handleMarkerClick}
            deleteMarker={deleteMarker}
            handleImageUpload={handleImageUpload}
          />
        </div>

        {/* Left: Room list (60%) */}
        <div className="lg:col-span-3">
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
                <div
                  key={room.id}
                  className={`rounded-xl bg-[#12122a] border overflow-hidden group/room transition-colors ${highlightedRoom === room.id ? 'border-purple-500 bg-purple-500/5' : 'border-[#1e1e3a]'}`}
                >
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
                        <span className="flex items-center gap-2">
                          <span className="text-slate-200 font-medium">{room.name}</span>
                          <button
                            onClick={(e) => startEditRoom(room, e)}
                            className="text-slate-500 hover:text-purple-300 text-xs transition cursor-pointer opacity-0 group-hover/room:opacity-100"
                            title="Umbenennen"
                          >
                            ✏️
                          </button>
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
                                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-sm">
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

        {/* Right: Image map (40%) – desktop only */}
        <div className="hidden lg:block lg:col-span-2">
          <div className="sticky top-16">
            <ImageMapSection
              palace={palace}
              markers={markers}
              rooms={rooms}
              imgRef={imgRef}
              uploading={uploading}
              dragging={dragging}
              highlightedRoom={highlightedRoom}
              handleImageClick={handleImageClick}
              handleMarkerPointerDown={handleMarkerPointerDown}
              handleMarkerClick={handleMarkerClick}
              deleteMarker={deleteMarker}
              handleImageUpload={handleImageUpload}
            />
          </div>
        </div>
      </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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

function ImageMapSection({ palace, markers, rooms, imgRef, uploading, dragging, handleImageClick, handleMarkerPointerDown, handleMarkerClick, deleteMarker, handleImageUpload }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-300 mb-3">Palast-Bild</h3>
      {palace?.image_url ? (
        <div className="space-y-2">
          <div
            className="relative rounded-xl overflow-hidden border border-[#1e1e3a] cursor-crosshair select-none"
            style={{ touchAction: 'none' }}
            onClick={handleImageClick}
          >
            <img
              ref={imgRef}
              src={palace.image_url}
              alt="Palace"
              className="w-full block"
              draggable={false}
            />
            {markers.map((marker) => {
              const room = rooms[marker.room_index - 1]
              const isActive = dragging === marker.id
              return (
                <div
                  key={marker.id}
                  className="absolute group/marker"
                  style={{
                    left: `${marker.x_percent}%`,
                    top: `${marker.y_percent}%`,
                    transform: 'translate(-50%, -50%)',
                    touchAction: 'none',
                    zIndex: isActive ? 50 : 10,
                  }}
                >
                  {/* Invisible large touch target (48x48 min for fingers) */}
                  <div
                    style={{ position: 'absolute', top: '-16px', left: '-16px', width: '48px', height: '48px', cursor: 'grab' }}
                    onMouseDown={(e) => handleMarkerPointerDown(e, marker)}
                    onTouchStart={(e) => handleMarkerPointerDown(e, marker)}
                    onClick={(e) => handleMarkerClick(marker, e)}
                  />
                  {/* Visible marker */}
                  <div
                    className="rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold pointer-events-none transition-all duration-150"
                    style={{
                      width: isActive ? '44px' : undefined,
                      height: isActive ? '44px' : undefined,
                      background: isActive ? 'rgba(147,51,234,0.9)' : 'rgb(147,51,234)',
                      boxShadow: isActive ? '0 0 20px rgba(147,51,234,0.6)' : undefined,
                    }}
                    // Default sizes via className when not active
                    {...(!isActive && { className: "w-10 h-10 sm:w-7 sm:h-7 rounded-full bg-purple-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold pointer-events-none transition-all duration-150" })}
                  >
                    {marker.room_index}
                  </div>
                  {room && !isActive && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-[#0a0a1a] border border-[#2a2a4a] text-xs text-slate-200 whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition pointer-events-none">
                      {room.name}
                    </div>
                  )}
                  <button
                    onClick={(e) => deleteMarker(marker.id, e)}
                    className="absolute -top-2 -right-2 w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-red-600 text-white text-[10px] sm:text-[9px] flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover/marker:opacity-100 transition cursor-pointer hover:bg-red-500"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Tippe aufs Bild, um Marker zu setzen. Halte & ziehe zum Verschieben.
            </p>
            <label className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer transition shrink-0 ml-2">
              Bild ändern
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>
      ) : (
        <label className="block rounded-xl border-2 border-dashed border-[#2a2a4a] hover:border-purple-500/40 p-10 text-center cursor-pointer transition group">
          <div className="text-4xl mb-3 opacity-40 group-hover:opacity-70 transition">🖼️</div>
          <p className="text-slate-500 text-sm mb-1 group-hover:text-slate-400 transition">
            {uploading ? 'Wird hochgeladen...' : 'Bild hochladen'}
          </p>
          <p className="text-slate-600 text-xs">Grundriss, Spielkarte, Foto...</p>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
        </label>
      )}
    </div>
  )
}
