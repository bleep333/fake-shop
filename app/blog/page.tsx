import Link from 'next/link'

export default function BlogPage() {
  const featuredArticle = {
    title: "Define the future of footwear now",
    category: "Design",
    journal: "Journal",
    image: "/placeholder-featured.jpg"
  }

  const latestNews = [
    {
      id: 1,
      title: "Better materials make better movement",
      category: "Materials",
      journal: "Journal",
      image: "/placeholder-1.jpg"
    },
    {
      id: 2,
      title: "Slower design makes stronger products",
      category: "Design",
      journal: "Journal",
      image: "/placeholder-2.jpg"
    },
    {
      id: 3,
      title: "Our gear deserves elite-level design",
      category: "Design",
      journal: "Journal",
      image: "/placeholder-3.jpg"
    }
  ]

  const relatedArticles = [
    {
      id: 4,
      title: "Trust is the real product we build",
      category: "Brand Trust",
      journal: "Journal",
      image: "/placeholder-4.jpg"
    },
    {
      id: 5,
      title: "What is a competitive edge",
      category: "Culture",
      journal: "Journal",
      image: "/placeholder-5.jpg"
    },
    {
      id: 6,
      title: "Restraint is a strength, not a weakness",
      category: "Brand",
      journal: "Journal",
      image: "/placeholder-6.jpg"
    }
  ]

  return (
    <div className="w-full py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-12 md:mb-16">Newsroom</h1>

        {/* Featured Article */}
        <section className="mb-16 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="aspect-[4/3] bg-stone-100 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                <span className="text-stone-400 text-sm md:text-base">Featured Article Image</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-3 md:mb-4">
                <span className="text-sm font-medium text-stone-600">{featuredArticle.category}</span>
                <span className="text-sm text-stone-400">•</span>
                <span className="text-sm font-medium text-stone-600">{featuredArticle.journal}</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight">
                {featuredArticle.title}
              </h2>
              <Link 
                href={`/blog/${featuredArticle.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center gap-2 text-base font-medium hover:underline transition-colors"
              >
                Read Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section className="mb-16 md:mb-20">
          <h3 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-12">Latest news</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {latestNews.map((article) => (
              <Link 
                key={article.id}
                href={`/blog/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="group"
              >
                <div className="aspect-[4/3] bg-stone-100 rounded-lg overflow-hidden mb-3 md:mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                    <span className="text-stone-400 text-xs md:text-sm">Article {article.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm font-medium text-stone-600">{article.category}</span>
                  <span className="text-sm text-stone-400">•</span>
                  <span className="text-sm font-medium text-stone-600">{article.journal}</span>
                </div>
                <h4 className="text-lg md:text-xl font-bold group-hover:underline transition-colors">{article.title}</h4>
              </Link>
            ))}
          </div>
        </section>

        {/* You Might Also Like */}
        <section>
          <h3 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-12">You might also like</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {relatedArticles.map((article) => (
              <Link 
                key={article.id}
                href={`/blog/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="group"
              >
                <div className="aspect-[4/3] bg-stone-100 rounded-lg overflow-hidden mb-3 md:mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                    <span className="text-stone-400 text-xs md:text-sm">Article {article.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm font-medium text-stone-600">{article.category}</span>
                  <span className="text-sm text-stone-400">•</span>
                  <span className="text-sm font-medium text-stone-600">{article.journal}</span>
                </div>
                <h4 className="text-lg md:text-xl font-bold group-hover:underline transition-colors">{article.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
