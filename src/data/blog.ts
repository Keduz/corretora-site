export type BlogPost = {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  coverImage: string
  author: string
  date: string
  readTime: string
  tags: string[]
  status: 'publicado' | 'rascunho'
  featured: boolean
}

export const BLOG_STORAGE_KEY = 'corretora-blog-posts'
export const BLOG_VERSION_KEY = 'corretora-blog-version'
export const BLOG_CURRENT_VERSION = 2 // v2 = HTML content with TipTap editor

export const blogCategories = [
  'Dicas',
  'Mercado',
  'Educacional',
  'Investimento',
  'Financiamento',
  'Decoracao',
]

export const defaultPosts: BlogPost[] = [
  {
    id: 1,
    slug: '5-dicas-comprar-primeiro-imovel',
    title: '5 Dicas Essenciais para Comprar seu Primeiro Imovel',
    excerpt:
      'Comprar o primeiro imovel e um grande passo. Confira nossas dicas essenciais para fazer a melhor escolha e evitar erros comuns.',
    content: `<h2>1. Defina seu Orcamento com Clareza</h2><p>Antes de comecar a busca, tenha uma visao clara do quanto voce pode investir. Considere nao apenas o valor do imovel, mas tambem custos como ITBI (Imposto sobre Transmissao de Bens Imoveis), escritura, registro e eventuais reformas.</p><img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6e?w=800&q=80" alt="Planejamento financeiro para compra de imovel" /><p><strong>Dica pratica:</strong> A parcela do financiamento nao deve ultrapassar 30% da sua renda bruta familiar.</p><h2>2. Pesquise a Localizacao com Cuidado</h2><p>A localizacao e o fator que mais impacta na valorizacao do imovel. Avalie:</p><ul><li>Proximidade de transporte publico, escolas e comercio</li><li>Seguranca do bairro e infraestrutura urbana</li><li>Planos de desenvolvimento da regiao</li><li>Vizinhanca e qualidade de vida</li></ul><div data-youtube-video><iframe src="https://www.youtube.com/embed/HmJbJBMkiSo" allowfullscreen></iframe></div><h2>3. Visite o Imovel em Diferentes Horarios</h2><p>Um erro comum e visitar o imovel apenas uma vez. Visite em horarios diferentes para avaliar:</p><ul><li>Incidencia de luz solar ao longo do dia</li><li>Nivel de ruido em horarios de pico</li><li>Movimentacao na rua e seguranca noturna</li><li>Fluxo de transito nos arredores</li></ul><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" alt="Visitacao de imovel - observe todos os detalhes" /><h2>4. Analise a Documentacao Completa</h2><p>Nunca feche negocio sem verificar toda a documentacao:</p><ul><li>Matricula atualizada do imovel</li><li>Certidoes negativas de debitos</li><li>IPTU e condominio em dia</li><li>Habite-se e planta aprovada</li><li>Situacao do vendedor (certidoes pessoais)</li></ul><h2>5. Conte com um Profissional de Confianca</h2><p>Um corretor experiente pode economizar tempo, dinheiro e dores de cabeca. Ele conhece o mercado, negocia melhores condicoes e garante seguranca juridica em todas as etapas.</p><hr /><p><strong>Quer ajuda para encontrar seu primeiro imovel?</strong> Entre em contato com Jeová Guedes e receba assessoria completa e personalizada.</p>`,
    category: 'Dicas',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    author: 'Jeová Guedes',
    date: '2026-03-10',
    readTime: '5 min',
    tags: ['primeiro imovel', 'dicas', 'compra'],
    status: 'publicado',
    featured: true,
  },
  {
    id: 2,
    slug: 'mercado-imobiliario-bahia-2026',
    title: 'Mercado Imobiliario na Bahia: Tendencias e Oportunidades em 2026',
    excerpt:
      'Analise completa do mercado imobiliario baiano. Tendencias, areas em valorizacao e oportunidades para compradores e investidores.',
    content: `<h2>Panorama Geral</h2><p>O mercado imobiliario da Bahia segue em trajetoria de crescimento em 2026, impulsionado por investimentos em infraestrutura, turismo e o aumento da demanda por imoveis no litoral norte.</p><img src="https://images.unsplash.com/photo-1585535738243-a4ba0cccb6cc?w=800&q=80" alt="Vista aerea de Salvador - mercado em crescimento" /><h2>Regioes em Destaque</h2><h3>Porto de Sauipe e Costa dos Coqueiros</h3><p>A regiao do litoral norte continua sendo o grande destaque do estado. Com investimentos em infraestrutura viaria e novos empreendimentos de alto padrao, a valorizacao media dos imoveis na regiao foi de <strong>18% nos ultimos 12 meses</strong>.</p><h3>Salvador - Pituba e Barra</h3><p>Os bairros tradicionais de Salvador mantem demanda aquecida, especialmente para apartamentos de 2 e 3 quartos. A revitalizacao urbana tem atraido novos investidores.</p><div data-youtube-video><iframe src="https://www.youtube.com/embed/gXJnMi-vRKg" allowfullscreen></iframe></div><h3>Feira de Santana</h3><p>A segunda maior cidade da Bahia apresenta excelente custo-beneficio e crescimento constante, com condominios fechados ganhando cada vez mais espaco.</p><img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80" alt="Condominios modernos em expansao na Bahia" /><h2>Tendencias para 2026</h2><ol><li><strong>Imoveis sustentaveis</strong> - Empreendimentos com energia solar e reuso de agua ganham preferencia</li><li><strong>Home office integrado</strong> - Plantas com escritorio dedicado sao prioridade</li><li><strong>Condominios com lazer completo</strong> - Areas de coworking, pet place e horta comunitaria</li><li><strong>Digitalizacao</strong> - Tours virtuais e processos 100% digitais</li><li><strong>Financiamento acessivel</strong> - Taxas de juros competitivas nos programas habitacionais</li></ol><h2>Oportunidades de Investimento</h2><p>Para investidores, o litoral norte da Bahia oferece retornos consistentes tanto na valorizacao do patrimonio quanto no aluguel por temporada, com rentabilidade media de <strong>0,6% a 0,8% ao mes</strong> em alta temporada.</p><hr /><p><strong>Quer investir no mercado imobiliario baiano?</strong> Fale com Jeová Guedes e descubra as melhores oportunidades.</p>`,
    category: 'Mercado',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    author: 'Jeová Guedes',
    date: '2026-03-05',
    readTime: '8 min',
    tags: ['mercado', 'bahia', 'investimento', 'tendencias'],
    status: 'publicado',
    featured: false,
  },
  {
    id: 3,
    slug: 'como-avaliar-valor-imovel',
    title: 'Como Avaliar o Valor Real de um Imovel: Guia Completo',
    excerpt:
      'Entenda os principais fatores que influenciam o valor de um imovel e aprenda a fazer uma avaliacao mais precisa.',
    content: `<h2>Por que a Avaliacao e Importante?</h2><p>Saber o valor real de um imovel e fundamental tanto para quem quer comprar quanto para quem deseja vender. Uma avaliacao correta evita pagar mais do que deveria ou vender abaixo do preco justo.</p><img src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?w=800&q=80" alt="Avaliacao profissional de imovel" /><h2>Fatores que Determinam o Valor</h2><h3>1. Localizacao</h3><p>O fator mais importante. Considere:</p><ul><li>Bairro e regiao da cidade</li><li>Proximidade de servicos essenciais</li><li>Acesso a transporte publico</li><li>Seguranca e qualidade de vida</li></ul><h3>2. Metragem e Planta</h3><ul><li>Area total construida vs area util</li><li>Distribuicao dos comodos</li><li>Numero de quartos, suites e vagas</li><li>Aproveitamento inteligente do espaco</li></ul><div data-youtube-video><iframe src="https://www.youtube.com/embed/kFez02jMbSY" allowfullscreen></iframe></div><h3>3. Estado de Conservacao</h3><ul><li>Idade do imovel e do condominio</li><li>Reformas recentes realizadas</li><li>Qualidade dos acabamentos</li><li>Instalacoes eletricas e hidraulicas</li></ul><h3>4. Infraestrutura do Condominio</h3><ul><li>Areas de lazer e facilidades</li><li>Portaria e seguranca</li><li>Manutencao das areas comuns</li><li>Valor do condominio</li></ul><img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80" alt="Infraestrutura de condominio valoriza o imovel" /><h3>5. Documentacao</h3><ul><li>Imovel regularizado e sem pendencias</li><li>Matricula atualizada</li><li>IPTU em dia</li><li>Ausencia de acoes judiciais</li></ul><h2>Metodos de Avaliacao</h2><p><strong>Comparativo de mercado:</strong> Analise de imoveis similares vendidos recentemente na mesma regiao.</p><p><strong>Custo de reposicao:</strong> Valor do terreno + custo de construcao similar.</p><p><strong>Renda:</strong> Para imoveis comerciais, baseado no retorno do aluguel.</p><h2>Dica Final</h2><p>Sempre consulte um profissional qualificado para uma avaliacao precisa. Um corretor experiente conhece as nuances do mercado local e pode identificar fatores que passam despercebidos.</p><hr /><p><strong>Precisa avaliar um imovel?</strong> Jeová Guedes oferece avaliacao personalizada e gratuita.</p>`,
    category: 'Educacional',
    coverImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
    author: 'Jeová Guedes',
    date: '2026-02-28',
    readTime: '6 min',
    tags: ['avaliacao', 'valor', 'imovel'],
    status: 'publicado',
    featured: false,
  },
  {
    id: 4,
    slug: 'financiamento-imobiliario-guia-completo',
    title: 'Financiamento Imobiliario: Tudo que Voce Precisa Saber',
    excerpt:
      'Guia completo sobre financiamento imobiliario no Brasil. Entenda SAC vs PRICE, documentos necessarios e como conseguir a melhor taxa.',
    content: `<h2>O que e Financiamento Imobiliario?</h2><p>O financiamento imobiliario e um emprestimo bancario destinado a compra de imoveis, onde o proprio imovel serve como garantia (alienacao fiduciaria). No Brasil, os prazos podem chegar a 35 anos.</p><img src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80" alt="Financiamento imobiliario - realize seu sonho" /><h2>SAC vs PRICE: Qual Escolher?</h2><h3>Tabela SAC (Sistema de Amortizacao Constante)</h3><ul><li>Parcelas iniciais maiores que diminuem ao longo do tempo</li><li>A amortizacao (valor que abate da divida) e sempre igual</li><li><strong>Vantagem:</strong> Voce paga menos juros no total</li><li><strong>Ideal para:</strong> Quem tem renda mais folgada no inicio</li></ul><h3>Tabela PRICE (Parcelas Fixas)</h3><ul><li>Parcelas iguais do inicio ao fim</li><li>No comeco, maior parte da parcela e juros</li><li><strong>Vantagem:</strong> Previsibilidade no orcamento</li><li><strong>Ideal para:</strong> Quem precisa de parcelas estaveis</li></ul><div data-youtube-video><iframe src="https://www.youtube.com/embed/aJJMazqGqoM" allowfullscreen></iframe></div><h2>Documentos Necessarios</h2><h3>Comprador</h3><ul><li>RG e CPF</li><li>Comprovante de renda (3 ultimos meses)</li><li>Comprovante de residencia</li><li>Declaracao de Imposto de Renda</li><li>Extrato do FGTS (se for utilizar)</li><li>Certidao de estado civil</li></ul><h3>Imovel</h3><ul><li>Matricula atualizada</li><li>Certidao de onus reais</li><li>IPTU quitado</li><li>Habite-se</li></ul><img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80" alt="Documentacao organizada agiliza a aprovacao" /><h2>Como Conseguir a Melhor Taxa</h2><ol><li><strong>Compare pelo menos 3 bancos</strong> - Cada um tem condicoes diferentes</li><li><strong>Mantenha o nome limpo</strong> - Score alto = taxas menores</li><li><strong>Relacionamento bancario</strong> - Ter conta e investimentos ajuda</li><li><strong>Use o FGTS</strong> - Reduz o valor financiado</li><li><strong>Negocie</strong> - Bancos tem margem para negociacao</li></ol><h2>Use o FGTS a seu Favor</h2><p>O FGTS pode ser usado para:</p><ul><li>Dar entrada no imovel</li><li>Amortizar o saldo devedor</li><li>Pagar parte das parcelas</li></ul><p><strong>Requisito:</strong> Ter pelo menos 3 anos de carteira assinada (nao precisa ser consecutivo).</p><hr /><p><strong>Quer simular seu financiamento?</strong> Use nosso simulador online ou fale diretamente com Jeová Guedes.</p>`,
    category: 'Financiamento',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    author: 'Jeová Guedes',
    date: '2026-02-20',
    readTime: '7 min',
    tags: ['financiamento', 'sac', 'price', 'fgts'],
    status: 'publicado',
    featured: false,
  },
  {
    id: 5,
    slug: 'investir-imoveis-litoral-bahia',
    title: 'Por que Investir em Imoveis no Litoral da Bahia?',
    excerpt:
      'Descubra por que o litoral baiano e um dos melhores destinos para investimento imobiliario no Brasil.',
    content: `<h2>O Litoral da Bahia como Destino de Investimento</h2><p>O litoral norte da Bahia, especialmente a regiao entre Salvador e a Costa dos Coqueiros, se consolidou como um dos mercados imobiliarios mais promissores do Nordeste brasileiro.</p><img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" alt="Litoral norte da Bahia - paraiso para investidores" /><h2>Numeros que Impressionam</h2><ul><li><strong>Valorizacao media de 15-20% ao ano</strong> em areas premium</li><li><strong>Rentabilidade de aluguel por temporada</strong> entre 0,6% e 1,2% ao mes</li><li><strong>Taxa de ocupacao</strong> acima de 75% em alta temporada</li><li><strong>Crescimento do turismo</strong> de 12% ao ano na regiao</li></ul><h2>Vantagens do Investimento</h2><h3>1. Valorizacao Constante</h3><p>Diferente de investimentos financeiros volateis, imoveis no litoral da Bahia apresentam valorizacao consistente e previsivel, impulsionada pelo turismo crescente.</p><h3>2. Renda Passiva</h3><p>Alugar o imovel por temporada atraves de plataformas como Airbnb gera renda passiva significativa, especialmente nos meses de verao e feriados prolongados.</p><div data-youtube-video><iframe src="https://www.youtube.com/embed/bvPJpnXsn3U" allowfullscreen></iframe></div><h3>3. Patrimonio Tangivel</h3><p>O imovel e um ativo real que voce pode usar, alugar ou vender. Diferente de acoes, voce tem controle total sobre seu investimento.</p><h3>4. Qualidade de Vida</h3><p>Alem do retorno financeiro, voce tem um refugio no paraiso para ferias em familia.</p><img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80" alt="Casa de praia - investimento e qualidade de vida" /><h2>Melhores Regioes para Investir</h2><h3>Porto de Sauipe</h3><p>Resort consolidado com infraestrutura completa. Ideal para casas e apartamentos de alto padrao.</p><h3>Praia do Forte</h3><p>Charme e natureza. Excelente para pousadas e casas de temporada.</p><h3>Guarajuba e Itacimirim</h3><p>Em plena expansao, com condominios novos e excelente custo-beneficio.</p><h3>Costa de Sauipe</h3><p>Novos empreendimentos com conceito de resort residencial.</p><h2>Como Comecar</h2><ol><li>Defina seu orcamento e objetivo (renda ou valorizacao)</li><li>Escolha a regiao que melhor se encaixa</li><li>Visite os empreendimentos pessoalmente</li><li>Analise o historico de valorizacao da area</li><li>Conte com assessoria especializada</li></ol><hr /><p><strong>Pronto para investir no litoral da Bahia?</strong> Jeová Guedes conhece cada oportunidade da regiao. Entre em contato!</p>`,
    category: 'Investimento',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    author: 'Jeová Guedes',
    date: '2026-02-15',
    readTime: '6 min',
    tags: ['investimento', 'litoral', 'bahia', 'aluguel temporada'],
    status: 'publicado',
    featured: false,
  },
  {
    id: 6,
    slug: 'decoracao-apartamento-praia',
    title: 'Decoracao para Apartamento de Praia: Tendencias 2026',
    excerpt:
      'Inspire-se com as tendencias de decoracao para imoveis litoraneos. Ambientes frescos, funcionais e com a cara do paraiso baiano.',
    content: `<h2>A Essencia da Decoracao Litoranea</h2><p>Decorar um apartamento de praia vai alem da estetica — e criar um ambiente que respire leveza, frescor e conexao com a natureza ao redor.</p><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80" alt="Decoracao litoranea - tons naturais e leveza" /><h2>Tendencias em Alta</h2><h3>1. Tons Naturais e Terrosos</h3><p>A paleta de cores de 2026 privilegia tons que remetem a natureza:</p><ul><li>Beige, areia e off-white como base</li><li>Toques de azul oceano e verde agua</li><li>Madeira natural como protagonista</li><li>Detalhes em fibras naturais (ratan, juta, sisal)</li></ul><h3>2. Materiais Sustentaveis</h3><p>A sustentabilidade nao e mais tendencia, e requisito:</p><ul><li>Moveis de madeira certificada</li><li>Tecidos organicos e reciclados</li><li>Iluminacao em LED</li><li>Tintas ecologicas</li></ul><div data-youtube-video><iframe src="https://www.youtube.com/embed/EoFsR1baIiw" allowfullscreen></iframe></div><h3>3. Integracao Indoor-Outdoor</h3><p>Ambientes que se conectam com o exterior:</p><ul><li>Varandas como extensao da sala</li><li>Portas de correr amplas</li><li>Jardins verticais</li><li>Plantas tropicais nos ambientes</li></ul><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80" alt="Integracao indoor-outdoor - varanda como extensao da sala" /><h3>4. Minimalismo Tropical</h3><p>Menos e mais, mas com personalidade:</p><ul><li>Poucos moveis, porem com presenca</li><li>Artesanato local como destaque</li><li>Obras de artistas regionais</li><li>Objetos com historia e significado</li></ul><h2>Dicas Praticas</h2><p><strong>Cozinha:</strong> Opte por bancadas claras e armarios em tons de madeira. Utilitarios a mostra em prateleiras abertas dao charme praiano.</p><p><strong>Quarto:</strong> Roupa de cama em linho branco, cortinas leves e ventilacao cruzada. Cabeceira em palhinha e um classico atemporal.</p><img src="https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&q=80" alt="Quarto praiano - minimalismo e conforto" /><p><strong>Banheiro:</strong> Revestimentos que remetem a natureza. Pedras naturais, madeira teca e plantas que gostam de umidade.</p><p><strong>Sala:</strong> Sofa em tecido claro, tapete de fibra natural e mesa de centro em madeira rustica. Almofadas em tons de azul completam.</p><h2>Investimento vs Retorno</h2><p>Uma decoracao bem planejada pode valorizar o imovel em ate <strong>15%</strong> e aumentar a taxa de ocupacao no aluguel por temporada em ate <strong>30%</strong>.</p><hr /><p><strong>Comprando um imovel no litoral?</strong> Jeová Guedes pode indicar os melhores profissionais de decoracao da regiao.</p>`,
    category: 'Decoracao',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    author: 'Jeová Guedes',
    date: '2026-02-10',
    readTime: '5 min',
    tags: ['decoracao', 'praia', 'tendencias', 'design'],
    status: 'publicado',
    featured: false,
  },
]

export function getBlogPosts(): BlogPost[] {
  if (typeof window === 'undefined') return defaultPosts
  try {
    const ver = localStorage.getItem(BLOG_VERSION_KEY)
    if (!ver || Number(ver) < BLOG_CURRENT_VERSION) {
      // Old version - reset to new HTML defaults
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(defaultPosts))
      localStorage.setItem(BLOG_VERSION_KEY, String(BLOG_CURRENT_VERSION))
      return defaultPosts
    }
    const stored = localStorage.getItem(BLOG_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  return defaultPosts
}

export function getPublishedPosts(): BlogPost[] {
  return getBlogPosts().filter(p => p.status === 'publicado')
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getBlogPosts().find(p => p.slug === slug)
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}
