import { useState, useRef } from 'react'
import { Box, Text, HStack, IconButton, VStack } from '@chakra-ui/react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const MotionBox = motion(Box)

const TESTIMONIALS = [
  {
    quote: 'Lightyear Stellar delivered exceptional quality on our commercial complex. Their attention to detail and project management exceeded our expectations.',
    author: 'Michael Rodriguez',
    role: 'Global Infrastructure Partners',
    project: 'Downtown Commercial Tower',
  },
  {
    quote: 'The engineering team brought creative solutions to complex structural challenges. From concept to completion, the process was seamless and professional.',
    author: 'Amara Okafor',
    role: 'Nexus Development Corp.',
    project: 'Riverside Power Plant',
  },
  {
    quote: 'Outstanding commitment to safety and quality. Their project management approach kept us on schedule and within budget — a rare achievement at this scale.',
    author: 'Dr. Emeka Nwosu',
    role: 'Federal Infrastructure Board',
    project: 'Innovation Transport Hub',
  },
]

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m15 18-6-6 6-6"/>
  </svg>
)
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6"/>
  </svg>
)

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const go = (d: number) => {
    setDir(d)
    setCurrent(c => (c + d + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  return (
    <Box
      as="section"
      py={{ base: 20, md: 28 }}
      bg="stellar.bg"
      position="relative"
      overflow="hidden"
    >
      {/* Background texture */}
      <Box
        position="absolute" inset={0}
        bgImage="url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070')"
        bgSize="cover" bgPos="center"
        opacity={0.03}
        pointerEvents="none"
      />
      <Box
        position="absolute" inset={0}
        bgGradient="linear(to-b, stellar.bg, rgba(15,25,41,0.3), stellar.bg)"
        pointerEvents="none"
      />

      {/* Large quote mark watermark */}
      <Text
        position="absolute"
        top={{ base: '5%', md: '10%' }}
        left={{ base: '3%', md: '6%' }}
        fontFamily="heading"
        fontSize={{ base: '120px', md: '200px' }}
        lineHeight="1"
        color="stellar.border"
        userSelect="none"
        pointerEvents="none"
        opacity={0.4}
      >
        "
      </Text>

      <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }} position="relative" zIndex={1}>
        <MotionBox
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          mb={16}
          textAlign="center"
        >
          <Box display="flex" alignItems="center" justifyContent="center" gap={4} mb={4}>
            <Box h="1px" w="40px" bg="brand.500" />
            <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
              Client Voices
            </Text>
            <Box h="1px" w="40px" bg="brand.500" />
          </Box>
          <Text
            as="h2"
            fontFamily="heading"
            fontWeight="800"
            fontSize={{ base: '3xl', md: '5xl' }}
            color="stellar.text"
            lineHeight="1.1"
          >
            What Our Clients{' '}
            <Box as="span" color="brand.400">Say</Box>
          </Text>
        </MotionBox>

        {/* Testimonial card */}
        <Box
          maxW="860px"
          mx="auto"
        >
          <Box
            p={{ base: 8, md: 12 }}
            border="1px solid"
            borderColor="stellar.border"
            bg="stellar.card"
            position="relative"
            overflow="hidden"
          >
            {/* Top gold line */}
            <Box
              position="absolute" top={0} left="20%" right="20%"
              h="2px"
              bgGradient="linear(to-r, transparent, brand.500, transparent)"
            />

            <AnimatePresence mode="wait" custom={dir}>
              <MotionBox
                key={current}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -dir * 40 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <Text
                  fontFamily="heading"
                  fontSize={{ base: 'xl', md: '2xl' }}
                  fontStyle="italic"
                  color="stellar.text"
                  lineHeight="1.7"
                  textAlign="center"
                  mb={10}
                  fontWeight="400"
                >
                  "{TESTIMONIALS[current].quote}"
                </Text>

                <VStack spacing={1} textAlign="center">
                  <Box h="1px" w="32px" bg="brand.500" mb={3} mx="auto" />
                  <Text fontFamily="heading" fontSize="lg" fontWeight="700" color="brand.400">
                    {TESTIMONIALS[current].author}
                  </Text>
                  <Text fontSize="sm" color="stellar.muted">
                    {TESTIMONIALS[current].role}
                  </Text>
                  <Text fontFamily="mono" fontSize="xs" color="brand.600" letterSpacing="0.1em" textTransform="uppercase" mt={1}>
                    {TESTIMONIALS[current].project}
                  </Text>
                </VStack>
              </MotionBox>
            </AnimatePresence>
          </Box>

          {/* Controls */}
          <HStack justify="center" mt={8} spacing={4}>
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeft />}
              variant="ghost_light"
              size="sm"
              border="1px solid"
              borderColor="stellar.border"
              borderRadius="2px"
              onClick={() => go(-1)}
              _hover={{ borderColor: 'brand.600', color: 'brand.400' }}
            />
            <HStack spacing={2}>
              {TESTIMONIALS.map((_, i) => (
                <Box
                  key={i}
                  as="button"
                  onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i) }}
                  w={i === current ? '24px' : '8px'}
                  h="3px"
                  bg={i === current ? 'brand.500' : 'stellar.border'}
                  borderRadius="2px"
                  transition="all 0.3s"
                  _hover={{ bg: i === current ? 'brand.400' : 'brand.700' }}
                />
              ))}
            </HStack>
            <IconButton
              aria-label="Next"
              icon={<ChevronRight />}
              variant="ghost_light"
              size="sm"
              border="1px solid"
              borderColor="stellar.border"
              borderRadius="2px"
              onClick={() => go(1)}
              _hover={{ borderColor: 'brand.600', color: 'brand.400' }}
            />
          </HStack>
        </Box>
      </Box>
    </Box>
  )
}
