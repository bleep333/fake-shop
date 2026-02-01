'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface CopyableCodeProps {
  code: string
  className?: string
}

export default function CopyableCode({ code, className = '' }: CopyableCodeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const input = document.createElement('input')
      input.value = code
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={handleCopy}
        className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        aria-label={copied ? 'Copied!' : 'Copy code'}
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </motion.svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m0 10h10a2 2 0 002-2v-2m0-10H8m10 0v10a2 2 0 01-2 2h-2m-4-4v4"
            />
          </svg>
        )}
      </button>
      <span className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.2em] text-white uppercase">
        {code}
      </span>
    </div>
  )
}
