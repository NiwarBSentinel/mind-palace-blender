import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons in bundled builds
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function NumberedIcon(number) {
  return L.divIcon({
    className: '',
    html: `<div style="background:#d97706;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)">${number}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  })
}

export default function RouteEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const polylineRef = useRef(null)

  const [route, setRoute] = useState(null)
  const [loci, setLoci] = useState([])
  const [editMode, setEditMode] = useState(true)

  // Form state for new locus
  const [pendingLatLng, setPendingLatLng] = useState(null)
  const [label, setLabel] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [eventText, setEventText] = useState('')

  // Load route + loci
  useEffect(() => {
    async function load() {
      const { data: r } = await supabase.from('routes').select('*').eq('id', id).single()
      if (r) setRoute(r)
      const { data: l } = await supabase
        .from('route_loci')
        .select('*')
        .eq('route_id', id)
        .order('position')
      if (l) setLoci(l)
    }
    load()
  }, [id])

  // Init map once route is loaded and the div is in the DOM
  useEffect(() => {
    if (!route || mapInstanceRef.current || !mapRef.current) return
    const map = L.map(mapRef.current).setView([47.0, 8.3], 8)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)
    mapInstanceRef.current = map

    // Fix tile rendering after container becomes visible
    setTimeout(() => map.invalidateSize(), 100)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [route])

  // Handle map clicks in edit mode
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    function onClick(e) {
      if (!editMode) return
      setPendingLatLng(e.latlng)
      setLabel('')
      setTimeframe('')
      setEventText('')
    }
    map.on('click', onClick)
    return () => map.off('click', onClick)
  }, [editMode, route])

  // Render markers + polyline when loci change
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear old markers
    markersRef.current.forEach((m) => map.removeLayer(m))
    markersRef.current = []
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current)
      polylineRef.current = null
    }

    const coords = []
    loci.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng], { icon: NumberedIcon(loc.position) })
        .addTo(map)
        .bindPopup(
          `<div style="min-width:160px">
            <strong>${loc.label}</strong>
            ${loc.timeframe ? `<br/><em style="color:#666">${loc.timeframe}</em>` : ''}
            ${loc.event_text ? `<br/><span>${loc.event_text}</span>` : ''}
          </div>`
        )
      markersRef.current.push(marker)
      coords.push([loc.lat, loc.lng])
    })

    if (coords.length >= 2) {
      polylineRef.current = L.polyline(coords, { color: '#d97706', weight: 3, opacity: 0.7 }).addTo(map)
    }
  }, [loci])

  async function handleAddLocus(e) {
    e.preventDefault()
    if (!pendingLatLng || !label.trim()) return
    const position = loci.length + 1
    const { data, error } = await supabase
      .from('route_loci')
      .insert({
        route_id: id,
        position,
        label: label.trim(),
        lat: pendingLatLng.lat,
        lng: pendingLatLng.lng,
        timeframe: timeframe.trim(),
        event_text: eventText.trim(),
      })
      .select()
      .single()
    if (!error && data) {
      setLoci((prev) => [...prev, data])
      setPendingLatLng(null)
    }
  }

  async function handleDeleteLocus(locusId) {
    await supabase.from('route_loci').delete().eq('id', locusId)
    const updated = loci.filter((l) => l.id !== locusId).map((l, i) => ({ ...l, position: i + 1 }))
    // Update positions in DB
    await Promise.all(
      updated.map((l) => supabase.from('route_loci').update({ position: l.position }).eq('id', l.id))
    )
    setLoci(updated)
  }

  async function handleDeleteRoute() {
    await supabase.from('routes').delete().eq('id', id)
    navigate('/routes')
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d24] to-[#050510] flex items-center justify-center">
        <p className="text-slate-400">Laden...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d24] to-[#050510] px-4 pb-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/routes')} className="text-slate-400 hover:text-slate-200 text-sm transition">
            ← Zurück
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                editMode
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#1e1e3a] text-slate-300 hover:bg-[#2a2a4a]'
              }`}
            >
              {editMode ? 'Ansehen' : 'Bearbeiten'}
            </button>
            <button
              onClick={handleDeleteRoute}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 transition"
            >
              Löschen
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-100 mb-1">{route.title}</h1>
        {route.description && <p className="text-slate-400 text-sm mb-4">{route.description}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Map */}
          <div className="lg:col-span-2">
            <div
              ref={mapRef}
              className="w-full rounded-xl overflow-hidden border border-[#1e1e3a]"
              style={{ height: '500px' }}
            />
            {editMode && !pendingLatLng && (
              <p className="text-slate-500 text-xs mt-2">Klicke auf die Karte, um einen neuen Locus zu setzen.</p>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Add locus form */}
            {editMode && pendingLatLng && (
              <form onSubmit={handleAddLocus} className="bg-[#12122a] border border-amber-500/30 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-amber-400">
                  Neuer Locus #{loci.length + 1}
                </h3>
                <p className="text-xs text-slate-500">
                  {pendingLatLng.lat.toFixed(5)}, {pendingLatLng.lng.toFixed(5)}
                </p>
                <input
                  type="text"
                  placeholder="Label (z.B. Hauptstrasse Ecke Metzgerei)"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition"
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Zeitraum (z.B. 1800-1850)"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition"
                />
                <textarea
                  placeholder="Ereignis (z.B. Napoleon invades Russia)"
                  value={eventText}
                  onChange={(e) => setEventText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-[#0a0a1a] border border-[#2a2a4a] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!label.trim()}
                    className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 disabled:opacity-40 transition"
                  >
                    Hinzufügen
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingLatLng(null)}
                    className="px-4 py-2 rounded-lg bg-[#1e1e3a] text-slate-300 text-sm hover:bg-[#2a2a4a] transition"
                  >
                    Abbrechen
                  </button>
                </div>
              </form>
            )}

            {/* Loci list */}
            <div className="bg-[#12122a] border border-[#1e1e3a] rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">
                Loci ({loci.length})
              </h3>
              {loci.length === 0 ? (
                <p className="text-slate-500 text-xs">Noch keine Loci gesetzt.</p>
              ) : (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {loci.map((loc) => (
                    <div
                      key={loc.id}
                      className="flex items-start gap-2 p-2 rounded-lg bg-[#0a0a1a] border border-[#1e1e3a] group"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                        {loc.position}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 text-sm font-medium truncate">{loc.label}</p>
                        {loc.timeframe && <p className="text-slate-500 text-xs">{loc.timeframe}</p>}
                        {loc.event_text && <p className="text-slate-400 text-xs mt-0.5">{loc.event_text}</p>}
                      </div>
                      {editMode && (
                        <button
                          onClick={() => handleDeleteLocus(loc.id)}
                          className="text-red-400/50 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
