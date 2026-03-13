'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

const posts = [
  {
    id: 1,
    slug: '5-dicas-comprar-primeiro-imovel',
    title: '5 Dicas para Comprar seu Primeiro Imovel',
    excerpt:
      'Comprar o primeiro imovel e um grande passo. Confira nossas dicas essenciais para fazer a melhor escolha e evitar erros comuns nessa jornada tao importante.',
    category: 'Dicas',
    date: '10 Mar 2026',
    readTime: '5 min',
  },
  {
    id: 2,
    slug: 'mercado-imobiliario-bahia-2026',
    title: 'Mercado Imobiliario na Bahia em 2026',
    excerpt:
      'Analise completa do mercado imobiliario baiano em 2026. Tendencias, areas em valorizacao e oportunidades para compradores e investidores nas principais cidades.',
    category: 'Mercado',
    date: '05 Mar 2026',
    readTime: '8 min',
  },
  {
    id: 3,
    slug: 'como-avaliar-valor-imovel',
    title: 'Como Avaliar o Valor de um Imovel',
    excerpt:
      'Entenda os principais fatores que influenciam o valor de um imovel e aprenda a fazer uma avaliacao mais precisa antes de comprar ou vender sua propriedade.',
    category: 'Educacional',
    date: '28 Fev 2026',
    readTime: '6 min',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

export default function BlogPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <main>
      {/* Hero Banner */}
      <section className="relative bg-charcoal-800 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,67,0.08)_0%,transparent_60%)]" />
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

      {/* Blog Posts Grid */}
      <section className="section-padding bg-sand-50" ref={ref}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 group"
                custom={index}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={cardVariants}
              >
                {/* Image Placeholder */}
                <div className="relative h-52 bg-charcoal-200 flex items-center justify-center overflow-hidden">
                  <svg className="w-12 h-12 text-charcoal-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                  </svg>

                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 bg-olive-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    {post.category}
                  </span>

                  <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/10 transition-colors duration-500" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Date and read time */}
                  <div className="flex items-center gap-3 text-charcoal-400 text-xs">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span>{post.date}</span>
                    </div>
                    <span className="text-sand-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="mt-3 font-heading text-xl text-charcoal-800 group-hover:text-olive-600 transition-colors leading-tight">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="mt-3 text-charcoal-500 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Read More Link */}
                  <div className="mt-5 pt-4 border-t border-sand-100">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-olive-600 text-sm font-semibold hover:text-olive-700 transition-colors inline-flex items-center gap-1.5 group/link"
                    >
                      Ler Mais
                      <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
