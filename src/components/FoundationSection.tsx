import { Box, Grid, GridItem, Text, VStack } from '@chakra-ui/react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const MotionBox = motion(Box)

const TargetIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const LightbulbIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/><path d="M10 22h4"/>
  </svg>
)
const HeartIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
)

const PILLARS = [
  {
    icon: <TargetIcon />,
    tag: '01',
    title: 'Our Vision',
    body: 'To be the global benchmark in engineering excellence, renowned for innovative solutions, uncompromising quality, and sustainable development practices that shape tomorrow\'s infrastructure.',
  },
  {
    icon: <LightbulbIcon />,
    tag: '02',
    title: 'Our Mission',
    body: 'To deliver exceptional engineering solutions through cutting-edge technology, rigorous quality standards, and collaborative partnerships that exceed client expectations while championing sustainability and safety.',
  },
  {
    icon: <HeartIcon />,
    tag: '03',
    title: 'Our Commitment',
    body: 'With over 18 years of industry leadership, we are committed to understanding your unique needs and delivering tailored solutions that stand the test of time, backed by our unwavering dedication to client satisfaction.',
  },
]

function PillarCard({ icon, tag, title, body, delay }: typeof PILLARS[0] & { delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <Box
        p={8}
        h="full"
        border="1px solid"
        borderColor="stellar.border"
        bg="stellar.card"
        position="relative"
        overflow="hidden"
        transition="all 0.35s ease"
        role="group"
        _hover={{
          borderColor: 'brand.600',
          transform: 'translateY(-6px)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Corner accent */}
        <Box
          position="absolute" top={0} right={0}
          w="60px" h="60px"
          overflow="hidden"
          _groupHover={{}}
        >
          <Box
            position="absolute" top={0} right={0}
            w={0} h={0}
            borderStyle="solid"
            borderWidth="0 60px 60px 0"
            borderColor="transparent"
            borderRightColor="brand.600"
            opacity={0.15}
            transition="opacity 0.3s"
            sx={{ '[role=group]:hover &': { opacity: 0.4 } }}
          />
        </Box>

        {/* Tag number */}
        <Text
          fontFamily="mono"
          fontSize="xs"
          color="brand.600"
          letterSpacing="0.2em"
          mb={5}
        >
          {tag}
        </Text>

        {/* Icon */}
        <Box
          color="brand.500"
          mb={5}
          transition="transform 0.3s"
          sx={{ '[role=group]:hover &': { transform: 'scale(1.1) rotate(5deg)' } }}
        >
          {icon}
        </Box>

        {/* Title */}
        <Text
          fontFamily="heading"
          fontSize="2xl"
          fontWeight="700"
          color="stellar.text"
          mb={4}
          letterSpacing="-0.01em"
        >
          {title}
        </Text>

        {/* Body */}
        <Text
          fontSize="sm"
          color="stellar.muted"
          lineHeight="1.9"
        >
          {body}
        </Text>

        {/* Bottom gold accent */}
        <Box
          position="absolute" bottom={0} left={0}
          h="2px" w="0"
          bgGradient="linear(to-r, brand.600, brand.400)"
          transition="width 0.4s ease"
          sx={{ '[role=group]:hover &': { width: '100%' } }}
        />
      </Box>
    </MotionBox>
  )
}

export default function FoundationSection() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true })
  return (
    <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.surface">
      <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
        <MotionBox
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          mb={16}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={4}
            mb={4}
          >
            <Box h="1px" w="40px" bg="brand.500" />
            <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
              Our Foundation
            </Text>
          </Box>
          <Text
            as="h2"
            fontFamily="heading"
            fontWeight="800"
            fontSize={{ base: '3xl', md: '5xl' }}
            color="stellar.text"
            maxW="560px"
            lineHeight="1.15"
          >
            Built on a Bedrock of{' '}
            <Box as="span" color="brand.400">Innovation</Box>
          </Text>
        </MotionBox>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(3,1fr)' }} gap={6}>
          {PILLARS.map((p, i) => (
            <GridItem key={p.title}>
              <PillarCard {...p} delay={i * 0.12} />
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
