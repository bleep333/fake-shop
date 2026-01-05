interface PlaceholderImageProps {
  seed: string
  className?: string
}

export default function PlaceholderImage({ seed, className = '' }: PlaceholderImageProps) {
  // Generate a consistent color based on seed
  const hue = (seed.charCodeAt(0) * 137.508) % 360
  const color1 = `hsl(${hue}, 70%, 85%)`
  const color2 = `hsl(${(hue + 30) % 360}, 70%, 75%)`

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
      }}
    >
      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  )
}

