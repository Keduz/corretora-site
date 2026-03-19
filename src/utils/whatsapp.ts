const WHATSAPP_NUMBER = '5571997106376'

export function getWhatsAppUrl(path: string, extra?: string) {
  const msg = getMessageForPath(path, extra)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export function getWhatsAppUrlWithMsg(msg: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

function getMessageForPath(path: string, extra?: string): string {
  if (path.startsWith('/imoveis/') && extra) {
    const mensagem = [
      '🏠 *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      '📌 *Imovel de interesse:*',
      extra,
      '',
      '📋 Gostaria de agendar uma visita e saber mais detalhes.',
      '',
      'Aguardo retorno! 🙏'
    ].join('\n')
    return mensagem
  }

  if (path.startsWith('/blog/') && extra) {
    const mensagem = [
      '📰 *Ola! Vim pelo blog da Jeova Guedes Imoveis*',
      '',
      '📖 *Artigo:* ' + extra,
      '',
      'Gostei do conteudo e gostaria de mais informacoes.',
      '',
      'Aguardo retorno! 🙏'
    ].join('\n')
    return mensagem
  }

  const messages: Record<string, string> = {
    '/': [
      '👋 *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      '🏡 Estou interessado(a) em conhecer os imoveis disponiveis.',
      '',
      'Pode me ajudar? 😊'
    ].join('\n'),

    '/imoveis': [
      '👋 *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      '🔍 *Pagina:* Imoveis',
      '',
      'Estou buscando um imovel e gostaria de ajuda para encontrar o ideal.',
      '',
      'Aguardo retorno! 🙏'
    ].join('\n'),

    '/servicos': [
      '👋 *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      '💼 *Pagina:* Servicos',
      '',
      'Gostaria de saber mais sobre os servicos oferecidos.',
      '',
      'Aguardo retorno! 🙏'
    ].join('\n'),

    '/simulador': [
      '👋 *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      '🏦 *Pagina:* Simulador de Financiamento',
      '',
      'Gostaria de tirar duvidas sobre financiamento imobiliario.',
      '',
      'Aguardo retorno! 🙏'
    ].join('\n'),

    '/portais': [
      '👋 *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      '🌐 *Pagina:* Portais Imobiliarios',
      '',
      'Gostaria de saber mais sobre a integracao com os portais.',
      '',
      'Aguardo retorno! 🙏'
    ].join('\n'),

    '/sobre': [
      '👋 *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      '📄 *Pagina:* Sobre',
      '',
      'Gostei do que vi e gostaria de entrar em contato.',
      '',
      'Aguardo retorno! 🙏'
    ].join('\n'),

    '/blog': [
      '👋 *Ola! Vim pelo blog da Jeova Guedes Imoveis*',
      '',
      '📰 Gostei dos conteudos e gostaria de mais informacoes.',
      '',
      'Aguardo retorno! 🙏'
    ].join('\n'),

    '/contato': [
      '👋 *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      '📞 *Pagina:* Contato',
      '',
      'Gostaria de falar diretamente com voce.',
      '',
      'Aguardo retorno! 🙏'
    ].join('\n'),

    '/favoritos': [
      '👋 *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      '❤️ Tenho alguns imoveis favoritados e gostaria de mais informacoes.',
      '',
      'Aguardo retorno! 🙏'
    ].join('\n'),

    '/comparar': [
      '👋 *Ola! Vim pelo site da Jeova Guedes Imoveis*',
      '',
      '📊 Estou comparando imoveis e gostaria de ajuda na escolha.',
      '',
      'Aguardo retorno! 🙏'
    ].join('\n'),
  }

  return messages[path] || [
    '👋 *Ola! Vim pelo site da Jeova Guedes Imoveis*',
    '',
    'Gostaria de mais informacoes.',
    '',
    'Aguardo retorno! 🙏'
  ].join('\n')
}
