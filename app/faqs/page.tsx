import FAQ from '@/components/FAQ'

export default function FAQsPage() {
  return (
    <div className="w-full">
      <section className="section-spacing">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4 text-black"
                style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
              Frequently Asked Questions
            </h1>
            <p className="text-stone-600 text-lg font-light">
              Everything you need to know about shopping with NOVARA
            </p>
          </div>
          <FAQ />
        </div>
      </section>
    </div>
  )
}
