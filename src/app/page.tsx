import Hero from '@/components/home/Hero'
import SearchBar from '@/components/home/SearchBar'
import FeaturedProperties from '@/components/home/FeaturedProperties'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import Testimonials from '@/components/home/Testimonials'
import CtaBanner from '@/components/home/CtaBanner'

export default function Home() {
  return (
    <main>
      <Hero />
      <SearchBar />
      <FeaturedProperties />
      <WhyChooseUs />
      <Testimonials />
      <CtaBanner />
    </main>
  )
}
