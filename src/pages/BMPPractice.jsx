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
  const [finished, setFinished] = useState(false)
  const [gewusst, setGewusst] = useState([])
  const [nichtGewusst, setNichtGewusst] = useState([])
  const [practiceCards, setPracticeCards] = useState([])

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
    setPracticeCards(lociList)
    setLoading(false)
  }

  const current = practiceCards[currentIdx]
  const total = practiceCards.length
  const progress = total > 0 ? ((currentIdx + (revealed ? 1 : 0)) / total) * 100 : 0

  function handleResult(knew) {
    const locus = practiceCards[currentIdx]
    if (knew) {
      setGewusst((prev) => [...prev, locus.id])
    } else {
      setNichtGewusst((prev) => [...prev, locus.id])
    }
    if (currentIdx >= total - 1) {
      setFinished(true)
      return
    }
    setRevealed(false)
    setCurrentIdx(currentIdx + 1)
  }

  function restart() {
    setPracticeCards(allLoci)
    setCurrentIdx(0)
    setRevealed(false)
    setFinished(false)
    setGewusst([])
    setNichtGewusst([])
  }

  function restartWrong() {
    const wrongCards = practiceCards.filter((l) => nichtGewusst.includes(l.id))
    setPracticeCards(wrongCards)
    setCurrentIdx(0)
    setRevealed(false)
    setFinished(false)
    setGewusst([])
    setNichtGewusst([])
  }

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

  if (finished) {
    const nichtGewusstLoci = practiceCards.filter((l) => nichtGewusst.includes(l.id))
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="p-12 rounded-xl bg-[#12122a] border border-[#1e1e3a] text-center">
          <h2 className="text-3xl font-bold text-slate-200 mb-8">🎉 Fertig!</h2>

          <div className="flex gap-4 justify-center mb-8">
            <div className="flex-1 p-4 rounded-lg bg-green-600/20 border border-green-500/30">
              <div className="text-green-300 font-bold text-xl">Gewusst</div>
              <div className="text-green-400 text-2xl mt-1">{gewusst.length} / {total}</div>
            </div>
            <div className="flex-1 p-4 rounded-lg bg-red-600/20 border border-red-500/30">
              <div className="text-red-300 font-bold text-xl">Nicht gewusst</div>
              <div className="text-red-400 text-2xl mt-1">{nichtGewusst.length} / {total}</div>
            </div>
          </div>

          {nichtGewusstLoci.length > 0 && (
            <div className="text-left mb-8">
              <h3 className="text-slate-400 text-sm font-medium mb-3">Zum Wiederholen:</h3>
              <ul className="space-y-2">
                {nichtGewusstLoci.map((locus) => (
                  <li key={locus.id} className="text-slate-300 text-sm p-2 rounded-lg bg-red-600/10 border border-red-500/20">
                    <span className="font-mono text-red-400 mr-2">{locus.position}.</span>
                    {locus.objekt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={restart}
              className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition cursor-pointer"
            >
              Nochmal alle
            </button>
            {nichtGewusstLoci.length > 0 && (
              <button
                onClick={restartWrong}
                className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition cursor-pointer"
              >
                Nur falsche üben
              </button>
            )}
            <button
              onClick={() => navigate(`/bmp/${personId}`)}
              className="px-6 py-2.5 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer"
            >
              Zurück
            </button>
          </div>
        </div>
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

      {revealed ? (
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => handleResult(true)}
            className="flex-1 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium text-lg transition cursor-pointer"
          >
            ✅ Gewusst
          </button>
          <button
            onClick={() => handleResult(false)}
            className="flex-1 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-lg transition cursor-pointer"
          >
            ❌ Nicht gewusst
          </button>
        </div>
      ) : !current.information ? (
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => handleResult(true)}
            className="flex-1 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium text-lg transition cursor-pointer"
          >
            ✅ Gewusst
          </button>
          <button
            onClick={() => handleResult(false)}
            className="flex-1 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-lg transition cursor-pointer"
          >
            ❌ Nicht gewusst
          </button>
        </div>
      ) : null}
    </div>
  )
}
