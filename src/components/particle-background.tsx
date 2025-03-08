"use client"

import { useEffect, useRef } from "react"

interface ParticleBackgroundProps {
  particleColor?: string;
}

export default function ParticleBackground({ particleColor = "rgba(255, 255, 255, 0.5)" }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const particleOpacity = 0.5
    const particleRgba = `${particleColor}${Math.round(particleOpacity * 255).toString(16).padStart(2, '0')}`
    const connectionOpacity = 0.05
    const connectionRgba = `${particleColor}${Math.round(connectionOpacity * 255).toString(16).padStart(2, '0')}`

    // Particle factory function
    const createParticle = (x: number, y: number, size: number, speedX: number, speedY: number, color: string) => {
      const particle = {
        x,
        y,
        size,
        speedX,
        speedY,
        color,
        update: () => {
          particle.x += particle.speedX
          particle.y += particle.speedY

          // Bounce off edges
          if (particle.x < 0 || particle.x > canvas.width) {
            particle.speedX *= -1
          }
          if (particle.y < 0 || particle.y > canvas.height) {
            particle.speedY *= -1
          }
        },
        draw: () => {
          if (!ctx) return
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.fill()
        }
      }
      return particle
    }

    // Create particles
    const particleCount = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 10000))
    const particles = Array.from({ length: particleCount }, () => {
      const size = Math.random() * 5 + 1
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const speedX = (Math.random() - 0.5) * 1
      const speedY = (Math.random() - 0.5) * 1
      return createParticle(x, y, size, speedX, speedY, particleRgba)
    })

    // Animation loop
    const animate = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Draw connections
      ctx.strokeStyle = connectionRgba
      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [particleColor])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  )
}

