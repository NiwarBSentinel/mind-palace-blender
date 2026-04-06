import { GOETHE_A1_WORDS } from './goetheA1Words'

export async function fetchGoetheWords(level) {
  if (level === 'A1') return GOETHE_A1_WORDS
  throw new Error(`Level ${level} not yet available`)
}
