import { Box, Grid, GridItem, Text, VStack, HStack, Button } from '@chakra-ui/react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

const MotionBox = motion(Box)

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)
const AwardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/>
    <circle cx="12" cy="8" r="6"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

export default function CtaSection({ onOpenConsultation }: { onOpenConsultation: () => void }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <Box
      as="section"
      py={{ base: 20, md: 28 }}
      bg="stellar.surface"
      position="relative"
      overflow="hidden"
    >
      {/* Background glow */}
      <Box
        position="absolute"
        top="50%" left="50%"
        transform="translate(-50%, -50%)"
        w="600px" h="400px"
        bg="brand.500"
        filter="blur(120px)"
        opacity={0.04}
        pointerEvents="none"
      />

      <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }} position="relative" zIndex={1}>
        {/* Leadership quote */}
        <MotionBox
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          mb={20}
        >
          <Box
            border="1px solid"
            borderColor="stellar.border"
            overflow="hidden"
          >
            <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }}>
              {/* Quote side */}
              <GridItem
                p={{ base: 10, md: 14 }}
                borderRight={{ base: 'none', lg: '1px solid' }}
                borderBottom={{ base: '1px solid', lg: 'none' }}
                borderColor="stellar.border"
              >
                <HStack spacing={4} mb={8}>
                  <Box h="1px" w="40px" bg="brand.500" />
                  <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
                    Leadership
                  </Text>
                </HStack>
                <Text
                  fontFamily="heading"
                  fontSize={{ base: '2xl', md: '3xl' }}
                  fontStyle="italic"
                  fontWeight="600"
                  color="stellar.text"
                  lineHeight="1.6"
                  mb={10}
                >
                  "Engineering is not merely about constructing buildings; it's about building trust, fostering innovation, and creating legacies that endure for generations."
                </Text>
                <Box>
                  <Text fontFamily="heading" fontSize="xl" fontWeight="700" color="brand.400">
                    Engr. John B. Ugwuagbo
                  </Text>
                  <Text fontFamily="mono" fontSize="xs" color="stellar.muted" letterSpacing="0.1em" mt={1}>
                    MNSE · ASCE · COREN
                  </Text>
                  <Text fontSize="sm" color="stellar.muted" fontWeight="600" mt={2}>
                    Chief Executive Officer
                  </Text>
                  <Text fontSize="xs" color="stellar.muted" mt={3} lineHeight="1.7" maxW="380px">
                    With over two decades of engineering excellence, leading Lightyear Stellar Solutions in delivering transformative infrastructure solutions worldwide.
                  </Text>
                </Box>
              </GridItem>

              {/* Image side */}
              <GridItem
                minH={{ base: '240px', lg: '400px' }}
                bgImage="url('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070')"
                bgSize="cover"
                bgPos="center"
                position="relative"
              >
                <Box
                  position="absolute" inset={0}
                  bgGradient="linear(to-br, rgba(8,12,20,0.5), transparent)"
                />
                <Box
                  position="absolute" bottom={6} right={6}
                  px={4} py={3}
                  bg="rgba(8,12,20,0.85)"
                  border="1px solid"
                  borderColor="brand.700"
                  backdropFilter="blur(10px)"
                >
                  <Text fontFamily="mono" fontSize="xs" color="brand.400" letterSpacing="0.15em">
                    18+ YEARS OF EXCELLENCE
                  </Text>
                </Box>
              </GridItem>
            </Grid>
          </Box>
        </MotionBox>

        {/* CTA Block */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} alignItems="start">
            {/* Left: message */}
            <Box>
              <Box display="flex" alignItems="center" gap={4} mb={5}>
                <Box h="1px" w="40px" bg="brand.500" />
                <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
                  Start Today
                </Text>
              </Box>
              <Text
                as="h2"
                fontFamily="heading"
                fontWeight="800"
                fontSize={{ base: '3xl', md: '4xl' }}
                color="stellar.text"
                lineHeight="1.15"
                mb={6}
              >
                Start Your Project Journey With Us
              </Text>
              <Text fontSize="sm" color="stellar.muted" lineHeight="1.9" mb={8} maxW="460px">
                Ready to transform your vision into reality? Our team of certified engineers and construction experts is prepared to deliver exceptional results for your next project.
              </Text>
              <VStack align="start" spacing={4}>
                {[
                  { icon: <MapPinIcon />, text: 'Global reach with local expertise' },
                  { icon: <ClockIcon />, text: 'Timely project delivery guaranteed' },
                  { icon: <AwardIcon />, text: 'Award-winning quality standards' },
                ].map(item => (
                  <HStack key={item.text} spacing={3}>
                    <Box color="brand.500">{item.icon}</Box>
                    <Text fontSize="sm" color="stellar.light" fontWeight="500">{item.text}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Right: contact card */}
            <Box
              p={8}
              border="1px solid"
              borderColor="stellar.border"
              bg="stellar.card"
              position="relative"
            >
              <Box
                position="absolute" top={0} left={0} right={0}
                h="2px"
                bgGradient="linear(to-r, brand.700, brand.400, brand.700)"
              />
              <Text fontFamily="heading" fontSize="2xl" fontWeight="700" color="stellar.text" mb={7}>
                Get In Touch
              </Text>
              <VStack align="start" spacing={5} mb={8}>
                {[
                  { icon: <PhoneIcon />, label: 'Call Us', value: '+234 803 885 0854' },
                  { icon: <MailIcon />, label: 'Email', value: 'info@lightyear.ng' },
                  { icon: <ClockIcon />, label: 'Business Hours', value: 'Mon – Fri: 8:00 AM – 6:00 PM' },
                ].map(item => (
                  <HStack key={item.label} spacing={4} align="start">
                    <Box
                      w="40px" h="40px"
                      bg="rgba(200,150,62,0.08)"
                      border="1px solid"
                      borderColor="rgba(200,150,62,0.15)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="brand.500"
                      flexShrink={0}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="stellar.muted" letterSpacing="0.05em">{item.label}</Text>
                      <Text fontSize="sm" color="stellar.text" fontWeight="600" mt="2px">{item.value}</Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
              <VStack spacing={3}>
                <Button variant="gold" w="full" size="md" py={6} onClick={onOpenConsultation}>
                  Schedule Free Consultation →
                </Button>
                <Button variant="ghost_light" w="full" size="md" py={6}>
                  Download Company Profile
                </Button>
              </VStack>
            </Box>
          </Grid>
        </MotionBox>
      </Box>
    </Box>
  )
}
