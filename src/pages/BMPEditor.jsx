import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const BODY_DOTS = [
  { koerperteil: 'Kopf',       x: 150, y: 40,  labelX: 178, labelY: 44,  anchor: 'start' },
  { koerperteil: 'Ohr',        x: 130, y: 65,  labelX: 102, labelY: 69,  anchor: 'end' },
  { koerperteil: 'Auge',       x: 150, y: 60,  labelX: 178, labelY: 64,  anchor: 'start' },
  { koerperteil: 'Nase',       x: 150, y: 75,  labelX: 178, labelY: 79,  anchor: 'start' },
  { koerperteil: 'Mund',       x: 150, y: 88,  labelX: 178, labelY: 92,  anchor: 'start' },
  { koerperteil: 'Kinn',       x: 150, y: 100, labelX: 178, labelY: 104, anchor: 'start' },
  { koerperteil: 'Achseln',    x: 108, y: 145, labelX: 80,  labelY: 149, anchor: 'end' },
  { koerperteil: 'Bauchnabel', x: 150, y: 210, labelX: 178, labelY: 214, anchor: 'start' },
  { koerperteil: 'Beine',      x: 150, y: 310, labelX: 178, labelY: 314, anchor: 'start' },
  { koerperteil: 'Fuss',       x: 150, y: 410, labelX: 178, labelY: 414, anchor: 'start' },
]

function BodySilhouette({ rooms, expandedRoom, fillStats, onDotClick }) {
  const [hovered, setHovered] = useState(null)

  const roomByKoerperteil = {}
  for (const room of rooms) {
    roomByKoerperteil[room.koerperteil] = room
  }

  function getDotColor(koerperteil) {
    const room = roomByKoerperteil[koerperteil]
    if (!room) return '#4a5568'
    const filled = fillStats[room.id] || 0
    if (filled >= 5) return '#48bb78'
    if (filled > 0) return '#ed8936'
    return '#4a5568'
  }

  return (
    <div className="sticky top-8">
      <div className="rounded-2xl bg-[#0d0d20] border border-[#1e1e3a] p-4">
        <svg viewBox="0 0 300 440" className="w-full">
          {/* Head */}
          <circle cx="150" cy="65" r="35" fill="#1a1a2e" stroke="#2a2a4a" strokeWidth="1" />
          {/* Neck */}
          <rect x="140" y="100" width="20" height="18" rx="4" fill="#1a1a2e" />
          {/* Torso */}
          <path d="M108 118 L108 250 Q108 260 118 260 L182 260 Q192 260 192 250 L192 118 Q192 112 182 112 L118 112 Q108 112 108 118Z" fill="#1a1a2e" stroke="#2a2a4a" strokeWidth="1" />
          {/* Left arm */}
          <path d="M108 125 L80 145 L65 210 L72 250 L80 250 L88 215 L95 170 L108 155" fill="#1a1a2e" stroke="#2a2a4a" strokeWidth="1" />
          {/* Right arm */}
          <path d="M192 125 L220 145 L235 210 L228 250 L220 250 L212 215 L205 170 L192 155" fill="#1a1a2e" stroke="#2a2a4a" strokeWidth="1" />
          {/* Left leg */}
          <path d="M118 260 L115 320 L112 370 L108 410 L100 425 L120 425 L125 410 L130 370 L135 320 L140 260" fill="#1a1a2e" stroke="#2a2a4a" strokeWidth="1" />
          {/* Right leg */}
          <path d="M160 260 L165 320 L170 370 L175 410 L180 425 L200 425 L192 410 L188 370 L185 320 L182 260" fill="#1a1a2e" stroke="#2a2a4a" strokeWidth="1" />

          {/* Dots and labels */}
          {BODY_DOTS.map((dot) => {
            const room = roomByKoerperteil[dot.koerperteil]
            const isActive = room && expandedRoom === room.id
            const isHovered = hovered === dot.koerperteil
            const filled = room ? (fillStats[room.id] || 0) : 0
            const color = getDotColor(dot.koerperteil)

            return (
              <g
                key={dot.koerperteil}
                onClick={() => room && onDotClick(room.id)}
                onMouseEnter={() => setHovered(dot.koerperteil)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                {/* Active ring */}
                {isActive && (
                  <circle cx={dot.x} cy={dot.y} r="11" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
                )}
                {/* Hover ring */}
                {isHovered && !isActive && (
                  <circle cx={dot.x} cy={dot.y} r="11" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
                )}
                {/* Dot */}
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={isHovered ? 8 : 7}
                  fill={color}
                  className="transition-all duration-150"
                />
                {/* Label */}
                <text
                  x={dot.labelX}
                  y={dot.labelY}
                  textAnchor={dot.anchor}
                  className="text-[9px] fill-slate-500 select-none"
                >
                  {dot.koerperteil}
                </text>
                {/* Tooltip on hover */}
                {isHovered && room && (
                  <g>
                    <rect
                      x={dot.x - 55}
                      y={dot.y - 32}
                      width="110"
                      height="20"
                      rx="4"
                      fill="#0a0a18"
                      stroke="#2a2a4a"
                      strokeWidth="0.5"
                    />
                    <text
                      x={dot.x}
                      y={dot.y - 19}
                      textAnchor="middle"
                      className="text-[8px] fill-slate-300 select-none"
                    >
                      {room.name} · {filled}/5 befüllt
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export default function BMPEditor() {
  const { personId } = useParams()
  const navigate = useNavigate()
  const [person, setPerson] = useState(null)
  const [rooms, setRooms] = useState([])
  const [expandedRoom, setExpandedRoom] = useState(null)
  const [lociByRoom, setLociByRoom] = useState({})
  const [inhalte, setInhalte] = useState({})
  const [fillStats, setFillStats] = useState({})
  const [loading, setLoading] = useState(true)
  const saveTimers = useRef({})
  const roomRefs = useRef({})

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

    // Fetch fill stats for all rooms
    const stats = {}
    for (const room of roomsData || []) {
      const { data: lociData } = await supabase
        .from('bmp_loci')
        .select('id')
        .eq('room_id', room.id)

      let filledCount = 0
      for (const locus of lociData || []) {
        const { data: inhaltData } = await supabase
          .from('bmp_inhalte')
          .select('id')
          .eq('locus_id', locus.id)
          .eq('session_name', 'Standard')
          .not('information', 'eq', '')
          .limit(1)
        if (inhaltData && inhaltData.length > 0) filledCount++
      }
      stats[room.id] = filledCount
    }
    setFillStats(stats)
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

  async function handleDotClick(roomId) {
    setExpandedRoom(roomId)
    if (!lociByRoom[roomId]) await fetchLoci(roomId)
    setTimeout(() => {
      roomRefs.current[roomId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
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

    // Find which room this locus belongs to and update fill stats
    const updateFillStat = (roomId) => {
      const loci = lociByRoom[roomId] || []
      let count = 0
      for (const l of loci) {
        const info = l.id === locusId ? value : (inhalte[l.id]?.information || '')
        if (info.trim()) count++
      }
      setFillStats((prev) => ({ ...prev, [roomId]: count }))
    }

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

    // Update fill stat for the room containing this locus
    if (expandedRoom) updateFillStat(expandedRoom)
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
    return <div className="max-w-6xl mx-auto px-4 py-8 text-center text-slate-400">Lade...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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

      <div className="flex gap-6">
        {/* Left: Room/Loci editor */}
        <div className="flex-1 min-w-0 space-y-3">
          {rooms.map((room, roomIdx) => (
            <div
              key={room.id}
              ref={(el) => { roomRefs.current[room.id] = el }}
              className={`rounded-xl bg-[#12122a] border overflow-hidden transition-colors ${expandedRoom === room.id ? 'border-purple-500/40' : 'border-[#1e1e3a]'}`}
            >
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
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-xs">
                    Pos {roomIdx * 5 + 1}–{roomIdx * 5 + 5}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${(fillStats[room.id] || 0) >= 5 ? 'bg-green-500' : (fillStats[room.id] || 0) > 0 ? 'bg-orange-500' : 'bg-slate-600'}`} />
                </div>
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

        {/* Right: Body silhouette */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <BodySilhouette
            rooms={rooms}
            expandedRoom={expandedRoom}
            fillStats={fillStats}
            onDotClick={handleDotClick}
          />
        </div>
      </div>
    </div>
  )
}
