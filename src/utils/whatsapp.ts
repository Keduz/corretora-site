const WHATSAPP_NUMBER = '5571997106376'

const E = {
  house: String.fromCodePoint(0x1F3E0),
  pin: String.fromCodePoint(0x1F4CC),
  clipboard: String.fromCodePoint(0x1F4CB),
  pray: String.fromCodePoint(0x1F64F),
  wave: String.fromCodePoint(0x1F44B),
  homeGarden: String.fromCodePoint(0x1F3E1),
  smile: String.fromCodePoint(0x1F60A),
  search: String.fromCodePoint(0x1F50D),
  briefcase: String.fromCodePoint(0x1F4BC),
  bank: String.fromCodePoint(0x1F3E6),
  globe: String.fromCodePoint(0x1F310),
  page: String.fromCodePoint(0x1F4C4),
  newspaper: String.fromCodePoint(0x1F4F0),
  phone: String.fromCodePoint(0x1F4DE),
  heart: String.fromCodePoint(0x2764, 0xFE0F),
  chart: String.fromCodePoint(0x1F4CA),
  book: String.fromCodePoint(0x1F4D6),
  tag: String.fromCodePoint(0x1F3F7, 0xFE0F),
}

export function getWhatsAppUrl(path: string, extra?: string) {
  const msg = getMessageForPath(path, extra)
  return 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + encodeURIComponent(msg)
}

export function getWhatsAppUrlWithMsg(msg: string) {
  return 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + encodeURIComponent(msg)
}

export function openWhatsApp(path: string, extra?: string) {
  const msg = getMessageForPath(path, extra)
  const url = 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + encodeURIComponent(msg)
  window.open(url, '_blank')
}

export function openWhatsAppWithMsg(msg: string) {
  const url = 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + encodeURIComponent(msg)
  window.open(url, '_blank')
}

function getMessageForPath(path: string, extra?: string): string {
  if (path.startsWith('/imoveis/') && extra) {
    return [
      E.house + ' *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      E.pin + ' *Imovel de interesse:*',
      extra,
      '',
      E.clipboard + ' Gostaria de agendar uma visita e saber mais detalhes.',
      '',
      'Aguardo retorno! ' + E.pray
    ].join('\n')
  }

  if (path.startsWith('/blog/') && extra) {
    return [
      E.newspaper + ' *Ola! Vim pelo blog da Jeova Guedes Imoveis*',
      '',
      E.book + ' *Artigo:* ' + extra,
      '',
      'Gostei do conteudo e gostaria de mais informacoes.',
      '',
      'Aguardo retorno! ' + E.pray
    ].join('\n')
  }

  const messages: Record<string, string> = {
    '/': [
      E.wave + ' *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      E.homeGarden + ' Estou interessado(a) em conhecer os imoveis disponiveis.',
      '',
      'Pode me ajudar? ' + E.smile
    ].join('\n'),

    '/imoveis': [
      E.wave + ' *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      E.search + ' *Pagina:* Imoveis',
      '',
      'Estou buscando um imovel e gostaria de ajuda para encontrar o ideal.',
      '',
      'Aguardo retorno! ' + E.pray
    ].join('\n'),

    '/servicos': [
      E.wave + ' *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      E.briefcase + ' *Pagina:* Servicos',
      '',
      'Gostaria de saber mais sobre os servicos oferecidos.',
      '',
      'Aguardo retorno! ' + E.pray
    ].join('\n'),

    '/simulador': [
      E.wave + ' *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      E.bank + ' *Pagina:* Simulador de Financiamento',
      '',
      'Gostaria de tirar duvidas sobre financiamento imobiliario.',
      '',
      'Aguardo retorno! ' + E.pray
    ].join('\n'),

    '/portais': [
      E.wave + ' *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      E.globe + ' *Pagina:* Portais Imobiliarios',
      '',
      'Gostaria de saber mais sobre a integracao com os portais.',
      '',
      'Aguardo retorno! ' + E.pray
    ].join('\n'),

    '/sobre': [
      E.wave + ' *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      E.page + ' *Pagina:* Sobre',
      '',
      'Gostei do que vi e gostaria de entrar em contato.',
      '',
      'Aguardo retorno! ' + E.pray
    ].join('\n'),

    '/blog': [
      E.wave + ' *Ola! Vim pelo blog da Jeova Guedes Imoveis*',
      '',
      E.newspaper + ' Gostei dos conteudos e gostaria de mais informacoes.',
      '',
      'Aguardo retorno! ' + E.pray
    ].join('\n'),

    '/contato': [
      E.wave + ' *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      E.phone + ' *Pagina:* Contato',
      '',
      'Gostaria de falar diretamente com voce.',
      '',
      'Aguardo retorno! ' + E.pray
    ].join('\n'),

    '/favoritos': [
      E.wave + ' *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      E.heart + ' Tenho alguns imoveis favoritados e gostaria de mais informacoes.',
      '',
      'Aguardo retorno! ' + E.pray
    ].join('\n'),

    '/comparar': [
      E.wave + ' *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      E.chart + ' Estou comparando imoveis e gostaria de ajuda na escolha.',
      '',
      'Aguardo retorno! ' + E.pray
    ].join('\n'),
  }

  return messages[path] || [
    E.wave + ' *Ola! Vim pelo site da Jeova Guedes Imoveis*',
    '',
    'Gostaria de mais informacoes.',
    '',
    'Aguardo retorno! ' + E.pray
  ].join('\n')
}
