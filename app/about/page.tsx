'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  // Scroll progress for the pinned section - tracks scroll through the tall container
  // Use a longer scroll range to slow down the animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']  // Track from when container enters bottom to when it exits top
  })

  // Split text into words for individual animation
  const fullText = "NOVARA® ISN'T JUST A STORE. IT'S A MOVEMENT IN FORM. BASED IN PARIS, WE CURATE CLEAN, ESSENTIAL DESIGN — NO NOISE, JUST PURPOSE. EVERY PIECE IS CHOSEN FOR ITS FEEL, FUNCTION, AND TIMELESS EDGE. MINIMAL. DURABLE. UNAPOLOGETICALLY REFINED."
  const words = fullText.split(' ')
  
  // Create word animations - each word fades in sequentially with slower timing
  // Note: We need to create transforms for each word. Since the text is static,
  // the number of hooks is constant. We disable the eslint rule for this case.
  const totalWords = words.length
  const wordAnimations: Array<{ opacity: any, color: any }> = []
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  for (let index = 0; index < totalWords; index++) {
    // Spread words across more of the scroll range for slower reveal
    const startProgress = (index / totalWords) * 0.8  // Words start revealing across 80% of scroll
    const endProgress = startProgress + (0.8 / totalWords)  // Each word gets a portion of the scroll
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const opacity = useTransform(
      scrollYProgress,
      [Math.max(0, startProgress - 0.05), startProgress, endProgress, Math.min(1, endProgress + 0.1)],
      [0.1, 0.2, 1, 1]  // Start very faint, gradually become fully visible
    )
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const color = useTransform(
      scrollYProgress,
      [Math.max(0, startProgress - 0.05), startProgress, endProgress, Math.min(1, endProgress + 0.1)],
      ['rgb(75, 85, 99)', 'rgb(107, 114, 128)', 'rgb(255, 255, 255)', 'rgb(255, 255, 255)']
    )
    
    wordAnimations.push({ opacity, color })
  }
  return (
    <div className="w-full" style={{ overflow: 'visible' }}>
      {/* Hero Section - NIVEST Style: Text on top, Image below */}
      <section className="w-full bg-white">
        {/* Text Section - Top with minimal spacing */}
        <div className="w-full pt-4 md:pt-6 pb-8 md:pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight text-black leading-[1.1] max-w-5xl"
                style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
              We build movement. Every piece is made for action on the street, on the run, on your terms.
            </h1>
          </div>
        </div>

        {/* Full Screen Image - Below Text, No Blur */}
        <div className="w-full relative aspect-[16/10] md:aspect-[16/9]">
          <Image
            src="/images/company/about-hero.jpg"
            alt="NOVARA community - diverse group of people walking together"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </section>

      {/* Main Statement Section - Pinned Scroll Animation */}
      <section 
        ref={containerRef}
        className="w-full bg-black relative"
        style={{ 
          height: '500vh',
          position: 'relative',
          overflow: 'visible'
        }}
      >
        {/* Pinned Container - Stays fixed while scrolling */}
        <motion.div 
          ref={sectionRef}
          className="sticky top-0 w-full h-screen flex items-center justify-center py-24 md:py-32 px-4 sm:px-6 lg:px-8 z-10"
          style={{ 
            position: 'sticky',
            top: 0,
            willChange: 'transform'
          }}
        >
          {/* Subtle background image */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
            <Image
              src="/images/company/about-hero.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-[1.1] max-w-5xl"
              style={{ 
                fontFamily: 'var(--font-playfair), ui-serif, serif',
              }}
            >
              {words.map((word, index) => (
                <motion.span
                  key={index}
                  style={{
                    opacity: wordAnimations[index].opacity,
                    color: wordAnimations[index].color,
                  }}
                  className="inline-block mr-2"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
          </div>
        </motion.div>
      </section>

      {/* Craftsmanship Section */}
      <section className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="/images/company/craftsmanship.jpg"
                alt="Handcrafted quality - vintage sewing machine creating timeless pieces"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-light tracking-tight mb-6 text-black"
                  style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                Crafted with Intention
              </h3>
              <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed mb-6">
                Every garment begins with a vision. Our artisans work with precision and care, using time-honored techniques passed down through generations. From the first stitch to the final detail, we ensure each piece meets our exacting standards.
              </p>
              <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed">
                We believe in the power of human touch — the subtle variations that make each piece unique, the attention to detail that machines can&apos;t replicate. This is what sets NOVARA apart.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Collaboration Section */}
      <section className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-3xl md:text-4xl font-light tracking-tight mb-6 text-black"
                  style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                Designed Together
              </h3>
              <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed mb-6">
                Our design team collaborates closely, bringing together diverse perspectives and expertise. We sketch, we prototype, we refine — always with the wearer in mind.
              </p>
              <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed">
                This collaborative spirit extends beyond our studio walls. We listen to our community, adapt to their needs, and create pieces that truly move with them.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden order-1 lg:order-2">
              <Image
                src="/images/company/team.jpg"
                alt="Design team collaborating on new collections"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h3 className="text-3xl md:text-4xl font-light tracking-tight mb-4 text-black"
                style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
              Backing Progress with Purpose
            </h3>
            <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed max-w-3xl">
              At NOVARA®, we build for movement — in culture, craft, and clarity. Every design choice is intentional. Minimalist, powerful, future-minded.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div>
              <h4 className="text-5xl md:text-6xl lg:text-7xl font-light mb-4 text-black">500+</h4>
              <p className="text-base md:text-lg text-stone-600 font-light">Pieces Tested in Motion</p>
            </div>
            <div>
              <h4 className="text-5xl md:text-6xl lg:text-7xl font-light mb-4 text-black">50+</h4>
              <p className="text-base md:text-lg text-stone-600 font-light">Designers & Creators Backed</p>
            </div>
            <div>
              <h4 className="text-5xl md:text-6xl lg:text-7xl font-light mb-4 text-black">200+</h4>
              <p className="text-base md:text-lg text-stone-600 font-light">Hours of Wear Before Launch</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/company/about-hero.jpg"
            alt="NOVARA community - diverse group walking together"
            fill
            className="object-cover opacity-50"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-8 text-white"
              style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
            Built for the Bold
          </h3>
          <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed max-w-3xl mx-auto mb-12">
            Our community moves with purpose. They&apos;re creators, thinkers, doers — people who value quality over quantity, substance over style. Join us.
          </p>
          <Link
            href="/all"
            className="inline-block px-8 py-4 bg-white text-black font-light tracking-wide hover:bg-white/90 transition-all duration-300"
          >
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* Corporate Partners Section */}
      <section className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-2 text-black">Corporate Partners</h3>
            <h4 className="text-xl md:text-2xl font-light mb-6 text-stone-700">A natural fit</h4>
            <p className="text-base md:text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
              At NOVARA®, we team up with partners who share our values — purposeful design, long-term thinking, and real-world responsibility. Whether it&apos;s ethical labor, reduced carbon footprints, or sustainable materials, we stand with brands that back progress where it matters. Together, we&apos;re building more than product — we&apos;re building better standards.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
