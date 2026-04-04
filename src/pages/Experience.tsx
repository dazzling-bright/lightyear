import { Box, Grid, GridItem, Text, VStack, HStack } from '@chakra-ui/react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const MotionBox = motion(Box)

const MILESTONES = [
  { year: '2006', title: 'Company Founded', desc: 'Established in Abuja as a civil and structural engineering consultancy.' },
  { year: '2009', title: 'First Major Contract', desc: 'Secured a ₦500M federal infrastructure project — a watershed moment for the firm.' },
  { year: '2012', title: 'Regional Expansion', desc: 'Opened satellite offices in Lagos and Port Harcourt, growing the team to 30+ professionals.' },
  { year: '2015', title: 'International Projects', desc: 'Commenced first cross-border projects in Ghana and Kenya, marking our continental reach.' },
  { year: '2018', title: 'Excellence Award', desc: 'Recognized by the Nigerian Society of Engineers for Outstanding Project Delivery.' },
  { year: '2021', title: 'Sustainability Pledge', desc: 'Launched our Green Build Initiative, committing to net-zero practices on all new projects.' },
  { year: '2024', title: 'Global Portfolio', desc: 'Operating across 12 countries with 40+ completed landmark projects and 10+ expert engineers.' },
]

const SECTORS = [
  { name: 'Commercial', count: '14', color: 'brand.400' },
  { name: 'Residential', count: '11', color: 'blue.400' },
  { name: 'Industrial', count: '8', color: 'teal.400' },
  { name: 'Infrastructure', count: '7', color: 'purple.400' },
]

export default function Experience() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true })
  const timelineRef = useRef(null)
  const timelineInView = useInView(timelineRef, { once: true, margin: '-80px' })
  const sectorsRef = useRef(null)
  const sectorsInView = useInView(sectorsRef, { once: true })

  return (
    <>
      {/* Hero */}
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
              Our Track Record
            </Text>
          </HStack>
          <Text as="h1" fontFamily="heading" fontWeight="900"
            fontSize={{ base: '4xl', md: '6xl' }} color="stellar.text" lineHeight="1.1" maxW="700px">
            18+ Years of{' '}
            <Box as="span" color="brand.400">Industry Experience</Box>
          </Text>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="stellar.muted" mt={5} maxW="560px" lineHeight="1.8">
            From our founding in 2006 to today, a journey of continuous growth, landmark achievements, and deepening expertise.
          </Text>
        </Box>
      </Box>

      {/* Timeline */}
      <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.surface">
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
          <MotionBox ref={headRef} initial={{ opacity: 0, y: 30 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} mb={16}>
            <Box h="1px" w="40px" bg="brand.500" mb={5} />
            <Text as="h2" fontFamily="heading" fontWeight="800"
              fontSize={{ base: '3xl', md: '5xl' }} color="stellar.text" lineHeight="1.1">
              Our <Box as="span" color="brand.400">Journey</Box>
            </Text>
          </MotionBox>

          {/* Timeline list */}
          <Box ref={timelineRef} position="relative" maxW="860px">
            {/* Vertical line */}
            <Box
              position="absolute"
              left={{ base: '18px', md: '80px' }}
              top={0} bottom={0}
              w="1px"
              bgGradient="linear(to-b, brand.600, transparent)"
              opacity={0.4}
            />

            <VStack align="stretch" spacing={0}>
              {MILESTONES.map((m, i) => (
                <MotionBox
                  key={m.year}
                  initial={{ opacity: 0, x: -30 }}
                  animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                >
                  <HStack align="start" spacing={{ base: 6, md: 10 }} pb={10} position="relative">
                    {/* Year */}
                    <Box
                      flexShrink={0}
                      w={{ base: '36px', md: '80px' }}
                      textAlign={{ base: 'center', md: 'right' }}
                      pt={1}
                    >
                      <Text
                        fontFamily="mono"
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color="brand.500"
                        fontWeight="700"
                        letterSpacing="0.05em"
                      >
                        {m.year}
                      </Text>
                    </Box>

                    {/* Dot */}
                    <Box
                      flexShrink={0}
                      w="12px" h="12px"
                      bg="brand.500"
                      border="3px solid"
                      borderColor="stellar.surface"
                      borderRadius="50%"
                      mt="6px"
                      position="relative"
                      zIndex={1}
                      boxShadow="0 0 0 4px rgba(200,150,62,0.15)"
                    />

                    {/* Content */}
                    <Box
                      flex={1}
                      pb={10}
                      borderBottom={i < MILESTONES.length - 1 ? '1px solid' : 'none'}
                      borderColor="stellar.border"
                    >
                      <Text fontFamily="heading" fontSize="xl" fontWeight="700" color="stellar.text" mb={2}>
                        {m.title}
                      </Text>
                      <Text fontSize="sm" color="stellar.muted" lineHeight="1.8">{m.desc}</Text>
                    </Box>
                  </HStack>
                </MotionBox>
              ))}
            </VStack>
          </Box>
        </Box>
      </Box>

      {/* Sectors */}
      <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.bg">
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
          <MotionBox ref={sectorsRef} initial={{ opacity: 0, y: 30 }}
            animate={sectorsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={16} alignItems="center">
              <Box>
                <Box h="1px" w="40px" bg="brand.500" mb={5} />
                <Text as="h2" fontFamily="heading" fontWeight="800"
                  fontSize={{ base: '3xl', md: '4xl' }} color="stellar.text" lineHeight="1.15" mb={6}>
                  Sectors of{' '}
                  <Box as="span" color="brand.400">Expertise</Box>
                </Text>
                <Text fontSize="sm" color="stellar.muted" lineHeight="1.9" maxW="400px">
                  Our project portfolio spans a diverse range of construction sectors, each requiring specialized knowledge and tailored approaches.
                </Text>
              </Box>
              <Grid templateColumns="repeat(2,1fr)" gap={5}>
                {SECTORS.map((s, i) => (
                  <MotionBox
                    key={s.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={sectorsInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Box
                      p={6}
                      border="1px solid" borderColor="stellar.border"
                      bg="stellar.card"
                      borderTop="3px solid"
                      borderTopColor={s.color}
                      role="group"
                      transition="all 0.3s"
                      _hover={{ transform: 'translateY(-4px)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}
                    >
                      <Text fontFamily="heading" fontSize="4xl" fontWeight="900"
                        color={s.color} lineHeight="1" mb={2}>
                        {s.count}
                      </Text>
                      <Text fontSize="sm" color="stellar.light" fontWeight="600" letterSpacing="0.03em">
                        {s.name}
                      </Text>
                      <Text fontSize="xs" color="stellar.muted" mt={1}>Projects Completed</Text>
                    </Box>
                  </MotionBox>
                ))}
              </Grid>
            </Grid>
          </MotionBox>
        </Box>
      </Box>
    </>
  )
}
