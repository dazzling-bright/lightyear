import { useEffect, useRef } from 'react'
import {
  Box, Flex, Text, Button, Grid, GridItem, VStack, HStack,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
const MotionText = motion(Text)
const MotionFlex = motion(Flex)

const STATS = [
  { value: '18+', label: 'Years Excellence', sub: 'Industry Leadership' },
  { value: '40+', label: 'Projects Completed', sub: 'Across 12 Countries' },
  { value: '10+', label: 'Expert Engineers', sub: 'Certified Professionals' },
  { value: '4+', label: 'Industry Awards', sub: 'Quality Recognition' },
]

function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    setSize()
    window.addEventListener('resize', setSize)

    const stars: { x: number; y: number; r: number; o: number; v: number }[] = []
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        o: Math.random() * 0.7 + 0.2,
        v: Math.random() * 0.4 + 0.1,
      })
    }

    let raf: number
    let tick = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      tick++
      stars.forEach(s => {
        const pulse = 0.5 + 0.5 * Math.sin(tick * s.v * 0.05)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,150,62,${s.o * pulse * 0.5})`
        ctx.fill()
        // occasional bright white stars
        if (s.r > 1) {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 0.4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(240,235,220,${s.o * pulse})`
          ctx.fill()
        }
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', setSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}

export default function HeroSection({ onOpenConsultation }: { onOpenConsultation: () => void }) {
  return (
    <Box
      as="section"
      position="relative"
      minH="100vh"
      display="flex"
      alignItems="center"
      overflow="hidden"
      bg="stellar.bg"
    >
      {/* Background: dark gradient + construction image */}
      <Box
        position="absolute" inset={0}
        bgImage="url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070')"
        bgSize="cover"
        bgPos="center"
        opacity={0.08}
      />
      {/* Gradient overlay */}
      <Box
        position="absolute" inset={0}
        bgGradient="linear(160deg, rgba(8,12,20,0.97) 40%, rgba(15,25,41,0.85) 70%, rgba(20,15,5,0.9) 100%)"
      />

      {/* Grid texture */}
      <Box
        position="absolute" inset={0}
        opacity={0.03}
        backgroundImage="linear-gradient(rgba(200,150,62,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(200,150,62,0.8) 1px, transparent 1px)"
        backgroundSize="60px 60px"
        pointerEvents="none"
      />

      {/* Starfield */}
      <StarfieldCanvas />

      {/* Diagonal gold accent */}
      <Box
        position="absolute"
        top={0} right={0}
        w={{ base: '60%', lg: '45%' }}
        h="full"
        opacity={0.03}
        bgGradient="linear(135deg, transparent 40%, brand.500 100%)"
        pointerEvents="none"
      />

      <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 20, md: 32 }} position="relative" zIndex={1} w="full">
        {/* Badge */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          mb={8}
        >
          <HStack
            display="inline-flex"
            spacing={3}
            px={5}
            py={2}
            border="1px solid"
            borderColor="rgba(200,150,62,0.4)"
            borderRadius="2px"
            bg="rgba(200,150,62,0.06)"
            backdropFilter="blur(10px)"
          >
            <Box
              w={2} h={2} bg="brand.400" borderRadius="50%"
              animation="pulse 2s infinite"
              sx={{ '@keyframes pulse': { '0%,100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.5, transform: 'scale(0.8)' } } }}
            />
            <Text fontFamily="mono" fontSize="xs" color="brand.400" letterSpacing="0.15em" textTransform="uppercase">
              Award-Winning Engineering Since 2006
            </Text>
          </HStack>
        </MotionBox>

        {/* Heading */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          mb={6}
        >
          <Text
            as="h1"
            fontFamily="heading"
            fontWeight="900"
            fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
            lineHeight={{ base: '1.1', md: '1.05' }}
            color="stellar.text"
            maxW="700px"
          >
            Building The Future{' '}
            <Box as="span" position="relative" display="inline-block">
              <Box
                as="span"
                color="brand.400"
                sx={{ WebkitTextStroke: '0px' }}
              >
                With Precision
              </Box>
              {/* Underline accent */}
              <Box
                position="absolute"
                bottom="-4px"
                left={0}
                right={0}
                h="3px"
                bgGradient="linear(to-r, brand.600, brand.400, transparent)"
                borderRadius="2px"
              />
            </Box>
          </Text>
        </MotionBox>

        {/* Subheading */}
        <MotionText
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          fontSize={{ base: 'md', md: 'xl' }}
          color="stellar.muted"
          maxW="600px"
          lineHeight="1.8"
          mb={10}
        >
          Comprehensive construction management, innovative design solutions, and engineering
          excellence delivered through 18+ years of industry leadership.
        </MotionText>

        {/* CTA Buttons */}
        <MotionFlex
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          gap={4}
          flexWrap="wrap"
          mb={20}
        >
          <Button variant="gold" size="lg" px={8} onClick={onOpenConsultation}>
            Schedule Consultation
          </Button>
          <Button as={Link} to="/services" variant="ghost_light" size="lg" px={8}>
            Explore Services →
          </Button>
        </MotionFlex>

        {/* Stats Grid */}
        <Grid
          templateColumns={{ base: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }}
          gap={4}
          maxW="900px"
        >
          {STATS.map((s, i) => (
            <MotionBox
              key={s.value}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
            >
              <GridItem
                p={5}
                border="1px solid"
                borderColor="stellar.border"
                borderTop="2px solid"
                borderTopColor="brand.600"
                bg="rgba(15,25,41,0.7)"
                backdropFilter="blur(12px)"
                position="relative"
                overflow="hidden"
                role="group"
                cursor="default"
                transition="all 0.3s"
                _hover={{
                  borderColor: 'brand.600',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                  bg: 'rgba(15,25,41,0.9)',
                }}
              >
                <Box
                  position="absolute" top={0} left={0} right={0} h="1px"
                  bgGradient="linear(to-r, transparent, brand.500, transparent)"
                  opacity={0}
                  transition="opacity 0.3s"
                  sx={{ 'div:hover > &': { opacity: 1 } }}
                />
                <Text
                  fontFamily="heading"
                  fontSize="3xl"
                  fontWeight="900"
                  color="brand.400"
                  lineHeight="1"
                  mb={1}
                >
                  {s.value}
                </Text>
                <Text fontSize="xs" fontWeight="700" color="stellar.text" letterSpacing="0.05em" mb="2px">
                  {s.label}
                </Text>
                <Text fontSize="xs" color="stellar.muted">
                  {s.sub}
                </Text>
              </GridItem>
            </MotionBox>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
