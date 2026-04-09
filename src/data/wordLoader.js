import { GOETHE_A1_WORDS } from './goetheA1Words'
import { GOETHE_A2_WORDS } from './goetheA2Words'
import { GOETHE_B1_WORDS } from './goetheB1Words'
import { GOETHE_B2_WORDS } from './goetheB2Words'
import { C1_WOERTER } from './c1WordsFull'
import { C1_WOERTER_EXTENDED } from './c1WordsExtended'
import { GOETHE_C2_WORDS } from './goetheC2Words'

const ALL_C1 = [...C1_WOERTER, ...C1_WOERTER_EXTENDED]

const WORD_LISTS = {
  A1: GOETHE_A1_WORDS,
  A2: GOETHE_A2_WORDS,
  B1: GOETHE_B1_WORDS,
  B2: GOETHE_B2_WORDS,
  C1: ALL_C1,
  C2: GOETHE_C2_WORDS,
}

export function getWordsForLevel(level) {
  return WORD_LISTS[level.toUpperCase()] || []
}

export function getAllWords() {
  return [...GOETHE_A1_WORDS, ...GOETHE_A2_WORDS, ...GOETHE_B1_WORDS, ...GOETHE_B2_WORDS, ...ALL_C1, ...GOETHE_C2_WORDS]
}

export function getLevelName(level) {
  const names = { A1: 'Anfänger', A2: 'Grundlegende Kenntnisse', B1: 'Mittelstufe', B2: 'Obere Mittelstufe', C1: 'Fortgeschritten', C2: 'Experte' }
  return names[level.toUpperCase()] || level
}
