// Vercel serverless function: OCR word pairs from an image via Claude.
// POST { imageBase64: string, mediaType?: string }
// → { pairs: [{ a, b }, ...] }
//
// Requires env var ANTHROPIC_API_KEY (set in Vercel project settings).

export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on server' })
    return
  }

  const { imageBase64, mediaType } = req.body || {}
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    res.status(400).json({ error: 'imageBase64 missing' })
    return
  }

  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
  const cleanType = allowedTypes.has(mediaType) ? mediaType : 'image/jpeg'

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        system:
          'Du bist ein OCR-Assistent. Extrahiere alle Wortpaare aus dem Bild. ' +
          'Antworte NUR mit einem JSON-Array ohne Backticks oder Text davor/danach. ' +
          'Format: [{"a":"Wort1","b":"Wort2"}]. Erkenne automatisch die zwei Sprachen/Spalten.',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: cleanType, data: imageBase64 },
              },
              { type: 'text', text: 'Extrahiere alle Wortpaare als JSON-Array.' },
            ],
          },
        ],
      }),
    })

    const data = await anthropicRes.json()
    if (!anthropicRes.ok || data.error) {
      res.status(502).json({ error: data?.error?.message || 'Anthropic request failed' })
      return
    }

    const raw = (data.content || []).map((b) => b.text || '').join('')
    const clean = raw.replace(/```json|```/g, '').trim()
    let pairs
    try {
      pairs = JSON.parse(clean)
    } catch {
      res.status(502).json({ error: 'Antwort war kein gültiges JSON', raw })
      return
    }

    if (!Array.isArray(pairs)) {
      res.status(502).json({ error: 'Antwort war kein Array' })
      return
    }

    // Keep only well-formed pairs.
    const cleaned = pairs
      .map((p) => ({ a: String(p?.a ?? '').trim(), b: String(p?.b ?? '').trim() }))
      .filter((p) => p.a && p.b)

    res.status(200).json({ pairs: cleaned })
  } catch (err) {
    res.status(500).json({ error: err.message || 'unknown error' })
  }
}
