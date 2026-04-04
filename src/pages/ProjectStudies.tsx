import { useState, useRef } from 'react'
import { Box, Grid, GridItem, Text, HStack, Button } from '@chakra-ui/react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const MotionBox = motion(Box)

const CATEGORIES = ['All', 'Commercial', 'Electrical', 'Infrastructure', 'Residential', 'Industrial']

const PROJECTS = [
  {
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200',
    category: 'Commercial',
    title: 'Innovation Business Hub',
    location: 'Abuja, Nigeria',
    year: '2023',
    value: '₦2.4B',
    desc: 'A 12-storey mixed-use commercial complex featuring 120 office units, a conference center, and ground-floor retail — delivered 3 weeks ahead of schedule.',
  },
  {
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1200',
    category: 'Electrical',
    title: 'Riverside Power Plant',
    location: 'Kogi State, Nigeria',
    year: '2024',
    value: '₦1.8B',
    desc: 'A 20MW diesel-hybrid power facility built to power a 5,000-home residential estate and adjacent industrial cluster.',
  },
  {
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200',
    category: 'Infrastructure',
    title: 'Innovation Transport Hub',
    location: 'Lagos, Nigeria',
    year: '2023',
    value: '₦3.1B',
    desc: 'A multi-modal transit facility integrating bus, rail, and ride-hailing services to serve over 100,000 daily commuters.',
  },
  {
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200',
    category: 'Residential',
    title: 'Emerald Gardens Estate',
    location: 'Enugu, Nigeria',
    year: '2022',
    value: '₦1.2B',
    desc: 'A gated community of 85 premium residential units with landscaped amenities, a clubhouse, and solar-powered street lighting.',
  },
  {
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200',
    category: 'Industrial',
    title: 'AgriPro Processing Plant',
    location: 'Kaduna, Nigeria',
    year: '2022',
    value: '₦980M',
    desc: 'A state-of-the-art food processing facility designed for a 200-tonne daily throughput with full HACCP compliance.',
  },
  {
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200',
    category: 'Commercial',
    title: 'Meridian Office Tower',
    location: 'Accra, Ghana',
    year: '2021',
    value: '$3.5M',
    desc: 'A 9-storey grade-A office tower built to EDGE green building certification standards for a leading Pan-African bank.',
  },
]

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 2v4"/><path d="M16 2v4"/>
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <path d="M3 10h18"/>
  </svg>
)
const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

export default function ProjectStudies() {
  const [activeFilter, setActiveFilter] = useState('All')
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true })

  const filtered = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter)

  return (
    <>
      <Box py={{ base: 24, md: 32 }} bg="stellar.bg" position="relative" overflow="hidden"
        borderBottom="1px solid" borderColor="stellar.border">
        <Box position="absolute" inset={0}
          bgImage="url('https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070')"
          bgSize="cover" bgPos="center" opacity={0.06} />
        <Box position="absolute" inset={0} bgGradient="linear(to-b, rgba(8,12,20,0.97), rgba(8,12,20,0.85))" />
        <Box position="absolute" bottom={0} left={0} right={0} h="1px"
          bgGradient="linear(to-r, transparent, brand.500, transparent)" opacity={0.5} />
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }} position="relative" zIndex={1}>
          <HStack spacing={4} mb={5}>
            <Box h="1px" w="40px" bg="brand.500" />
            <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
              Our Portfolio
            </Text>
          </HStack>
          <Text as="h1" fontFamily="heading" fontWeight="900"
            fontSize={{ base: '4xl', md: '6xl' }} color="stellar.text" lineHeight="1.1" maxW="700px">
            Project <Box as="span" color="brand.400">Studies</Box>
          </Text>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="stellar.muted" mt={5} maxW="560px" lineHeight="1.8">
            A selection of landmark projects that showcase our breadth of capability, technical rigor, and commitment to excellence.
          </Text>
        </Box>
      </Box>

      <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.bg">
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
          {/* Filter row */}
          <MotionBox ref={headRef} initial={{ opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} mb={12}>
            <HStack spacing={2} flexWrap="wrap" gap={2}>
              {CATEGORIES.map(cat => (
                <Button
                  key={cat}
                  size="sm"
                  px={5}
                  variant={activeFilter === cat ? 'gold' : 'ghost_light'}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </Button>
              ))}
            </HStack>
          </MotionBox>

          {/* Projects grid */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2,1fr)', lg: 'repeat(3,1fr)' }} gap={6}>
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <MotionBox
                  key={p.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <Box
                    role="group"
                    overflow="hidden"
                    border="1px solid"
                    borderColor="stellar.border"
                    bg="stellar.card"
                    h="full"
                    display="flex"
                    flexDir="column"
                    transition="all 0.4s"
                    _hover={{ borderColor: 'brand.700', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', transform: 'translateY(-4px)' }}
                  >
                    {/* Image */}
                    <Box position="relative" h="220px" overflow="hidden" flexShrink={0}>
                      <Box
                        position="absolute" inset={0}
                        bgImage={`url('${p.image}')`}
                        bgSize="cover" bgPos="center"
                        transition="transform 0.6s"
                        sx={{ '[role=group]:hover &': { transform: 'scale(1.06)' } }}
                      />
                      <Box position="absolute" inset={0}
                        bgGradient="linear(to-t, rgba(8,12,20,0.9) 0%, rgba(8,12,20,0.2) 50%, transparent 100%)" />
                      <Box position="absolute" top={4} left={4}>
                        <Text
                          display="inline-block" px={3} py={1}
                          bg="rgba(8,12,20,0.85)"
                          border="1px solid" borderColor="brand.700"
                          fontFamily="mono" fontSize="xs" color="brand.400"
                          letterSpacing="0.12em" textTransform="uppercase" backdropFilter="blur(8px)"
                        >{p.category}</Text>
                      </Box>
                      <Box position="absolute" bottom={4} right={4}>
                        <Text fontFamily="mono" fontSize="sm" fontWeight="700" color="brand.400">{p.value}</Text>
                      </Box>
                    </Box>

                    {/* Content */}
                    <Box p={6} flex={1} display="flex" flexDir="column">
                      <Text fontFamily="heading" fontSize="xl" fontWeight="700"
                        color="stellar.text" mb={3} lineHeight="1.3" letterSpacing="-0.01em"
                        transition="color 0.2s"
                        sx={{ '[role=group]:hover &': { color: 'brand.400' } }}>
                        {p.title}
                      </Text>
                      <Text fontSize="xs" color="stellar.muted" lineHeight="1.8" mb={5} flex={1}>
                        {p.desc}
                      </Text>
                      <HStack justify="space-between">
                        <HStack spacing={1.5}>
                          <Box color="brand.600"><PinIcon /></Box>
                          <Text fontSize="xs" color="stellar.muted">{p.location}</Text>
                        </HStack>
                        <HStack spacing={1.5}>
                          <Box color="brand.600"><CalendarIcon /></Box>
                          <Text fontSize="xs" color="stellar.muted">{p.year}</Text>
                        </HStack>
                      </HStack>
                    </Box>
                    <Box h="2px" bgGradient="linear(to-r, brand.700, brand.400)"
                      transform="scaleX(0)" transformOrigin="left" transition="transform 0.4s"
                      sx={{ '[role=group]:hover &': { transform: 'scaleX(1)' } }} />
                  </Box>
                </MotionBox>
              ))}
            </AnimatePresence>
          </Grid>
        </Box>
      </Box>
    </>
  )
}
