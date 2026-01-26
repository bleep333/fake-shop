import { Suspense } from 'react'
import SaleContent from './SaleContent'

export default function SalePage() {
  return (
    <Suspense fallback={<div className="w-full py-8 px-4 sm:px-6 lg:px-8">Loading...</div>}>
      <SaleContent />
    </Suspense>
  )
}
