import Image from 'next/image'
import Link from 'next/link'

export default function LocationsPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <Image
            src="/images/company/store.jpg"
            alt=""
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1] mb-8"
              style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
            Store Locations
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto">
            Experience NOVARA in person. Our flagship stores bring our vision to life.
          </p>
        </div>
      </section>

      {/* Store Experience Section */}
      <section className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center mb-24">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="/images/company/store.jpg"
                alt="NOVARA flagship store interior - minimalist design with curated collections"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6 text-black"
                  style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                A Space for Discovery
              </h2>
              <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed mb-6">
                Our stores are more than retail spaces — they&apos;re environments designed to inspire. Every detail, from the lighting to the layout, is curated to showcase our collections in their best light.
              </p>
              <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed">
                Visit us to experience the quality firsthand, feel the fabrics, and discover pieces that move with you. Our team is here to help you find exactly what you&apos;re looking for.
              </p>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-light tracking-tight mb-6 text-black"
                style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
              Flagship Stores Coming Soon
            </h3>
            <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed mb-12">
              We&apos;re opening our first flagship locations in Paris, New York, and Tokyo. Each store will reflect our commitment to quality, sustainability, and exceptional design.
            </p>

            {/* Location Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="p-8 bg-stone-50 rounded-lg">
                <h4 className="text-xl font-medium mb-2 text-black">Paris</h4>
                <p className="text-stone-600 font-light mb-4">Le Marais District</p>
                <p className="text-sm text-stone-500 font-light">Opening Spring 2025</p>
              </div>
              <div className="p-8 bg-stone-50 rounded-lg">
                <h4 className="text-xl font-medium mb-2 text-black">New York</h4>
                <p className="text-stone-600 font-light mb-4">SoHo Neighborhood</p>
                <p className="text-sm text-stone-500 font-light">Opening Summer 2025</p>
              </div>
              <div className="p-8 bg-stone-50 rounded-lg">
                <h4 className="text-xl font-medium mb-2 text-black">Tokyo</h4>
                <p className="text-stone-600 font-light mb-4">Omotesando District</p>
                <p className="text-sm text-stone-500 font-light">Opening Fall 2025</p>
              </div>
            </div>

            <p className="text-base md:text-lg text-stone-600 font-light mb-8">
              In the meantime, shop our full collection online with worldwide shipping available.
            </p>
            <p className="text-base md:text-lg text-stone-600 font-light mb-12">
              For inquiries about future store openings, please contact us at{' '}
              <a href="mailto:info@novara.com" className="text-stone-900 underline hover:no-underline">
                info@novara.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Online Shopping CTA */}
      <section className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-8 text-white"
              style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
            Shop Online Now
          </h2>
          <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed mb-12">
            Browse our complete collection online. Free shipping on orders over $100. Easy returns within 30 days.
          </p>
          <Link
            href="/all"
            className="inline-block px-8 py-4 bg-white text-black font-light tracking-wide hover:bg-white/90 transition-all duration-300"
          >
            Shop the Collection
          </Link>
        </div>
      </section>
    </div>
  )
}
