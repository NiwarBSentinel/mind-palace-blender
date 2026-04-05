import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function BMPPractice() {
  const { personId } = useParams()
  const navigate = useNavigate()
  const [person, setPerson] = useState(null)
  const [allLoci, setAllLoci] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(true)

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

    const lociList = []
    for (const room of roomsData || []) {
      const { data: lociData } = await supabase
        .from('bmp_loci')
        .select('*')
        .eq('room_id', room.id)
        .order('position')

      for (const locus of lociData || []) {
        const { data: inhaltData } = await supabase
          .from('bmp_inhalte')
          .select('*')
          .eq('locus_id', locus.id)
          .eq('session_name', 'Standard')
          .limit(1)
          .single()

        lociList.push({
          ...locus,
          roomName: room.name,
          koerperteil: room.koerperteil,
          information: inhaltData?.information || ''
        })
      }
    }
    setAllLoci(lociList)
    setLoading(false)
  }

  const current = allLoci[currentIdx]
  const total = allLoci.length
  const progress = total > 0 ? ((currentIdx + (revealed ? 1 : 0)) / total) * 100 : 0

  function goNext() {
    setRevealed(false)
    if (currentIdx < total - 1) setCurrentIdx(currentIdx + 1)
  }

  function goBack() {
    setRevealed(false)
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  const isFirst = currentIdx === 0
  const isLast = currentIdx === total - 1

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-8 text-center text-slate-400">Lade Übung...</div>
  }

  if (total === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-400 mb-6">Keine Loci vorhanden.</p>
        <button
          onClick={() => navigate(`/bmp/${personId}`)}
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
          onClick={() => navigate(`/bmp/${personId}`)}
          className="text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          ← Zurück zum Editor
        </button>
        <span className="text-slate-500 text-sm">
          {currentIdx + 1} / {total}
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-[#1e1e3a] mb-8 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-center mb-2">
        <span className="text-sm font-medium" style={{ color: person?.farbe || '#c084fc' }}>
          {person?.name}
        </span>
      </div>
      <div className="text-center mb-6">
        <span className="text-xs text-slate-500">
          {current.roomName} · {current.koerperteil}
        </span>
      </div>

      <div className="p-8 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center mb-8">
        <div className="text-5xl font-bold text-purple-300 mb-4 font-mono">
          {currentIdx + 1}
        </div>
        <div className="text-xl text-slate-200 font-medium mb-2">
          {current.objekt}
        </div>
        <div className="text-sm text-slate-500 mb-6">
          {current.ort}
        </div>

        {current.information ? (
          revealed ? (
            <div className="p-4 rounded-lg bg-[#0a0a1a] text-slate-200 text-left whitespace-pre-wrap">
              {current.information}
            </div>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="px-8 py-3 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition cursor-pointer text-lg"
            >
              Information aufdecken
            </button>
          )
        ) : (
          <p className="text-slate-600 text-sm italic">Keine Information hinterlegt</p>
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
          onClick={isLast && revealed ? () => navigate(`/bmp/${personId}`) : goNext}
          disabled={isLast && !revealed}
          className="px-6 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-30 transition cursor-pointer"
        >
          {isLast && revealed ? 'Fertig' : 'Weiter →'}
        </button>
      </div>
    </div>
  )
}
