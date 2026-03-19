'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { type BlogPost, getPostBySlug, getPublishedPosts, formatDate } from '@/data/blog'
import { openWhatsApp } from '@/utils/whatsapp'

/* Renders blog content - supports HTML (from TipTap editor) */
function RenderContent({ content }: { content: string }) {
  return (
    <div
      className="blog-rendered"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default function BlogPostClient() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const slug = params?.slug as string
    if (!slug) return
    const found = getPostBySlug(slug)
    if (found) {
      setPost(found)
      const related = getPublishedPosts()
        .filter(p => p.id !== found.id && (p.category === found.category || p.tags.some(t => found.tags.includes(t))))
        .slice(0, 3)
      setRelatedPosts(related)
    } else {
      setNotFound(true)
    }
  }, [params])

  if (notFound) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-sand-50 pt-20">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-charcoal-800 mb-4">Artigo nao encontrado</h1>
          <Link href="/blog" className="btn-primary">Voltar ao Blog</Link>
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-sand-50 pt-20">
        <div className="w-8 h-8 border-3 border-olive-500 border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main>
      {/* Hero with cover image */}
      <section className="relative bg-charcoal-800 pt-28 pb-0 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/70 to-charcoal-900/50" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-10 pb-16 md:pb-20">
          {/* Breadcrumb */}
          <motion.div
            className="flex items-center gap-2 text-sand-400 text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-olive-400">{post.category}</span>
          </motion.div>

          <motion.span
            className="inline-block bg-olive-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {post.category}
          </motion.span>

          <motion.h1
            className="font-heading text-3xl md:text-5xl text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {post.title}
          </motion.h1>

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-4 text-sand-300 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-olive-600 flex items-center justify-center text-white text-xs font-bold">JG</div>
              <span>{post.author}</span>
            </div>
            <span className="text-sand-500">|</span>
            <span>{formatDate(post.date)}</span>
            <span className="text-sand-500">|</span>
            <span>{post.readTime} de leitura</span>
          </motion.div>
        </div>
      </section>

      {/* Article content */}
      <section className="bg-sand-50 py-12 md:py-16 px-5 md:px-10">
        <div className="max-w-3xl mx-auto">
          <motion.article
            className="bg-white rounded-2xl p-6 md:p-10 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <RenderContent content={post.content} />
          </motion.article>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs font-medium text-olive-600 bg-olive-50 border border-olive-200 px-3 py-1.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Share + CTA */}
          <div className="mt-8 bg-olive-700 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="font-heading text-2xl text-white mb-2">Gostou deste artigo?</h3>
            <p className="text-olive-100 text-sm mb-6">Fale com Jeova Guedes e receba assessoria personalizada</p>
            <button
              type="button"
              onClick={() => openWhatsApp(`/blog/${post.slug}`, post.title)}
              className="btn-whatsapp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar com Jeova Guedes
            </button>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="font-heading text-2xl text-charcoal-800 mb-6">Artigos Relacionados</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(rp => (
                  <Link key={rp.id} href={`/blog/${rp.slug}`} className="group">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <div className="h-36 overflow-hidden">
                        <img src={rp.coverImage} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <span className="text-[10px] font-semibold text-olive-600 uppercase tracking-wider">{rp.category}</span>
                        <h4 className="mt-1 font-heading text-sm text-charcoal-800 group-hover:text-olive-600 transition-colors leading-snug line-clamp-2">
                          {rp.title}
                        </h4>
                        <span className="mt-2 text-[11px] text-charcoal-400 block">{formatDate(rp.date)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to blog */}
          <div className="mt-10 text-center">
            <Link href="/blog" className="btn-outline">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Voltar ao Blog
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
