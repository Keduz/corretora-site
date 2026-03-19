'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { openWhatsApp } from '@/utils/whatsapp'

const fadeUp = {
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

const cities = [
  {
    name: 'Porto de Sauipe',
    subtitle: 'Litoral Norte',
    description: 'Imoveis de alto padrao no paraiso baiano',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
  },
  {
    name: 'Salvador',
    subtitle: 'Capital',
    description: 'Mercado diversificado e em constante crescimento',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    name: 'Litoral da Bahia',
    subtitle: 'Costa dos Coqueiros',
    description: 'Oportunidades exclusivas no litoral',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
]

const values = [
  {
    title: 'Confianca',
    description: 'Construimos relacionamentos duradouros baseados na confianca mutua com cada cliente.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Transparencia',
    description: 'Todas as informacoes sobre o imovel e o processo de negociacao sao compartilhadas abertamente.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Compromisso',
    description: 'Dedicacao total ao sucesso de cada negociacao, do primeiro contato a entrega das chaves.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    title: 'Excelencia',
    description: 'Buscamos a excelencia em cada detalhe, oferecendo uma experiencia de alto padrao.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-7.54 0" />
      </svg>
    ),
  },
]

/* ------------------------------------------------------------------ */
/*  Gold floating particles (CSS keyframes injected once)             */
/* ------------------------------------------------------------------ */
const particleStyles = `
@keyframes floatParticle {
  0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  50% { transform: translateY(-60px) translateX(20px) scale(1.5); opacity: 0.8; }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 15px 2px rgba(46,158,166,0.25), 0 0 40px 4px rgba(46,158,166,0.10); }
  50% { box-shadow: 0 0 25px 6px rgba(46,158,166,0.40), 0 0 60px 10px rgba(46,158,166,0.18); }
}
@keyframes gentleTilt {
  0% { transform: perspective(800px) rotateY(-4deg) rotateX(2deg); }
  25% { transform: perspective(800px) rotateY(2deg) rotateX(-3deg); }
  50% { transform: perspective(800px) rotateY(4deg) rotateX(2deg); }
  75% { transform: perspective(800px) rotateY(-2deg) rotateX(-2deg); }
  100% { transform: perspective(800px) rotateY(-4deg) rotateX(2deg); }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes floatShadow {
  0%, 100% { transform: scaleX(0.85); opacity: 0.35; }
  50% { transform: scaleX(0.75); opacity: 0.2; }
}
`

/* Particle positions pre-computed for 12 particles */
const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  top: `${10 + Math.random() * 80}%`,
  left: `${5 + Math.random() * 90}%`,
  size: 3 + Math.random() * 5,
  delay: Math.random() * 5,
  duration: 3 + Math.random() * 4,
}))

export default function SobrePage() {
  const storyRef = useRef(null)
  const storyInView = useInView(storyRef, { once: true, margin: '-100px' })
  const citiesRef = useRef(null)
  const citiesInView = useInView(citiesRef, { once: true, margin: '-100px' })
  const valuesRef = useRef(null)
  const valuesInView = useInView(valuesRef, { once: true, margin: '-100px' })
  const ctaRef = useRef(null)
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' })

  /* ---- 3D photo tilt state ---- */
  const photoRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile || !photoRef.current) return
      const rect = photoRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5   // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setTilt({ x: y * -18, y: x * 18 }) // degrees
    },
    [isMobile],
  )

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  return (
    <main>
      {/* Inject particle / glow keyframes */}
      <style dangerouslySetInnerHTML={{ __html: particleStyles }} />

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
            Sobre Nos
          </motion.h1>
          <motion.p
            className="mt-4 text-sand-300 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Conheca Jeova Guedes e sua paixao pelo mercado imobiliario no litoral da Bahia
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-sand-50" ref={storyRef}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ===== 3D Photo Display ===== */}
            <motion.div
              className="relative h-[400px] lg:h-[500px] flex items-center justify-center"
              initial={{ opacity: 0, x: -40, scale: 0.92 }}
              animate={storyInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Floating shadow beneath the card */}
              <div
                className="absolute bottom-2 left-[12%] right-[12%] h-8 rounded-[50%] bg-charcoal-800/30 blur-xl"
                style={{ animation: 'floatShadow 4s ease-in-out infinite' }}
              />

              {/* Perspective wrapper */}
              <div
                ref={photoRef}
                className="relative w-full h-full"
                style={{ perspective: '1000px' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* The tilting card */}
                <div
                  className="relative w-full h-full rounded-2xl overflow-hidden"
                  style={{
                    transform: isMobile
                      ? undefined
                      : `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: 'transform 0.15s ease-out',
                    animation: isMobile ? 'gentleTilt 8s ease-in-out infinite' : undefined,
                    willChange: 'transform',
                  }}
                >
                  {/* Gold pulsing border/glow */}
                  <div
                    className="absolute -inset-[3px] rounded-2xl z-0"
                    style={{
                      background: 'linear-gradient(135deg, #2E9EA6, #258389, #2E9EA6, #4CB8BF, #2E9EA6)',
                      animation: 'pulseGlow 3s ease-in-out infinite',
                    }}
                  />

                  {/* Inner card with image */}
                  <div className="absolute inset-[3px] rounded-[14px] overflow-hidden z-10 bg-charcoal-800">
                    <Image
                      src="/jeova-guedes.png"
                      alt="Jeova Guedes - Corretor de Imoveis"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />

                    {/* Glass reflection overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none z-20"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
                      }}
                    />

                    {/* Shimmer sweep */}
                    <div
                      className="absolute inset-0 pointer-events-none z-20"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 6s ease-in-out infinite',
                      }}
                    />

                    {/* Bottom gradient with name */}
                    <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/50 to-transparent z-20" />
                    <div className="absolute bottom-5 left-6 right-6 z-30">
                      <p className="font-heading text-white text-lg font-semibold drop-shadow-lg">
                        Jeova Guedes
                      </p>
                      <p className="text-gold-400 text-sm font-medium drop-shadow-md">
                        Corretor de Imoveis &bull; CRECI-BA 022-670
                      </p>
                    </div>
                  </div>

                  {/* Gold floating particles */}
                  {particles.map((p) => (
                    <div
                      key={p.id}
                      className="absolute rounded-full z-30 pointer-events-none"
                      style={{
                        top: p.top,
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        background: 'radial-gradient(circle, #2E9EA6 0%, rgba(46,158,166,0) 70%)',
                        animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Story Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="text-gold-500 font-medium text-sm uppercase tracking-wider">Sobre Jeova Guedes</span>
              <h2 className="font-heading text-3xl md:text-4xl text-charcoal-800 mt-3">
                Especialista em imoveis no litoral da Bahia
              </h2>
              <div className="gold-divider mt-4" />
              <div className="mt-6 space-y-4 text-charcoal-600 leading-relaxed">
                <p>
                  Com uma trajetoria solida no mercado imobiliario, Jeova Guedes e referencia na
                  intermediacao de imoveis em Porto de Sauipe e em toda a Costa dos Coqueiros, no
                  litoral norte da Bahia. Sua paixao pelo que faz se reflete no atendimento
                  personalizado e no profundo conhecimento da regiao.
                </p>
                <p>
                  Atuando ha mais de 10 anos no setor, Jeova construiu uma reputacao baseada em
                  honestidade, dedicacao e resultados. Seja para quem busca uma casa de praia dos
                  sonhos, um investimento rentavel ou o primeiro imovel da familia, ele oferece
                  consultoria completa do inicio ao fim da negociacao.
                </p>
                <p>
                  Seu diferencial esta na combinacao de experiencia local — conhecendo cada rua,
                  cada condominio e cada oportunidade da regiao — com um atendimento humano e
                  transparente que transforma a jornada de compra ou venda em uma experiencia
                  tranquila e segura.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-8">
                <div>
                  <span className="font-heading text-3xl font-bold text-gold-500">500+</span>
                  <p className="text-charcoal-500 text-sm mt-1">Imoveis vendidos</p>
                </div>
                <div>
                  <span className="font-heading text-3xl font-bold text-gold-500">10+</span>
                  <p className="text-charcoal-500 text-sm mt-1">Anos de experiencia</p>
                </div>
                <div>
                  <span className="font-heading text-3xl font-bold text-gold-500">98%</span>
                  <p className="text-charcoal-500 text-sm mt-1">Clientes satisfeitos</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="section-padding bg-white" ref={citiesRef}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={citiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl text-charcoal-800">
              Regioes de Atuacao
            </h2>
            <div className="gold-divider mx-auto mt-4" />
            <p className="mt-4 text-charcoal-500 max-w-lg mx-auto">
              Presenca estrategica no litoral e nas principais cidades da Bahia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cities.map((city, index) => (
              <motion.div
                key={city.name}
                className="bg-sand-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-500"
                custom={index}
                initial="hidden"
                animate={citiesInView ? 'visible' : 'hidden'}
                variants={fadeUp}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-olive-50 text-olive-600 mb-5">
                  {city.icon}
                </div>
                <h3 className="font-heading text-xl text-charcoal-800 font-semibold">{city.name}</h3>
                <span className="inline-block mt-2 text-gold-500 font-medium text-sm">{city.subtitle}</span>
                <p className="mt-2 text-charcoal-500 text-sm">{city.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-charcoal-800" ref={valuesRef}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl text-white">
              Meus Valores
            </h2>
            <div className="gold-divider mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="text-center"
                custom={index}
                initial="hidden"
                animate={valuesInView ? 'visible' : 'hidden'}
                variants={fadeUp}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-500/10 text-gold-400 mb-4">
                  {value.icon}
                </div>
                <h3 className="font-heading text-lg text-white font-semibold">{value.title}</h3>
                <p className="mt-2 text-sand-400 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-olive-700 relative overflow-hidden" ref={ctaRef}>
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 200">
            <defs>
              <pattern id="aboutCtaPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20h40M20 0v40" stroke="#2E9EA6" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#aboutCtaPattern)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.h2
            className="font-heading text-3xl md:text-4xl text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Vamos conversar sobre o seu proximo imovel?
          </motion.h2>
          <motion.p
            className="mt-4 text-olive-100 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Entre em contato pelo WhatsApp e receba atendimento personalizado
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <button
              type="button"
              onClick={() => openWhatsApp('/sobre')}
              className="btn-whatsapp text-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar no WhatsApp
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
