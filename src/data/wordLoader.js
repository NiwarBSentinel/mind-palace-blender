import { GOETHE_A1_WORDS } from './goetheA1Words'
import { GOETHE_A2_WORDS } from './goetheA2Words'
import { GOETHE_B1_WORDS } from './goetheB1Words'
import { C1_WOERTER } from './c1WordsFull'

const WORD_LISTS = {
  A1: GOETHE_A1_WORDS,
  A2: GOETHE_A2_WORDS,
  B1: GOETHE_B1_WORDS,
  C1: C1_WOERTER,
}

export function getWordsForLevel(level) {
  return WORD_LISTS[level.toUpperCase()] || []
}

export function getAllWords() {
  return [...GOETHE_A1_WORDS, ...GOETHE_A2_WORDS, ...GOETHE_B1_WORDS, ...C1_WOERTER]
}

export function getLevelName(level) {
  const names = { A1: 'Anfänger', A2: 'Grundlegende Kenntnisse', B1: 'Mittelstufe', C1: 'Fortgeschritten' }
  return names[level.toUpperCase()] || level
}
