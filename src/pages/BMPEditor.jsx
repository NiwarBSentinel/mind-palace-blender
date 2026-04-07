import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { LocusFieldsEditable } from '../components/LocusFields'

const BODY_DOTS = [
  { koerperteil: 'Kopf',       x: 150, y: 30,  labelX: 165, labelY: 34  },
  { koerperteil: 'Ohr',        x: 100, y: 65,  labelX: 75,  labelY: 69, anchor: 'end' },
  { koerperteil: 'Auge',       x: 150, y: 50,  labelX: 165, labelY: 54  },
  { koerperteil: 'Nase',       x: 150, y: 75,  labelX: 165, labelY: 79  },
  { koerperteil: 'Mund',       x: 150, y: 95,  labelX: 165, labelY: 99  },
  { koerperteil: 'Kinn',       x: 150, y: 115, labelX: 165, labelY: 119 },
  { koerperteil: 'Achseln',    x: 150, y: 160, labelX: 165, labelY: 164 },
  { koerperteil: 'Bauchnabel', x: 150, y: 270, labelX: 165, labelY: 274 },
  { koerperteil: 'Beine',      x: 150, y: 450, labelX: 165, labelY: 454 },
  { koerperteil: 'Fuss',       x: 150, y: 590, labelX: 165, labelY: 594 },
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
        <svg viewBox="0 0 300 700" className="w-full">
          {/* Head */}
          <ellipse cx="150" cy="60" rx="45" ry="55" fill="#1e2a4a" stroke="#3a4a7a" strokeWidth="2" />
          {/* Neck */}
          <rect x="135" y="112" width="30" height="28" rx="6" fill="#1e2a4a" stroke="#3a4a7a" strokeWidth="2" />
          {/* Torso — shoulders wide, tapers at waist, widens at hips */}
          <path d="
            M80 155
            C80 145, 100 140, 135 140
            L165 140
            C200 140, 220 145, 220 155
            L220 220
            C220 250, 205 260, 195 270
            L195 300
            C195 320, 200 340, 205 360
            L95 360
            C100 340, 105 320, 105 300
            L105 270
            C95 260, 80 250, 80 220
            Z
          " fill="#1e2a4a" stroke="#3a4a7a" strokeWidth="2" />
          {/* Left arm */}
          <path d="
            M80 155
            C70 170, 60 210, 55 270
            C52 310, 55 330, 60 350
            L85 350
            C82 330, 78 310, 80 270
            C85 220, 92 180, 100 165
          " fill="#1e2a4a" stroke="#3a4a7a" strokeWidth="2" />
          {/* Right arm */}
          <path d="
            M220 155
            C230 170, 240 210, 245 270
            C248 310, 245 330, 240 350
            L215 350
            C218 330, 222 310, 220 270
            C215 220, 208 180, 200 165
          " fill="#1e2a4a" stroke="#3a4a7a" strokeWidth="2" />
          {/* Left leg */}
          <path d="
            M95 360
            C98 400, 100 440, 105 480
            C108 520, 108 560, 100 600
            L100 620
            L80 625
            L78 615
            C85 610, 85 605, 80 600
            L80 595
            C90 560, 90 520, 88 480
            C85 440, 82 400, 110 360
          " fill="#1e2a4a" stroke="#3a4a7a" strokeWidth="2" />
          {/* Right leg */}
          <path d="
            M205 360
            C202 400, 200 440, 195 480
            C192 520, 192 560, 200 600
            L200 620
            L220 625
            L222 615
            C215 610, 215 605, 220 600
            L220 595
            C210 560, 210 520, 212 480
            C215 440, 218 400, 190 360
          " fill="#1e2a4a" stroke="#3a4a7a" strokeWidth="2" />

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
                  <circle cx={dot.x} cy={dot.y} r="14" fill="none" stroke="white" strokeWidth="2.5" opacity="0.8" />
                )}
                {/* Hover ring */}
                {isHovered && !isActive && (
                  <circle cx={dot.x} cy={dot.y} r="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
                )}
                {/* Dot */}
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={isHovered ? 11 : 10}
                  fill={color}
                  className="transition-all duration-150"
                />
                {/* Label */}
                <text
                  x={dot.labelX}
                  y={dot.labelY}
                  textAnchor={dot.anchor || 'start'}
                  className="text-[11px] fill-slate-400 select-none font-medium"
                >
                  {dot.koerperteil}
                </text>
                {/* Tooltip on hover */}
                {isHovered && room && (
                  <g>
                    <rect
                      x={dot.x - 60}
                      y={dot.y - 36}
                      width="120"
                      height="22"
                      rx="5"
                      fill="#0a0a18"
                      stroke="#3a4a7a"
                      strokeWidth="1"
                    />
                    <text
                      x={dot.x}
                      y={dot.y - 21}
                      textAnchor="middle"
                      className="text-[9px] fill-slate-300 select-none"
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
  const { user } = useAuth()
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
                        <LocusFieldsEditable palaceId={`bmp_${personId}`} locusId={`${roomIdx}_${locus.position}`} userId={user?.id} />
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
