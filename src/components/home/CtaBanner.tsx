'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const WHATSAPP_URL = 'https://wa.me/5571999999999'

export default function CtaBanner() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative overflow-hidden bg-olive-700" ref={ref}>
      {/* Decorative gold accent line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, transparent, #D4A843, #FFD166, #D4A843, transparent)',
        }}
      />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 800 200"
          aria-hidden="true"
        >
          <defs>
            <pattern id="ctaPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20h40M20 0v40" stroke="#D4A843" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ctaPattern)" />
        </svg>
      </div>

      <div className="relative z-10 py-20 md:py-24 px-5 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Gold decorative element */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-gold-400" />
              <svg
                className="w-5 h-5 text-gold-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="w-8 h-[1px] bg-gold-400" />
            </div>

            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              Pronto para encontrar seu im&oacute;vel ideal?
            </h2>
          </motion.div>

          <motion.p
            className="mt-4 text-olive-100 text-lg md:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Fale com nossa especialista e receba um atendimento personalizado
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-lg"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar no WhatsApp
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decorative gold accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, #D4A843, #FFD166, #D4A843, transparent)',
        }}
      />
    </section>
  )
}
