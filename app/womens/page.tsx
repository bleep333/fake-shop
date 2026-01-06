import { Suspense } from 'react'
import WomensContent from './WomensContent'

export default function WomensPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">Loading...</div>}>
      <WomensContent />
    </Suspense>
  )
}