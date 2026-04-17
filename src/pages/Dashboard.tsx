import { useEffect, useState } from 'react'
import {
  Box, Grid, Text, VStack, HStack, Button,
  Flex, Badge, Spinner, Progress,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiCall } from '../lib/supabase'

const MotionBox = motion(Box)

interface Project {
  id: string; title: string; type: string; status: string
  progress_percent: number; location: string; budget: number
  amount_paid: number; start_date: string; estimated_end_date: string
}
interface Update {
  id: string; title: string; content: string
  update_type: string; is_read: boolean; created_at: string
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'yellow', planning: 'blue', in_progress: 'green',
  on_hold: 'orange', review: 'purple', completed: 'teal', cancelled: 'red',
}

function ProjectCard({ project, updates }: { project: Project; updates: Update[] }) {
  const unread = updates.filter(u => !u.is_read).length
  const paid_pct = project.budget
    ? Math.round((project.amount_paid / project.budget) * 100) : 0

  return (
    <Box p={6} border="1px solid" borderColor="stellar.border" bg="stellar.card"
      role="group" transition="all 0.3s" position="relative" overflow="hidden"
      _hover={{ borderColor: 'brand.700', boxShadow: '0 16px 50px rgba(0,0,0,0.4)' }}>
      <Box position="absolute" top={0} left={0} right={0} h="2px"
        bgGradient="linear(to-r, brand.700, brand.400)" />

      <Flex justify="space-between" align="start" mb={3}>
        <Box flex={1}>
          <Text fontFamily="heading" fontSize="lg" fontWeight="700" color="stellar.text" lineHeight="1.3">
            {project.title}
          </Text>
          <Text fontSize="xs" color="stellar.muted" mt={0.5}>{project.location || 'Location TBD'}</Text>
        </Box>
        <VStack spacing={1} align="end" ml={3}>
          <Badge colorScheme={STATUS_COLOR[project.status] || 'gray'} fontSize="xs"
            textTransform="uppercase" letterSpacing="0.08em" px={2} borderRadius="2px">
            {project.status.replace('_', ' ')}
          </Badge>
          {unread > 0 && (
            <Badge bg="brand.500" color="white" fontSize="xs" borderRadius="2px" px={2}>
              {unread} new
            </Badge>
          )}
        </VStack>
      </Flex>

      <Box mb={4}>
        <Flex justify="space-between" mb={1}>
          <Text fontSize="xs" fontFamily="mono" color="stellar.muted" letterSpacing="0.08em" textTransform="uppercase">
            Progress
          </Text>
          <Text fontSize="xs" fontFamily="mono" color="brand.400" fontWeight="700">
            {project.progress_percent}%
          </Text>
        </Flex>
        <Progress value={project.progress_percent} size="sm" bg="stellar.border"
          sx={{ '& > div': { background: 'linear-gradient(to right, #875C22, #C8963E)' } }} />
      </Box>

      <Box mb={4} p={3} bg="stellar.bg" border="1px solid" borderColor="stellar.border">
        <Flex justify="space-between" mb={1}>
          <Text fontSize="xs" color="stellar.muted">Budget</Text>
          <Text fontSize="xs" fontFamily="mono" color="brand.400">{paid_pct}% paid</Text>
        </Flex>
        <Flex justify="space-between">
          <Text fontSize="sm" color="stellar.text" fontWeight="600">
            ₦{(project.amount_paid || 0).toLocaleString()}
          </Text>
          <Text fontSize="xs" color="stellar.muted">of ₦{(project.budget || 0).toLocaleString()}</Text>
        </Flex>
        <Progress value={paid_pct} size="xs" mt={2} bg="stellar.border"
          sx={{ '& > div': { background: 'linear-gradient(to right, #3B6FD4, #60A5FA)' } }} />
      </Box>

      <HStack justify="space-between" fontSize="xs" color="stellar.muted" mb={5}>
        <Box>
          <Text fontFamily="mono" letterSpacing="0.06em" textTransform="uppercase">Started</Text>
          <Text color="stellar.light">
            {project.start_date
              ? new Date(project.start_date).toLocaleDateString('en-NG') : '—'}
          </Text>
        </Box>
        <Box textAlign="right">
          <Text fontFamily="mono" letterSpacing="0.06em" textTransform="uppercase">Est. End</Text>
          <Text color="stellar.light">
            {project.estimated_end_date
              ? new Date(project.estimated_end_date).toLocaleDateString('en-NG') : '—'}
          </Text>
        </Box>
      </HStack>

      <Button as={Link} to={`/dashboard/project/${project.id}`}
        variant="outline_gold" w="full" size="sm">
        View Full Project →
      </Button>
    </Box>
  )
}

export default function Dashboard() {
  const { profile } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [allUpdates, setAllUpdates] = useState<Record<string, Update[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const ps = await apiCall<Project[]>('/projects/')
        setProjects(ps)
        const updMap: Record<string, Update[]> = {}
        await Promise.all(ps.map(async p => {
          const us = await apiCall<Update[]>(`/projects/${p.id}/updates`)
          updMap[p.id] = us
        }))
        setAllUpdates(updMap)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalUnread = Object.values(allUpdates).flat().filter(u => !u.is_read).length
  const activeProjects = projects.filter(p =>
    ['in_progress', 'planning', 'review'].includes(p.status))
  const recentUpdates = Object.values(allUpdates)
    .flat()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <Flex h="60vh" align="center" justify="center">
        <VStack spacing={3}>
          <Spinner size="lg" color="brand.500" thickness="2px" />
          <Text fontSize="sm" color="stellar.muted" fontFamily="mono" letterSpacing="0.1em">
            Loading your dashboard...
          </Text>
        </VStack>
      </Flex>
    )
  }

  const quickLinks = [
    { label: '🧮 Material Calculators', href: '/dashboard/calculators' },
    { label: '🎥 How-To Videos', href: '/dashboard/resources' },
    { label: '⚙️ Engineer Calculations', href: '/dashboard/engineer-calcs' },
    { label: '📞 Contact Your Engineer', href: '/contact' },
  ]

  return (
    <Box maxW="1280px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      {/* Header */}
      <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} mb={8}>
        <HStack spacing={4} mb={2}>
          <Box h="1px" w="30px" bg="brand.500" />
          <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
            My Dashboard
          </Text>
        </HStack>
        <Flex justify="space-between" align="start" flexWrap="wrap" gap={4}>
          <Box>
            <Text fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800" color="stellar.text">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'there'} 👋
            </Text>
            <Text fontSize="sm" color="stellar.muted" mt={1}>
              {new Date().toLocaleDateString('en-NG', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </Text>
          </Box>
          {totalUnread > 0 && (
            <Box px={4} py={2} bg="rgba(200,150,62,0.1)" border="1px solid" borderColor="brand.700">
              <Text fontSize="sm" color="brand.400">
                📬 You have <strong>{totalUnread}</strong> unread update{totalUnread > 1 ? 's' : ''}
              </Text>
            </Box>
          )}
        </Flex>
      </MotionBox>

      {/* Stats row */}
      <Grid templateColumns={{ base: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }} gap={4} mb={8}>
        {[
          { label: 'Total Projects', value: projects.length, color: 'brand.400' },
          { label: 'Active', value: activeProjects.length, color: 'green.400' },
          { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: 'teal.400' },
          { label: 'New Updates', value: totalUnread, color: 'orange.400' },
        ].map((s, i) => (
          <MotionBox key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}>
            <Box p={5} border="1px solid" borderColor="stellar.border" bg="stellar.card"
              borderTop="2px solid" borderTopColor={s.color}>
              <Text fontFamily="heading" fontSize="3xl" fontWeight="900" color={s.color} lineHeight="1">
                {s.value}
              </Text>
              <Text fontSize="xs" fontFamily="mono" color="stellar.muted" letterSpacing="0.08em"
                textTransform="uppercase" mt={1}>{s.label}</Text>
            </Box>
          </MotionBox>
        ))}
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        {/* Projects list */}
        <Box>
          <Text fontFamily="heading" fontSize="xl" fontWeight="700" color="stellar.text" mb={5}>
            Your Projects
          </Text>
          {projects.length === 0 ? (
            <Box p={10} textAlign="center" border="1px dashed" borderColor="stellar.border" bg="stellar.card">
              <Text fontSize="3xl" mb={3}>🏗️</Text>
              <Text fontFamily="heading" fontSize="lg" color="stellar.text" mb={2}>No projects yet</Text>
              <Text fontSize="sm" color="stellar.muted" mb={5}>
                Once we start working together, your projects will appear here.
              </Text>
              <Button as={Link} to="/contact" variant="gold" size="sm">Start a Project</Button>
            </Box>
          ) : (
            <VStack spacing={4} align="stretch">
              {projects.map((p, i) => (
                <MotionBox key={p.id} initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                  <ProjectCard project={p} updates={allUpdates[p.id] || []} />
                </MotionBox>
              ))}
            </VStack>
          )}
        </Box>

        {/* Sidebar */}
        <VStack spacing={5} align="stretch">
          {/* Recent updates */}
          <Box>
            <Text fontFamily="heading" fontSize="xl" fontWeight="700" color="stellar.text" mb={4}>
              Recent Updates
            </Text>
            {recentUpdates.length === 0 ? (
              <Box p={6} textAlign="center" border="1px dashed" borderColor="stellar.border" bg="stellar.card">
                <Text fontSize="sm" color="stellar.muted">No updates yet</Text>
              </Box>
            ) : (
              <VStack spacing={0} align="stretch" border="1px solid" borderColor="stellar.border" bg="stellar.card">
                {recentUpdates.map((u, i) => (
                  <Box key={u.id} p={4}
                    borderBottom={i < recentUpdates.length - 1 ? '1px solid' : 'none'}
                    borderColor="stellar.border"
                    bg={!u.is_read ? 'rgba(200,150,62,0.04)' : 'transparent'}>
                    <Flex justify="space-between" align="start" mb={1}>
                      <Text fontSize="sm" fontWeight="600"
                        color={!u.is_read ? 'stellar.text' : 'stellar.light'}
                        lineHeight="1.4" flex={1} pr={2}>
                        {u.title}
                      </Text>
                      {!u.is_read && (
                        <Box w="8px" h="8px" bg="brand.400" borderRadius="50%" flexShrink={0} mt={1} />
                      )}
                    </Flex>
                    <Text fontSize="xs" color="stellar.muted" lineHeight="1.6" noOfLines={2}>
                      {u.content.replace(/\*\*/g, '')}
                    </Text>
                    <Text fontSize="xs" fontFamily="mono" color="stellar.muted" mt={2}>
                      {new Date(u.created_at).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </Text>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>

          {/* Quick links */}
          <Box p={5} border="1px solid" borderColor="stellar.border" bg="stellar.card">
            <Text fontSize="xs" fontFamily="mono" color="brand.500" letterSpacing="0.2em"
              textTransform="uppercase" mb={4}>Quick Links</Text>
            <VStack spacing={2} align="stretch">
              {quickLinks.map(link => (
                <Button key={link.label} as={Link} to={link.href}
                  variant="ghost" justifyContent="flex-start"
                  px={3} py={2.5} h="auto" fontSize="sm" color="stellar.muted" fontWeight="400"
                  border="1px solid" borderColor="stellar.border" borderRadius="2px"
                  _hover={{ borderColor: 'brand.700', color: 'brand.400', bg: 'rgba(200,150,62,0.04)' }}>
                  {link.label}
                </Button>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Grid>
    </Box>
  )
}
