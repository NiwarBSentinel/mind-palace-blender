import { supabase } from './supabase'
import { BMP_PERSONS } from '../data/bmpData'

export async function seedBMPPersons() {
  for (const person of BMP_PERSONS) {
    const { data: p, error: pErr } = await supabase
      .from('bmp_persons')
      .insert({ name: person.name, beschreibung: person.beschreibung, farbe: person.farbe })
      .select()
      .single()
    if (pErr) { console.error('seed person error:', pErr); continue }

    for (let ri = 0; ri < person.rooms.length; ri++) {
      const room = person.rooms[ri]
      const { data: r, error: rErr } = await supabase
        .from('bmp_rooms')
        .insert({ person_id: p.id, name: room.name, koerperteil: room.koerperteil, reihenfolge: ri + 1 })
        .select()
        .single()
      if (rErr) { console.error('seed room error:', rErr); continue }

      for (const locus of room.loci) {
        const { error: lErr } = await supabase
          .from('bmp_loci')
          .insert({ room_id: r.id, position: locus.position, objekt: locus.objekt, ort: locus.ort })
        if (lErr) console.error('seed locus error:', lErr)
      }
    }
  }
}
