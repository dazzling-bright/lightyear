import { Box, Text, VStack, HStack, Flex, Button } from '@chakra-ui/react'
import { useRef } from 'react'

interface CertificateProps {
  recipientName:  string
  programme:      string   // e.g. "Construction Management Internship"
  period:         string   // e.g. "June – August 2025"
  issueDate:      string
  supervisorName: string
  supervisorRole: string
  certificateId:  string
}

export default function Certificate({
  recipientName, programme, period, issueDate,
  supervisorName, supervisorRole, certificateId,
}: CertificateProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const el = ref.current
    if (!el) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>Certificate — ${recipientName}</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        body { margin:0; background:#f1f5f9; display:flex; justify-content:center; align-items:center; min-height:100vh; }
        @media print { body { background:white; } @page { size: A4 landscape; margin:0; } }
      </style></head>
      <body>${el.outerHTML}</body></html>
    `)
    win.document.close()
    setTimeout(() => { win.print(); win.close() }, 500)
  }

  return (
    <Box>
      {/* Certificate canvas */}
      <Box ref={ref}
        w="794px" minH="560px"
        bg="white"
        position="relative"
        overflow="hidden"
        border="2px solid #C8963E"
        boxShadow="0 20px 60px rgba(0,0,0,0.3)"
        sx={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Corner ornaments */}
        {['top left', 'top right', 'bottom left', 'bottom right'].map(pos => {
          const [v, h] = pos.split(' ')
          return (
            <Box key={pos} position="absolute"
              top={v === 'top' ? '8px' : undefined}
              bottom={v === 'bottom' ? '8px' : undefined}
              left={h === 'left' ? '8px' : undefined}
              right={h === 'right' ? '8px' : undefined}
              w="60px" h="60px"
              border="2px solid"
              borderColor="brand.500"
              opacity={0.5}
              sx={{
                borderTopWidth:    v === 'bottom' ? 0 : '2px',
                borderBottomWidth: v === 'top'    ? 0 : '2px',
                borderLeftWidth:   h === 'right'  ? 0 : '2px',
                borderRightWidth:  h === 'left'   ? 0 : '2px',
              }}
            />
          )
        })}

        {/* Dark header band */}
        <Box bg="#0F1929" px={10} py={6}>
          <Flex align="center" justify="space-between">
            <HStack spacing={3}>
              <Box w="28px" h="28px" bg="brand.500" transform="rotate(45deg)" borderRadius="2px" flexShrink={0} />
              <Box>
                <Text fontFamily="'Playfair Display', serif" fontWeight="700" fontSize="lg" color="white" lineHeight="1.1">
                  Lightyear Stellar Solutions
                </Text>
                <Text fontFamily="mono" fontSize="8px" color="brand.400" letterSpacing="0.2em" textTransform="uppercase">
                  Engineering & Construction Excellence
                </Text>
              </Box>
            </HStack>
            <Text fontFamily="mono" fontSize="10px" color="#8899AA" letterSpacing="0.1em">
              CERT/{certificateId}
            </Text>
          </Flex>
        </Box>

        {/* Gold accent */}
        <Box h="3px" bgGradient="linear(to-r, transparent, brand.500, transparent)" />

        {/* Body */}
        <VStack spacing={0} px={12} py={8} align="center" textAlign="center">
          <Text fontFamily="mono" fontSize="10px" color="brand.500" letterSpacing="0.3em"
            textTransform="uppercase" mb={3}>
            Certificate of Completion
          </Text>

          <Text fontFamily="'Playfair Display', serif" fontSize="13px" color="#475569" mb={1}>
            This is to certify that
          </Text>

          <Text fontFamily="'Playfair Display', serif" fontSize="36px" fontWeight="800"
            color="#0F1929" lineHeight="1.15" mb={1}>
            {recipientName}
          </Text>

          <Box h="2px" w="180px" bgGradient="linear(to-r, transparent, brand.500, transparent)" my={3} />

          <Text fontSize="14px" color="#475569" mb={1}>
            has successfully completed the programme
          </Text>

          <Text fontFamily="'Playfair Display', serif" fontSize="22px" fontWeight="700"
            color="#0F1929" mb={1}>
            {programme}
          </Text>

          <Text fontSize="13px" color="#64748B" mb={6}>
            {period}
          </Text>

          {/* Attributes grid */}
          <HStack spacing={10} mb={8}>
            {[
              { label: 'Integrity',     icon: '⚖️' },
              { label: 'Innovation',    icon: '💡' },
              { label: 'Excellence',    icon: '🏆' },
              { label: 'Safety',        icon: '🛡️' },
            ].map(a => (
              <VStack key={a.label} spacing={1}>
                <Text fontSize="18px">{a.icon}</Text>
                <Text fontSize="10px" fontFamily="mono" letterSpacing="0.1em"
                  textTransform="uppercase" color="#94A3B8">{a.label}</Text>
              </VStack>
            ))}
          </HStack>

          {/* Signature row */}
          <HStack spacing={20} w="full" justify="center" pt={4}
            borderTop="1px solid" borderColor="#E2E8F0">
            <VStack spacing={0}>
              <Box h="1px" w="140px" bg="#C8963E" mb={2} />
              <Text fontSize="13px" fontWeight="700" color="#0F1929">{supervisorName}</Text>
              <Text fontSize="11px" color="#64748B">{supervisorRole}</Text>
              <Text fontSize="11px" color="#94A3B8" fontFamily="mono">{issueDate}</Text>
            </VStack>
            <VStack spacing={0}>
              {/* Official seal placeholder */}
              <Box w="70px" h="70px" border="2px solid" borderColor="brand.500" borderRadius="50%"
                display="flex" alignItems="center" justifyContent="center" opacity={0.6}>
                <VStack spacing={0}>
                  <Text fontFamily="'Playfair Display',serif" fontSize="8px" fontWeight="700"
                    color="#C8963E" textAlign="center" lineHeight="1.2">LIGHTYEAR<br/>STELLAR</Text>
                  <Text fontSize="7px" color="#C8963E">★ OFFICIAL ★</Text>
                </VStack>
              </Box>
            </VStack>
          </HStack>
        </VStack>
      </Box>

      {/* Print button */}
      <Flex justify="center" mt={5}>
        <Button variant="gold" size="sm" px={8} onClick={handlePrint}>
          🖨️ Print / Download PDF
        </Button>
      </Flex>
    </Box>
  )
}
