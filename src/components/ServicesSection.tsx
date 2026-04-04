import { Box, Grid, GridItem, Text, VStack, HStack, List, ListItem } from '@chakra-ui/react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

const MotionBox = motion(Box)

const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
  </svg>
)
const BuildingIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
    <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
  </svg>
)
const TargetIcon2 = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const UsersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const SERVICES = [
  {
    icon: <ShieldIcon />,
    title: 'Feasibility Studies',
    desc: 'Comprehensive technical and economic analysis, site evaluation, risk assessment, and investment viability studies for informed decision-making.',
    items: ['Technical Surveys', 'Cost Analysis', 'Risk Assessment'],
  },
  {
    icon: <BuildingIcon />,
    title: 'Design & Engineering',
    desc: 'Innovative architectural design, structural engineering, MEP systems, and sustainable building solutions using BIM technology.',
    items: ['BIM Modeling', 'Structural Design', 'MEP Systems'],
  },
  {
    icon: <TargetIcon2 />,
    title: 'Project Management',
    desc: 'End-to-end project delivery with rigorous quality control, budget management, and timeline optimization methodologies.',
    items: ['Quality Control', 'Budget Management', 'Timeline Optimization'],
  },
  {
    icon: <UsersIcon />,
    title: 'Construction Services',
    desc: 'Turnkey construction solutions from ground-up development to complex renovations and specialized infrastructure projects.',
    items: ['Turnkey Solutions', 'Renovations', 'Infrastructure'],
  },
]

function ServiceCard({ icon, title, desc, items, index }: typeof SERVICES[0] & { index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      h="full"
    >
      <Box
        p={8}
        h="full"
        bg="stellar.card"
        border="1px solid"
        borderColor="stellar.border"
        position="relative"
        overflow="hidden"
        display="flex"
        flexDir="column"
        role="group"
        transition="all 0.35s"
        _hover={{
          borderColor: 'rgba(200,150,62,0.4)',
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Number watermark */}
        <Text
          position="absolute"
          top={4} right={5}
          fontFamily="mono"
          fontSize="5xl"
          fontWeight="900"
          color="stellar.border"
          lineHeight="1"
          userSelect="none"
          transition="color 0.3s"
          sx={{ '[role=group]:hover &': { color: 'rgba(200,150,62,0.08)' } }}
        >
          {String(index + 1).padStart(2, '0')}
        </Text>

        {/* Icon */}
        <Box
          mb={6}
          w="64px" h="64px"
          bg="rgba(200,150,62,0.08)"
          border="1px solid"
          borderColor="rgba(200,150,62,0.15)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="brand.500"
          transition="all 0.3s"
          sx={{
            '[role=group]:hover &': {
              bg: 'rgba(200,150,62,0.15)',
              borderColor: 'brand.500',
              transform: 'scale(1.05)',
            }
          }}
        >
          {icon}
        </Box>

        <Text
          fontFamily="heading"
          fontSize="xl"
          fontWeight="700"
          color="stellar.text"
          mb={4}
          letterSpacing="-0.01em"
        >
          {title}
        </Text>
        <Text fontSize="sm" color="stellar.muted" lineHeight="1.8" mb={6} flex={1}>
          {desc}
        </Text>

        <List spacing={2} mb={6}>
          {items.map(item => (
            <ListItem key={item} display="flex" alignItems="center" gap={2}>
              <Box color="brand.500" flexShrink={0}><CheckIcon /></Box>
              <Text fontSize="xs" color="stellar.light" letterSpacing="0.03em">{item}</Text>
            </ListItem>
          ))}
        </List>

        <Box
          as={Link}
          to="/services"
          display="inline-flex"
          alignItems="center"
          gap={2}
          fontSize="xs"
          fontWeight="700"
          letterSpacing="0.1em"
          textTransform="uppercase"
          color="brand.500"
          transition="all 0.2s"
          _hover={{ color: 'brand.300', gap: 3 }}
        >
          Explore Service
          <Box transition="transform 0.2s" sx={{ 'a:hover &': { transform: 'translateX(4px)' } }}>→</Box>
        </Box>

        {/* Left border accent */}
        <Box
          position="absolute" left={0} top="20%" bottom="20%"
          w="2px"
          bgGradient="linear(to-b, transparent, brand.500, transparent)"
          opacity={0}
          transition="opacity 0.3s"
          sx={{ '[role=group]:hover &': { opacity: 1 } }}
        />
      </Box>
    </MotionBox>
  )
}

export default function ServicesSection() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true })
  return (
    <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.bg">
      <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
        <MotionBox
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          mb={16}
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
                What We Do
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
              Comprehensive{' '}
              <Box as="span" color="brand.400">Services</Box>
            </Text>
          </Box>
          <Text fontSize="sm" color="stellar.muted" maxW="300px" lineHeight="1.8">
            End-to-end engineering and construction solutions tailored to your project requirements
          </Text>
        </MotionBox>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' }}
          gap={6}
        >
          {SERVICES.map((s, i) => (
            <GridItem key={s.title} h="full">
              <ServiceCard {...s} index={i} />
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
