import { Suspense } from 'react'
import SearchResultsContent from './SearchResultsContent'

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="w-full py-8 px-4 sm:px-6 lg:px-8">Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  )
}
