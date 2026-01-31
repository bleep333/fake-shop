'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

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

export default function CountdownTimer({ targetDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-2 tabular-nums"
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <div className="text-xs md:text-sm text-white/80 font-light uppercase tracking-wider">
        {label}
      </div>
    </div>
  )

  return (
    <div className={`flex items-center gap-4 md:gap-6 lg:gap-8 ${className}`}>
      <TimeUnit value={timeLeft.days} label="Days" />
      <div className="text-3xl md:text-4xl text-white/60">:</div>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className="text-3xl md:text-4xl text-white/60">:</div>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <div className="text-3xl md:text-4xl text-white/60">:</div>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  )
}
