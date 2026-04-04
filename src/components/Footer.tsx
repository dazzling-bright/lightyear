import {
  Box, Flex, Grid, GridItem, VStack, HStack, Text,
  Link as ChakraLink, IconButton, Divider,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)
const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
)
const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const FOOTER_LINKS = {
  'Company': [
    { label: 'About Us', href: '/who-we-are' },
    { label: 'Our Experience', href: '/experience' },
    { label: 'Contact Us', href: '/contact' },
  ],
  'Services': [
    { label: 'Our Services', href: '/services' },
    { label: 'Project Studies', href: '/project-studies' },
    { label: 'Feasibility Studies', href: '/services' },
    { label: 'Design & Engineering', href: '/services' },
  ],
}

export default function Footer() {
  return (
    <Box
      as="footer"
      bg="stellar.surface"
      borderTop="1px solid"
      borderColor="stellar.border"
      pt={16}
      pb={8}
    >
      {/* Gold accent top bar */}
      <Box h="2px" bgGradient="linear(to-r, transparent, brand.500, transparent)" mb={16} opacity={0.6} />

      <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2,1fr)', lg: '2fr 1fr 1fr 1.5fr' }}
          gap={{ base: 10, md: 12 }}
          mb={12}
        >
          {/* Brand */}
          <GridItem>
            <Flex align="center" gap={3} mb={5}>
              <Box w="34px" h="34px" position="relative" flexShrink={0}>
                <Box
                  position="absolute" inset={0}
                  bg="brand.500"
                  transform="rotate(45deg)"
                  borderRadius="2px"
                />
                <Box
                  position="absolute" inset="8px"
                  bg="stellar.surface"
                  transform="rotate(45deg)"
                  borderRadius="1px"
                />
              </Box>
              <Box>
                <Text fontFamily="heading" fontWeight="700" fontSize="md" color="stellar.text" lineHeight="1.1">
                  Lightyear Stellar
                </Text>
                <Text fontFamily="mono" fontSize="8px" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
                  Solutions
                </Text>
              </Box>
            </Flex>
            <Text fontSize="sm" color="stellar.muted" maxW="280px" lineHeight="1.8" mb={6}>
              Quality construction. Inspired design. Unparalleled experience. Exemplary service — since 2006.
            </Text>
            <HStack spacing={2}>
              {[
                { icon: <FacebookIcon />, href: 'https://facebook.com', label: 'Facebook' },
                { icon: <TwitterIcon />, href: 'https://twitter.com', label: 'Twitter' },
                { icon: <LinkedInIcon />, href: 'https://linkedin.com', label: 'LinkedIn' },
              ].map(s => (
                <IconButton
                  key={s.label}
                  as="a"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  icon={s.icon}
                  size="sm"
                  variant="ghost"
                  color="stellar.muted"
                  border="1px solid"
                  borderColor="stellar.border"
                  borderRadius="2px"
                  _hover={{ color: 'brand.400', borderColor: 'brand.600', bg: 'rgba(200,150,62,0.08)' }}
                />
              ))}
            </HStack>
          </GridItem>

          {/* Nav links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <GridItem key={title}>
              <Text
                fontFamily="mono"
                fontSize="xs"
                fontWeight="700"
                letterSpacing="0.2em"
                textTransform="uppercase"
                color="brand.500"
                mb={5}
              >
                {title}
              </Text>
              <VStack align="start" spacing={3}>
                {links.map(l => (
                  <ChakraLink
                    key={l.label}
                    as={Link}
                    to={l.href}
                    fontSize="sm"
                    color="stellar.muted"
                    _hover={{ color: 'stellar.text', pl: 1 }}
                    transition="all 0.2s"
                  >
                    {l.label}
                  </ChakraLink>
                ))}
              </VStack>
            </GridItem>
          ))}

          {/* Contact */}
          <GridItem>
            <Text
              fontFamily="mono"
              fontSize="xs"
              fontWeight="700"
              letterSpacing="0.2em"
              textTransform="uppercase"
              color="brand.500"
              mb={5}
            >
              Contact Info
            </Text>
            <VStack align="start" spacing={4}>
              <HStack align="start" spacing={3}>
                <Box color="brand.500" mt="2px" flexShrink={0}><MapPinIcon /></Box>
                <Text fontSize="sm" color="stellar.muted" lineHeight="1.6">
                  179A, Maccido Royal Estate,<br/>Galadimawa, Abuja
                </Text>
              </HStack>
              <HStack align="start" spacing={3}>
                <Box color="brand.500" mt="2px" flexShrink={0}><PhoneIcon /></Box>
                <Box>
                  <Text fontSize="sm" color="stellar.light">+234 803 885 0854</Text>
                  <Text fontSize="sm" color="stellar.muted">+234 803 639 7972</Text>
                </Box>
              </HStack>
              <HStack align="start" spacing={3}>
                <Box color="brand.500" mt="2px" flexShrink={0}><MailIcon /></Box>
                <Text fontSize="sm" color="stellar.muted">info@lightyear.ng</Text>
              </HStack>
              <Box
                mt={2}
                px={3}
                py={2}
                border="1px solid"
                borderColor="stellar.border"
                borderLeft="2px solid"
                borderLeftColor="brand.500"
              >
                <Text fontSize="xs" color="stellar.muted" letterSpacing="0.05em">
                  Mon – Fri: 8:00 AM – 6:00 PM WAT
                </Text>
              </Box>
            </VStack>
          </GridItem>
        </Grid>

        <Divider borderColor="stellar.border" mb={8} />

        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'start', md: 'center' }}
          gap={4}
        >
          <Text fontSize="xs" color="stellar.muted" letterSpacing="0.05em">
            © {new Date().getFullYear()} Lightyear Stellar Solutions Ltd. All rights reserved.
          </Text>
          <HStack spacing={6}>
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map(l => (
              <ChakraLink key={l} href="#" fontSize="xs" color="stellar.muted" _hover={{ color: 'brand.400' }}>
                {l}
              </ChakraLink>
            ))}
          </HStack>
        </Flex>
      </Box>
    </Box>
  )
}
