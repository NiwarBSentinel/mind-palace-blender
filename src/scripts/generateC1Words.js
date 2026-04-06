const fs = require('fs')
const path = require('path')

const API_KEY = process.env.ANTHROPIC_API_KEY
if (!API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable not set')
  process.exit(1)
}

const TOTAL_BATCHES = 40
const WORDS_PER_BATCH = 50
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'c1WordsFull.js')

async function generateBatch(batchNumber, existingWords) {
  const startIndex = (batchNumber - 1) * WORDS_PER_BATCH + 1
  const wordList = existingWords.length > 0
    ? `\nAlready generated words (DO NOT repeat these): ${existingWords.map(w => w.wort).join(', ')}`
    : ''

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `Generate exactly 50 German C1 level vocabulary words (batch ${batchNumber}/${TOTAL_BATCHES}).
Return ONLY a JSON array, no other text. No markdown code blocks.
Each object: { "wort": "das Wort", "definition": "kurze deutsche Definition", "beispiel": "Ein Beispielsatz." }
Focus on: abstract nouns, academic verbs, formal adjectives, connectors, scientific terms, legal/political vocabulary.
Do not repeat words from previous batches. Start from word number ${startIndex}.${wordList}`
      }]
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`API error (${response.status}): ${err}`)
  }

  const data = await response.json()
  const text = data.content[0].text.trim()

  // Extract JSON array from response
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error(`Could not parse JSON from batch ${batchNumber}: ${text.substring(0, 200)}`)
  }

  const words = JSON.parse(jsonMatch[0])
  if (!Array.isArray(words) || words.length === 0) {
    throw new Error(`Batch ${batchNumber} returned empty or invalid array`)
  }

  return words
}

async function main() {
  console.log(`Generating ${TOTAL_BATCHES * WORDS_PER_BATCH} C1 vocabulary words...`)
  console.log(`Output: ${OUTPUT_PATH}\n`)

  let allWords = []

  // Check for existing progress
  const progressPath = OUTPUT_PATH + '.progress.json'
  if (fs.existsSync(progressPath)) {
    allWords = JSON.parse(fs.readFileSync(progressPath, 'utf-8'))
    console.log(`Resuming from batch ${Math.floor(allWords.length / WORDS_PER_BATCH) + 1} (${allWords.length} words already generated)\n`)
  }

  const startBatch = Math.floor(allWords.length / WORDS_PER_BATCH) + 1

  for (let batch = startBatch; batch <= TOTAL_BATCHES; batch++) {
    const attempt = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          return await generateBatch(batch, allWords)
        } catch (err) {
          console.error(`  Attempt ${i + 1} failed: ${err.message}`)
          if (i < retries - 1) {
            console.log('  Retrying in 5 seconds...')
            await new Promise(r => setTimeout(r, 5000))
          } else {
            throw err
          }
        }
      }
    }

    console.log(`Batch ${batch}/${TOTAL_BATCHES}...`)
    const words = await attempt()

    // Deduplicate against existing words
    const existingSet = new Set(allWords.map(w => w.wort.toLowerCase()))
    const newWords = words.filter(w => !existingSet.has(w.wort.toLowerCase()))
    allWords.push(...newWords)

    console.log(`  +${newWords.length} words (${allWords.length} total)`)

    // Save progress after each batch
    fs.writeFileSync(progressPath, JSON.stringify(allWords, null, 2))

    // Rate limit: wait 2 seconds between batches
    if (batch < TOTAL_BATCHES) {
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  // Deduplicate final list
  const seen = new Set()
  const unique = allWords.filter(w => {
    const key = w.wort.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  console.log(`\nDone! ${unique.length} unique words generated.`)

  // Write final JS export
  const jsContent = `// Auto-generated C1 vocabulary - ${unique.length} words
// Generated on ${new Date().toISOString().split('T')[0]}

export const C1_WOERTER = ${JSON.stringify(unique, null, 2)}
`

  fs.writeFileSync(OUTPUT_PATH, jsContent)
  console.log(`Saved to ${OUTPUT_PATH}`)

  // Clean up progress file
  if (fs.existsSync(progressPath)) {
    fs.unlinkSync(progressPath)
  }
}

main().catch(err => {
  console.error('\nFatal error:', err.message)
  process.exit(1)
})
