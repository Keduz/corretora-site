export type Locale = 'pt' | 'en' | 'es' | 'fr'

export const localeNames: Record<Locale, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
  fr: 'Français',
}

export const localeFlags: Record<Locale, string> = {
  pt: '🇧🇷',
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
}

const translations = {
  pt: {
    // Navbar
    'nav.inicio': 'Início',
    'nav.imoveis': 'Imóveis',
    'nav.servicos': 'Serviços',
    'nav.financiamento': 'Financiamento',
    'nav.portais': 'Portais',
    'nav.sobre': 'Sobre',
    'nav.blog': 'Blog',
    'nav.contato': 'Contato',
    'nav.favoritos': 'Favoritos',
    'nav.whatsapp': 'WhatsApp',
    'nav.fale': 'Fale Conosco',

    // Hero
    'hero.title': 'Nossos Imóveis',
    'hero.subtitle': 'Encontre o imóvel ideal em Salvador, Feira de Santana e Alagoinhas',
    'hero.cta': 'Explorar Imóveis',
    'hero.badge.label': 'Corretor Credenciado',
    'hero.badge.verified': 'Verificado',

    // Services
    'services.title': 'Nossos Serviços',
    'services.subtitle': 'Soluções completas para todas as suas necessidades imobiliárias',
    'services.cta': 'Saiba Mais pelo WhatsApp',

    // Footer
    'footer.description': 'Seu parceiro de confiança no mercado imobiliário da Bahia. Especialista em imóveis em Salvador, Feira de Santana e Alagoinhas.',
    'footer.links': 'Links Rápidos',
    'footer.contact': 'Contato',
    'footer.hours': 'Horário de Atendimento',
    'footer.weekdays': 'Seg - Sex: 8h às 18h',
    'footer.saturday': 'Sábado: 8h às 12h',
    'footer.rights': 'Todos os direitos reservados.',

    // Common
    'common.bedrooms': 'quartos',
    'common.bathrooms': 'banheiros',
    'common.area': 'Área',
    'common.parking': 'vagas',
    'common.sale': 'Venda',
    'common.rent': 'Aluguel',
    'common.seeMore': 'Ver Mais',
    'common.loading': 'Carregando...',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.all': 'Todos',
    'common.city': 'Cidade',
    'common.type': 'Tipo',
    'common.transaction': 'Transação',
    'common.price': 'Preço',
    'common.reset': 'Limpar',

    // Property types
    'type.apartamento': 'Apartamento',
    'type.casa': 'Casa',
    'type.cobertura': 'Cobertura',
    'type.terreno': 'Terreno',
    'type.comercial': 'Comercial',

    // Contact page
    'contact.title': 'Entre em Contato',
    'contact.subtitle': 'Estamos prontos para ajudá-lo',
    'contact.name': 'Nome',
    'contact.email': 'Email',
    'contact.phone': 'Telefone',
    'contact.message': 'Mensagem',
    'contact.send': 'Enviar Mensagem',

    // About
    'about.title': 'Sobre Nós',
    'about.subtitle': 'Conheça a Jeová Guedes Imóveis',

    // Simulator
    'simulator.title': 'Simulador de Financiamento',
    'simulator.subtitle': 'Calcule as parcelas do seu financiamento imobiliário',

    // Blog
    'blog.title': 'Blog',
    'blog.subtitle': 'Dicas e novidades do mercado imobiliário',

    // Footer extra
    'footer.subtitle': 'Corretor de Imóveis - Porto de Sauípe, BA',
    'footer.tagline': 'Os melhores preços e as melhores oportunidades em imóveis no litoral da Bahia. Atendimento personalizado e exclusivo.',
    'footer.cities': 'Cidades',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Uso',
    'footer.copyright': '© 2026 Jeová Guedes Corretor de Imóveis • CRECI-BA 022-670. Todos os direitos reservados.',

    // Lead popup
    'popup.title': 'Encontre seu imóvel ideal',
    'popup.subtitle': 'Deixe seus dados e um consultor entrará em contato com as melhores opções para você.',
    'popup.name': 'Nome',
    'popup.phone': 'Telefone',
    'popup.email': 'Email',
    'popup.optional': '(opcional)',
    'popup.send': 'Quero ser contactado',
    'popup.sending': 'Enviando...',
    'popup.safe': 'Seus dados estão seguros conosco.',
    'popup.success.title': 'Recebemos seus dados!',
    'popup.success.subtitle': 'Em breve um consultor entrará em contato.',
  },

  en: {
    'nav.inicio': 'Home',
    'nav.imoveis': 'Properties',
    'nav.servicos': 'Services',
    'nav.financiamento': 'Financing',
    'nav.portais': 'Portals',
    'nav.sobre': 'About',
    'nav.blog': 'Blog',
    'nav.contato': 'Contact',
    'nav.favoritos': 'Favorites',
    'nav.whatsapp': 'WhatsApp',
    'nav.fale': 'Contact Us',

    'hero.title': 'Our Properties',
    'hero.subtitle': 'Find the perfect property in Salvador, Feira de Santana and Alagoinhas',
    'hero.cta': 'Explore Properties',
    'hero.badge.label': 'Licensed Broker',
    'hero.badge.verified': 'Verified',

    'services.title': 'Our Services',
    'services.subtitle': 'Complete solutions for all your real estate needs',
    'services.cta': 'Learn More via WhatsApp',

    'footer.description': 'Your trusted partner in the Bahia real estate market. Specialist in properties in Salvador, Feira de Santana and Alagoinhas.',
    'footer.links': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.hours': 'Business Hours',
    'footer.weekdays': 'Mon - Fri: 8am to 6pm',
    'footer.saturday': 'Saturday: 8am to 12pm',
    'footer.rights': 'All rights reserved.',

    'common.bedrooms': 'bedrooms',
    'common.bathrooms': 'bathrooms',
    'common.area': 'Area',
    'common.parking': 'parking',
    'common.sale': 'Sale',
    'common.rent': 'Rent',
    'common.seeMore': 'See More',
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.city': 'City',
    'common.type': 'Type',
    'common.transaction': 'Transaction',
    'common.price': 'Price',
    'common.reset': 'Clear',

    'type.apartamento': 'Apartment',
    'type.casa': 'House',
    'type.cobertura': 'Penthouse',
    'type.terreno': 'Land',
    'type.comercial': 'Commercial',

    'contact.title': 'Get in Touch',
    'contact.subtitle': 'We are ready to help you',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Message',
    'contact.send': 'Send Message',

    'about.title': 'About Us',
    'about.subtitle': 'Meet Jeová Guedes Real Estate',

    'simulator.title': 'Financing Simulator',
    'simulator.subtitle': 'Calculate your real estate financing installments',

    'blog.title': 'Blog',
    'blog.subtitle': 'Tips and news from the real estate market',

    'footer.subtitle': 'Real Estate Broker - Porto de Sauípe, BA',
    'footer.tagline': 'The best prices and opportunities in real estate on the coast of Bahia. Personalized and exclusive service.',
    'footer.cities': 'Cities',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',
    'footer.copyright': '© 2026 Jeová Guedes Real Estate Broker • CRECI-BA 022-670. All rights reserved.',

    'popup.title': 'Find your ideal property',
    'popup.subtitle': 'Leave your details and a consultant will contact you with the best options.',
    'popup.name': 'Name',
    'popup.phone': 'Phone',
    'popup.email': 'Email',
    'popup.optional': '(optional)',
    'popup.send': 'I want to be contacted',
    'popup.sending': 'Sending...',
    'popup.safe': 'Your data is safe with us.',
    'popup.success.title': 'We received your details!',
    'popup.success.subtitle': 'A consultant will contact you soon.',
  },

  es: {
    'nav.inicio': 'Inicio',
    'nav.imoveis': 'Inmuebles',
    'nav.servicos': 'Servicios',
    'nav.financiamento': 'Financiación',
    'nav.portais': 'Portales',
    'nav.sobre': 'Nosotros',
    'nav.blog': 'Blog',
    'nav.contato': 'Contacto',
    'nav.favoritos': 'Favoritos',
    'nav.whatsapp': 'WhatsApp',
    'nav.fale': 'Contáctenos',

    'hero.title': 'Nuestros Inmuebles',
    'hero.subtitle': 'Encuentre la propiedad ideal en Salvador, Feira de Santana y Alagoinhas',
    'hero.cta': 'Explorar Inmuebles',
    'hero.badge.label': 'Corredor Acreditado',
    'hero.badge.verified': 'Verificado',

    'services.title': 'Nuestros Servicios',
    'services.subtitle': 'Soluciones completas para todas sus necesidades inmobiliarias',
    'services.cta': 'Más Información por WhatsApp',

    'footer.description': 'Su socio de confianza en el mercado inmobiliario de Bahía. Especialista en propiedades en Salvador, Feira de Santana y Alagoinhas.',
    'footer.links': 'Enlaces Rápidos',
    'footer.contact': 'Contacto',
    'footer.hours': 'Horario de Atención',
    'footer.weekdays': 'Lun - Vie: 8h a 18h',
    'footer.saturday': 'Sábado: 8h a 12h',
    'footer.rights': 'Todos los derechos reservados.',

    'common.bedrooms': 'habitaciones',
    'common.bathrooms': 'baños',
    'common.area': 'Área',
    'common.parking': 'plazas',
    'common.sale': 'Venta',
    'common.rent': 'Alquiler',
    'common.seeMore': 'Ver Más',
    'common.loading': 'Cargando...',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.all': 'Todos',
    'common.city': 'Ciudad',
    'common.type': 'Tipo',
    'common.transaction': 'Transacción',
    'common.price': 'Precio',
    'common.reset': 'Limpiar',

    'type.apartamento': 'Apartamento',
    'type.casa': 'Casa',
    'type.cobertura': 'Ático',
    'type.terreno': 'Terreno',
    'type.comercial': 'Comercial',

    'contact.title': 'Contáctenos',
    'contact.subtitle': 'Estamos listos para ayudarle',
    'contact.name': 'Nombre',
    'contact.email': 'Correo',
    'contact.phone': 'Teléfono',
    'contact.message': 'Mensaje',
    'contact.send': 'Enviar Mensaje',

    'about.title': 'Sobre Nosotros',
    'about.subtitle': 'Conozca Jeová Guedes Inmuebles',

    'simulator.title': 'Simulador de Financiación',
    'simulator.subtitle': 'Calcule las cuotas de su financiación inmobiliaria',

    'blog.title': 'Blog',
    'blog.subtitle': 'Consejos y novedades del mercado inmobiliario',

    'footer.subtitle': 'Corredor de Inmuebles - Porto de Sauípe, BA',
    'footer.tagline': 'Los mejores precios y oportunidades en inmuebles en la costa de Bahía. Atención personalizada y exclusiva.',
    'footer.cities': 'Ciudades',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Uso',
    'footer.copyright': '© 2026 Jeová Guedes Corredor de Inmuebles • CRECI-BA 022-670. Todos los derechos reservados.',

    'popup.title': 'Encuentre su inmueble ideal',
    'popup.subtitle': 'Deje sus datos y un consultor se pondrá en contacto con las mejores opciones.',
    'popup.name': 'Nombre',
    'popup.phone': 'Teléfono',
    'popup.email': 'Correo',
    'popup.optional': '(opcional)',
    'popup.send': 'Quiero ser contactado',
    'popup.sending': 'Enviando...',
    'popup.safe': 'Sus datos están seguros con nosotros.',
    'popup.success.title': '¡Recibimos sus datos!',
    'popup.success.subtitle': 'Un consultor se pondrá en contacto pronto.',
  },

  fr: {
    'nav.inicio': 'Accueil',
    'nav.imoveis': 'Biens',
    'nav.servicos': 'Services',
    'nav.financiamento': 'Financement',
    'nav.portais': 'Portails',
    'nav.sobre': 'À propos',
    'nav.blog': 'Blog',
    'nav.contato': 'Contact',
    'nav.favoritos': 'Favoris',
    'nav.whatsapp': 'WhatsApp',
    'nav.fale': 'Contactez-nous',

    'hero.title': 'Nos Biens',
    'hero.subtitle': 'Trouvez le bien idéal à Salvador, Feira de Santana et Alagoinhas',
    'hero.cta': 'Explorer les Biens',
    'hero.badge.label': 'Courtier Agréé',
    'hero.badge.verified': 'Vérifié',

    'services.title': 'Nos Services',
    'services.subtitle': 'Des solutions complètes pour tous vos besoins immobiliers',
    'services.cta': 'En Savoir Plus via WhatsApp',

    'footer.description': 'Votre partenaire de confiance sur le marché immobilier de Bahia. Spécialiste des biens à Salvador, Feira de Santana et Alagoinhas.',
    'footer.links': 'Liens Rapides',
    'footer.contact': 'Contact',
    'footer.hours': "Heures d'Ouverture",
    'footer.weekdays': 'Lun - Ven: 8h à 18h',
    'footer.saturday': 'Samedi: 8h à 12h',
    'footer.rights': 'Tous droits réservés.',

    'common.bedrooms': 'chambres',
    'common.bathrooms': 'salles de bain',
    'common.area': 'Surface',
    'common.parking': 'places',
    'common.sale': 'Vente',
    'common.rent': 'Location',
    'common.seeMore': 'Voir Plus',
    'common.loading': 'Chargement...',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.all': 'Tous',
    'common.city': 'Ville',
    'common.type': 'Type',
    'common.transaction': 'Transaction',
    'common.price': 'Prix',
    'common.reset': 'Effacer',

    'type.apartamento': 'Appartement',
    'type.casa': 'Maison',
    'type.cobertura': 'Penthouse',
    'type.terreno': 'Terrain',
    'type.comercial': 'Commercial',

    'contact.title': 'Contactez-nous',
    'contact.subtitle': 'Nous sommes prêts à vous aider',
    'contact.name': 'Nom',
    'contact.email': 'Email',
    'contact.phone': 'Téléphone',
    'contact.message': 'Message',
    'contact.send': 'Envoyer le Message',

    'about.title': 'À Propos',
    'about.subtitle': 'Découvrez Jeová Guedes Immobilier',

    'simulator.title': 'Simulateur de Financement',
    'simulator.subtitle': 'Calculez les mensualités de votre financement immobilier',

    'blog.title': 'Blog',
    'blog.subtitle': "Conseils et actualités de l'immobilier",

    'footer.subtitle': 'Courtier Immobilier - Porto de Sauípe, BA',
    'footer.tagline': 'Les meilleurs prix et opportunités immobilières sur la côte de Bahia. Service personnalisé et exclusif.',
    'footer.cities': 'Villes',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': "Conditions d'Utilisation",
    'footer.copyright': '© 2026 Jeová Guedes Courtier Immobilier • CRECI-BA 022-670. Tous droits réservés.',

    'popup.title': 'Trouvez votre bien idéal',
    'popup.subtitle': 'Laissez vos coordonnées et un consultant vous contactera avec les meilleures options.',
    'popup.name': 'Nom',
    'popup.phone': 'Téléphone',
    'popup.email': 'Email',
    'popup.optional': '(facultatif)',
    'popup.send': 'Je veux être contacté',
    'popup.sending': 'Envoi...',
    'popup.safe': 'Vos données sont en sécurité chez nous.',
    'popup.success.title': 'Nous avons reçu vos données !',
    'popup.success.subtitle': 'Un consultant vous contactera bientôt.',
  },
} as const

export type TranslationKey = keyof typeof translations.pt

export function getTranslation(locale: Locale, key: TranslationKey): string {
  return translations[locale]?.[key] ?? translations.pt[key] ?? key
}

export default translations
