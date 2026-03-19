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
    content: `## 1. Defina seu Orcamento com Clareza

Antes de comecar a busca, tenha uma visao clara do quanto voce pode investir. Considere nao apenas o valor do imovel, mas tambem custos como ITBI (Imposto sobre Transmissao de Bens Imoveis), escritura, registro e eventuais reformas.

![Planejamento financeiro para compra de imovel](https://images.unsplash.com/photo-1554224155-8d04cb21cd6e?w=800&q=80)

**Dica pratica:** A parcela do financiamento nao deve ultrapassar 30% da sua renda bruta familiar.

## 2. Pesquise a Localizacao com Cuidado

A localizacao e o fator que mais impacta na valorizacao do imovel. Avalie:

- Proximidade de transporte publico, escolas e comercio
- Seguranca do bairro e infraestrutura urbana
- Planos de desenvolvimento da regiao
- Vizinhanca e qualidade de vida

@youtube(HmJbJBMkiSo)

## 3. Visite o Imovel em Diferentes Horarios

Um erro comum e visitar o imovel apenas uma vez. Visite em horarios diferentes para avaliar:

- Incidencia de luz solar ao longo do dia
- Nivel de ruido em horarios de pico
- Movimentacao na rua e seguranca noturna
- Fluxo de transito nos arredores

![Visitacao de imovel - observe todos os detalhes](https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80)

## 4. Analise a Documentacao Completa

Nunca feche negocio sem verificar toda a documentacao:

- Matricula atualizada do imovel
- Certidoes negativas de debitos
- IPTU e condominio em dia
- Habite-se e planta aprovada
- Situacao do vendedor (certidoes pessoais)

## 5. Conte com um Profissional de Confianca

Um corretor experiente pode economizar tempo, dinheiro e dores de cabeca. Ele conhece o mercado, negocia melhores condicoes e garante seguranca juridica em todas as etapas.

---

**Quer ajuda para encontrar seu primeiro imovel?** Entre em contato com Jeova Guedes e receba assessoria completa e personalizada.`,
    category: 'Dicas',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    author: 'Jeova Guedes',
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
    content: `## Panorama Geral

O mercado imobiliario da Bahia segue em trajetoria de crescimento em 2026, impulsionado por investimentos em infraestrutura, turismo e o aumento da demanda por imoveis no litoral norte.

![Vista aerea de Salvador - mercado em crescimento](https://images.unsplash.com/photo-1585535738243-a4ba0cccb6cc?w=800&q=80)

## Regioes em Destaque

### Porto de Sauipe e Costa dos Coqueiros
A regiao do litoral norte continua sendo o grande destaque do estado. Com investimentos em infraestrutura viaria e novos empreendimentos de alto padrao, a valorizacao media dos imoveis na regiao foi de **18% nos ultimos 12 meses**.

### Salvador - Pituba e Barra
Os bairros tradicionais de Salvador mantem demanda aquecida, especialmente para apartamentos de 2 e 3 quartos. A revitalizacao urbana tem atraido novos investidores.

@youtube(gXJnMi-vRKg)

### Feira de Santana
A segunda maior cidade da Bahia apresenta excelente custo-beneficio e crescimento constante, com condominios fechados ganhando cada vez mais espaco.

![Condominios modernos em expansao na Bahia](https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80)

## Tendencias para 2026

1. **Imoveis sustentaveis** - Empreendimentos com energia solar e reuso de agua ganham preferencia
2. **Home office integrado** - Plantas com escritorio dedicado sao prioridade
3. **Condominios com lazer completo** - Areas de coworking, pet place e horta comunitaria
4. **Digitalizacao** - Tours virtuais e processos 100% digitais
5. **Financiamento acessivel** - Taxas de juros competitivas nos programas habitacionais

## Oportunidades de Investimento

Para investidores, o litoral norte da Bahia oferece retornos consistentes tanto na valorizacao do patrimonio quanto no aluguel por temporada, com rentabilidade media de **0,6% a 0,8% ao mes** em alta temporada.

---

**Quer investir no mercado imobiliario baiano?** Fale com Jeova Guedes e descubra as melhores oportunidades.`,
    category: 'Mercado',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    author: 'Jeova Guedes',
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
    content: `## Por que a Avaliacao e Importante?

Saber o valor real de um imovel e fundamental tanto para quem quer comprar quanto para quem deseja vender. Uma avaliacao correta evita pagar mais do que deveria ou vender abaixo do preco justo.

![Avaliacao profissional de imovel](https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?w=800&q=80)

## Fatores que Determinam o Valor

### 1. Localizacao
O fator mais importante. Considere:
- Bairro e regiao da cidade
- Proximidade de servicos essenciais
- Acesso a transporte publico
- Seguranca e qualidade de vida

### 2. Metragem e Planta
- Area total construida vs area util
- Distribuicao dos comodos
- Numero de quartos, suites e vagas
- Aproveitamento inteligente do espaco

@youtube(kFez02jMbSY)

### 3. Estado de Conservacao
- Idade do imovel e do condominio
- Reformas recentes realizadas
- Qualidade dos acabamentos
- Instalacoes eletricas e hidraulicas

### 4. Infraestrutura do Condominio
- Areas de lazer e facilidades
- Portaria e seguranca
- Manutencao das areas comuns
- Valor do condominio

![Infraestrutura de condominio valoriza o imovel](https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80)

### 5. Documentacao
- Imovel regularizado e sem pendencias
- Matricula atualizada
- IPTU em dia
- Ausencia de acoes judiciais

## Metodos de Avaliacao

**Comparativo de mercado:** Analise de imoveis similares vendidos recentemente na mesma regiao.

**Custo de reposicao:** Valor do terreno + custo de construcao similar.

**Renda:** Para imoveis comerciais, baseado no retorno do aluguel.

## Dica Final

Sempre consulte um profissional qualificado para uma avaliacao precisa. Um corretor experiente conhece as nuances do mercado local e pode identificar fatores que passam despercebidos.

---

**Precisa avaliar um imovel?** Jeova Guedes oferece avaliacao personalizada e gratuita.`,
    category: 'Educacional',
    coverImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
    author: 'Jeova Guedes',
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
    content: `## O que e Financiamento Imobiliario?

O financiamento imobiliario e um emprestimo bancario destinado a compra de imoveis, onde o proprio imovel serve como garantia (alienacao fiduciaria). No Brasil, os prazos podem chegar a 35 anos.

![Financiamento imobiliario - realize seu sonho](https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80)

## SAC vs PRICE: Qual Escolher?

### Tabela SAC (Sistema de Amortizacao Constante)
- Parcelas iniciais maiores que diminuem ao longo do tempo
- A amortizacao (valor que abate da divida) e sempre igual
- **Vantagem:** Voce paga menos juros no total
- **Ideal para:** Quem tem renda mais folgada no inicio

### Tabela PRICE (Parcelas Fixas)
- Parcelas iguais do inicio ao fim
- No comeco, maior parte da parcela e juros
- **Vantagem:** Previsibilidade no orcamento
- **Ideal para:** Quem precisa de parcelas estaveis

@youtube(aJJMazqGqoM)

## Documentos Necessarios

### Comprador
- RG e CPF
- Comprovante de renda (3 ultimos meses)
- Comprovante de residencia
- Declaracao de Imposto de Renda
- Extrato do FGTS (se for utilizar)
- Certidao de estado civil

### Imovel
- Matricula atualizada
- Certidao de onus reais
- IPTU quitado
- Habite-se

![Documentacao organizada agiliza a aprovacao](https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80)

## Como Conseguir a Melhor Taxa

1. **Compare pelo menos 3 bancos** - Cada um tem condicoes diferentes
2. **Mantenha o nome limpo** - Score alto = taxas menores
3. **Relacionamento bancario** - Ter conta e investimentos ajuda
4. **Use o FGTS** - Reduz o valor financiado
5. **Negocie** - Bancos tem margem para negociacao

## Use o FGTS a seu Favor

O FGTS pode ser usado para:
- Dar entrada no imovel
- Amortizar o saldo devedor
- Pagar parte das parcelas

**Requisito:** Ter pelo menos 3 anos de carteira assinada (nao precisa ser consecutivo).

---

**Quer simular seu financiamento?** Use nosso simulador online ou fale diretamente com Jeova Guedes.`,
    category: 'Financiamento',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    author: 'Jeova Guedes',
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
    content: `## O Litoral da Bahia como Destino de Investimento

O litoral norte da Bahia, especialmente a regiao entre Salvador e a Costa dos Coqueiros, se consolidou como um dos mercados imobiliarios mais promissores do Nordeste brasileiro.

![Litoral norte da Bahia - paraiso para investidores](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80)

## Numeros que Impressionam

- **Valorizacao media de 15-20% ao ano** em areas premium
- **Rentabilidade de aluguel por temporada** entre 0,6% e 1,2% ao mes
- **Taxa de ocupacao** acima de 75% em alta temporada
- **Crescimento do turismo** de 12% ao ano na regiao

## Vantagens do Investimento

### 1. Valorizacao Constante
Diferente de investimentos financeiros volateis, imoveis no litoral da Bahia apresentam valorizacao consistente e previsivel, impulsionada pelo turismo crescente.

### 2. Renda Passiva
Alugar o imovel por temporada atraves de plataformas como Airbnb gera renda passiva significativa, especialmente nos meses de verao e feriados prolongados.

@youtube(bvPJpnXsn3U)

### 3. Patrimonio Tangivel
O imovel e um ativo real que voce pode usar, alugar ou vender. Diferente de acoes, voce tem controle total sobre seu investimento.

### 4. Qualidade de Vida
Alem do retorno financeiro, voce tem um refugio no paraiso para ferias em familia.

![Casa de praia - investimento e qualidade de vida](https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80)

## Melhores Regioes para Investir

### Porto de Sauipe
Resort consolidado com infraestrutura completa. Ideal para casas e apartamentos de alto padrao.

### Praia do Forte
Charme e natureza. Excelente para pousadas e casas de temporada.

### Guarajuba e Itacimirim
Em plena expansao, com condominios novos e excelente custo-beneficio.

### Costa de Sauipe
Novos empreendimentos com conceito de resort residencial.

## Como Comecar

1. Defina seu orcamento e objetivo (renda ou valorizacao)
2. Escolha a regiao que melhor se encaixa
3. Visite os empreendimentos pessoalmente
4. Analise o historico de valorizacao da area
5. Conte com assessoria especializada

---

**Pronto para investir no litoral da Bahia?** Jeova Guedes conhece cada oportunidade da regiao. Entre em contato!`,
    category: 'Investimento',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    author: 'Jeova Guedes',
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
    content: `## A Essencia da Decoracao Litoranea

Decorar um apartamento de praia vai alem da estetica — e criar um ambiente que respire leveza, frescor e conexao com a natureza ao redor.

![Decoracao litoranea - tons naturais e leveza](https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80)

## Tendencias em Alta

### 1. Tons Naturais e Terrosos
A paleta de cores de 2026 privilegia tons que remetem a natureza:
- Beige, areia e off-white como base
- Toques de azul oceano e verde agua
- Madeira natural como protagonista
- Detalhes em fibras naturais (ratan, juta, sisal)

### 2. Materiais Sustentaveis
A sustentabilidade nao e mais tendencia, e requisito:
- Moveis de madeira certificada
- Tecidos organicos e reciclados
- Iluminacao em LED
- Tintas ecologicas

@youtube(EoFsR1baIiw)

### 3. Integracao Indoor-Outdoor
Ambientes que se conectam com o exterior:
- Varandas como extensao da sala
- Portas de correr amplas
- Jardins verticais
- Plantas tropicais nos ambientes

![Integracao indoor-outdoor - varanda como extensao da sala](https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80)

### 4. Minimalismo Tropical
Menos e mais, mas com personalidade:
- Poucos moveis, porem com presenca
- Artesanato local como destaque
- Obras de artistas regionais
- Objetos com historia e significado

## Dicas Praticas

**Cozinha:** Opte por bancadas claras e armarios em tons de madeira. Utilitarios a mostra em prateleiras abertas dao charme praiano.

**Quarto:** Roupa de cama em linho branco, cortinas leves e ventilacao cruzada. Cabeceira em palhinha e um classico atemporal.

![Quarto praiano - minimalismo e conforto](https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&q=80)

**Banheiro:** Revestimentos que remetem a natureza. Pedras naturais, madeira teca e plantas que gostam de umidade.

**Sala:** Sofa em tecido claro, tapete de fibra natural e mesa de centro em madeira rustica. Almofadas em tons de azul completam.

## Investimento vs Retorno

Uma decoracao bem planejada pode valorizar o imovel em ate **15%** e aumentar a taxa de ocupacao no aluguel por temporada em ate **30%**.

---

**Comprando um imovel no litoral?** Jeova Guedes pode indicar os melhores profissionais de decoracao da regiao.`,
    category: 'Decoracao',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    author: 'Jeova Guedes',
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
