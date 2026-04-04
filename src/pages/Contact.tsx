import { useState, useRef } from 'react'
import {
  Box, Grid, GridItem, Text, VStack, HStack,
  Input, Textarea, Select, Button, FormControl, FormLabel,
} from '@chakra-ui/react'
import { motion, useInView } from 'framer-motion'

const MotionBox = motion(Box)

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const inputStyles = {
  bg: 'stellar.bg',
  border: '1px solid',
  borderColor: 'stellar.border',
  borderRadius: '2px',
  color: 'stellar.text',
  fontSize: 'sm',
  fontFamily: 'body',
  _placeholder: { color: 'stellar.muted', fontSize: 'sm' },
  _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-600)', bg: 'stellar.surface' },
  _hover: { borderColor: 'brand.700' },
  transition: 'all 0.2s',
}

const labelStyles = {
  fontSize: 'xs',
  fontFamily: 'mono',
  color: 'stellar.muted',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  mb: 2,
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const formRef = useRef(null)
  const formInView = useInView(formRef, { once: true })
  const infoRef = useRef(null)
  const infoInView = useInView(infoRef, { once: true })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <Box py={{ base: 24, md: 32 }} bg="stellar.bg" position="relative" overflow="hidden"
        borderBottom="1px solid" borderColor="stellar.border">
        <Box position="absolute" inset={0}
          bgImage="url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070')"
          bgSize="cover" bgPos="center" opacity={0.05} />
        <Box position="absolute" inset={0} bgGradient="linear(to-b, rgba(8,12,20,0.98), rgba(8,12,20,0.88))" />
        <Box position="absolute" bottom={0} left={0} right={0} h="1px"
          bgGradient="linear(to-r, transparent, brand.500, transparent)" opacity={0.5} />
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }} position="relative" zIndex={1}>
          <HStack spacing={4} mb={5}>
            <Box h="1px" w="40px" bg="brand.500" />
            <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
              Reach Out
            </Text>
          </HStack>
          <Text as="h1" fontFamily="heading" fontWeight="900"
            fontSize={{ base: '4xl', md: '6xl' }} color="stellar.text" lineHeight="1.1" maxW="700px">
            Start a <Box as="span" color="brand.400">Conversation</Box>
          </Text>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="stellar.muted" mt={5} maxW="540px" lineHeight="1.8">
            Whether you have a project in mind or simply want to learn more about our services, our team is ready to engage.
          </Text>
        </Box>
      </Box>

      {/* Main content */}
      <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.surface">
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1.6fr' }} gap={12} alignItems="start">
            {/* Contact info */}
            <MotionBox ref={infoRef} initial={{ opacity: 0, x: -30 }}
              animate={infoInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
              <Box h="1px" w="40px" bg="brand.500" mb={5} />
              <Text fontFamily="heading" fontWeight="800" fontSize={{ base: '2xl', md: '3xl' }}
                color="stellar.text" mb={6} lineHeight="1.2">
                Get In <Box as="span" color="brand.400">Touch</Box>
              </Text>
              <Text fontSize="sm" color="stellar.muted" lineHeight="1.9" mb={10}>
                We'd love to hear about your project. Reach out through any of the channels below, or fill out the form and we'll get back to you within one business day.
              </Text>

              <VStack align="start" spacing={6} mb={10}>
                {[
                  { icon: <MapPinIcon />, label: 'Head Office', value: '179A, Maccido Royal Estate,\nGaladimawa, Abuja, Nigeria' },
                  { icon: <PhoneIcon />, label: 'Phone', value: '+234 803 885 0854\n+234 803 639 7972' },
                  { icon: <MailIcon />, label: 'Email', value: 'info@lightyear.ng' },
                  { icon: <ClockIcon />, label: 'Business Hours', value: 'Monday – Friday\n8:00 AM – 6:00 PM WAT' },
                ].map(item => (
                  <HStack key={item.label} spacing={4} align="start">
                    <Box
                      w="44px" h="44px" bg="rgba(200,150,62,0.08)"
                      border="1px solid" borderColor="rgba(200,150,62,0.15)"
                      display="flex" alignItems="center" justifyContent="center"
                      color="brand.500" flexShrink={0}
                    >{item.icon}</Box>
                    <Box>
                      <Text fontFamily="mono" fontSize="xs" color="brand.600"
                        letterSpacing="0.12em" textTransform="uppercase" mb={1}>{item.label}</Text>
                      <Text fontSize="sm" color="stellar.text" fontWeight="500"
                        whiteSpace="pre-line" lineHeight="1.7">{item.value}</Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>

              {/* Emergency hotline box */}
              <Box p={5} border="1px solid" borderColor="rgba(200,150,62,0.3)"
                bg="rgba(200,150,62,0.05)" position="relative">
                <Box position="absolute" top={0} left={0} right={0} h="2px"
                  bgGradient="linear(to-r, brand.700, brand.400)" />
                <Text fontFamily="mono" fontSize="xs" color="brand.500"
                  letterSpacing="0.15em" textTransform="uppercase" mb={2}>
                  Emergency Hotline
                </Text>
                <Text fontFamily="heading" fontSize="2xl" fontWeight="700" color="stellar.text">
                  +234 803 885 0854
                </Text>
                <Text fontSize="xs" color="stellar.muted" mt={1}>Available for urgent site inquiries</Text>
              </Box>
            </MotionBox>

            {/* Form */}
            <MotionBox ref={formRef} initial={{ opacity: 0, x: 30 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }}>
              <Box
                p={{ base: 8, md: 12 }}
                border="1px solid" borderColor="stellar.border"
                bg="stellar.card"
                position="relative"
              >
                <Box position="absolute" top={0} left={0} right={0} h="2px"
                  bgGradient="linear(to-r, brand.700, brand.400, brand.700)" />

                {submitted ? (
                  <Box textAlign="center" py={12}>
                    <Box
                      w="64px" h="64px" bg="rgba(200,150,62,0.1)"
                      border="1px solid" borderColor="brand.500"
                      display="flex" alignItems="center" justifyContent="center"
                      mx="auto" mb={6}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8963E" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </Box>
                    <Text fontFamily="heading" fontSize="2xl" fontWeight="700" color="stellar.text" mb={3}>
                      Message Received
                    </Text>
                    <Text fontSize="sm" color="stellar.muted" lineHeight="1.8" maxW="360px" mx="auto">
                      Thank you for reaching out. A member of our team will be in touch within one business day.
                    </Text>
                    <Button mt={8} variant="outline_gold" size="sm" onClick={() => setSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </Box>
                ) : (
                  <Box as="form" onSubmit={handleSubmit}>
                    <Text fontFamily="heading" fontSize="2xl" fontWeight="700" color="stellar.text" mb={8}>
                      Send a Message
                    </Text>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2,1fr)' }} gap={5} mb={5}>
                      <FormControl isRequired>
                        <FormLabel {...labelStyles}>Full Name</FormLabel>
                        <Input {...inputStyles} placeholder="John Doe"
                          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel {...labelStyles}>Email Address</FormLabel>
                        <Input {...inputStyles} type="email" placeholder="john@example.com"
                          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                      </FormControl>
                    </Grid>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2,1fr)' }} gap={5} mb={5}>
                      <FormControl>
                        <FormLabel {...labelStyles}>Phone Number</FormLabel>
                        <Input {...inputStyles} placeholder="+234 000 000 0000"
                          value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                      </FormControl>
                      <FormControl>
                        <FormLabel {...labelStyles}>Service of Interest</FormLabel>
                        <Select {...inputStyles} placeholder="Select a service"
                          value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                          <option value="feasibility">Feasibility Studies</option>
                          <option value="design">Design & Engineering</option>
                          <option value="management">Project Management</option>
                          <option value="construction">Construction Services</option>
                          <option value="advisory">Advisory & Consulting</option>
                        </Select>
                      </FormControl>
                    </Grid>
                    <FormControl isRequired mb={8}>
                      <FormLabel {...labelStyles}>Project Details</FormLabel>
                      <Textarea
                        {...inputStyles}
                        placeholder="Briefly describe your project or inquiry..."
                        rows={6}
                        resize="vertical"
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                      />
                    </FormControl>
                    <Button type="submit" variant="gold" w="full" size="lg" py={7}>
                      Submit Enquiry →
                    </Button>
                    <Text fontSize="xs" color="stellar.muted" mt={4} textAlign="center" letterSpacing="0.03em">
                      We respond within 1 business day. All enquiries are handled with strict confidentiality.
                    </Text>
                  </Box>
                )}
              </Box>
            </MotionBox>
          </Grid>
        </Box>
      </Box>
    </>
  )
}
