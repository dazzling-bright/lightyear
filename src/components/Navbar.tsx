import { useState, useEffect } from 'react'
import {
  Box, Flex, HStack, Text, Button, IconButton,
  Drawer, DrawerOverlay, DrawerContent, DrawerBody,
  VStack, useDisclosure, Link as ChakraLink, Avatar, Menu,
  MenuButton, MenuList, MenuItem, MenuDivider,
} from '@chakra-ui/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Who We Are', href: '/who-we-are' },
  { label: 'Experience', href: '/experience' },
  { label: 'Services', href: '/services' },
  { label: 'Project Studies', href: '/project-studies' },
  { label: 'Contact', href: '/contact' },
]

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <line x1="2" y1="5" x2="20" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="2" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)
const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

interface NavbarProps {
  onOpenConsultation: () => void
}

export default function Navbar({ onOpenConsultation }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => location.pathname === href

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <>
      <Box
        as="nav" position="fixed" top={0} left={0} right={0} zIndex={1000}
        transition="all 0.4s ease"
        bg={scrolled ? 'rgba(8,12,20,0.96)' : 'rgba(8,12,20,0.6)'}
        backdropFilter="blur(16px)"
        borderBottom="1px solid"
        borderColor={scrolled ? 'stellar.border' : 'rgba(200,150,62,0.1)'}
        boxShadow={scrolled ? '0 4px 40px rgba(0,0,0,0.5)' : 'none'}
      >
        <Box h="2px" bgGradient="linear(to-r, transparent, brand.500, transparent)" opacity={0.8} />
        <Flex maxW="1280px" mx="auto" px={{ base: 5, md: 8 }} h="72px" align="center" justify="space-between">

          {/* Logo */}
          <Link to="/">
            <Flex align="center" gap={3} role="group">
              <Box w="36px" h="36px" position="relative" flexShrink={0}>
                <Box position="absolute" inset={0} bg="brand.500" transform="rotate(45deg)" borderRadius="2px"
                  transition="all 0.3s" _groupHover={{ transform: 'rotate(90deg)', bg: 'brand.400' }} />
                <Box position="absolute" inset="8px" bg="stellar.bg" transform="rotate(45deg)" borderRadius="1px" />
              </Box>
              <Box display={{ base: 'none', md: 'block' }}>
                <Text fontFamily="heading" fontWeight="700" fontSize="lg" color="stellar.text" lineHeight="1.1">
                  Lightyear Stellar
                </Text>
                <Text fontFamily="mono" fontSize="9px" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
                  Solutions
                </Text>
              </Box>
            </Flex>
          </Link>

          {/* Desktop nav links */}
          <HStack as="ul" spacing={1} display={{ base: 'none', lg: 'flex' }} listStyleType="none">
            {NAV_LINKS.map(link => (
              <Box as="li" key={link.href}>
                <ChakraLink as={Link} to={link.href}
                  px={4} py={2} fontSize="xs" fontWeight="600" letterSpacing="0.1em" textTransform="uppercase"
                  color={isActive(link.href) ? 'brand.400' : 'stellar.muted'}
                  position="relative" transition="color 0.2s"
                  _hover={{ color: 'stellar.text', _after: { transform: 'scaleX(1)' } }}
                  _after={{
                    content: '""', position: 'absolute', bottom: '-2px',
                    left: '16px', right: '16px', h: '1px', bg: 'brand.500',
                    transform: isActive(link.href) ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left', transition: 'transform 0.3s',
                  }}>
                  {link.label}
                </ChakraLink>
              </Box>
            ))}
          </HStack>

          {/* Right side */}
          <HStack spacing={3} display={{ base: 'none', lg: 'flex' }}>
            <ChakraLink href="tel:+2348038850854"
              display="flex" alignItems="center" gap={2} fontSize="xs" fontWeight="500"
              color="stellar.muted" px={3} py={2} borderRadius="2px" transition="all 0.2s"
              _hover={{ color: 'brand.400', bg: 'rgba(200,150,62,0.06)' }}>
              <Box color="brand.500"><PhoneIcon /></Box>
              +234 803 885 0854
            </ChakraLink>

            <Button variant="ghost_light" size="sm" px={4} onClick={onOpenConsultation}>
              Schedule Call
            </Button>

            {user ? (
              <Menu>
                <MenuButton as={Button} variant="gold" size="sm" px={4}
                  rightIcon={<ChevronDownIcon />}>
                  <HStack spacing={2}>
                    <Text>{profile?.full_name?.split(' ')[0] || 'Account'}</Text>
                  </HStack>
                </MenuButton>
                <MenuList bg="stellar.surface" border="1px solid" borderColor="stellar.border"
                  borderRadius="2px" shadow="0 16px 40px rgba(0,0,0,0.5)" minW="180px" py={2}>
                  <MenuItem as={Link} to="/dashboard" bg="transparent" fontSize="sm" color="stellar.muted"
                    _hover={{ color: 'brand.400', bg: 'rgba(200,150,62,0.06)' }} px={4} py={2.5}>
                    🏗️ My Dashboard
                  </MenuItem>
                  <MenuItem as={Link} to="/dashboard/calculators" bg="transparent" fontSize="sm" color="stellar.muted"
                    _hover={{ color: 'brand.400', bg: 'rgba(200,150,62,0.06)' }} px={4} py={2.5}>
                    🧮 Calculators
                  </MenuItem>
                  <MenuDivider borderColor="stellar.border" my={1} />
                  <MenuItem bg="transparent" fontSize="sm" color="red.400"
                    _hover={{ bg: 'rgba(200,50,50,0.06)' }} px={4} py={2.5}
                    onClick={handleSignOut}>
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button as={Link} to="/login" variant="gold" size="sm" px={6}>
                Get Started →
              </Button>
            )}
          </HStack>

          {/* Mobile toggle */}
          <IconButton aria-label="Open menu" icon={isOpen ? <CloseIcon /> : <MenuIcon />}
            display={{ base: 'flex', lg: 'none' }} variant="ghost" color="stellar.text"
            _hover={{ bg: 'rgba(200,150,62,0.1)', color: 'brand.400' }}
            onClick={isOpen ? onClose : onOpen} />
        </Flex>
      </Box>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay backdropFilter="blur(8px)" bg="rgba(8,12,20,0.8)" />
        <DrawerContent bg="stellar.surface" borderLeft="1px solid" borderColor="stellar.border">
          <DrawerBody p={0}>
            <Box pt="88px" pb={8} px={6}>
              {user && (
                <Box mb={5} p={4} border="1px solid" borderColor="stellar.border" bg="stellar.card">
                  <Text fontSize="xs" fontFamily="mono" color="brand.500" letterSpacing="0.1em" textTransform="uppercase" mb={1}>
                    Signed in as
                  </Text>
                  <Text fontSize="sm" fontWeight="600" color="stellar.text">{profile?.full_name}</Text>
                  <Text fontSize="xs" color="stellar.muted" textTransform="capitalize">{profile?.role}</Text>
                </Box>
              )}
              <VStack align="stretch" spacing={0}>
                {NAV_LINKS.map((link, i) => (
                  <ChakraLink key={link.href} as={Link} to={link.href} onClick={onClose}
                    py={4} px={4} fontSize="sm" fontWeight="600" letterSpacing="0.1em" textTransform="uppercase"
                    color={isActive(link.href) ? 'brand.400' : 'stellar.light'}
                    borderBottom="1px solid" borderColor="stellar.border"
                    display="flex" alignItems="center" justifyContent="space-between"
                    transition="all 0.2s" _hover={{ color: 'brand.400', pl: 6, bg: 'rgba(200,150,62,0.04)' }}>
                    {link.label}
                    <Box opacity={0.3} fontSize="xs">→</Box>
                  </ChakraLink>
                ))}
              </VStack>

              <Box mt={6} p={4} border="1px solid" borderColor="stellar.border" borderRadius="2px">
                <Text fontSize="xs" color="stellar.muted" letterSpacing="0.1em" textTransform="uppercase" mb={3}>
                  Actions
                </Text>
                <VStack spacing={2}>
                  <Button variant="gold" w="full" size="sm" onClick={() => { onClose(); onOpenConsultation() }}>
                    Schedule Consultation
                  </Button>
                  {user ? (
                    <>
                      <Button as={Link} to="/dashboard" onClick={onClose} variant="ghost_light" w="full" size="sm">
                        My Dashboard
                      </Button>
                      <Button variant="ghost_light" w="full" size="sm" onClick={handleSignOut} color="red.400">
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button as={Link} to="/login" onClick={onClose} variant="ghost_light" w="full" size="sm">
                      Sign In / Register
                    </Button>
                  )}
                </VStack>
              </Box>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Box h="74px" />
    </>
  )
}
