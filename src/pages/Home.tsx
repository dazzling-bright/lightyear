import HeroSection from '../components/HeroSection'
import FoundationSection from '../components/FoundationSection'
import ServicesSection from '../components/ServicesSection'
import ProjectsSection from '../components/ProjectsSection'
import TestimonialsSection from '../components/TestimonialsSection'
import CtaSection from '../components/CtaSection'

interface HomeProps {
  onOpenConsultation: () => void
}

export default function Home({ onOpenConsultation }: HomeProps) {
  return (
    <>
      <HeroSection onOpenConsultation={onOpenConsultation} />
      <FoundationSection />
      <ServicesSection />
      <ProjectsSection />
      <TestimonialsSection />
      <CtaSection onOpenConsultation={onOpenConsultation} />
    </>
  )
}
