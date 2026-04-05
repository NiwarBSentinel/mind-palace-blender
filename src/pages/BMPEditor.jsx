import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function BMPEditor() {
  const { personId } = useParams()
  const navigate = useNavigate()
  const [person, setPerson] = useState(null)
  const [rooms, setRooms] = useState([])
  const [expandedRoom, setExpandedRoom] = useState(null)
  const [lociByRoom, setLociByRoom] = useState({})
  const [inhalte, setInhalte] = useState({})
  const [loading, setLoading] = useState(true)
  const saveTimers = useRef({})

  useEffect(() => {
    fetchData()
  }, [personId])

  async function fetchData() {
    const { data: personData } = await supabase
      .from('bmp_persons')
      .select('*')
      .eq('id', personId)
      .single()
    setPerson(personData)

    const { data: roomsData } = await supabase
      .from('bmp_rooms')
      .select('*')
      .eq('person_id', personId)
      .order('reihenfolge')
    setRooms(roomsData || [])
    setLoading(false)
  }

  async function fetchLoci(roomId) {
    const { data } = await supabase
      .from('bmp_loci')
      .select('*')
      .eq('room_id', roomId)
      .order('position')
    setLociByRoom((prev) => ({ ...prev, [roomId]: data || [] }))

    for (const locus of data || []) {
      const { data: inhaltData } = await supabase
        .from('bmp_inhalte')
        .select('*')
        .eq('locus_id', locus.id)
        .eq('session_name', 'Standard')
        .limit(1)
        .single()
      if (inhaltData) {
        setInhalte((prev) => ({ ...prev, [locus.id]: inhaltData }))
      }
    }
  }

  async function toggleRoom(roomId) {
    if (expandedRoom === roomId) {
      setExpandedRoom(null)
    } else {
      setExpandedRoom(roomId)
      if (!lociByRoom[roomId]) await fetchLoci(roomId)
    }
  }

  function handleInfoChange(locusId, value) {
    setInhalte((prev) => ({
      ...prev,
      [locusId]: { ...prev[locusId], information: value }
    }))

    if (saveTimers.current[locusId]) clearTimeout(saveTimers.current[locusId])
    saveTimers.current[locusId] = setTimeout(() => saveInfo(locusId, value), 800)
  }

  async function saveInfo(locusId, value) {
    const existing = inhalte[locusId]
    if (existing?.id) {
      const { error } = await supabase
        .from('bmp_inhalte')
        .update({ information: value })
        .eq('id', existing.id)
      if (error) console.error('update inhalt error:', error)
    } else {
      const { data, error } = await supabase
        .from('bmp_inhalte')
        .insert({ locus_id: locusId, session_name: 'Standard', information: value })
        .select()
        .single()
      if (error) console.error('insert inhalt error:', error)
      if (data) setInhalte((prev) => ({ ...prev, [locusId]: data }))
    }
  }

  function handleBlur(locusId) {
    if (saveTimers.current[locusId]) {
      clearTimeout(saveTimers.current[locusId])
      delete saveTimers.current[locusId]
    }
    const value = inhalte[locusId]?.information || ''
    saveInfo(locusId, value)
  }

  function getGlobalPosition(roomIndex, locusPosition) {
    return roomIndex * 5 + locusPosition
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400">Lade...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/bmp')}
            className="text-slate-400 hover:text-slate-200 transition text-sm mb-2 cursor-pointer"
          >
            ← Alle Personen
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {person?.name}
          </h1>
          {person?.beschreibung && (
            <p className="text-slate-400 text-sm mt-1">{person.beschreibung}</p>
          )}
        </div>
        <button
          onClick={() => navigate(`/bmp/${personId}/practice`)}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition cursor-pointer"
        >
          Üben →
        </button>
      </div>

      <div className="space-y-3">
        {rooms.map((room, roomIdx) => (
          <div key={room.id} className="rounded-xl bg-[#12122a] border border-[#1e1e3a] overflow-hidden">
            <div
              onClick={() => toggleRoom(room.id)}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#16163a] transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-purple-400 text-sm font-mono w-6">{room.reihenfolge}</span>
                <span className={`transition text-sm ${expandedRoom === room.id ? 'rotate-90' : ''}`}>▶</span>
                <span className="text-slate-200 font-medium">{room.name}</span>
                <span className="text-slate-500 text-xs">({room.koerperteil})</span>
              </div>
              <span className="text-slate-500 text-xs">
                Pos {roomIdx * 5 + 1}–{roomIdx * 5 + 5}
              </span>
            </div>

            {expandedRoom === room.id && (
              <div className="border-t border-[#1e1e3a] p-4 space-y-3">
                {(lociByRoom[room.id] || []).map((locus) => {
                  const globalPos = getGlobalPosition(roomIdx, locus.position)
                  const info = inhalte[locus.id]?.information || ''
                  return (
                    <div key={locus.id} className="p-3 rounded-lg bg-[#0a0a1a] space-y-2">
                      <div className="flex items-start gap-3">
                        <span className="text-purple-300 font-bold text-lg font-mono w-8 shrink-0">
                          {globalPos}
                        </span>
                        <div className="flex-1">
                          <div className="text-slate-200 font-medium">{locus.objekt}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{locus.ort}</div>
                        </div>
                      </div>
                      <textarea
                        placeholder="Information eingeben..."
                        value={info}
                        onChange={(e) => handleInfoChange(locus.id, e.target.value)}
                        onBlur={() => handleBlur(locus.id)}
                        rows={2}
                        className="w-full px-3 py-2 rounded bg-[#12122a] border border-[#2a2a4a] text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500 transition resize-none"
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
