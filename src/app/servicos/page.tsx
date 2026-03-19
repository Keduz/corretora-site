'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const WHATSAPP_URL = 'https://wa.me/5571997106376'

const services = [
  {
    title: 'Assessoria de Compra',
    subtitle: 'Ajudamos voce a encontrar o imovel perfeito',
    description:
      'Nossa equipe especializada acompanha voce em toda a jornada de compra, desde a busca inicial ate a entrega das chaves. Analisamos suas necessidades, orcamento e preferencias para apresentar opcoes que realmente fazem sentido para seu estilo de vida.',
    benefits: [
      'Analise personalizada do seu perfil e necessidades',
      'Selecao curada de imoveis compativeis',
      'Acompanhamento em visitas e avaliacoes',
      'Negociacao do melhor preco e condicoes',
      'Suporte na documentacao e financiamento',
    ],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&q=80',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
      </svg>
    ),
  },
  {
    title: 'Venda de Imoveis',
    subtitle: 'Vendemos seu imovel pelo melhor valor',
    description:
      'Utilizamos estrategias de marketing imobiliario modernas e nossa ampla rede de contatos para vender seu imovel de forma rapida e pelo melhor valor de mercado. Cuidamos de tudo para que voce tenha uma experiencia tranquila.',
    benefits: [
      'Avaliacao precisa do valor de mercado',
      'Fotos profissionais e tour virtual',
      'Divulgacao nos principais portais e redes sociais',
      'Triagem e qualificacao de compradores',
      'Assessoria juridica completa na negociacao',
    ],
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop&q=80',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    title: 'Gestao de Aluguel',
    subtitle: 'Administracao completa do seu imovel',
    description:
      'Oferecemos servico completo de gestao de aluguel, garantindo que seu imovel esteja sempre bem cuidado e gerando renda. Da selecao de inquilinos a manutencao preventiva, cuidamos de tudo.',
    benefits: [
      'Selecao criteriosa de inquilinos',
      'Elaboracao e gestao de contratos',
      'Cobranca e repasse de alugueis',
      'Vistorias periodicas do imovel',
      'Gestao de manutencoes e reparos',
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&q=80',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
      </svg>
    ),
  },
  {
    title: 'Consultoria de Investimento',
    subtitle: 'Orientacao estrategica para investidores',
    description:
      'Para investidores que buscam oportunidades no mercado imobiliario baiano, oferecemos consultoria especializada com analise de mercado, projecoes de valorizacao e identificacao das melhores oportunidades.',
    benefits: [
      'Analise detalhada do mercado regional',
      'Identificacao de areas em valorizacao',
      'Projecao de retorno sobre investimento',
      'Diversificacao de portfolio imobiliario',
      'Acompanhamento pos-compra',
    ],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
]

export default function ServicosPage() {
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
            Nossos Servicos
          </motion.h1>
          <motion.p
            className="mt-4 text-sand-300 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Solucoes completas para todas as suas necessidades imobiliarias
          </motion.p>
        </div>
      </section>

      {/* Services Sections */}
      {services.map((service, index) => (
        <ServiceSection key={service.title} service={service} index={index} reversed={index % 2 !== 0} />
      ))}
    </main>
  )
}

function ServiceSection({
  service,
  index,
  reversed,
}: {
  service: (typeof services)[number]
  index: number
  reversed: boolean
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      className={`section-padding ${index % 2 === 0 ? 'bg-sand-50' : 'bg-white'}`}
      ref={ref}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${reversed ? 'lg:[direction:rtl]' : ''}`}>
          {/* Service Image */}
          <motion.div
            className={`relative h-[350px] lg:h-[450px] rounded-2xl overflow-hidden group ${reversed ? 'lg:[direction:ltr]' : ''}`}
            initial={{ opacity: 0, x: reversed ? 40 : -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-charcoal-900/10 to-transparent" />
            {/* Number badge */}
            <div className="absolute top-4 left-4 bg-olive-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
              0{index + 1}
            </div>
            {/* Icon + title overlay at bottom */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                {service.icon}
              </div>
              <span className="font-heading text-lg font-bold text-white drop-shadow-lg">
                {service.title}
              </span>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className={reversed ? 'lg:[direction:ltr]' : ''}
            initial={{ opacity: 0, x: reversed ? -40 : 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-gold-500 font-medium text-sm uppercase tracking-wider">
              Servico 0{index + 1}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl text-charcoal-800 mt-2">
              {service.title}
            </h2>
            <p className="text-olive-600 font-medium mt-1">{service.subtitle}</p>
            <div className="gold-divider mt-4" />

            <p className="mt-6 text-charcoal-600 leading-relaxed">
              {service.description}
            </p>

            <ul className="mt-6 space-y-3">
              {service.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-charcoal-600">
                  <svg className="w-5 h-5 text-olive-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Saiba Mais pelo WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
