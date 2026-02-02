import Image from 'next/image'
import Link from 'next/link'

export default function ValuesPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <Image
            src="/images/company/sustainability.jpg"
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
            Our Values
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto">
            Purposeful design, sustainable materials, ethical practices — the principles that guide everything we create.
          </p>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center mb-24">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="/images/company/sustainability.jpg"
                alt="Sustainable fashion materials and ethical sourcing"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6 text-black"
                  style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                Sustainable by Design
              </h2>
              <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed mb-6">
                We source materials with care, choosing natural fibers and sustainable alternatives that minimize our environmental impact. Every fabric roll, every thread, every button is selected with purpose.
              </p>
              <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed">
                Our commitment extends beyond materials — we work with partners who share our values, ensuring ethical labor practices and reduced carbon footprints throughout our supply chain.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div>
              <h3 className="text-2xl md:text-3xl font-light mb-4 text-black"
                  style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                Quality First
              </h3>
              <p className="text-base md:text-lg text-stone-600 font-light leading-relaxed">
                We believe in timeless design and exceptional quality. Every piece is crafted to last, designed to move with you, built to stand the test of time.
              </p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-light mb-4 text-black"
                  style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                Ethical Practices
              </h3>
              <p className="text-base md:text-lg text-stone-600 font-light leading-relaxed">
                Fair wages, safe working conditions, and respect for our artisans — these aren&apos;t negotiable. We build relationships, not just products.
              </p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-light mb-4 text-black"
                  style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                Transparency
              </h3>
              <p className="text-base md:text-lg text-stone-600 font-light leading-relaxed">
                We&apos;re open about our processes, our partners, and our impact. You deserve to know where your clothes come from and how they&apos;re made.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6 text-black"
                  style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                Crafted with Care
              </h2>
              <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed mb-6">
                Our artisans bring decades of experience to every stitch. Using time-honored techniques and modern precision, we create pieces that honor tradition while embracing innovation.
              </p>
              <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed">
                The human touch matters. The subtle variations, the attention to detail, the care that goes into each piece — this is what makes NOVARA special.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden order-1 lg:order-2">
              <Image
                src="/images/company/craftsmanship.jpg"
                alt="Handcrafted quality and attention to detail"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-8 text-white"
              style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
            Values in Action
          </h2>
          <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed mb-12">
            Experience the difference that purpose-driven design makes. Every piece tells a story of quality, sustainability, and care.
          </p>
          <Link
            href="/all"
            className="inline-block px-8 py-4 bg-white text-black font-light tracking-wide hover:bg-white/90 transition-all duration-300"
          >
            Explore Our Collection
          </Link>
        </div>
      </section>
    </div>
  )
}
