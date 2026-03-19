const WHATSAPP_NUMBER = '5571997106376'

// Pre-encoded UTF-8 emoji bytes - bypasses JS string processing entirely
const E = {
  house: '%F0%9F%8F%A0',       // 🏠
  pin: '%F0%9F%93%8C',         // 📌
  clipboard: '%F0%9F%93%8B',   // 📋
  pray: '%F0%9F%99%8F',        // 🙏
  wave: '%F0%9F%91%8B',        // 👋
  homeGarden: '%F0%9F%8F%A1',  // 🏡
  smile: '%F0%9F%98%8A',       // 😊
  search: '%F0%9F%94%8D',      // 🔍
  briefcase: '%F0%9F%92%BC',   // 💼
  bank: '%F0%9F%8F%A6',        // 🏦
  globe: '%F0%9F%8C%90',       // 🌐
  page: '%F0%9F%93%84',        // 📄
  newspaper: '%F0%9F%93%B0',   // 📰
  phone: '%F0%9F%93%9E',       // 📞
  heart: '%E2%9D%A4%EF%B8%8F', // ❤️
  chart: '%F0%9F%93%8A',       // 📊
  book: '%F0%9F%93%96',        // 📖
  tag: '%F0%9F%8F%B7%EF%B8%8F', // 🏷️
}

const NL = '%0A'
const SP = '%20'

function t(s: string): string {
  return encodeURIComponent(s)
}

function buildUrl(text: string): string {
  return 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + text
}

export function openWhatsApp(path: string, extra?: string) {
  const text = getEncodedMessage(path, extra)
  window.open(buildUrl(text), '_blank')
}

export function openWhatsAppWithMsg(msg: string) {
  window.open(buildUrl(encodeURIComponent(msg)), '_blank')
}

export function openWhatsAppWithService(title: string) {
  const text =
    E.briefcase + SP + t('*Ola! Vim pelo site da Jeová Guedes Imoveis*') +
    NL + NL +
    E.tag + SP + t('*Servico de interesse:*') +
    NL + t(title) +
    NL + NL +
    E.clipboard + SP + t('Gostaria de saber mais detalhes sobre este servico.') +
    NL + NL +
    t('Aguardo retorno!')
  window.open(buildUrl(text), '_blank')
}

export function getWhatsAppUrl(path: string, extra?: string) {
  const text = getEncodedMessage(path, extra)
  return buildUrl(text)
}

export function getWhatsAppUrlWithMsg(msg: string) {
  return buildUrl(encodeURIComponent(msg))
}

function getEncodedMessage(path: string, extra?: string): string {
  if (path.startsWith('/imoveis/') && extra) {
    return E.house + SP + t('*Ola! Vim pelo site da Jeová Guedes Imoveis*') +
      NL + NL +
      E.pin + SP + t('*Imovel de interesse:*') +
      NL + t(extra) +
      NL + NL +
      E.clipboard + SP + t('Gostaria de agendar uma visita e saber mais detalhes.') +
      NL + NL +
      t('Aguardo retorno!')
  }

  if (path.startsWith('/blog/') && extra) {
    return E.newspaper + SP + t('*Ola! Vim pelo blog da Jeová Guedes Imoveis*') +
      NL + NL +
      E.book + SP + t('*Artigo:* ' + extra) +
      NL + NL +
      t('Gostei do conteudo e gostaria de mais informacoes.') +
      NL + NL +
      t('Aguardo retorno!')
  }

  const messages: Record<string, string> = {
    '/':
      E.wave + SP + t('*Ola! Vim pelo site da Jeová Guedes Imoveis*') +
      NL + NL +
      E.homeGarden + SP + t('Estou interessado(a) em conhecer os imoveis disponiveis.') +
      NL + NL +
      t('Pode me ajudar? ') + E.smile,

    '/imoveis':
      E.wave + SP + t('*Ola! Vim pelo site da Jeová Guedes Imoveis*') +
      NL + NL +
      E.search + SP + t('*Pagina:* Imoveis') +
      NL + NL +
      t('Estou buscando um imovel e gostaria de ajuda para encontrar o ideal.') +
      NL + NL +
      t('Aguardo retorno!'),

    '/servicos':
      E.wave + SP + t('*Ola! Vim pelo site da Jeová Guedes Imoveis*') +
      NL + NL +
      E.briefcase + SP + t('*Pagina:* Servicos') +
      NL + NL +
      t('Gostaria de saber mais sobre os servicos oferecidos.') +
      NL + NL +
      t('Aguardo retorno!'),

    '/simulador':
      E.wave + SP + t('*Ola! Vim pelo site da Jeová Guedes Imoveis*') +
      NL + NL +
      E.bank + SP + t('*Pagina:* Simulador de Financiamento') +
      NL + NL +
      t('Gostaria de tirar duvidas sobre financiamento imobiliario.') +
      NL + NL +
      t('Aguardo retorno!'),

    '/portais':
      E.wave + SP + t('*Ola! Vim pelo site da Jeová Guedes Imoveis*') +
      NL + NL +
      E.globe + SP + t('*Pagina:* Portais Imobiliarios') +
      NL + NL +
      t('Gostaria de saber mais sobre a integracao com os portais.') +
      NL + NL +
      t('Aguardo retorno!'),

    '/sobre':
      E.wave + SP + t('*Ola! Vim pelo site da Jeová Guedes Imoveis*') +
      NL + NL +
      E.page + SP + t('*Pagina:* Sobre') +
      NL + NL +
      t('Gostei do que vi e gostaria de entrar em contato.') +
      NL + NL +
      t('Aguardo retorno!'),

    '/blog':
      E.wave + SP + t('*Ola! Vim pelo blog da Jeová Guedes Imoveis*') +
      NL + NL +
      E.newspaper + SP + t('Gostei dos conteudos e gostaria de mais informacoes.') +
      NL + NL +
      t('Aguardo retorno!'),

    '/contato':
      E.wave + SP + t('*Ola! Vim pelo site da Jeová Guedes Imoveis*') +
      NL + NL +
      E.phone + SP + t('*Pagina:* Contato') +
      NL + NL +
      t('Gostaria de falar diretamente com voce.') +
      NL + NL +
      t('Aguardo retorno!'),

    '/favoritos':
      E.wave + SP + t('*Ola! Vim pelo site da Jeová Guedes Imoveis*') +
      NL + NL +
      E.heart + SP + t('Tenho alguns imoveis favoritados e gostaria de mais informacoes.') +
      NL + NL +
      t('Aguardo retorno!'),

    '/comparar':
      E.wave + SP + t('*Ola! Vim pelo site da Jeová Guedes Imoveis*') +
      NL + NL +
      E.chart + SP + t('Estou comparando imoveis e gostaria de ajuda na escolha.') +
      NL + NL +
      t('Aguardo retorno!'),
  }

  return messages[path] || (
    E.wave + SP + t('*Ola! Vim pelo site da Jeová Guedes Imoveis*') +
    NL + NL +
    t('Gostaria de mais informacoes.') +
    NL + NL +
    t('Aguardo retorno!')
  )
}
