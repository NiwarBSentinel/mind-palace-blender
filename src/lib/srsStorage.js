import { supabase } from './supabase'

// Load SRS data for a level — from Supabase if logged in, localStorage if not
export async function loadSRSData(level, userId) {
  if (userId) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('level', level.toUpperCase())
    if (error) console.error('loadSRS error:', error)
    const result = {}
    for (const row of data || []) {
      result[row.word] = {
        easeFactor: row.ease_factor,
        interval: row.interval,
        nextReview: row.next_review,
        repetitions: row.repetitions,
      }
    }
    return result
  }
  // Fallback: localStorage
  try {
    return JSON.parse(localStorage.getItem(`srs_${level.toUpperCase()}`)) || {}
  } catch {
    return {}
  }
}

// Save SRS data for a single word
export async function saveSRSWord(level, word, srsData, userId) {
  if (userId) {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        word,
        level: level.toUpperCase(),
        ease_factor: srsData.easeFactor,
        interval: srsData.interval,
        next_review: srsData.nextReview,
        repetitions: srsData.repetitions,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,word,level' })
    if (error) console.error('saveSRS error:', error)
  } else {
    // Fallback: localStorage
    const key = `srs_${level.toUpperCase()}`
    try {
      const existing = JSON.parse(localStorage.getItem(key)) || {}
      existing[word] = srsData
      localStorage.setItem(key, JSON.stringify(existing))
    } catch {}
  }
}

// Save full SRS object to localStorage (for anonymous bulk save)
export function saveSRSLocal(level, data) {
  localStorage.setItem(`srs_${level.toUpperCase()}`, JSON.stringify(data))
}
