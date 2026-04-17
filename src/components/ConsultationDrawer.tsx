import { useState } from 'react'
import {
  Drawer, DrawerOverlay, DrawerContent, DrawerBody, DrawerCloseButton,
  Box, Text, VStack, HStack, Input, Textarea, Select,
  Button, FormControl, FormLabel, Grid, useToast,
  Divider, Link as ChakraLink, useColorModeValue,
} from '@chakra-ui/react'
import { apiCall } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface Props { isOpen: boolean; onClose: () => void }

const inputStyles = (isDark: boolean) => ({
  bg:           isDark ? 'stellar.bg'     : '#F8FAFC',
  border:       '1px solid',
  borderColor:  isDark ? 'stellar.border' : 'gray.200',
  borderRadius: '2px',
  color:        isDark ? 'stellar.text'   : 'gray.800',
  fontSize:     'sm',
  _placeholder: { color: isDark ? 'stellar.muted' : 'gray.400' },
  _focus:       { borderColor: 'brand.500', boxShadow: '0 0 0 1px #C8963E' },
  _hover:       { borderColor: 'brand.700' },
})

const labelStyles = {
  fontSize: 'xs' as const, fontFamily: 'mono', color: 'stellar.muted',
  letterSpacing: '0.1em', textTransform: 'uppercase' as const, mb: 1,
}

const STEPS = ['Your Details', 'Project Info', 'Review & Send']

const WHATSAPP = 'https://wa.me/2347032082725'
const LINKEDIN = 'https://linkedin.com/company/lightyear-stellar-solutions'
const PHONE    = 'tel:+2347032082725'

export default function ConsultationDrawer({ isOpen, onClose }: Props) {
  const { profile } = useAuth()
  const toast = useToast()
  const isDark = useColorModeValue(false, true)
  const drawerBg = useColorModeValue('white', 'stellar.surface')
  const borderC  = useColorModeValue('gray.200', 'stellar.border')

  const [step, setStep]         = useState(0)
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    full_name:    profile?.full_name || '',
    email:        profile?.email     || '',
    phone:        profile?.phone     || '',
    location:     '',
    service_type: '',
    project_type: '',
    budget_range: '',
    timeline:     '',
    message:      '',
  })

  const f = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }))

  const iStyles = inputStyles(isDark)

  const handleSubmit = async () => {
    if (!form.full_name || !form.email || !form.message) {
      toast({ title: 'Please fill required fields', status: 'warning', duration: 2500, position: 'top' })
      return
    }
    setLoading(true)
    try {
      // Save to DB
      await apiCall('/consultations/', {
        method: 'POST',
        body: JSON.stringify({ ...form, user_id: profile?.id || null }),
      })
      // Send emails
      await apiCall('/email/consultation', {
        method: 'POST',
        body: JSON.stringify(form),
      }).catch(() => {}) // email failure is non-fatal
      setSubmitted(true)
    } catch (err: any) {
      toast({ title: 'Submission failed', description: err.message, status: 'error', duration: 3000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => { setStep(0); setSubmitted(false) }, 400)
  }

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} placement="right" size="md">
      <DrawerOverlay backdropFilter="blur(8px)" bg="rgba(8,12,20,0.75)" />
      <DrawerContent bg={drawerBg} borderLeft="1px solid" borderColor={borderC} maxW="520px">
        <Box h="2px" bgGradient="linear(to-r, brand.700, brand.400, brand.700)" />
        <DrawerCloseButton color="stellar.muted" mt={2} _hover={{ color: 'brand.400' }} />

        <DrawerBody p={0}>
          {submitted ? (
            // ── Success screen ──────────────────────────────────────────
            <Box p={10} textAlign="center" pt={20}>
              <Box w="72px" h="72px" bg="rgba(200,150,62,0.1)" border="1px solid" borderColor="brand.600"
                display="flex" alignItems="center" justifyContent="center" mx="auto" mb={6}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C8963E" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </Box>
              <Text fontFamily="heading" fontSize="2xl" fontWeight="700" color="text-primary" mb={2}>
                Request Submitted!
              </Text>
              <Text fontSize="sm" color="text-muted" lineHeight="1.8" maxW="320px" mx="auto" mb={2}>
                Thank you, <strong>{form.full_name.split(' ')[0]}</strong>. A confirmation email with your submission details has been sent to <strong>{form.email}</strong>.
              </Text>
              <Text fontSize="xs" color="text-muted" mb={8}>
                Our team will reach out within 1 business day.
              </Text>

              <Divider borderColor={borderC} mb={6} />

              {/* Contact channels */}
              <Text fontSize="xs" fontFamily="mono" color="brand.500" letterSpacing="0.15em" mb={4}>
                REACH US DIRECTLY
              </Text>
              <VStack spacing={2} mb={8}>
                <ChakraLink href={WHATSAPP} isExternal w="full">
                  <Button variant="ghost_light" w="full" size="sm" leftIcon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M11.977 0C5.366 0 0 5.373 0 11.977c0 2.091.543 4.057 1.491 5.765L0 24l6.445-1.69A11.933 11.933 0 0011.977 24C18.59 24 24 18.627 24 12.023 24 5.373 18.59 0 11.977 0zm0 21.818a9.843 9.843 0 01-5.022-1.375l-.36-.214-3.724.977.993-3.628-.235-.373a9.846 9.846 0 01-1.51-5.228c0-5.441 4.424-9.864 9.858-9.864 5.441 0 9.865 4.423 9.865 9.864 0 5.441-4.424 9.841-9.865 9.841z"/>
                    </svg>
                  }>
                    WhatsApp Us
                  </Button>
                </ChakraLink>
                <ChakraLink href={PHONE} w="full">
                  <Button variant="ghost_light" w="full" size="sm">
                    📞 +234 703 208 2725
                  </Button>
                </ChakraLink>
                <ChakraLink href={LINKEDIN} isExternal w="full">
                  <Button variant="ghost_light" w="full" size="sm">
                    🔗 LinkedIn
                  </Button>
                </ChakraLink>
              </VStack>
              <Button variant="gold" onClick={handleClose}>Close</Button>
            </Box>
          ) : (
            <Box p={8}>
              <Text fontFamily="heading" fontSize="2xl" fontWeight="700" color="text-primary" mb={1}>
                Schedule a Consultation
              </Text>
              <Text fontSize="sm" color="text-muted" mb={2}>
                Tell us about your project and we'll match you with the right engineer.
              </Text>

              {/* Quick contact links */}
              <HStack spacing={2} mb={6} flexWrap="wrap">
                <Text fontSize="xs" color="text-muted">Prefer to reach us?</Text>
                <ChakraLink href={WHATSAPP} isExternal fontSize="xs" color="green.500" fontWeight="600">
                  WhatsApp
                </ChakraLink>
                <Text fontSize="xs" color="text-muted">·</Text>
                <ChakraLink href={PHONE} fontSize="xs" color="brand.400" fontWeight="600">
                  Call
                </ChakraLink>
                <Text fontSize="xs" color="text-muted">·</Text>
                <ChakraLink href={LINKEDIN} isExternal fontSize="xs" color="blue.400" fontWeight="600">
                  LinkedIn
                </ChakraLink>
              </HStack>

              {/* Step indicators */}
              <HStack spacing={0} mb={8}>
                {STEPS.map((label, i) => (
                  <Box key={label} flex={1} position="relative">
                    <Box h="2px" bg={i <= step ? 'brand.500' : borderC} transition="background 0.3s" />
                    <Text fontSize="xs" fontFamily="mono" color={i <= step ? 'brand.400' : 'text-muted'}
                      letterSpacing="0.08em" mt={2} textTransform="uppercase">{label}</Text>
                  </Box>
                ))}
              </HStack>

              {/* Step 0 — Details */}
              {step === 0 && (
                <VStack spacing={4}>
                  <Grid templateColumns="1fr 1fr" gap={4} w="full">
                    <FormControl isRequired>
                      <FormLabel {...labelStyles}>Full Name</FormLabel>
                      <Input {...iStyles} placeholder="John Doe" value={form.full_name} onChange={f('full_name')} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel {...labelStyles}>Email</FormLabel>
                      <Input {...iStyles} type="email" placeholder="you@example.com" value={form.email} onChange={f('email')} />
                    </FormControl>
                  </Grid>
                  <Grid templateColumns="1fr 1fr" gap={4} w="full">
                    <FormControl>
                      <FormLabel {...labelStyles}>Phone</FormLabel>
                      <Input {...iStyles} placeholder="+234 000 000 0000" value={form.phone} onChange={f('phone')} />
                    </FormControl>
                    <FormControl>
                      <FormLabel {...labelStyles}>Location</FormLabel>
                      <Input {...iStyles} placeholder="Lagos, Nigeria" value={form.location} onChange={f('location')} />
                    </FormControl>
                  </Grid>
                  <Button variant="gold" w="full" mt={2} onClick={() => setStep(1)}
                    isDisabled={!form.full_name || !form.email}>Continue →</Button>
                </VStack>
              )}

              {/* Step 1 — Project Info */}
              {step === 1 && (
                <VStack spacing={4}>
                  <FormControl w="full">
                    <FormLabel {...labelStyles}>Service Needed</FormLabel>
                    <Select {...iStyles} value={form.service_type} onChange={f('service_type')} placeholder="Select a service">
                      <option>Feasibility Studies</option>
                      <option>Design & Engineering</option>
                      <option>Project Management</option>
                      <option>Construction Services</option>
                      <option>Advisory & Consulting</option>
                      <option>Foundation Investigation</option>
                      <option>Pre-Construction Planning</option>
                    </Select>
                  </FormControl>
                  <FormControl w="full">
                    <FormLabel {...labelStyles}>Project Type</FormLabel>
                    <Select {...iStyles} value={form.project_type} onChange={f('project_type')} placeholder="Select project type">
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Industrial</option>
                      <option>Infrastructure</option>
                      <option>Renovation</option>
                    </Select>
                  </FormControl>
                  <Grid templateColumns="1fr 1fr" gap={4} w="full">
                    <FormControl>
                      <FormLabel {...labelStyles}>Budget Range</FormLabel>
                      <Select {...iStyles} value={form.budget_range} onChange={f('budget_range')} placeholder="Select range">
                        <option>Under ₦5M</option>
                        <option>₦5M – ₦20M</option>
                        <option>₦20M – ₦100M</option>
                        <option>₦100M – ₦500M</option>
                        <option>Above ₦500M</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel {...labelStyles}>Timeline</FormLabel>
                      <Select {...iStyles} value={form.timeline} onChange={f('timeline')} placeholder="When to start?">
                        <option>Immediately</option>
                        <option>1 – 3 months</option>
                        <option>3 – 6 months</option>
                        <option>6+ months</option>
                        <option>Just exploring</option>
                      </Select>
                    </FormControl>
                  </Grid>
                  <FormControl isRequired w="full">
                    <FormLabel {...labelStyles}>Project Description</FormLabel>
                    <Textarea {...iStyles} rows={4} resize="none"
                      placeholder="Describe your project, goals, and any specific requirements..."
                      value={form.message} onChange={f('message')} />
                  </FormControl>
                  <HStack w="full" gap={3}>
                    <Button variant="ghost_light" flex={1} onClick={() => setStep(0)}>← Back</Button>
                    <Button variant="gold" flex={2} onClick={() => setStep(2)} isDisabled={!form.message}>
                      Review →
                    </Button>
                  </HStack>
                </VStack>
              )}

              {/* Step 2 — Review */}
              {step === 2 && (
                <VStack spacing={0} align="stretch">
                  <Box mb={4} p={3} bg="rgba(200,150,62,0.06)" border="1px solid" borderColor="brand.700">
                    <Text fontSize="xs" fontFamily="mono" color="brand.500" letterSpacing="0.1em">
                      📧 A confirmation email will be sent to <strong>{form.email}</strong>
                    </Text>
                  </Box>
                  {[
                    { label: 'Name',         value: form.full_name },
                    { label: 'Email',        value: form.email },
                    { label: 'Phone',        value: form.phone || '—' },
                    { label: 'Location',     value: form.location || '—' },
                    { label: 'Service',      value: form.service_type || '—' },
                    { label: 'Project Type', value: form.project_type || '—' },
                    { label: 'Budget',       value: form.budget_range || '—' },
                    { label: 'Timeline',     value: form.timeline || '—' },
                  ].map(row => (
                    <HStack key={row.label} py={2.5} borderBottom="1px solid" borderColor={borderC}
                      justify="space-between">
                      <Text fontSize="xs" fontFamily="mono" color="text-muted" letterSpacing="0.08em"
                        textTransform="uppercase">{row.label}</Text>
                      <Text fontSize="sm" color="text-primary" fontWeight="500" textAlign="right" maxW="60%">
                        {row.value}
                      </Text>
                    </HStack>
                  ))}
                  <Box mt={4} p={4} bg={isDark ? 'stellar.bg' : 'gray.50'} border="1px solid" borderColor={borderC}>
                    <Text fontSize="xs" fontFamily="mono" color="text-muted" letterSpacing="0.08em"
                      textTransform="uppercase" mb={2}>Message</Text>
                    <Text fontSize="sm" color="text-light" lineHeight="1.7">{form.message}</Text>
                  </Box>
                  <HStack mt={6} gap={3}>
                    <Button variant="ghost_light" flex={1} onClick={() => setStep(1)}>← Edit</Button>
                    <Button variant="gold" flex={2} isLoading={loading} onClick={handleSubmit}>
                      Submit Request
                    </Button>
                  </HStack>
                </VStack>
              )}
            </Box>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
