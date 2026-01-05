import { Suspense } from 'react'
import MensContent from './MensContent'

export default function MensPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">Loading...</div>}>
      <MensContent />
    </Suspense>
  )
}
