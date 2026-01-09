import { Suspense } from 'react'
import NewArrivalsContent from './NewArrivalsContent'

export default function NewArrivalsPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">Loading...</div>}>
      <NewArrivalsContent />
    </Suspense>
  )
}
