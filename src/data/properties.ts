export type Property = {
  id: number
  slug: string
  title: string
  type: 'apartamento' | 'casa' | 'cobertura' | 'terreno' | 'comercial'
  transaction: 'venda' | 'aluguel'
  price: number
  condoFee?: number
  city: 'Salvador' | 'Feira de Santana' | 'Alagoinhas'
  neighborhood: string
  bedrooms: number
  bathrooms: number
  area: number
  parking: number
  description: string
  features: string[]
  images: string[]
  youtubeVideoId?: string
  lat: number
  lng: number
  featured: boolean
  status: 'ativo' | 'vendido' | 'alugado' | 'inativo'
}

export const properties: Property[] = [
  {
    id: 1,
    slug: 'apartamento-pituba-3-quartos',
    title: 'Apartamento de Luxo na Pituba',
    type: 'apartamento',
    transaction: 'venda',
    price: 850000,
    condoFee: 1200,
    city: 'Salvador',
    neighborhood: 'Pituba',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    parking: 2,
    description: 'Apartamento sofisticado com acabamento premium, vista panoramica para o mar e localizacao privilegiada no coracao da Pituba. Totalmente reformado com materiais de primeira linha.',
    features: ['Vista Mar', 'Varanda Gourmet', 'Piscina', 'Academia', 'Portaria 24h', 'Churrasqueira'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    ],
    youtubeVideoId: '9AFoz9RQx3Y',
    lat: -12.9830,
    lng: -38.4530,
    featured: true,
    status: 'ativo',
  },
  {
    id: 2,
    slug: 'casa-alphaville-4-suites',
    title: 'Casa em Condominio Alphaville',
    type: 'casa',
    transaction: 'venda',
    price: 1200000,
    condoFee: 800,
    city: 'Salvador',
    neighborhood: 'Alphaville',
    bedrooms: 4,
    bathrooms: 4,
    area: 280,
    parking: 3,
    description: 'Casa ampla em condominio fechado com total seguranca e infraestrutura completa. Projeto arquitetonico moderno com ambientes integrados e area de lazer privativa.',
    features: ['Condominio Fechado', 'Piscina Privativa', 'Suite Master', 'Closet', 'Jardim', 'Seguranca 24h'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
    ],
    youtubeVideoId: '2NekzGIlX6E',
    lat: -12.9270,
    lng: -38.3720,
    featured: true,
    status: 'ativo',
  },
  {
    id: 3,
    slug: 'apartamento-centro-feira',
    title: 'Apartamento Moderno no Centro',
    type: 'apartamento',
    transaction: 'venda',
    price: 380000,
    condoFee: 450,
    city: 'Feira de Santana',
    neighborhood: 'Centro',
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    parking: 1,
    description: 'Apartamento novo e moderno no centro de Feira de Santana. Ideal para quem busca praticidade e qualidade de vida. Proximo a comercios, escolas e hospitais.',
    features: ['Novo', 'Elevador', 'Portaria', 'Salao de Festas', 'Playground'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    ],
    youtubeVideoId: 'GVEq9dNofLQ',
    lat: -12.2669,
    lng: -38.9666,
    featured: true,
    status: 'ativo',
  },
  {
    id: 4,
    slug: 'cobertura-barra-duplex',
    title: 'Cobertura Duplex na Barra',
    type: 'cobertura',
    transaction: 'venda',
    price: 1800000,
    condoFee: 2500,
    city: 'Salvador',
    neighborhood: 'Barra',
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
    parking: 3,
    description: 'Cobertura duplex espetacular com vista 360 graus para o mar. Terraco amplo com piscina privativa, churrasqueira e area gourmet. O maximo em sofisticacao.',
    features: ['Duplex', 'Piscina no Terraco', 'Vista 360', 'Jacuzzi', 'Home Office', 'Automacao'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop',
    ],
    youtubeVideoId: '1DLzEPsq6Rg',
    lat: -13.0090,
    lng: -38.5320,
    featured: true,
    status: 'ativo',
  },
  {
    id: 5,
    slug: 'casa-alagoinhas-3-quartos',
    title: 'Casa Espacosa em Alagoinhas',
    type: 'casa',
    transaction: 'venda',
    price: 290000,
    city: 'Alagoinhas',
    neighborhood: 'Centro',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    parking: 2,
    description: 'Casa ampla e arejada em excelente localizacao em Alagoinhas. Quintal grande, garagem para dois carros e bairro tranquilo e valorizado.',
    features: ['Quintal Grande', 'Garagem Coberta', 'Area de Servico', 'Piso Porcelanato'],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
    ],
    youtubeVideoId: '3ea4vyuDuBo',
    lat: -12.1356,
    lng: -38.4189,
    featured: false,
    status: 'ativo',
  },
  {
    id: 6,
    slug: 'apartamento-caminho-arvores',
    title: 'Apt. Caminho das Arvores',
    type: 'apartamento',
    transaction: 'aluguel',
    price: 4500,
    condoFee: 900,
    city: 'Salvador',
    neighborhood: 'Caminho das Arvores',
    bedrooms: 2,
    bathrooms: 2,
    area: 90,
    parking: 1,
    description: 'Apartamento mobiliado em regiao nobre de Salvador. Proximo ao Shopping da Bahia e com facil acesso a toda cidade. Ideal para executivos e profissionais.',
    features: ['Mobiliado', 'Ar Condicionado', 'Portaria 24h', 'Academia', 'Sauna'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    ],
    youtubeVideoId: 'MevR6C958Y8',
    lat: -12.9820,
    lng: -38.4610,
    featured: true,
    status: 'ativo',
  },
  {
    id: 7,
    slug: 'terreno-condominio-feira',
    title: 'Terreno em Condominio Fechado',
    type: 'terreno',
    transaction: 'venda',
    price: 180000,
    city: 'Feira de Santana',
    neighborhood: 'SIM',
    bedrooms: 0,
    bathrooms: 0,
    area: 450,
    parking: 0,
    description: 'Terreno plano em condominio fechado com toda infraestrutura. Ideal para construir a casa dos seus sonhos com seguranca e tranquilidade.',
    features: ['Condominio Fechado', 'Terreno Plano', 'Infraestrutura Completa', 'Seguranca 24h'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800&h=600&fit=crop',
    ],
    youtubeVideoId: '564c-gyQtqg',
    lat: -12.2580,
    lng: -38.9530,
    featured: false,
    status: 'ativo',
  },
  {
    id: 8,
    slug: 'sala-comercial-iguatemi',
    title: 'Sala Comercial Iguatemi',
    type: 'comercial',
    transaction: 'aluguel',
    price: 3200,
    condoFee: 600,
    city: 'Salvador',
    neighborhood: 'Iguatemi',
    bedrooms: 0,
    bathrooms: 1,
    area: 55,
    parking: 1,
    description: 'Sala comercial em empresarial moderno proximo ao Shopping Iguatemi. Ar condicionado central, recepcao e estacionamento rotativo.',
    features: ['Empresarial', 'Ar Central', 'Recepcao', 'Elevadores', 'Estacionamento'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop',
    ],
    youtubeVideoId: '3ecyAHQDsIU',
    lat: -12.9810,
    lng: -38.4560,
    featured: false,
    status: 'ativo',
  },
  {
    id: 9,
    slug: 'apartamento-paralela-2-quartos',
    title: 'Apartamento na Paralela',
    type: 'apartamento',
    transaction: 'aluguel',
    price: 2800,
    condoFee: 500,
    city: 'Salvador',
    neighborhood: 'Paralela',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    parking: 1,
    description: 'Apartamento bem localizado na Avenida Paralela, proximo a shoppings, faculdades e transporte publico. Otima opcao para quem busca praticidade.',
    features: ['Portaria 24h', 'Elevador', 'Salao de Festas', 'Area de Lazer'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    ],
    youtubeVideoId: 'RkHJEo7q3VQ',
    lat: -12.9370,
    lng: -38.4010,
    featured: false,
    status: 'ativo',
  },
  {
    id: 10,
    slug: 'casa-condominio-alagoinhas',
    title: 'Casa em Condominio Alagoinhas',
    type: 'casa',
    transaction: 'venda',
    price: 420000,
    condoFee: 350,
    city: 'Alagoinhas',
    neighborhood: 'Jardim Petropolis',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    parking: 2,
    description: 'Casa moderna em condominio fechado em Alagoinhas. Acabamento de alto padrao, area de lazer completa e seguranca 24h.',
    features: ['Condominio Fechado', 'Acabamento Premium', 'Cozinha Planejada', 'Varanda', 'Seguranca 24h'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop',
    ],
    youtubeVideoId: '3wW1XTEU2Dc',
    lat: -12.1400,
    lng: -38.4250,
    featured: true,
    status: 'ativo',
  },
  {
    id: 11,
    slug: 'apartamento-tomba-feira',
    title: 'Apartamento no Tomba',
    type: 'apartamento',
    transaction: 'venda',
    price: 220000,
    condoFee: 300,
    city: 'Feira de Santana',
    neighborhood: 'Tomba',
    bedrooms: 2,
    bathrooms: 1,
    area: 58,
    parking: 1,
    description: 'Apartamento acessivel e bem localizado no bairro Tomba. Pronto para morar com infraestrutura completa de lazer.',
    features: ['Pronto para Morar', 'Elevador', 'Playground', 'Churrasqueira'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    ],
    youtubeVideoId: 'XA_UD_BH5Qk',
    lat: -12.2540,
    lng: -38.9710,
    featured: false,
    status: 'ativo',
  },
  {
    id: 12,
    slug: 'cobertura-horto-florestal',
    title: 'Cobertura no Horto Florestal',
    type: 'cobertura',
    transaction: 'venda',
    price: 2200000,
    condoFee: 3000,
    city: 'Salvador',
    neighborhood: 'Horto Florestal',
    bedrooms: 5,
    bathrooms: 4,
    area: 320,
    parking: 4,
    description: 'Cobertura de altissimo padrao no Horto Florestal. Amplo terraco com piscina aquecida, churrasqueira gourmet e vista privilegiada da cidade.',
    features: ['Alto Padrao', 'Piscina Aquecida', 'Churrasqueira Gourmet', 'Vista Cidade', 'Automacao Residencial', 'Adega'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    ],
    youtubeVideoId: '4aPdw6jybO4',
    lat: -12.9660,
    lng: -38.4960,
    featured: false,
    status: 'ativo',
  },
]

export function getPropertyBySlug(slug: string) {
  return properties.find((p) => p.slug === slug)
}

export function getFeaturedProperties() {
  return properties.filter((p) => p.featured && p.status === 'ativo')
}

export function getActiveProperties() {
  return properties.filter((p) => p.status === 'ativo')
}

export function getSimilarProperties(property: Property, limit = 3) {
  return properties
    .filter(
      (p) =>
        p.id !== property.id &&
        p.status === 'ativo' &&
        (p.city === property.city || p.type === property.type)
    )
    .slice(0, limit)
}

export function formatPrice(price: number, transaction: string) {
  const formatted = price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
  return transaction === 'aluguel' ? `${formatted}/mes` : formatted
}

export function getAllNeighborhoods() {
  const neighborhoods: string[] = []
  properties.forEach((p) => {
    if (!neighborhoods.includes(p.neighborhood)) {
      neighborhoods.push(p.neighborhood)
    }
  })
  return neighborhoods.sort()
}
