import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { seedBMPPersons } from '../lib/seedBMP'
import { useAuth } from '../contexts/AuthContext'

export default function BMPDashboard() {
  const [persons, setPersons] = useState([])
  const [customPalaces, setCustomPalaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    fetchPersons()
    if (user) fetchCustomPalaces()
  }, [user])

  async function fetchPersons() {
    const { data, error } = await supabase
      .from('bmp_persons')
      .select('*')
      .order('name')
    if (error) console.error('fetchPersons error:', error)
    setPersons(data || [])
    setLoading(false)
  }

  async function fetchCustomPalaces() {
    const { data, error } = await supabase
      .from('custom_palaces')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) console.error('fetchCustomPalaces error:', error)
    setCustomPalaces(data || [])
  }

  async function handleSeed() {
    setSeeding(true)
    try {
      await seedBMPPersons()
      setSeeded(true)
      await fetchPersons()
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
      >
        ← Zurück zur Übersicht
      </button>

      <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Body Memory Palace
      </h1>
      <p className="text-center text-slate-400 mb-10">
        10 Personen · 10 Räume · 50 Loci pro Person
      </p>

      {loading ? (
        <p className="text-center text-slate-400">Lade Personen...</p>
      ) : persons.length === 0 && !seeded ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-6">Noch keine BMP-Daten vorhanden.</p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-8 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-medium text-lg transition cursor-pointer"
          >
            {seeding ? 'Wird geladen...' : 'Seed-Daten laden'}
          </button>
        </div>
      ) : persons.length === 0 ? (
        <p className="text-center text-slate-400">Keine Personen gefunden.</p>
      ) : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {persons.map((person) => (
            <div
              key={person.id}
              onClick={() => navigate(`/bmp/${person.id}`)}
              className="p-5 rounded-xl bg-[#12122a] border-l-4 cursor-pointer hover:bg-[#16163a] transition group"
              style={{ borderLeftColor: person.farbe || '#6b46c1' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-200 group-hover:text-purple-300 transition">
                    {person.name}
                  </h3>
                  {person.beschreibung && (
                    <p className="text-slate-400 text-sm mt-1">{person.beschreibung}</p>
                  )}
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                  50 Loci
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Palaces */}
        {(customPalaces.length > 0 || user) && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-slate-300 mb-4">Eigene Paläste</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {customPalaces.map((p) => {
                const totalLoci = (p.raeume || []).reduce((sum, r) => sum + (r.loci?.length || 0), 0)
                return (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/bmp/custom/${p.id}`)}
                    className="p-5 rounded-xl bg-[#12122a] border border-[#1e1e3a] cursor-pointer hover:bg-[#16163a] hover:border-purple-500/30 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.emoji || '🏛️'}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-200 group-hover:text-purple-300 transition">{p.name}</h3>
                          {p.beschreibung && <p className="text-slate-400 text-sm mt-0.5">{p.beschreibung}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">{totalLoci} Loci</span>
                        <div className="text-xs text-slate-500 mt-1">{(p.raeume || []).length} Räume</div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Create tile */}
              {user && (
                <div
                  onClick={() => navigate('/bmp/create')}
                  className="p-5 rounded-xl bg-[#12122a] border-2 border-dashed border-[#2a2a4a] cursor-pointer hover:border-purple-500/50 hover:bg-[#16163a] transition flex flex-col items-center justify-center min-h-[100px]"
                >
                  <span className="text-3xl mb-2">➕</span>
                  <span className="text-slate-400 text-sm font-medium">Neuen Palast erstellen</span>
                </div>
              )}
            </div>
          </div>
        )}
        </>
      )}
    </div>
  )
}
