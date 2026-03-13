'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const testimonials = [
  {
    id: 1,
    name: 'Maria Silva',
    city: 'Salvador',
    quote:
      'Encontrei meu apartamento ideal em Salvador gracas ao atendimento excepcional. Cada detalhe foi cuidado com muito carinho e profissionalismo.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Joao Santos',
    city: 'Feira de Santana',
    quote:
      'Profissionalismo e dedicacao do inicio ao fim. Recomendo de olhos fechados! A equipe foi incansavel em encontrar exatamente o que eu precisava.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Ana Oliveira',
    city: 'Alagoinhas',
    quote:
      'A melhor experiencia que ja tive comprando um imovel. Suporte completo! Desde a documentacao ate a entrega das chaves, tudo impecavel.',
    rating: 5,
  },
]

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${filled ? 'text-gold-400' : 'text-sand-200'}`}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  )
}

function QuoteIcon() {
  return (
    <svg
      className="w-10 h-10 text-gold-300/40"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
    </svg>
  )
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1)
      setCurrentIndex(index)
    },
    [currentIndex]
  )

  const testimonial = testimonials[currentIndex]

  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl text-charcoal-800">
            O que nossos clientes dizem
          </h2>
          <div className="gold-divider mx-auto mt-4" />
        </motion.div>

        {/* Testimonial carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="relative bg-sand-50 rounded-3xl p-8 md:p-12 min-h-[320px] flex flex-col items-center justify-center overflow-hidden">
            {/* Quote icon */}
            <div className="mb-6">
              <QuoteIcon />
            </div>

            {/* Animated testimonial */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={testimonial.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} filled={i < testimonial.rating} />
                  ))}
                </div>

                {/* Quote text */}
                <blockquote className="text-charcoal-700 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="mt-8">
                  {/* Author avatar placeholder */}
                  <div className="w-12 h-12 rounded-full bg-olive-100 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-olive-600 font-heading text-lg font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <p className="font-heading text-charcoal-800 font-semibold text-lg">
                    {testimonial.name}
                  </p>
                  <p className="text-charcoal-400 text-sm mt-0.5">{testimonial.city}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots navigation */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-gold-400'
                    : 'w-3 h-3 bg-sand-300 hover:bg-sand-400'
                }`}
                aria-label={`Ver depoimento ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
