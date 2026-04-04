import { Box, Grid, GridItem, Text, VStack, HStack, List, ListItem } from '@chakra-ui/react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const MotionBox = motion(Box)

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const ALL_SERVICES = [
  {
    num: '01',
    title: 'Feasibility Studies',
    desc: 'Before a single brick is laid, our feasibility studies give clients clear-eyed analysis of technical viability, cost projections, and risk landscape — empowering confident investment decisions.',
    items: ['Technical & Environmental Surveys', 'Cost-Benefit Analysis', 'Risk Assessment & Mitigation', 'Investment Viability Reports', 'Site Evaluation'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200',
  },
  {
    num: '02',
    title: 'Design & Engineering',
    desc: 'Innovative architectural design meets rigorous structural engineering. We leverage BIM technology to deliver sustainable, aesthetically compelling, and structurally sound solutions.',
    items: ['BIM 3D Modeling & Visualization', 'Structural & Civil Design', 'MEP Systems Engineering', 'Architectural Design', 'Sustainability Consulting'],
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200',
  },
  {
    num: '03',
    title: 'Project Management',
    desc: 'End-to-end project delivery with military-grade discipline. We track every timeline, cost item, and quality checkpoint to ensure your project lands on spec, on time, and on budget.',
    items: ['Scope & Schedule Management', 'Budget & Cost Control', 'Quality Assurance & Control', 'Stakeholder Reporting', 'Risk Management'],
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200',
  },
  {
    num: '04',
    title: 'Construction Services',
    desc: 'From ground-breaking to ribbon-cutting: turnkey construction executed by seasoned professionals with an uncompromising safety culture and a passion for lasting quality.',
    items: ['Ground-Up Construction', 'Complex Renovations', 'Infrastructure Development', 'Fit-Out & Finishing Works', 'Facilities Management'],
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200',
  },
  {
    num: '05',
    title: 'Advisory & Consulting',
    desc: 'Strategic engineering counsel for developers, institutions, and governments. We offer expert witness services, technical due diligence, and specialized advisory for complex projects.',
    items: ['Technical Due Diligence', 'Expert Witness Services', 'Procurement Advisory', 'Regulatory Compliance', 'Portfolio Reviews'],
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200',
  },
]

function ServiceRow({ service, reverse }: { service: typeof ALL_SERVICES[0]; reverse: boolean }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <Grid
        templateColumns={{ base: '1fr', lg: reverse ? '1fr 1fr' : '1fr 1fr' }}
        gap={0}
        border="1px solid"
        borderColor="stellar.border"
        overflow="hidden"
        mb={6}
        role="group"
        transition="border-color 0.3s"
        _hover={{ borderColor: 'brand.700' }}
      >
        {/* Image */}
        <GridItem order={{ base: 0, lg: reverse ? 1 : 0 }}
          minH={{ base: '220px', md: '340px' }} position="relative" overflow="hidden">
          <Box
            position="absolute" inset={0}
            bgImage={`url('${service.image}')`}
            bgSize="cover" bgPos="center"
            transition="transform 0.6s ease"
            sx={{ '[role=group]:hover &': { transform: 'scale(1.04)' } }}
          />
          <Box position="absolute" inset={0}
            bgGradient="linear(to-br, rgba(8,12,20,0.5), rgba(8,12,20,0.1))" />
          <Box position="absolute" top={6} left={6}>
            <Text fontFamily="mono" fontSize="3xl" fontWeight="900"
              color="rgba(200,150,62,0.2)" lineHeight="1">
              {service.num}
            </Text>
          </Box>
        </GridItem>

        {/* Content */}
        <GridItem order={{ base: 1, lg: reverse ? 0 : 1 }}
          p={{ base: 8, md: 12 }} bg="stellar.card" display="flex" flexDir="column" justifyContent="center">
          <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em"
            textTransform="uppercase" mb={3}>
            Service {service.num}
          </Text>
          <Text fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700"
            color="stellar.text" lineHeight="1.2" mb={5} letterSpacing="-0.01em">
            {service.title}
          </Text>
          <Text fontSize="sm" color="stellar.muted" lineHeight="1.9" mb={7}>{service.desc}</Text>
          <List spacing={2}>
            {service.items.map(item => (
              <ListItem key={item} display="flex" alignItems="center" gap={2}>
                <Box color="brand.500" flexShrink={0}><CheckIcon /></Box>
                <Text fontSize="xs" color="stellar.light" letterSpacing="0.03em">{item}</Text>
              </ListItem>
            ))}
          </List>
        </GridItem>
      </Grid>
    </MotionBox>
  )
}

export default function ServicesPage() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true })
  return (
    <>
      <Box py={{ base: 24, md: 32 }} bg="stellar.bg" position="relative" overflow="hidden"
        borderBottom="1px solid" borderColor="stellar.border">
        <Box position="absolute" inset={0}
          bgImage="url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070')"
          bgSize="cover" bgPos="center" opacity={0.06} />
        <Box position="absolute" inset={0} bgGradient="linear(to-b, rgba(8,12,20,0.97), rgba(8,12,20,0.85))" />
        <Box position="absolute" bottom={0} left={0} right={0} h="1px"
          bgGradient="linear(to-r, transparent, brand.500, transparent)" opacity={0.5} />
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }} position="relative" zIndex={1}>
          <HStack spacing={4} mb={5}>
            <Box h="1px" w="40px" bg="brand.500" />
            <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
              What We Offer
            </Text>
          </HStack>
          <Text as="h1" fontFamily="heading" fontWeight="900"
            fontSize={{ base: '4xl', md: '6xl' }} color="stellar.text" lineHeight="1.1" maxW="700px">
            Our <Box as="span" color="brand.400">Services</Box>
          </Text>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="stellar.muted" mt={5} maxW="560px" lineHeight="1.8">
            End-to-end engineering and construction solutions, tailored to your vision and executed to exacting standards.
          </Text>
        </Box>
      </Box>

      <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.bg">
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
          <MotionBox ref={headRef} initial={{ opacity: 0, y: 30 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} mb={14}>
            <Box h="1px" w="40px" bg="brand.500" mb={5} />
            <Text as="h2" fontFamily="heading" fontWeight="800"
              fontSize={{ base: '3xl', md: '5xl' }} color="stellar.text" lineHeight="1.1">
              Comprehensive <Box as="span" color="brand.400">Capabilities</Box>
            </Text>
          </MotionBox>
          {ALL_SERVICES.map((s, i) => (
            <ServiceRow key={s.num} service={s} reverse={i % 2 !== 0} />
          ))}
        </Box>
      </Box>
    </>
  )
}
