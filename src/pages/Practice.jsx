import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Practice() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [palace, setPalace] = useState(null)
  const [rooms, setRooms] = useState([])
  const [currentRoomIdx, setCurrentRoomIdx] = useState(0)
  const [currentLocusIdx, setCurrentLocusIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    const { data: palaceData } = await supabase
      .from('palaces')
      .select('*')
      .eq('id', id)
      .single()
    setPalace(palaceData)

    const { data: roomsData } = await supabase
      .from('rooms')
      .select('*')
      .eq('palace_id', id)
      .order('reihenfolge')

    const roomsWithLoci = []
    for (const room of roomsData || []) {
      const { data: lociData } = await supabase
        .from('loci')
        .select('*')
        .eq('room_id', room.id)
        .order('position')
      if (lociData && lociData.length > 0) {
        roomsWithLoci.push({ ...room, loci: lociData })
      }
    }
    setRooms(roomsWithLoci)
    setLoading(false)
  }

  const currentRoom = rooms[currentRoomIdx]
  const currentLocus = currentRoom?.loci[currentLocusIdx]

  const totalLoci = rooms.reduce((sum, r) => sum + r.loci.length, 0)
  let completedLoci = 0
  for (let i = 0; i < currentRoomIdx; i++) {
    completedLoci += rooms[i].loci.length
  }
  completedLoci += currentLocusIdx
  const progress = totalLoci > 0 ? ((completedLoci + (revealed ? 1 : 0)) / totalLoci) * 100 : 0

  function goNext() {
    setRevealed(false)
    if (currentLocusIdx < currentRoom.loci.length - 1) {
      setCurrentLocusIdx(currentLocusIdx + 1)
    } else if (currentRoomIdx < rooms.length - 1) {
      setCurrentRoomIdx(currentRoomIdx + 1)
      setCurrentLocusIdx(0)
    }
  }

  function goBack() {
    setRevealed(false)
    if (currentLocusIdx > 0) {
      setCurrentLocusIdx(currentLocusIdx - 1)
    } else if (currentRoomIdx > 0) {
      const prevRoom = rooms[currentRoomIdx - 1]
      setCurrentRoomIdx(currentRoomIdx - 1)
      setCurrentLocusIdx(prevRoom.loci.length - 1)
    }
  }

  const isFirst = currentRoomIdx === 0 && currentLocusIdx === 0
  const isLast = currentRoomIdx === rooms.length - 1 && currentLocusIdx === currentRoom?.loci.length - 1

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center text-slate-400">
        Lade Übung...
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-400 mb-6">Keine Loci zum Üben vorhanden.</p>
        <button
          onClick={() => navigate(`/palace/${id}`)}
          className="px-5 py-2 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer"
        >
          Zurück zum Editor
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/palace/${id}`)}
          className="text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          ← Zurück zum Editor
        </button>
        <span className="text-slate-500 text-sm">
          {completedLoci + 1} / {totalLoci}
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-[#1e1e3a] mb-8 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-center mb-4">
        <span className="text-sm text-purple-400 font-medium">
          {currentRoom.name}
        </span>
      </div>

      <div className="p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center mb-8">
        <div className="text-6xl font-bold text-purple-300 mb-6">
          {currentLocus.position}
        </div>

        {revealed ? (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-lg bg-[#0a0a1a]">
              <div className="text-slate-500 text-sm mb-1">Was lernen</div>
              <div className="text-slate-100 text-xl font-semibold">{currentLocus.lerninhalt || '–'}</div>
            </div>
            {currentLocus.vorstellung && (
              <div className="p-4 rounded-lg bg-[#0a0a1a] text-left">
                <div className="text-slate-500 text-sm mb-1">Vorstellung</div>
                <div className="text-slate-300 whitespace-pre-wrap">{currentLocus.vorstellung}</div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="px-8 py-3 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition cursor-pointer text-lg"
          >
            Aufdecken
          </button>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={goBack}
          disabled={isFirst}
          className="px-6 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] disabled:opacity-30 transition cursor-pointer"
        >
          ← Zurück
        </button>
        <button
          onClick={isLast && revealed ? () => navigate(`/palace/${id}`) : goNext}
          disabled={isLast && !revealed}
          className="px-6 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-30 transition cursor-pointer"
        >
          {isLast && revealed ? 'Fertig ✓' : 'Weiter →'}
        </button>
      </div>
    </div>
  )
}
