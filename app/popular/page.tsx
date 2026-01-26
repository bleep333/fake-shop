import { Suspense } from 'react'
import PopularContent from './PopularContent'

export default function PopularPage() {
  return (
    <Suspense fallback={<div className="w-full py-8 px-4 sm:px-6 lg:px-8">Loading...</div>}>
      <PopularContent />
    </Suspense>
  )
}
