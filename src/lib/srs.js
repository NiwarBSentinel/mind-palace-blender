export function calculateNextReview(quality, repetitions, interval, easeFactor) {
  // quality: 0=Schwer, 3=Ok, 5=Einfach
  let newInterval, newEaseFactor, newRepetitions

  if (quality < 3) {
    newRepetitions = 0
    newInterval = 1
  } else {
    newRepetitions = repetitions + 1
    if (repetitions === 0) newInterval = 1
    else if (repetitions === 1) newInterval = 6
    else newInterval = Math.round(interval * easeFactor)
  }

  newEaseFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + newInterval)

  return {
    next_review: nextReview.toISOString(),
    interval_days: newInterval,
    ease_factor: newEaseFactor,
    repetitions: newRepetitions,
  }
}

export function isDue(nextReview) {
  return new Date(nextReview) <= new Date()
}

export function getDueCount(cards) {
  return cards.filter((c) => isDue(c.next_review)).length
}

export function getNextDueDate(cards) {
  const future = cards
    .filter((c) => !isDue(c.next_review))
    .map((c) => new Date(c.next_review))
    .sort((a, b) => a - b)
  return future.length > 0 ? future[0] : null
}

export function formatInterval(days) {
  if (days === 1) return 'morgen'
  if (days < 7) return `${days} Tage`
  if (days < 30) return `${Math.round(days / 7)} Wochen`
  return `${Math.round(days / 30)} Monate`
}

export function previewIntervals(card) {
  const rep = card.repetitions || 0
  const int = card.interval_days || 1
  const ef = card.ease_factor || 2.5

  const schwer = calculateNextReview(0, rep, int, ef)
  const ok = calculateNextReview(3, rep, int, ef)
  const einfach = calculateNextReview(5, rep, int, ef)

  return {
    schwer: formatInterval(schwer.interval_days),
    ok: formatInterval(ok.interval_days),
    einfach: formatInterval(einfach.interval_days),
  }
}
