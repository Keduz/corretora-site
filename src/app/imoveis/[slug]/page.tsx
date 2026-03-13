import { properties, getPropertyBySlug, formatPrice } from '@/data/properties'
import { notFound } from 'next/navigation'
import PropertyDetailClient from './PropertyDetailClient'

export function generateStaticParams() {
  return properties.map((property) => ({
    slug: property.slug,
  }))
}

export default function PropertyPage({ params }: { params: { slug: string } }) {
  const property = getPropertyBySlug(params.slug)

  if (!property) {
    notFound()
  }

  return <PropertyDetailClient property={property} formattedPrice={formatPrice(property.price, property.transaction)} />
}
