import { useState } from 'react'
import {
  Drawer, DrawerOverlay, DrawerContent, DrawerBody, DrawerCloseButton,
  Box, Text, VStack, HStack, Input, Textarea, Select,
  Button, FormControl, FormLabel, Grid, useToast,
} from '@chakra-ui/react'
import { apiCall } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const inputStyles = {
  bg: 'stellar.bg',
  border: '1px solid',
  borderColor: 'stellar.border',
  borderRadius: '2px',
  color: 'stellar.text',
  fontSize: 'sm',
  _placeholder: { color: 'stellar.muted' },
  _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #C8963E' },
  _hover: { borderColor: 'brand.700' },
}
const labelStyles = {
  fontSize: 'xs' as const,
  fontFamily: 'mono',
  color: 'stellar.muted',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  mb: 1,
}

const STEPS = ['Your Details', 'Project Info', 'Confirm']

export default function ConsultationDrawer({ isOpen, onClose }: Props) {
  const { profile } = useAuth()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    location: '',
    service_type: '',
    project_type: '',
    budget_range: '',
    timeline: '',
    message: '',
  })

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.full_name || !form.email || !form.message) {
      toast({ title: 'Please fill required fields', status: 'warning', duration: 2500, position: 'top' })
      return
    }
    setLoading(true)
    try {
      await apiCall('/consultations/', {
        method: 'POST',
        body: JSON.stringify({ ...form, user_id: profile?.id || null }),
      })
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
      <DrawerContent bg="stellar.surface" borderLeft="1px solid" borderColor="stellar.border" maxW="520px">
        <Box h="2px" bgGradient="linear(to-r, brand.700, brand.400, brand.700)" />
        <DrawerCloseButton color="stellar.muted" mt={2} _hover={{ color: 'brand.400' }} />

        <DrawerBody p={0}>
          {submitted ? (
            <Box p={10} textAlign="center" pt={20}>
              <Box w="72px" h="72px" bg="rgba(200,150,62,0.1)" border="1px solid" borderColor="brand.600"
                display="flex" alignItems="center" justifyContent="center" mx="auto" mb={6}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C8963E" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </Box>
              <Text fontFamily="heading" fontSize="2xl" fontWeight="700" color="stellar.text" mb={3}>
                Request Received
              </Text>
              <Text fontSize="sm" color="stellar.muted" lineHeight="1.8" maxW="320px" mx="auto" mb={8}>
                Thank you, <strong>{form.full_name.split(' ')[0]}</strong>. Our team will review your request and reach out within 1 business day.
              </Text>
              <Text fontSize="xs" fontFamily="mono" color="brand.500" letterSpacing="0.15em" mb={6}>
                WHAT HAPPENS NEXT
              </Text>
              <VStack align="start" spacing={3} textAlign="left" maxW="320px" mx="auto">
                {[
                  'We review your project details',
                  'An engineer contacts you to schedule a call',
                  'You receive a detailed proposal within 5 days',
                ].map((s, i) => (
                  <HStack key={i} spacing={3}>
                    <Box w="24px" h="24px" bg="rgba(200,150,62,0.1)" border="1px solid" borderColor="brand.700"
                      flexShrink={0} display="flex" alignItems="center" justifyContent="center">
                      <Text fontFamily="mono" fontSize="xs" color="brand.500">{i + 1}</Text>
                    </Box>
                    <Text fontSize="sm" color="stellar.muted">{s}</Text>
                  </HStack>
                ))}
              </VStack>
              <Button variant="gold" mt={10} onClick={handleClose}>Close</Button>
            </Box>
          ) : (
            <Box p={8}>
              {/* Header */}
              <Text fontFamily="heading" fontSize="2xl" fontWeight="700" color="stellar.text" mb={1}>
                Schedule a Consultation
              </Text>
              <Text fontSize="sm" color="stellar.muted" mb={6}>
                Tell us about your project and we'll match you with the right engineer.
              </Text>

              {/* Step indicators */}
              <HStack spacing={0} mb={8}>
                {STEPS.map((label, i) => (
                  <Box key={label} flex={1} position="relative">
                    <Box h="2px" bg={i <= step ? 'brand.500' : 'stellar.border'} transition="background 0.3s" />
                    <Text fontSize="xs" fontFamily="mono" color={i <= step ? 'brand.400' : 'stellar.muted'}
                      letterSpacing="0.08em" mt={2} textTransform="uppercase">
                      {label}
                    </Text>
                  </Box>
                ))}
              </HStack>

              {/* Step 0 — Your Details */}
              {step === 0 && (
                <VStack spacing={4}>
                  <Grid templateColumns="1fr 1fr" gap={4} w="full">
                    <FormControl isRequired>
                      <FormLabel {...labelStyles}>Full Name</FormLabel>
                      <Input {...inputStyles} placeholder="John Doe" value={form.full_name} onChange={f('full_name')} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel {...labelStyles}>Email</FormLabel>
                      <Input {...inputStyles} type="email" placeholder="you@example.com" value={form.email} onChange={f('email')} />
                    </FormControl>
                  </Grid>
                  <Grid templateColumns="1fr 1fr" gap={4} w="full">
                    <FormControl>
                      <FormLabel {...labelStyles}>Phone</FormLabel>
                      <Input {...inputStyles} placeholder="+234 000 000 0000" value={form.phone} onChange={f('phone')} />
                    </FormControl>
                    <FormControl>
                      <FormLabel {...labelStyles}>Location</FormLabel>
                      <Input {...inputStyles} placeholder="Lagos, Nigeria" value={form.location} onChange={f('location')} />
                    </FormControl>
                  </Grid>
                  <Button variant="gold" w="full" mt={2} onClick={() => setStep(1)}
                    isDisabled={!form.full_name || !form.email}>
                    Continue →
                  </Button>
                </VStack>
              )}

              {/* Step 1 — Project Info */}
              {step === 1 && (
                <VStack spacing={4}>
                  <FormControl w="full">
                    <FormLabel {...labelStyles}>Service Needed</FormLabel>
                    <Select {...inputStyles} value={form.service_type} onChange={f('service_type')}
                      placeholder="Select a service">
                      <option>Feasibility Studies</option>
                      <option>Design & Engineering</option>
                      <option>Project Management</option>
                      <option>Construction Services</option>
                      <option>Advisory & Consulting</option>
                    </Select>
                  </FormControl>
                  <FormControl w="full">
                    <FormLabel {...labelStyles}>Project Type</FormLabel>
                    <Select {...inputStyles} value={form.project_type} onChange={f('project_type')}
                      placeholder="Select project type">
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
                      <Select {...inputStyles} value={form.budget_range} onChange={f('budget_range')}
                        placeholder="Select range">
                        <option>Under ₦5M</option>
                        <option>₦5M – ₦20M</option>
                        <option>₦20M – ₦100M</option>
                        <option>₦100M – ₦500M</option>
                        <option>Above ₦500M</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel {...labelStyles}>Timeline</FormLabel>
                      <Select {...inputStyles} value={form.timeline} onChange={f('timeline')}
                        placeholder="When to start?">
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
                    <Textarea {...inputStyles} rows={4} resize="none"
                      placeholder="Describe your project, goals, and any specific requirements..."
                      value={form.message} onChange={f('message')} />
                  </FormControl>
                  <HStack w="full" gap={3}>
                    <Button variant="ghost_light" flex={1} onClick={() => setStep(0)}>← Back</Button>
                    <Button variant="gold" flex={2} onClick={() => setStep(2)}
                      isDisabled={!form.message}>
                      Review →
                    </Button>
                  </HStack>
                </VStack>
              )}

              {/* Step 2 — Confirm */}
              {step === 2 && (
                <VStack spacing={0} align="stretch">
                  {[
                    { label: 'Name', value: form.full_name },
                    { label: 'Email', value: form.email },
                    { label: 'Phone', value: form.phone || '—' },
                    { label: 'Location', value: form.location || '—' },
                    { label: 'Service', value: form.service_type || '—' },
                    { label: 'Project Type', value: form.project_type || '—' },
                    { label: 'Budget', value: form.budget_range || '—' },
                    { label: 'Timeline', value: form.timeline || '—' },
                  ].map(row => (
                    <HStack key={row.label} py={3} borderBottom="1px solid" borderColor="stellar.border"
                      justify="space-between">
                      <Text fontSize="xs" fontFamily="mono" color="stellar.muted" letterSpacing="0.08em"
                        textTransform="uppercase">{row.label}</Text>
                      <Text fontSize="sm" color="stellar.text" fontWeight="500" textAlign="right" maxW="60%">
                        {row.value}
                      </Text>
                    </HStack>
                  ))}
                  <Box mt={4} p={4} bg="stellar.bg" border="1px solid" borderColor="stellar.border">
                    <Text fontSize="xs" fontFamily="mono" color="stellar.muted" letterSpacing="0.08em"
                      textTransform="uppercase" mb={2}>Message</Text>
                    <Text fontSize="sm" color="stellar.light" lineHeight="1.7">{form.message}</Text>
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
