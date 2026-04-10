import { useState } from 'react'
import { supabase } from '../lib/supabase'
import * as XLSX from 'xlsx'

export default function BulkImport({ palaceId, existingRoomCount = 0, onDone }) {
  const [importTab, setImportTab] = useState('text')
  const [importText, setImportText] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)

  async function handleGlobalImport() {
    if (!importText.trim()) return
    setImporting(true)
    setImportResult(null)

    const lines = importText.split('\n').map((l) => l.trim()).filter(Boolean)
    let currentRoomName = null
    const roomMap = {}

    for (const line of lines) {
      if (line.startsWith('#')) {
        currentRoomName = line.replace(/^#+\s*/, '').trim()
        if (currentRoomName && !roomMap[currentRoomName]) roomMap[currentRoomName] = []
      } else if (currentRoomName) {
        roomMap[currentRoomName].push(line)
      }
    }

    const roomNames = Object.keys(roomMap)
    if (roomNames.length === 0) {
      setImportResult({ error: 'Keine Räume gefunden. Nutze # Raumname als Überschrift.' })
      setImporting(false)
      return
    }

    let totalRooms = 0
    let totalLoci = 0

    for (const roomName of roomNames) {
      const reihenfolge = existingRoomCount + totalRooms + 1
      const { data: roomData, error: roomErr } = await supabase
        .from('rooms')
        .insert({ palace_id: palaceId, name: roomName, reihenfolge })
        .select()
        .single()
      if (roomErr || !roomData) { console.error('room insert error:', roomErr); continue }
      totalRooms++

      const lociLines = roomMap[roomName]
      if (lociLines.length > 0) {
        const rows = lociLines.map((line, i) => {
          const sep = line.includes('|') ? '|' : line.includes(';') ? ';' : line.includes('\t') ? '\t' : ','
          const parts = line.split(sep).map((p) => p.trim())
          return {
            room_id: roomData.id,
            position: i + 1,
            person: parts[0] || '',
            action: parts[1] || '',
            object: parts[2] || '',
            major_zahl: parts[3] || '',
            major_zahl_2: parts[4] || '',
            notiz: parts[5] || '',
          }
        })
        const { error: lociErr } = await supabase.from('loci').insert(rows)
        if (lociErr) console.error('loci insert error:', lociErr)
        else totalLoci += rows.length
      }
    }

    setImportResult({ rooms: totalRooms, loci: totalLoci })
    setImporting(false)
    if (onDone) onDone()
  }

  function handleExcelFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'array' })
        const lines = []
        for (const name of wb.SheetNames) {
          const ws = wb.Sheets[name]
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
          let startRow = 0
          if (rows.length > 0) {
            const first = String(rows[0][0] || '').trim().toLowerCase()
            const knownHeaders = ['raum', 'room', 'person', 'zimmer', 'name']
            if (knownHeaders.some(h => first === h || first.startsWith(h))) startRow = 1
          }
          lines.push(`# ${name}`)
          for (let i = startRow; i < rows.length; i++) {
            const cells = rows[i].map(c => String(c || '').trim()).filter(Boolean)
            if (cells.length > 0) lines.push(cells.join(' | '))
          }
          lines.push('')
        }
        setImportText(lines.join('\n').trim())
        setImportTab('text')
        setImportResult(null)
      } catch (err) {
        console.error('Excel parse error:', err)
        setImportResult({ error: 'Datei konnte nicht gelesen werden.' })
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const lineStats = (() => {
    const lines = importText.split('\n').map(l => l.trim()).filter(Boolean)
    return { rooms: lines.filter(l => l.startsWith('#')).length, loci: lines.filter(l => !l.startsWith('#')).length }
  })()

  return (
    <div className="p-5 rounded-xl bg-[#0a0a1a] border border-blue-500/20 space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setImportTab('text')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${importTab === 'text' ? 'bg-blue-600 text-white' : 'bg-[#12122a] border border-[#2a2a4a] text-slate-400 hover:border-blue-500/50'}`}
        >
          ✏️ Text
        </button>
        <button
          onClick={() => setImportTab('excel')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${importTab === 'excel' ? 'bg-green-600 text-white' : 'bg-[#12122a] border border-[#2a2a4a] text-slate-400 hover:border-green-500/50'}`}
        >
          📊 Excel / CSV
        </button>
      </div>

      {importTab === 'excel' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Jedes <strong className="text-green-400">Tabellenblatt</strong> = ein Raum. Spalten = Person, Aktion, Objekt, Major1, Major2, Notiz.
          </p>
          <label className="flex items-center justify-center gap-3 p-6 rounded-lg border-2 border-dashed border-[#2a2a4a] hover:border-green-500/40 cursor-pointer transition group">
            <span className="text-3xl opacity-50 group-hover:opacity-80 transition">📊</span>
            <div>
              <p className="text-sm text-slate-300 group-hover:text-green-300 transition font-medium">Datei auswählen</p>
              <p className="text-xs text-slate-500">.xlsx, .xls oder .csv</p>
            </div>
            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelFile} className="hidden" />
          </label>
        </div>
      )}

      {importTab === 'text' && (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-[#12122a] border border-[#2a2a4a]">
            <pre className="text-xs text-slate-500 font-mono leading-relaxed whitespace-pre-wrap">{`# Wohnzimmer
Einstein | schreibt | Formel
Mona Lisa | lächelt | Rahmen

# Küche
Napoleon | kocht | Suppe`}</pre>
            <p className="text-xs text-slate-500 mt-2">
              <code className="text-blue-400">#</code> = neuer Raum · Spalten: Person | Aktion | Objekt | Major1 | Major2 | Notiz
            </p>
          </div>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={"# Raumname\nPerson | Aktion | Objekt\n\n# Zweiter Raum\nPerson | Aktion | Objekt"}
            rows={8}
            className="w-full px-4 py-3 rounded-lg bg-[#12122a] border border-[#2a2a4a] text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 transition resize-y font-mono"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">{lineStats.rooms} Räume · {lineStats.loci} Loci</span>
            <button
              onClick={handleGlobalImport}
              disabled={importing || !importText.trim()}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-medium transition cursor-pointer"
            >
              {importing ? 'Importiere...' : 'Importieren'}
            </button>
          </div>
        </div>
      )}

      {importResult && !importResult.error && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm font-medium">
          ✅ {importResult.rooms} Räume und {importResult.loci} Loci importiert!
        </div>
      )}
      {importResult?.error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          ❌ {importResult.error}
        </div>
      )}
    </div>
  )
}
