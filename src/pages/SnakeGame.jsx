import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const GRID = 20            // cells per row/column
const CELL = 20            // logical px per cell
const SIZE = GRID * CELL   // logical canvas size (400)
const START_SPEED = 140    // ms per tick
const MIN_SPEED = 70
const SPEED_STEP = 4
const HS_KEY = 'snake_highscore'

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

function randomFood(snake) {
  // pick a free cell not occupied by the snake
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`))
  let cell
  do {
    cell = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }
  } while (occupied.has(`${cell.x},${cell.y}`))
  return cell
}

function initialSnake() {
  const mid = Math.floor(GRID / 2)
  // length 3, heading right, head first
  return [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ]
}

function DPadButton({ dir, label, onPress }) {
  return (
    <button
      onClick={() => onPress(dir)}
      className="w-14 h-14 rounded-xl bg-[#1e1e3a] border border-[#2a2a4a] text-slate-300 text-xl active:bg-lime-600/40 active:text-lime-200 transition cursor-pointer select-none"
      aria-label={label}
    >
      {label}
    </button>
  )
}

export default function SnakeGame() {
  const navigate = useNavigate()
  const { level = 'C1' } = useParams()

  const canvasRef = useRef(null)
  const snakeRef = useRef(initialSnake())
  const dirRef = useRef(DIRS.right)
  const queueRef = useRef([])
  const foodRef = useRef(randomFood(initialSnake()))
  const speedRef = useRef(START_SPEED)
  const statusRef = useRef('idle') // idle | running | paused | over

  const [status, setStatusState] = useState('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem(HS_KEY)) || 0)

  const setStatus = useCallback((s) => {
    statusRef.current = s
    setStatusState(s)
  }, [])

  const resetGame = useCallback(() => {
    snakeRef.current = initialSnake()
    dirRef.current = DIRS.right
    queueRef.current = []
    foodRef.current = randomFood(snakeRef.current)
    speedRef.current = START_SPEED
    setScore(0)
  }, [])

  const startGame = useCallback(() => {
    resetGame()
    setStatus('running')
  }, [resetGame, setStatus])

  // Queue a direction change, rejecting reversals against the last intended direction
  const enqueueDir = useCallback((dir) => {
    const q = queueRef.current
    const last = q.length ? q[q.length - 1] : dirRef.current
    if (last.x === dir.x && last.y === dir.y) return            // no-op
    if (last.x === -dir.x && last.y === -dir.y) return          // 180° turn -> ignore
    if (q.length < 3) q.push(dir)
  }, [])

  const handleDir = useCallback((dir) => {
    if (statusRef.current === 'idle') {
      // start on first directional input (left is a reverse of the initial right -> ignored)
      startGame()
      enqueueDir(dir)
    } else if (statusRef.current === 'running') {
      enqueueDir(dir)
    }
  }, [startGame, enqueueDir])

  const togglePause = useCallback(() => {
    if (statusRef.current === 'running') setStatus('paused')
    else if (statusRef.current === 'paused') setStatus('running')
  }, [setStatus])

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': e.preventDefault(); handleDir(DIRS.up); break
        case 'ArrowDown': case 's': case 'S': e.preventDefault(); handleDir(DIRS.down); break
        case 'ArrowLeft': case 'a': case 'A': e.preventDefault(); handleDir(DIRS.left); break
        case 'ArrowRight': case 'd': case 'D': e.preventDefault(); handleDir(DIRS.right); break
        case ' ': e.preventDefault()
          if (statusRef.current === 'over') startGame()
          else togglePause()
          break
        default: break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleDir, togglePause, startGame])

  // Touch swipe controls on the canvas
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    let sx = 0, sy = 0
    const onStart = (e) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY }
    const onMove = (e) => { if (statusRef.current === 'running' || statusRef.current === 'idle') e.preventDefault() }
    const onEnd = (e) => {
      const t = e.changedTouches[0]
      const dx = t.clientX - sx, dy = t.clientY - sy
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return
      if (Math.abs(dx) > Math.abs(dy)) handleDir(dx > 0 ? DIRS.right : DIRS.left)
      else handleDir(dy > 0 ? DIRS.down : DIRS.up)
    }
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
    }
  }, [handleDir])

  // Game loop + rendering
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = SIZE * dpr
    canvas.height = SIZE * dpr
    ctx.scale(dpr, dpr)

    let raf
    let lastTick = 0

    const drawCell = (x, y, color) => {
      ctx.fillStyle = color
      const p = 1
      const px = x * CELL + p, py = y * CELL + p, sz = CELL - 2 * p
      ctx.beginPath()
      if (ctx.roundRect) ctx.roundRect(px, py, sz, sz, 4)
      else ctx.rect(px, py, sz, sz)
      ctx.fill()
    }

    const draw = () => {
      // background
      ctx.fillStyle = '#0a0a1a'
      ctx.fillRect(0, 0, SIZE, SIZE)
      // subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.035)'
      ctx.lineWidth = 1
      for (let i = 1; i < GRID; i++) {
        ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, SIZE); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(SIZE, i * CELL); ctx.stroke()
      }
      // food
      const f = foodRef.current
      drawCell(f.x, f.y, '#fb7185')
      // snake
      const snake = snakeRef.current
      snake.forEach((s, i) => drawCell(s.x, s.y, i === 0 ? '#bef264' : '#84cc16'))
    }

    const tick = () => {
      // apply one queued direction per tick
      if (queueRef.current.length) dirRef.current = queueRef.current.shift()
      const dir = dirRef.current
      const snake = snakeRef.current
      const head = snake[0]
      const next = { x: head.x + dir.x, y: head.y + dir.y }

      // wall collision
      if (next.x < 0 || next.x >= GRID || next.y < 0 || next.y >= GRID) return gameOver()
      // self collision (ignore the tail tip, which moves away — unless we just grew)
      const ate = next.x === foodRef.current.x && next.y === foodRef.current.y
      const body = ate ? snake : snake.slice(0, -1)
      if (body.some((s) => s.x === next.x && s.y === next.y)) return gameOver()

      const newSnake = [next, ...snake]
      if (ate) {
        foodRef.current = randomFood(newSnake)
        speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_STEP)
        setScore((sc) => sc + 1)
      } else {
        newSnake.pop()
      }
      snakeRef.current = newSnake
    }

    const gameOver = () => {
      setStatus('over')
      setScore((sc) => {
        setHighScore((hs) => {
          if (sc > hs) { localStorage.setItem(HS_KEY, String(sc)); return sc }
          return hs
        })
        return sc
      })
    }

    const frame = (t) => {
      raf = requestAnimationFrame(frame)
      if (statusRef.current === 'running' && t - lastTick >= speedRef.current) {
        lastTick = t
        tick()
      }
      draw()
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [setStatus])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(`/sprachen/deutsch/${level.toLowerCase()}/spiele`)}
        className="text-slate-400 hover:text-slate-200 transition text-sm mb-4 cursor-pointer"
      >
        ← Zurück zu Spiele
      </button>

      <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
        🐍 Snake
      </h1>
      <p className="text-center text-slate-400 mb-6">
        Friss die Punkte, werde länger, vermeide Wand & dich selbst
      </p>

      <div className="p-4 sm:p-6 rounded-xl bg-[#12122a] border border-[#1e1e3a]">
        {/* Score row */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <div className="text-xs text-slate-500">Punkte</div>
            <div className="text-2xl font-bold text-lime-300">{score}</div>
          </div>
          <button
            onClick={() => { if (status === 'running' || status === 'paused') togglePause() }}
            className="px-4 py-2 rounded-lg bg-[#1e1e3a] border border-[#2a2a4a] text-slate-300 text-sm hover:bg-[#2a2a4a] transition cursor-pointer disabled:opacity-30"
            disabled={status === 'idle' || status === 'over'}
          >
            {status === 'paused' ? '▶ Weiter' : '⏸ Pause'}
          </button>
          <div className="text-right">
            <div className="text-xs text-slate-500">Highscore</div>
            <div className="text-2xl font-bold text-amber-300">{highScore}</div>
          </div>
        </div>

        {/* Board */}
        <div className="relative mx-auto" style={{ maxWidth: SIZE }}>
          <canvas
            ref={canvasRef}
            className="w-full rounded-lg border border-[#1e1e3a] touch-none"
            style={{ aspectRatio: '1 / 1', imageRendering: 'pixelated' }}
          />

          {/* Idle overlay */}
          {status === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a1a]/70 rounded-lg backdrop-blur-sm">
              <button
                onClick={startGame}
                className="px-8 py-3 rounded-xl bg-lime-600 hover:bg-lime-500 text-white font-bold text-lg transition cursor-pointer mb-3"
              >
                ▶ Start
              </button>
              <p className="text-slate-400 text-sm text-center px-6">
                Steuerung: Pfeiltasten / WASD · Wischen am Handy · Leertaste = Pause
              </p>
            </div>
          )}

          {/* Pause overlay */}
          {status === 'paused' && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a1a]/60 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-slate-200">⏸ Pause</div>
            </div>
          )}

          {/* Game over overlay */}
          {status === 'over' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a1a]/80 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold text-red-300 mb-1">Game Over</div>
              <div className="text-slate-300 mb-1">Punkte: <span className="font-bold text-lime-300">{score}</span></div>
              {score >= highScore && score > 0 && (
                <div className="text-amber-300 text-sm font-medium mb-3">🏆 Neuer Highscore!</div>
              )}
              <button
                onClick={startGame}
                className="mt-2 px-8 py-3 rounded-xl bg-lime-600 hover:bg-lime-500 text-white font-bold transition cursor-pointer"
              >
                Nochmal
              </button>
            </div>
          )}
        </div>

        {/* On-screen D-pad (touch friendly) */}
        <div className="mt-6 flex flex-col items-center gap-2 sm:hidden">
          <DPadButton dir={DIRS.up} label="↑" onPress={handleDir} />
          <div className="flex gap-2">
            <DPadButton dir={DIRS.left} label="←" onPress={handleDir} />
            <DPadButton dir={DIRS.down} label="↓" onPress={handleDir} />
            <DPadButton dir={DIRS.right} label="→" onPress={handleDir} />
          </div>
        </div>
      </div>
    </div>
  )
}
