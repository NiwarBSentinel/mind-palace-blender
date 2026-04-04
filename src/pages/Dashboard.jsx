import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [palaces, setPalaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPalaces()
  }, [])

  async function fetchPalaces() {
    const { data } = await supabase
      .from('palaces')
      .select('*')
      .order('created_at', { ascending: false })
    setPalaces(data || [])
    setLoading(false)
  }

  async function createPalace(e) {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    const { error } = await supabase
      .from('palaces')
      .insert({ name: name.trim(), beschreibung: description.trim() })
    if (!error) {
      setName('')
      setDescription('')
      await fetchPalaces()
    }
    setCreating(false)
  }

  async function deletePalace(id, e) {
    e.stopPropagation()
    if (!confirm('Diesen Palast wirklich löschen?')) return
    await supabase.from('loci').delete().eq('palace_id', id)
    await supabase.from('rooms').delete().eq('palace_id', id)
    await supabase.from('palaces').delete().eq('id', id)
    await fetchPalaces()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Gedächtnispalast
      </h1>
      <p className="text-center text-slate-400 mb-10">
        Erstelle und verwalte deine Gedächtnispaläste
      </p>

      <form onSubmit={createPalace} className="mb-10 p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a]">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Neuer Palast</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name des Palastes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
          />
          <input
            type="text"
            placeholder="Beschreibung (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
          />
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-medium transition cursor-pointer"
          >
            {creating ? 'Erstelle...' : 'Palast erstellen'}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-center text-slate-400">Lade Paläste...</p>
      ) : palaces.length === 0 ? (
        <p className="text-center text-slate-500">Noch keine Paläste vorhanden. Erstelle deinen ersten!</p>
      ) : (
        <div className="grid gap-4">
          {palaces.map((palace) => (
            <div
              key={palace.id}
              onClick={() => navigate(`/palace/${palace.id}`)}
              className="p-5 rounded-xl bg-[#12122a] border border-[#1e1e3a] hover:border-purple-500/50 cursor-pointer transition group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-200 group-hover:text-purple-300 transition">
                    {palace.name}
                  </h3>
                  {palace.description && (
                    <p className="text-slate-400 text-sm mt-1">{palace.description}</p>
                  )}
                </div>
                <button
                  onClick={(e) => deletePalace(palace.id, e)}
                  className="px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
