export async function fetchGoetheWords(level) {
  const response = await fetch(`https://api.allorigins.win/raw?url=https://www.dwds.de/api/lemma/goethe/${level}.json`)
  if (!response.ok) throw new Error(`Failed to fetch ${level} word list`)
  const data = await response.json()
  return data.map((entry) => ({
    wort: (entry.articles?.[0] ? entry.articles[0] + ' ' : '') + entry.sch[0].lemma,
    pos: entry.pos,
    artikel: entry.articles?.[0] || '',
    definition: '',
    beispiel: '',
  }))
}
