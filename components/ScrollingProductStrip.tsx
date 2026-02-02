'use client'

import Image from 'next/image'
import Link from 'next/link'

// Product image paths for the marquee (our product pictures)
const PRODUCT_IMAGES = [
  '/images/products/MENS-classic-white-tee.jpg',
  '/images/products/MENS-denim-jacket.jpg',
  '/images/products/MENS-jacket-bomber.png',
  '/images/products/MENS-knitwear-cardigan.png',
  '/images/products/WOMENS-floral-summer-dress.jpg',
  '/images/products/WOMENS-silk-blouse.jpg',
  '/images/products/WOMENS-trench-coat.jpg',
  '/images/products/WOMENS-knit-sweater.jpg',
  '/images/products/MENS-button-down-shirt.jpg',
  '/images/products/WOMENS-cropped-blazer.jpg',
  '/images/products/MENS-hooded-sweatshirt.jpg',
  '/images/products/WOMENS-leather-handbag.png',
].filter(Boolean)

function StripRow({ rowIndex }: { rowIndex: number }) {
  return (
    <div className="flex items-center gap-4 md:gap-5 shrink-0">
      {PRODUCT_IMAGES.map((src, i) => (
        <div key={`row-${rowIndex}-${src}-${i}`} className="flex flex-col items-center shrink-0 w-[88px] md:w-[100px]">
          <Link
            href="/all"
            className="block w-[88px] h-[88px] md:w-[100px] md:h-[100px] relative rounded-md overflow-hidden bg-stone-100 shrink-0 flex-shrink-0"
          >
            <Image
              src={src}
              alt={`NOVARA product - ${src.split('/').pop()?.replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/-/g, ' ') || 'Product'}`}
              fill
              className="object-cover"
              sizes="100px"
            />
          </Link>
          <p className="mt-1.5 text-[10px] text-stone-500 font-light whitespace-nowrap">Shop NOVARA</p>
        </div>
      ))}
    </div>
  )
}

export default function ScrollingProductStrip() {
  return (
    <section className="w-full py-5 md:py-6 bg-stone-50 overflow-hidden border-y border-stone-200">
      {/* Multiple row copies so both sides stay filled with products while scrolling */}
      <div className="flex animate-scroll-left-slow w-max">
        <StripRow rowIndex={0} />
        <StripRow rowIndex={1} />
        <StripRow rowIndex={2} />
        <StripRow rowIndex={3} />
      </div>
    </section>
  )
}
