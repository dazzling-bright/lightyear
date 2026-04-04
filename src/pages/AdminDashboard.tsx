import { useEffect, useState } from 'react'
import {
  Box, Grid, Text, VStack, HStack, Flex, Button,
  Badge, Spinner, Table, Thead, Tbody, Tr, Th, Td,
  Select, useToast,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { apiCall } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const MotionBox = motion(Box)

interface Summary {
  total_projects: number; in_progress: number; completed: number
  pending_consultations: number; total_clients: number; total_revenue: number
}
interface Consultation {
  id: string; full_name: string; email: string; service_type: string
  project_type: string; budget_range: string; status: string; created_at: string; message: string
}
interface Project {
  id: string; title: string; status: string; progress_percent: number
  type: string; location: string; profiles: { full_name: string; email: string }
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'yellow', reviewed: 'blue', contacted: 'purple',
  converted: 'green', closed: 'gray',
  in_progress: 'green', planning: 'blue', completed: 'teal', cancelled: 'red', on_hold: 'orange',
}

export default function AdminDashboard() {
  const { profile } = useAuth()
  const toast = useToast()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'projects'>('overview')

  useEffect(() => {
    const load = async () => {
      try {
        const [s, c, p] = await Promise.all([
          apiCall<Summary>('/projects/admin/summary'),
          apiCall<Consultation[]>('/consultations/'),
          apiCall<Project[]>('/projects/'),
        ])
        setSummary(s); setConsultations(c); setProjects(p)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const updateConsultationStatus = async (id: string, status: string) => {
    try {
      await apiCall(`/consultations/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, status } : c))
      toast({ title: 'Status updated', status: 'success', duration: 2000, position: 'top' })
    } catch (e: any) {
      toast({ title: 'Update failed', description: e.message, status: 'error', duration: 3000, position: 'top' })
    }
  }

  if (loading) return (
    <Flex h="60vh" align="center" justify="center">
      <VStack><Spinner size="lg" color="brand.500" thickness="2px" />
        <Text fontSize="sm" color="stellar.muted" fontFamily="mono">Loading admin panel...</Text>
      </VStack>
    </Flex>
  )

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'consultations', label: `Consultations (${consultations.filter(c => c.status === 'pending').length})` },
    { id: 'projects', label: `Projects (${projects.length})` },
  ] as const

  return (
    <Box maxW="1280px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      {/* Header */}
      <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} mb={8}>
        <HStack mb={2}><Box h="1px" w="30px" bg="brand.500" />
          <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
            Admin Panel
          </Text>
        </HStack>
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Box>
            <Text fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800" color="stellar.text">
              Admin Dashboard
            </Text>
            <Text fontSize="sm" color="stellar.muted">Welcome, {profile?.full_name}</Text>
          </Box>
        </Flex>
      </MotionBox>

      {/* Summary stats */}
      {summary && (
        <Grid templateColumns={{ base: 'repeat(2,1fr)', md: 'repeat(3,1fr)', lg: 'repeat(6,1fr)' }} gap={4} mb={8}>
          {[
            { label: 'Total Projects', value: summary.total_projects, color: 'brand.400' },
            { label: 'In Progress', value: summary.in_progress, color: 'green.400' },
            { label: 'Completed', value: summary.completed, color: 'teal.400' },
            { label: 'Pending Enquiries', value: summary.pending_consultations, color: 'yellow.400' },
            { label: 'Clients', value: summary.total_clients, color: 'blue.400' },
            { label: 'Revenue (₦)', value: (summary.total_revenue / 1_000_000).toFixed(1) + 'M', color: 'purple.400' },
          ].map((s, i) => (
            <MotionBox key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}>
              <Box p={4} border="1px solid" borderColor="stellar.border" bg="stellar.card"
                borderTop="2px solid" borderTopColor={s.color}>
                <Text fontFamily="heading" fontSize="2xl" fontWeight="900" color={s.color} lineHeight="1">
                  {s.value}
                </Text>
                <Text fontSize="xs" fontFamily="mono" color="stellar.muted" letterSpacing="0.06em"
                  textTransform="uppercase" mt={1}>{s.label}</Text>
              </Box>
            </MotionBox>
          ))}
        </Grid>
      )}

      {/* Tabs */}
      <HStack spacing={0} mb={6} borderBottom="1px solid" borderColor="stellar.border">
        {TABS.map(t => (
          <Button key={t.id} variant="unstyled" px={6} py={3}
            fontSize="sm" fontWeight="600" letterSpacing="0.05em"
            color={activeTab === t.id ? 'brand.400' : 'stellar.muted'}
            borderBottom="2px solid"
            borderColor={activeTab === t.id ? 'brand.500' : 'transparent'}
            borderRadius={0}
            onClick={() => setActiveTab(t.id)}>
            {t.label}
          </Button>
        ))}
      </HStack>

      {/* Overview */}
      {activeTab === 'overview' && (
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          {/* Recent consultations */}
          <Box border="1px solid" borderColor="stellar.border" bg="stellar.card">
            <Box p={4} borderBottom="1px solid" borderColor="stellar.border">
              <Text fontFamily="heading" fontSize="lg" fontWeight="700" color="stellar.text">
                Recent Enquiries
              </Text>
            </Box>
            <VStack spacing={0} align="stretch" maxH="400px" overflowY="auto">
              {consultations.slice(0, 6).map((c, i) => (
                <Box key={c.id} p={4} borderBottom={i < 5 ? '1px solid' : 'none'}
                  borderColor="stellar.border" transition="bg 0.2s" _hover={{ bg: 'stellar.surface' }}>
                  <Flex justify="space-between" align="start">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="stellar.text">{c.full_name}</Text>
                      <Text fontSize="xs" color="stellar.muted">{c.email}</Text>
                      <Text fontSize="xs" color="stellar.muted" mt={1}>{c.service_type || 'General Enquiry'}</Text>
                    </Box>
                    <Badge colorScheme={STATUS_COLOR[c.status] || 'gray'} fontSize="xs"
                      textTransform="uppercase" letterSpacing="0.06em" borderRadius="2px">
                      {c.status}
                    </Badge>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Active projects */}
          <Box border="1px solid" borderColor="stellar.border" bg="stellar.card">
            <Box p={4} borderBottom="1px solid" borderColor="stellar.border">
              <Text fontFamily="heading" fontSize="lg" fontWeight="700" color="stellar.text">
                Active Projects
              </Text>
            </Box>
            <VStack spacing={0} align="stretch" maxH="400px" overflowY="auto">
              {projects.filter(p => p.status !== 'completed' && p.status !== 'cancelled').slice(0, 6).map((p, i) => (
                <Box key={p.id} p={4} borderBottom="1px solid" borderColor="stellar.border"
                  transition="bg 0.2s" _hover={{ bg: 'stellar.surface' }}>
                  <Flex justify="space-between" align="center">
                    <Box flex={1}>
                      <Text fontSize="sm" fontWeight="600" color="stellar.text">{p.title}</Text>
                      <Text fontSize="xs" color="stellar.muted">
                        {(p.profiles as any)?.full_name || 'No client'} · {p.location || 'TBD'}
                      </Text>
                      <HStack mt={2} spacing={2}>
                        <Box flex={1} h="4px" bg="stellar.border" borderRadius="2px" overflow="hidden">
                          <Box h="full" w={`${p.progress_percent}%`}
                            bgGradient="linear(to-r, brand.700, brand.400)" borderRadius="2px" />
                        </Box>
                        <Text fontSize="xs" fontFamily="mono" color="brand.400">{p.progress_percent}%</Text>
                      </HStack>
                    </Box>
                    <Badge ml={3} colorScheme={STATUS_COLOR[p.status] || 'gray'} fontSize="xs"
                      textTransform="uppercase" borderRadius="2px">
                      {p.status.replace('_', ' ')}
                    </Badge>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        </Grid>
      )}

      {/* Consultations tab */}
      {activeTab === 'consultations' && (
        <Box border="1px solid" borderColor="stellar.border" bg="stellar.card" overflowX="auto">
          <Table size="sm">
            <Thead>
              <Tr borderBottom="1px solid" borderColor="stellar.border">
                {['Name', 'Email', 'Service', 'Budget', 'Status', 'Date', 'Action'].map(h => (
                  <Th key={h} py={3} px={4} fontSize="xs" fontFamily="mono" color="stellar.muted"
                    letterSpacing="0.1em" textTransform="uppercase" borderColor="stellar.border">
                    {h}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {consultations.map(c => (
                <Tr key={c.id} _hover={{ bg: 'stellar.surface' }} transition="background 0.2s">
                  <Td py={3} px={4} borderColor="stellar.border">
                    <Text fontSize="sm" color="stellar.text" fontWeight="500">{c.full_name}</Text>
                  </Td>
                  <Td py={3} px={4} borderColor="stellar.border">
                    <Text fontSize="xs" color="stellar.muted">{c.email}</Text>
                  </Td>
                  <Td py={3} px={4} borderColor="stellar.border">
                    <Text fontSize="xs" color="stellar.muted">{c.service_type || '—'}</Text>
                  </Td>
                  <Td py={3} px={4} borderColor="stellar.border">
                    <Text fontSize="xs" color="stellar.muted">{c.budget_range || '—'}</Text>
                  </Td>
                  <Td py={3} px={4} borderColor="stellar.border">
                    <Badge colorScheme={STATUS_COLOR[c.status] || 'gray'} fontSize="xs" borderRadius="2px"
                      textTransform="uppercase">{c.status}</Badge>
                  </Td>
                  <Td py={3} px={4} borderColor="stellar.border">
                    <Text fontSize="xs" color="stellar.muted">
                      {new Date(c.created_at).toLocaleDateString('en-NG')}
                    </Text>
                  </Td>
                  <Td py={3} px={4} borderColor="stellar.border">
                    <Select size="xs" value={c.status} onChange={e => updateConsultationStatus(c.id, e.target.value)}
                      bg="stellar.bg" borderColor="stellar.border" color="stellar.text"
                      fontSize="xs" borderRadius="2px" w="110px">
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
                    </Select>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Projects tab */}
      {activeTab === 'projects' && (
        <Box border="1px solid" borderColor="stellar.border" bg="stellar.card" overflowX="auto">
          <Table size="sm">
            <Thead>
              <Tr borderBottom="1px solid" borderColor="stellar.border">
                {['Project', 'Client', 'Type', 'Progress', 'Status', 'Action'].map(h => (
                  <Th key={h} py={3} px={4} fontSize="xs" fontFamily="mono" color="stellar.muted"
                    letterSpacing="0.1em" textTransform="uppercase" borderColor="stellar.border">{h}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {projects.map(p => (
                <Tr key={p.id} _hover={{ bg: 'stellar.surface' }} transition="background 0.2s">
                  <Td py={3} px={4} borderColor="stellar.border">
                    <Text fontSize="sm" fontWeight="600" color="stellar.text">{p.title}</Text>
                    <Text fontSize="xs" color="stellar.muted">{p.location || 'TBD'}</Text>
                  </Td>
                  <Td py={3} px={4} borderColor="stellar.border">
                    <Text fontSize="xs" color="stellar.muted">{(p.profiles as any)?.full_name || '—'}</Text>
                  </Td>
                  <Td py={3} px={4} borderColor="stellar.border">
                    <Text fontSize="xs" color="stellar.muted" textTransform="capitalize">{p.type}</Text>
                  </Td>
                  <Td py={3} px={4} borderColor="stellar.border" minW="120px">
                    <HStack spacing={2}>
                      <Box flex={1} h="4px" bg="stellar.border" borderRadius="2px" overflow="hidden">
                        <Box h="full" w={`${p.progress_percent}%`}
                          bgGradient="linear(to-r, brand.700, brand.400)" />
                      </Box>
                      <Text fontSize="xs" fontFamily="mono" color="brand.400">{p.progress_percent}%</Text>
                    </HStack>
                  </Td>
                  <Td py={3} px={4} borderColor="stellar.border">
                    <Badge colorScheme={STATUS_COLOR[p.status] || 'gray'} fontSize="xs"
                      textTransform="uppercase" borderRadius="2px">
                      {p.status.replace('_', ' ')}
                    </Badge>
                  </Td>
                  <Td py={3} px={4} borderColor="stellar.border">
                    <Button as={Link} to={`/dashboard/project/${p.id}`}
                      variant="outline_gold" size="xs">View</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  )
}
