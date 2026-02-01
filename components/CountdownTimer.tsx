'use client'

import { useState, useEffect, useRef } from 'react'

interface CountdownTimerProps {
  targetDate: Date
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function sameTimeLeft(a: TimeLeft, b: TimeLeft) {
  return a.days === b.days && a.hours === b.hours && a.minutes === b.minutes && a.seconds === b.seconds
}

export default function CountdownTimer({ targetDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const prevRef = useRef<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        }
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const tick = () => {
      const next = calculateTimeLeft()
      if (!sameTimeLeft(prevRef.current, next)) {
        prevRef.current = next
        setTimeLeft(next)
      }
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center min-w-[3.5rem] md:min-w-[4.5rem] lg:min-w-[5rem] flex-shrink-0">
      <span className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-1 tabular-nums select-none inline-block w-full text-center">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] md:text-xs text-white/80 font-light uppercase tracking-wider">
        {label}
      </span>
    </div>
  )

  return (
    <div className={`flex items-center gap-4 md:gap-6 lg:gap-8 ${className}`}>
      <TimeUnit value={timeLeft.days} label="Days" />
      <span className="text-3xl md:text-4xl text-white/60 tabular-nums">:</span>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className="text-3xl md:text-4xl text-white/60 tabular-nums">:</span>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <span className="text-3xl md:text-4xl text-white/60 tabular-nums">:</span>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  )
}
