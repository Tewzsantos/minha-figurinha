'use client'

import { useEffect, useRef, useState } from 'react'

interface CounterProps {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export default function AnimatedCounter({
  target,
  duration = 1800,
  prefix = '+',
  suffix = '',
  className = '',
}: CounterProps) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [started, target, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString('pt-BR')}{suffix}
    </span>
  )
}
