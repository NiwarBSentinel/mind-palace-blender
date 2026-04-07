import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function RoutesDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [routes, setRoutes] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from('routes')
      .select('*, route_loci(id)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setRoutes(data || []))
  }, [user])

  async function handleCreate(e) {
    e.preventDefault()
    if (!title.trim() || !user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('routes')
      .insert({ user_id: user.id, title: title.trim(), description: description.trim() })
      .select()
      .single()
    if (!error && data) {
      navigate(`/routes/${data.id}`)
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d24] to-[#050510] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Melde dich an, um Routen zu erstellen.</p>
          <button onClick={() => navigate('/login')} className="px-4 py-2 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-500 transition">
            Anmelden
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d24] to-[#050510] px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-200 text-sm mb-6 inline-block transition">
          ← Zurück
        </button>

        <h1 className="text-3xl font-bold text-slate-100 mb-2">Historische Routen</h1>
        <p className="text-slate-400 mb-8">Erstelle Routen mit Orten auf der Karte und verknüpfe sie mit historischen Ereignissen.</p>

        <form onSubmit={handleCreate} className="bg-[#12122a] border border-[#1e1e3a] rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Neue Route erstellen</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Titel der Route"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
            <input
              type="text"
              placeholder="Beschreibung (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className="px-5 py-2.5 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Erstelle...' : 'Route erstellen'}
            </button>
          </div>
        </form>

        {routes.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Noch keine Routen erstellt.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {routes.map((route) => (
              <div
                key={route.id}
                onClick={() => navigate(`/routes/${route.id}`)}
                className="p-5 rounded-xl bg-[#12122a] border border-[#1e1e3a] hover:border-amber-500/50 cursor-pointer transition-all duration-200 hover:bg-[#16163a] group"
              >
                <h3 className="text-lg font-semibold text-slate-200 group-hover:text-amber-300 transition mb-1">
                  {route.title}
                </h3>
                {route.description && (
                  <p className="text-slate-400 text-sm mb-2">{route.description}</p>
                )}
                <span className="text-xs text-amber-400/70 bg-amber-500/10 px-2 py-1 rounded-full">
                  {route.route_loci?.length || 0} Loci
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
