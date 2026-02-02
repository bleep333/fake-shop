export default function ContactPage() {
  return (
    <div className="w-full">
      <section className="section-spacing">
        <div className="container-custom max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8 text-black"
              style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
            Contact Us
          </h1>
          <div className="space-y-8 text-lg text-stone-700 font-light leading-relaxed">
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">Customer Service</h2>
              <p>
                Email:{' '}
                <a href="mailto:hello@novara.com" className="text-stone-900 underline hover:no-underline">
                  hello@novara.com
                </a>
              </p>
              <p className="mt-2">Response time: Within 24 hours</p>
            </div>
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">Returns & Exchanges</h2>
              <p>
                For returns or exchanges, please email{' '}
                <a href="mailto:returns@novara.com" className="text-stone-900 underline hover:no-underline">
                  returns@novara.com
                </a>
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">Press Inquiries</h2>
              <p>
                Media and press inquiries:{' '}
                <a href="mailto:press@novara.com" className="text-stone-900 underline hover:no-underline">
                  press@novara.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
