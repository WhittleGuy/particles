import React, {useRef, useEffect} from 'react'

interface Particle {
  x: number
  y: number
  rad: number
  acc: number
  vel: number
  trig: {sin: number; cos: number}
}

const generateParticle = (rad: number, maxVel: number): Particle => {
  let x = Math.random() * window.innerWidth
  let y = Math.random() * window.innerHeight
  // Bound within canvas
  // if (x < 2 * rad) x += 2 * rad
  // else if (x + 2 * rad > window.innerWidth) x -= 2 * rad
  // if (y < 2 * rad) y += rad
  // else if (y + 2 * rad > window.innerHeight) y -= rad

  const acc = 0
  const vel = maxVel - Math.random() * 0.05 * maxVel
  const phi = Math.random() * Math.PI * 2
  const sin = Math.sin(phi)
  const cos = Math.cos(phi)

  return {x, y, rad, acc, vel, trig: {sin, cos}}
}

const moveParticle = (p: Particle) => {
  p.x += p.vel * p.trig.cos
  if (p.x <= 0) p.x = window.innerWidth
  else if (p.x >= window.innerWidth) p.x = 0
  p.y += p.vel * p.trig.sin
  if (p.y <= 0) p.y = window.innerHeight
  else if (p.y >= window.innerHeight) p.y = 0
}

const connectParticles = (
  ctx: CanvasRenderingContext2D,
  p1: Particle,
  particles: Particle[],
  dis: number
) => {
  for (let i = 1; i < particles.length; i++) {
    const p2 = particles[i]
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < dis) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / dis})`
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }
  }
}

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const POINTS = 450
  const RADIUS = 3
  const CONNECT_DISTANCE = 100
  const particles: Particle[] = []
  const WIDTH = window.innerWidth
  const HEIGHT = window.innerHeight

  useEffect(() => {
    for (let i = 0; i < POINTS; i++) {
      particles.push(generateParticle(RADIUS, 1))
    }
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d')

      if (ctxRef.current) {
        // Clear canvas and paint black
        const ctx = ctxRef.current
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
      }
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (canvasRef?.current) canvasRef.current.width = canvasRef.current.width
      if (canvasRef.current && ctxRef.current) {
        const ctx = ctxRef.current
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
        // Draw Particles
        ctx.fillStyle = '#ffffff'
        for (const p of particles) {
          ctx.fillRect(p.x, p.y, p.rad, p.rad)
          ctx.fill()
          // Connect particles within a certain distance
          connectParticles(ctx, p, particles, CONNECT_DISTANCE)
          // Update particles for next draw
          moveParticle(p)
        }
      }
    }, 25)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="App">
      <canvas
        id="particles"
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
      ></canvas>
    </div>
  )
}

export default App
