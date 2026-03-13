export type Property = {
  id: number
  slug: string
  title: string
  type: 'apartamento' | 'casa' | 'cobertura' | 'terreno' | 'comercial'
  transaction: 'venda' | 'aluguel'
  price: number
  city: 'Salvador' | 'Feira de Santana' | 'Alagoinhas'
  neighborhood: string
  bedrooms: number
  bathrooms: number
  area: number
  parking: number
  description: string
  features: string[]
  images: string[]
  featured: boolean
}

export const properties: Property[] = [
  {
    id: 1,
    slug: 'apartamento-pituba-3-quartos',
    title: 'Apartamento de Luxo na Pituba',
    type: 'apartamento',
    transaction: 'venda',
    price: 850000,
    city: 'Salvador',
    neighborhood: 'Pituba',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    parking: 2,
    description: 'Apartamento sofisticado com acabamento premium, vista panoramica para o mar e localizacao privilegiada no coracao da Pituba. Totalmente reformado com materiais de primeira linha.',
    features: ['Vista Mar', 'Varanda Gourmet', 'Piscina', 'Academia', 'Portaria 24h', 'Churrasqueira'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'],
    featured: true,
  },
  {
    id: 2,
    slug: 'casa-alphaville-4-suites',
    title: 'Casa em Condominio Alphaville',
    type: 'casa',
    transaction: 'venda',
    price: 1200000,
    city: 'Salvador',
    neighborhood: 'Alphaville',
    bedrooms: 4,
    bathrooms: 4,
    area: 280,
    parking: 3,
    description: 'Casa ampla em condominio fechado com total seguranca e infraestrutura completa. Projeto arquitetonico moderno com ambientes integrados e area de lazer privativa.',
    features: ['Condominio Fechado', 'Piscina Privativa', 'Suite Master', 'Closet', 'Jardim', 'Seguranca 24h'],
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'],
    featured: true,
  },
  {
    id: 3,
    slug: 'apartamento-centro-feira',
    title: 'Apartamento Moderno no Centro',
    type: 'apartamento',
    transaction: 'venda',
    price: 380000,
    city: 'Feira de Santana',
    neighborhood: 'Centro',
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    parking: 1,
    description: 'Apartamento novo e moderno no centro de Feira de Santana. Ideal para quem busca praticidade e qualidade de vida. Proximo a comercios, escolas e hospitais.',
    features: ['Novo', 'Elevador', 'Portaria', 'Salao de Festas', 'Playground'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
    featured: true,
  },
  {
    id: 4,
    slug: 'cobertura-barra-duplex',
    title: 'Cobertura Duplex na Barra',
    type: 'cobertura',
    transaction: 'venda',
    price: 1800000,
    city: 'Salvador',
    neighborhood: 'Barra',
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
    parking: 3,
    description: 'Cobertura duplex espetacular com vista 360 graus para o mar. Terraço amplo com piscina privativa, churrasqueira e area gourmet. O maximo em sofisticacao.',
    features: ['Duplex', 'Piscina no Terraço', 'Vista 360°', 'Jacuzzi', 'Home Office', 'Automacao'],
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'],
    featured: true,
  },
  {
    id: 5,
    slug: 'casa-alagoinhas-3-quartos',
    title: 'Casa Espaçosa em Alagoinhas',
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
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'],
    featured: false,
  },
  {
    id: 6,
    slug: 'apartamento-caminho-arvores',
    title: 'Apt. Caminho das Arvores',
    type: 'apartamento',
    transaction: 'aluguel',
    price: 4500,
    city: 'Salvador',
    neighborhood: 'Caminho das Arvores',
    bedrooms: 2,
    bathrooms: 2,
    area: 90,
    parking: 1,
    description: 'Apartamento mobiliado em regiao nobre de Salvador. Proximo ao Shopping da Bahia e com facil acesso a toda cidade. Ideal para executivos e profissionais.',
    features: ['Mobiliado', 'Ar Condicionado', 'Portaria 24h', 'Academia', 'Sauna'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'],
    featured: true,
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
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop'],
    featured: false,
  },
  {
    id: 8,
    slug: 'sala-comercial-iguatemi',
    title: 'Sala Comercial Iguatemi',
    type: 'comercial',
    transaction: 'aluguel',
    price: 3200,
    city: 'Salvador',
    neighborhood: 'Iguatemi',
    bedrooms: 0,
    bathrooms: 1,
    area: 55,
    parking: 1,
    description: 'Sala comercial em empresarial moderno proximo ao Shopping Iguatemi. Ar condicionado central, recepcao e estacionamento rotativo.',
    features: ['Empresarial', 'Ar Central', 'Recepcao', 'Elevadores', 'Estacionamento'],
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'],
    featured: false,
  },
]

export function getPropertyBySlug(slug: string) {
  return properties.find((p) => p.slug === slug)
}

export function getFeaturedProperties() {
  return properties.filter((p) => p.featured)
}

export function formatPrice(price: number, transaction: string) {
  const formatted = price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
  return transaction === 'aluguel' ? `${formatted}/mes` : formatted
}
