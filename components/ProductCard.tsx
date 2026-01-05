'use client'

import { Product } from '@/lib/mockProducts'
import PlaceholderImage from './PlaceholderImage'

interface ProductCardProps {
  product: Product
  onQuickAdd?: (product: Product) => void
}

export default function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  return (
    <div className="group">
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg mb-3">
        <PlaceholderImage seed={product.id} className="group-hover:scale-105 transition-transform duration-300" />
        
        {/* Tags */}
        <div className="absolute top-2 left-2 flex gap-2">
          {product.tags.includes('New') && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded">New</span>
          )}
          {product.tags.includes('Sale') && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">Sale</span>
          )}
        </div>

        {/* Quick Add Button */}
        {onQuickAdd && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onQuickAdd(product)}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Quick Add
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

