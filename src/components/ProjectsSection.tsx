import { Box, Grid, GridItem, Text, HStack, Button } from '@chakra-ui/react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

const MotionBox = motion(Box)

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 2v4"/><path d="M16 2v4"/>
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <path d="M3 10h18"/>
  </svg>
)

const PROJECTS = [
  {
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200',
    category: 'Commercial',
    title: 'Innovation Business Hub',
    year: '2023',
    units: '120 Units',
    categoryColor: 'brand.500',
  },
  {
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1200',
    category: 'Electrical',
    title: 'Riverside Power Plant',
    year: '2024',
    units: '1 Facility',
    categoryColor: 'blue.400',
  },
  {
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200',
    category: 'Infrastructure',
    title: 'Innovation Transport Hub',
    year: '2023',
    units: '120 Units',
    categoryColor: 'teal.400',
  },
]

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
    >
      <Box
        role="group"
        overflow="hidden"
        border="1px solid"
        borderColor="stellar.border"
        bg="stellar.card"
        transition="all 0.4s"
        _hover={{ borderColor: 'brand.700', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}
      >
        {/* Image */}
        <Box position="relative" h="260px" overflow="hidden">
          <Box
            position="absolute" inset={0}
            bgImage={`url('${project.image}')`}
            bgSize="cover"
            bgPos="center"
            transition="transform 0.6s ease"
            sx={{ '[role=group]:hover &': { transform: 'scale(1.06)' } }}
          />
          {/* Gradient */}
          <Box
            position="absolute" inset={0}
            bgGradient="linear(to-t, rgba(8,12,20,0.95) 0%, rgba(8,12,20,0.3) 50%, transparent 100%)"
          />
          {/* Category tag */}
          <Box position="absolute" top={4} left={4}>
            <Text
              display="inline-block"
              px={3} py={1}
              bg="rgba(8,12,20,0.8)"
              border="1px solid"
              borderColor="brand.700"
              fontFamily="mono"
              fontSize="xs"
              color="brand.400"
              letterSpacing="0.12em"
              textTransform="uppercase"
              backdropFilter="blur(8px)"
            >
              {project.category}
            </Text>
          </Box>
        </Box>

        {/* Content */}
        <Box p={6}>
          <Text
            fontFamily="heading"
            fontSize="xl"
            fontWeight="700"
            color="stellar.text"
            mb={4}
            letterSpacing="-0.01em"
            transition="color 0.2s"
            sx={{ '[role=group]:hover &': { color: 'brand.400' } }}
          >
            {project.title}
          </Text>
          <HStack justify="space-between">
            <HStack spacing={2}>
              <Box color="brand.600"><CalendarIcon /></Box>
              <Text fontSize="xs" color="stellar.muted" letterSpacing="0.05em">
                Completed {project.year}
              </Text>
            </HStack>
            <Text fontSize="xs" color="stellar.muted" letterSpacing="0.05em">
              {project.units}
            </Text>
          </HStack>
        </Box>

        {/* Bottom hover bar */}
        <Box
          h="2px"
          bgGradient="linear(to-r, brand.700, brand.400)"
          transform="scaleX(0)"
          transformOrigin="left"
          transition="transform 0.4s ease"
          sx={{ '[role=group]:hover &': { transform: 'scaleX(1)' } }}
        />
      </Box>
    </MotionBox>
  )
}

export default function ProjectsSection() {
  const headRef = useRef(null)
  const inView = useInView(headRef, { once: true })
  return (
    <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.surface">
      <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
        <MotionBox
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          mb={14}
          display="flex"
          flexDir={{ base: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ base: 'start', md: 'end' }}
          gap={6}
        >
          <Box>
            <Box display="flex" alignItems="center" gap={4} mb={4}>
              <Box h="1px" w="40px" bg="brand.500" />
              <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
                Our Work
              </Text>
            </Box>
            <Text
              as="h2"
              fontFamily="heading"
              fontWeight="800"
              fontSize={{ base: '3xl', md: '5xl' }}
              color="stellar.text"
              lineHeight="1.1"
            >
              Featured{' '}
              <Box as="span" color="brand.400">Projects</Box>
            </Text>
          </Box>
          <Button
            as={Link}
            to="/project-studies"
            variant="outline_gold"
            size="sm"
            px={6}
          >
            View All Projects →
          </Button>
        </MotionBox>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2,1fr)', lg: 'repeat(3,1fr)' }}
          gap={6}
        >
          {PROJECTS.map((p, i) => (
            <GridItem key={p.title}>
              <ProjectCard project={p} index={i} />
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
