import { GOETHE_A1_WORDS } from './goetheA1Words'
import { GOETHE_A2_WORDS } from './goetheA2Words'
import { GOETHE_B1_WORDS } from './goetheB1Words'
import { GOETHE_B2_WORDS } from './goetheB2Words'
import { GOETHE_C2_WORDS } from './goetheC2Words'

export async function fetchGoetheWords(level) {
  if (level === 'A1') return GOETHE_A1_WORDS
  if (level === 'A2') return GOETHE_A2_WORDS
  if (level === 'B1') return GOETHE_B1_WORDS
  if (level === 'B2') return GOETHE_B2_WORDS
  if (level === 'C2') return GOETHE_C2_WORDS
  throw new Error(`Level ${level} not yet available`)
}
