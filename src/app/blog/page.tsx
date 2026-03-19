'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { type BlogPost, getPublishedPosts, blogCategories, formatDate } from '@/data/blog'

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

export default function BlogPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setPosts(getPublishedPosts())
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'Todos' || post.category === activeCategory
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredPost = posts.find(p => p.featured)

  return (
    <main>
      {/* Hero Banner */}
      <section className="relative bg-charcoal-800 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(46,158,166,0.08)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            className="gold-divider mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.h1
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Blog
          </motion.h1>
          <motion.p
            className="mt-4 text-sand-300 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Dicas, tendencias e informacoes sobre o mercado imobiliario na Bahia
          </motion.p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="bg-sand-50 pt-16 pb-4 px-5 md:px-10">
          <div className="max-w-7xl mx-auto">
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="relative rounded-2xl overflow-hidden bg-charcoal-800 h-[300px] md:h-[420px]">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <span className="inline-block bg-olive-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                    {featuredPost.category}
                  </span>
                  <h2 className="font-heading text-2xl md:text-4xl text-white leading-tight group-hover:text-olive-300 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-2 text-sand-300 text-sm md:text-base max-w-2xl line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sand-400 text-xs">
                    <span>{formatDate(featuredPost.date)}</span>
                    <span>|</span>
                    <span>{featuredPost.readTime} de leitura</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="bg-sand-50 pt-10 px-5 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {['Todos', ...blogCategories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-olive-600 text-white shadow-md'
                      : 'bg-white text-charcoal-500 hover:bg-sand-100 border border-sand-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative w-full md:w-72">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-200 bg-white text-sm text-charcoal-700 outline-none focus:border-olive-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding bg-sand-50" ref={ref}>
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-charcoal-200 mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <p className="text-charcoal-400 text-lg">Nenhum artigo encontrado</p>
              <p className="text-charcoal-300 text-sm mt-1">Tente outra categoria ou termo de busca</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 group"
                  custom={index}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  variants={cardVariants}
                >
                  {/* Cover Image */}
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative h-52 bg-charcoal-200 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <span className="absolute top-4 left-4 bg-olive-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        {post.category}
                      </span>
                      <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/10 transition-colors duration-500" />
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-charcoal-400 text-xs">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <span className="text-sand-300">|</span>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h2 className="mt-3 font-heading text-xl text-charcoal-800 group-hover:text-olive-600 transition-colors leading-tight">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="mt-3 text-charcoal-500 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-medium text-olive-600 bg-olive-50 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t border-sand-100">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-olive-600 text-sm font-semibold hover:text-olive-700 transition-colors inline-flex items-center gap-1.5 group/link"
                      >
                        Ler Artigo
                        <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
