import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const CATEGORIES = ['Alle', 'Wohnung', 'Schule', 'Natur', 'Reise', 'Spiel', 'Allgemein']

export default function PalaceTemplates() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [templates, setTemplates] = useState([])
  const [filter, setFilter] = useState('Alle')
  const [loading, setLoading] = useState(true)
  const [copying, setCopying] = useState(null)

  // Create form
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Allgemein')
  const [creating, setCreating] = useState(false)

  useEffect(() => { fetchTemplates() }, [])

  async function fetchTemplates() {
    const { data, error } = await supabase
      .from('palace_templates')
      .select('*, template_rooms(id)')
      .order('copy_count', { ascending: false })
    if (error) console.error('fetch templates error:', error)
    setTemplates(data || [])
    setLoading(false)
  }

  const filtered = filter === 'Alle' ? templates : templates.filter((t) => t.category === filter)

  async function copyTemplate(template) {
    if (!user) { navigate('/login'); return }
    setCopying(template.id)

    // 1. Create palace
    const { data: palace, error: palErr } = await supabase
      .from('palaces')
      .insert({ name: template.title, beschreibung: template.description || '' })
      .select()
      .single()
    if (palErr || !palace) { console.error('copy palace error:', palErr); setCopying(null); return }

    // 2. Fetch template rooms
    const { data: tRooms } = await supabase
      .from('template_rooms')
      .select('*')
      .eq('template_id', template.id)
      .order('position')

    if (tRooms && tRooms.length > 0) {
      // 3. Create rooms and map old→new IDs
      for (const tRoom of tRooms) {
        const { data: newRoom } = await supabase
          .from('rooms')
          .insert({ palace_id: palace.id, name: tRoom.name, reihenfolge: tRoom.position })
          .select()
          .single()
        if (!newRoom) continue

        // 4. Fetch and copy loci for this room
        const { data: tLoci } = await supabase
          .from('template_loci')
          .select('*')
          .eq('room_id', tRoom.id)
          .order('position')

        if (tLoci && tLoci.length > 0) {
          const lociInserts = tLoci.map((l) => ({
            room_id: newRoom.id,
            position: l.position,
            person: l.person || '',
            action: l.aktion || '',
            object: l.objekt || '',
            major_zahl: l.major || '',
            notiz: l.notiz || '',
          }))
          await supabase.from('loci').insert(lociInserts)
        }
      }
    }

    // 5. Increment copy count
    await supabase
      .from('palace_templates')
      .update({ copy_count: (template.copy_count || 0) + 1 })
      .eq('id', template.id)

    setCopying(null)
    navigate(`/palace/${palace.id}`)
  }

  async function createTemplate(e) {
    e.preventDefault()
    if (!title.trim() || !user) return
    setCreating(true)

    const { data, error } = await supabase
      .from('palace_templates')
      .insert({
        created_by: user.id,
        title: title.trim(),
        description: description.trim(),
        category,
        copy_count: 0,
      })
      .select()
      .single()

    if (error) { console.error('create template error:', error); setCreating(false); return }

    setCreating(false)
    setShowForm(false)
    setTitle('')
    setDescription('')
    setCategory('Allgemein')
    await fetchTemplates()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d24] to-[#050510] px-4 pt-14 pb-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/mnemotechnik')} className="text-slate-400 hover:text-slate-200 text-sm mb-6 inline-block transition">
          ← Zurück
        </button>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-100">Vorlagen</h1>
          {user && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition"
            >
              {showForm ? 'Abbrechen' : '+ Neue Vorlage'}
            </button>
          )}
        </div>
        <p className="text-slate-400 mb-6">Fertige Palast-Vorlagen kopieren oder eigene teilen</p>

        {/* Create form */}
        {showForm && (
          <form onSubmit={createTemplate} className="bg-[#12122a] border border-[#1e1e3a] rounded-xl p-6 mb-8 space-y-3">
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Neue Vorlage erstellen</h3>
            <input
              type="text"
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
            />
            <input
              type="text"
              placeholder="Beschreibung (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 focus:outline-none focus:border-purple-500 transition"
            >
              {CATEGORIES.filter((c) => c !== 'Alle').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!title.trim() || creating}
              className="px-5 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-500 disabled:opacity-40 transition"
            >
              {creating ? 'Erstelle...' : 'Vorlage erstellen'}
            </button>
          </form>
        )}

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === c
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#1e1e3a] text-slate-400 hover:text-slate-200 hover:bg-[#2a2a4a]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Templates grid */}
        {loading ? (
          <p className="text-slate-500 text-center py-12">Laden...</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500 text-center py-12">Keine Vorlagen gefunden.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="rounded-xl bg-[#12122a] border border-[#1e1e3a] overflow-hidden hover:border-purple-500/30 transition-all duration-200 hover:bg-[#16163a] flex flex-col"
              >
                {t.image_url && (
                  <img src={t.image_url} alt="" className="w-full h-32 object-cover" />
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-200">{t.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 whitespace-nowrap ml-2">
                      {t.category}
                    </span>
                  </div>
                  {t.description && (
                    <p className="text-slate-400 text-sm mb-3">{t.description}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{t.template_rooms?.length || 0} Räume</span>
                      <span>{t.copy_count || 0}x kopiert</span>
                    </div>
                    <button
                      onClick={() => copyTemplate(t)}
                      disabled={copying === t.id}
                      className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-500 disabled:opacity-40 transition"
                    >
                      {copying === t.id ? 'Kopiere...' : 'Übernehmen'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
