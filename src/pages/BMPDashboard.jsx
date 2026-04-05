import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { seedBMPPersons } from '../lib/seedBMP'

export default function BMPDashboard() {
  const [persons, setPersons] = useState([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPersons()
  }, [])

  async function fetchPersons() {
    const { data, error } = await supabase
      .from('bmp_persons')
      .select('*')
      .order('name')
    if (error) console.error('fetchPersons error:', error)
    setPersons(data || [])
    setLoading(false)
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
      )}
    </div>
  )
}
