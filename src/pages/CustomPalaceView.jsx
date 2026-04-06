import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CustomPalaceView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [palace, setPalace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedRoom, setExpandedRoom] = useState(null)

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('custom_palaces')
        .select('*')
        .eq('id', id)
        .single()
      if (error) console.error('fetch palace error:', error)
      setPalace(data)
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400">Lade...</div>
  if (!palace) return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      <p className="text-slate-400 mb-4">Palast nicht gefunden.</p>
      <button onClick={() => navigate('/bmp')} className="px-5 py-2 rounded-lg bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a] transition cursor-pointer">← Zurück</button>
    </div>
  )

  const raeume = palace.raeume || []
  const totalLoci = raeume.reduce((sum, r) => sum + (r.loci?.length || 0), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/bmp')} className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer">← Zurück</button>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">{palace.emoji || '🏛️'}</span>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{palace.name}</h1>
      </div>
      {palace.beschreibung && <p className="text-slate-400 text-sm mb-2">{palace.beschreibung}</p>}
      <p className="text-slate-500 text-sm mb-8">{raeume.length} Räume · {totalLoci} Loci</p>

      <div className="space-y-3">
        {raeume.map((room, roomIdx) => (
          <div key={roomIdx} className="rounded-xl bg-[#12122a] border border-[#1e1e3a] overflow-hidden">
            <div
              onClick={() => setExpandedRoom(expandedRoom === roomIdx ? null : roomIdx)}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#16163a] transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-purple-400 text-sm font-mono w-6">{roomIdx + 1}</span>
                <span className={`transition text-sm ${expandedRoom === roomIdx ? 'rotate-90' : ''}`}>▶</span>
                <span className="text-slate-200 font-medium">{room.name}</span>
              </div>
              <span className="text-slate-500 text-xs">{room.loci?.length || 0} Loci</span>
            </div>

            {expandedRoom === roomIdx && (
              <div className="border-t border-[#1e1e3a] p-4 space-y-2">
                {(room.loci || []).map((locus) => (
                  <div key={locus.position} className="p-3 rounded-lg bg-[#0a0a1a] flex items-start gap-3">
                    <span className="text-purple-300 font-bold text-lg font-mono w-8 shrink-0">{locus.position}</span>
                    <span className="text-slate-200">{locus.beschreibung}</span>
                  </div>
                ))}
                {(room.loci || []).length === 0 && (
                  <p className="text-slate-600 text-sm italic">Keine Loci in diesem Raum</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
