export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold mb-12 md:mb-16 leading-[1.1] max-w-5xl">
            We build movement. Every pair is made for action on the street, on the run, on your terms.
          </h1>
          
          {/* Portrait Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                <span className="text-stone-400 text-xs md:text-sm">Portrait 1</span>
              </div>
            </div>
            <div className="aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                <span className="text-stone-400 text-xs md:text-sm">Portrait 2</span>
              </div>
            </div>
            <div className="aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                <span className="text-stone-400 text-xs md:text-sm">Portrait 3</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold leading-[1.1] max-w-5xl">
            NOVARA® ISN&apos;T JUST A STORE. IT&apos;S A MOVEMENT IN FORM. BASED IN PARIS, WE CURATE CLEAN, ESSENTIAL DESIGN — NO NOISE, JUST PURPOSE. EVERY PIECE IS CHOSEN FOR ITS FEEL, FUNCTION, AND TIMELESS EDGE. MINIMAL. DURABLE. UNAPOLOGETICALLY REFINED.
          </h2>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-semibold mb-6">Backing Progress with Purpose</h3>
          <p className="text-lg md:text-xl text-stone-600 mb-12 md:mb-16 max-w-3xl">
            At NOVARA®, we build for movement — in culture, craft, and clarity. Every design choice is intentional. Minimalist, powerful, future-minded.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <h4 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4">800+</h4>
              <p className="text-base md:text-lg text-stone-600">Shoes Tested in Motion</p>
            </div>
            <div>
              <h4 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4">50+</h4>
              <p className="text-base md:text-lg text-stone-600">Athletes & Creators Backed</p>
            </div>
            <div>
              <h4 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4">200+</h4>
              <p className="text-base md:text-lg text-stone-600">Hours of Wear Before Launch</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="aspect-[16/10] bg-stone-100 rounded-lg overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
              <span className="text-stone-400 text-base md:text-lg">Featured Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Partners Section */}
      <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-semibold mb-2">Corporate Partners</h3>
          <h4 className="text-xl md:text-2xl font-medium mb-6 md:mb-8 text-stone-700">A natural fit</h4>
          <p className="text-base md:text-lg text-stone-600 mb-8 md:mb-12 max-w-3xl">
            At NOVARA®, we team up with partners who share our values — purposeful design, long-term thinking, and real-world responsibility. Whether it&apos;s ethical labor, reduced carbon footprints, or mental health support, we stand with brands that back progress where it matters. Together, we&apos;re building more than product — we&apos;re building better standards.
          </p>
          
          {/* Partner Logos Placeholder */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-stone-50 rounded-lg flex items-center justify-center border border-stone-200">
                <span className="text-stone-400 text-xs md:text-sm">Partner {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Preview */}
      <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <h3 className="text-2xl md:text-3xl font-semibold">New arrivals</h3>
            <a href="/new-arrivals" className="text-base font-medium hover:underline flex items-center gap-2 transition-colors">
              Shop New
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <a key={i} href="/new-arrivals" className="group">
                <div className="aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                    <span className="text-stone-400 text-xs md:text-sm">Product {i}</span>
                  </div>
                </div>
                <p className="text-base font-medium group-hover:underline">Product Name {i}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-12">Follow @novara on Instagram</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-stone-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                  <span className="text-stone-400 text-xs">Instagram {i}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
