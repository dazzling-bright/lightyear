import { useState } from 'react'
import {
  Box, Flex, Text, Button, Input, VStack, HStack, Grid,
  FormControl, FormLabel, FormErrorMessage, useToast, Divider,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const MotionBox = motion(Box)

const ROLES = [
  {
    id: 'homeowner',
    label: 'Home Owner',
    icon: '🏠',
    desc: 'Track your project, payments, and communicate with your team',
  },
  {
    id: 'engineer',
    label: 'Engineer',
    icon: '⚙️',
    desc: 'Manage assigned projects and submit daily reports',
  },
  {
    id: 'admin',
    label: 'Administrator',
    icon: '🛡️',
    desc: 'Full platform access — clients, projects, and analytics',
  },
]

const inputStyles = {
  bg: 'stellar.bg',
  border: '1px solid',
  borderColor: 'stellar.border',
  borderRadius: '2px',
  color: 'stellar.text',
  fontSize: 'sm',
  _placeholder: { color: 'stellar.muted', fontSize: 'sm' },
  _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #C8963E', bg: 'stellar.surface' },
  _hover: { borderColor: 'brand.700' },
}

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<'login' | 'register'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  )
  const [selectedRole, setSelectedRole] = useState('homeowner')
  const [step, setStep] = useState<'role' | 'form'>(
    searchParams.get('mode') === 'register' ? 'role' : 'form'
  )
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setErrors({ form: 'Please fill in all fields' }); return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email, password: form.password,
    })
    setLoading(false)
    if (error) { setErrors({ form: error.message }); return }
    toast({ title: 'Welcome back!', status: 'success', duration: 2000, position: 'top' })
    navigate('/dashboard')
  }

  const handleRegister = async () => {
    const errs: Record<string, string> = {}
    if (!form.full_name) errs.full_name = 'Required'
    if (!form.email) errs.email = 'Required'
    if (!form.password || form.password.length < 6) errs.password = 'Minimum 6 characters'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name, role: selectedRole } },
    })
    setLoading(false)
    if (error) { setErrors({ form: error.message }); return }
    toast({
      title: 'Account created!',
      description: 'Check your email to confirm your account, then log in.',
      status: 'success', duration: 5000, position: 'top',
    })
    setTab('login'); setStep('form')
  }

  return (
    <Box minH="100vh" bg="stellar.bg" display="flex" alignItems="center" justifyContent="center"
      position="relative" overflow="hidden">
      {/* Background grid */}
      <Box position="absolute" inset={0} opacity={0.02}
        backgroundImage="linear-gradient(rgba(200,150,62,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,150,62,1) 1px, transparent 1px)"
        backgroundSize="60px 60px" pointerEvents="none" />

      {/* Gold glow */}
      <Box position="absolute" top="30%" left="50%" transform="translate(-50%,-50%)"
        w="500px" h="300px" bg="brand.500" filter="blur(100px)" opacity={0.05} />

      <Box w="full" maxW="1100px" mx="auto" px={{ base: 4, md: 8 }} py={12}>
        {/* Logo */}
        <Flex justify="center" mb={10}>
          <Link to="/">
            <Flex align="center" gap={3} role="group">
              <Box w="32px" h="32px" position="relative">
                <Box position="absolute" inset={0} bg="brand.500" transform="rotate(45deg)" borderRadius="2px"
                  transition="all 0.3s" _groupHover={{ transform: 'rotate(90deg)' }} />
                <Box position="absolute" inset="7px" bg="stellar.bg" transform="rotate(45deg)" />
              </Box>
              <Box>
                <Text fontFamily="heading" fontWeight="700" fontSize="lg" color="stellar.text" lineHeight="1.1">
                  Lightyear Stellar
                </Text>
                <Text fontFamily="mono" fontSize="8px" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
                  Solutions
                </Text>
              </Box>
            </Flex>
          </Link>
        </Flex>

        {/* Tabs */}
        <Flex justify="center" mb={8} gap={0}>
          {(['login', 'register'] as const).map(t => (
            <Button key={t} variant="unstyled" px={8} py={3} fontSize="sm" fontWeight="700"
              letterSpacing="0.1em" textTransform="uppercase"
              color={tab === t ? 'brand.400' : 'stellar.muted'}
              borderBottom="2px solid"
              borderColor={tab === t ? 'brand.500' : 'stellar.border'}
              borderRadius={0}
              onClick={() => { setTab(t); setStep(t === 'register' ? 'role' : 'form') }}
            >
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          ))}
        </Flex>

        <AnimatePresence mode="wait">
          {/* ── LOGIN FORM ── */}
          {tab === 'login' && (
            <MotionBox key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              maxW="420px" mx="auto">
              <Box p={8} border="1px solid" borderColor="stellar.border" bg="stellar.card" position="relative">
                <Box position="absolute" top={0} left={0} right={0} h="2px"
                  bgGradient="linear(to-r, brand.700, brand.400, brand.700)" />
                <Text fontFamily="heading" fontSize="2xl" fontWeight="700" color="stellar.text" mb={6}>
                  Welcome Back
                </Text>
                {errors.form && (
                  <Box p={3} mb={4} border="1px solid" borderColor="red.700" bg="rgba(200,50,50,0.08)">
                    <Text fontSize="sm" color="red.400">{errors.form}</Text>
                  </Box>
                )}
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="xs" fontFamily="mono" color="stellar.muted"
                      letterSpacing="0.1em" textTransform="uppercase">Email</FormLabel>
                    <Input {...inputStyles} type="email" placeholder="you@example.com"
                      value={form.email} onChange={f('email')} />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="xs" fontFamily="mono" color="stellar.muted"
                      letterSpacing="0.1em" textTransform="uppercase">Password</FormLabel>
                    <Input {...inputStyles} type="password" placeholder="••••••••"
                      value={form.password} onChange={f('password')}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                  </FormControl>
                  <Button variant="gold" w="full" size="md" py={6} isLoading={loading}
                    onClick={handleLogin}>
                    Sign In →
                  </Button>
                </VStack>
                <Text fontSize="xs" color="stellar.muted" textAlign="center" mt={5}>
                  Don't have an account?{' '}
                  <Text as="span" color="brand.400" cursor="pointer"
                    onClick={() => { setTab('register'); setStep('role') }}>
                    Create one
                  </Text>
                </Text>
              </Box>
            </MotionBox>
          )}

          {/* ── REGISTER: Step 1 — Role ── */}
          {tab === 'register' && step === 'role' && (
            <MotionBox key="role" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <Text fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700"
                color="stellar.text" textAlign="center" mb={2}>
                Who are you joining as?
              </Text>
              <Text fontSize="sm" color="stellar.muted" textAlign="center" mb={8}>
                Choose your role — you can always contact us to change it later.
              </Text>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3,1fr)' }} gap={5} maxW="860px" mx="auto">
                {ROLES.map(role => (
                  <Box key={role.id} p={7}
                    border="2px solid"
                    borderColor={selectedRole === role.id ? 'brand.500' : 'stellar.border'}
                    bg={selectedRole === role.id ? 'rgba(200,150,62,0.06)' : 'stellar.card'}
                    cursor="pointer"
                    transition="all 0.25s"
                    position="relative"
                    _hover={{ borderColor: 'brand.600' }}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    {selectedRole === role.id && (
                      <Box position="absolute" top={3} right={3} w={5} h={5}
                        bg="brand.500" display="flex" alignItems="center" justifyContent="center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </Box>
                    )}
                    <Text fontSize="3xl" mb={3}>{role.icon}</Text>
                    <Text fontFamily="heading" fontSize="xl" fontWeight="700" color="stellar.text" mb={2}>
                      {role.label}
                    </Text>
                    <Text fontSize="sm" color="stellar.muted" lineHeight="1.7">{role.desc}</Text>
                  </Box>
                ))}
              </Grid>
              <Flex justify="center" mt={8}>
                <Button variant="gold" size="lg" px={10} onClick={() => setStep('form')}>
                  Continue as {ROLES.find(r => r.id === selectedRole)?.label} →
                </Button>
              </Flex>
            </MotionBox>
          )}

          {/* ── REGISTER: Step 2 — Form ── */}
          {tab === 'register' && step === 'form' && (
            <MotionBox key="regform" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              maxW="460px" mx="auto">
              <Box p={8} border="1px solid" borderColor="stellar.border" bg="stellar.card" position="relative">
                <Box position="absolute" top={0} left={0} right={0} h="2px"
                  bgGradient="linear(to-r, brand.700, brand.400, brand.700)" />
                {/* Role badge */}
                <HStack mb={5} spacing={3}>
                  <Text fontSize="xl">{ROLES.find(r => r.id === selectedRole)?.icon}</Text>
                  <Box>
                    <Text fontSize="xs" fontFamily="mono" color="brand.500" letterSpacing="0.1em" textTransform="uppercase">
                      Registering as
                    </Text>
                    <Text fontSize="sm" fontWeight="700" color="stellar.text">
                      {ROLES.find(r => r.id === selectedRole)?.label}
                    </Text>
                  </Box>
                  <Button size="xs" variant="ghost_light" ml="auto" onClick={() => setStep('role')}>
                    Change
                  </Button>
                </HStack>
                <Divider borderColor="stellar.border" mb={5} />

                {errors.form && (
                  <Box p={3} mb={4} border="1px solid" borderColor="red.700" bg="rgba(200,50,50,0.08)">
                    <Text fontSize="sm" color="red.400">{errors.form}</Text>
                  </Box>
                )}

                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.full_name}>
                    <FormLabel fontSize="xs" fontFamily="mono" color="stellar.muted"
                      letterSpacing="0.1em" textTransform="uppercase">Full Name</FormLabel>
                    <Input {...inputStyles} placeholder="John Doe"
                      value={form.full_name} onChange={f('full_name')} />
                    <FormErrorMessage fontSize="xs">{errors.full_name}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel fontSize="xs" fontFamily="mono" color="stellar.muted"
                      letterSpacing="0.1em" textTransform="uppercase">Email</FormLabel>
                    <Input {...inputStyles} type="email" placeholder="you@example.com"
                      value={form.email} onChange={f('email')} />
                    <FormErrorMessage fontSize="xs">{errors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="xs" fontFamily="mono" color="stellar.muted"
                      letterSpacing="0.1em" textTransform="uppercase">Phone (optional)</FormLabel>
                    <Input {...inputStyles} placeholder="+234 000 000 0000"
                      value={form.phone} onChange={f('phone')} />
                  </FormControl>
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel fontSize="xs" fontFamily="mono" color="stellar.muted"
                      letterSpacing="0.1em" textTransform="uppercase">Password</FormLabel>
                    <Input {...inputStyles} type="password" placeholder="Min. 6 characters"
                      value={form.password} onChange={f('password')} />
                    <FormErrorMessage fontSize="xs">{errors.password}</FormErrorMessage>
                  </FormControl>
                  <Button variant="gold" w="full" size="md" py={6} isLoading={loading}
                    onClick={handleRegister}>
                    Create Account →
                  </Button>
                </VStack>
                <Text fontSize="xs" color="stellar.muted" textAlign="center" mt={5}>
                  Already have an account?{' '}
                  <Text as="span" color="brand.400" cursor="pointer"
                    onClick={() => { setTab('login'); setStep('form') }}>
                    Sign in
                  </Text>
                </Text>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  )
}
