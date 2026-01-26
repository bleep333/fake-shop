import { Suspense } from 'react'
import AllProductsContent from './AllProductsContent'

export default function AllProductsPage() {
  return (
    <Suspense fallback={<div className="w-full py-8 px-4 sm:px-6 lg:px-8">Loading...</div>}>
      <AllProductsContent />
    </Suspense>
  )
}
