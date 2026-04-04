import { useState, useRef, useEffect } from 'react'
import {
  Box, Text, VStack, HStack, Input, IconButton, Spinner,
  Button, useToast,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiCall } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const MotionBox = motion(Box)

interface Message { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'How much does it cost to build a 3-bedroom house in Nigeria?',
  'What is waterproofing and why is it important?',
  'How long does a typical construction project take?',
  'What permits do I need to build in Abuja?',
]

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <Flex justify={isUser ? 'flex-end' : 'flex-start'} w="full">
      {!isUser && (
        <Box
          w="28px" h="28px" bg="brand.500" flexShrink={0}
          display="flex" alignItems="center" justifyContent="center"
          mr={2} mt={1} fontSize="xs" fontWeight="700" color="white"
          fontFamily="heading" borderRadius="2px"
        >S</Box>
      )}
      <Box
        maxW="80%"
        px={3} py={2}
        bg={isUser ? 'brand.600' : 'stellar.card'}
        border="1px solid"
        borderColor={isUser ? 'brand.500' : 'stellar.border'}
        position="relative"
      >
        <Text fontSize="sm" color="stellar.text" lineHeight="1.7"
          whiteSpace="pre-wrap"
          sx={{
            '& strong': { color: 'brand.400', fontWeight: '600' },
            '& em': { fontStyle: 'italic', color: 'stellar.light' },
          }}>
          {msg.content}
        </Text>
      </Box>
    </Flex>
  )
}

// Need Flex from chakra
import { Flex } from '@chakra-ui/react'

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { user, profile } = useAuth()
  const toast = useToast()

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Greet on first open
  useEffect(() => {
    if (open && !hasGreeted) {
      setHasGreeted(true)
      const name = profile?.full_name?.split(' ')[0] || 'there'
      setMessages([{
        role: 'assistant',
        content: `Hi ${name}! 👋 I'm **Stella**, Lightyear Stellar's AI assistant.\n\nI can help you with construction costs, materials, timelines, regulations in Nigeria, and more. What's on your mind?`,
      }])
    }
  }, [open])

  const send = async (text?: string) => {
    const content = text || input.trim()
    if (!content || loading) return
    setInput('')

    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await apiCall<{ reply: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: newMessages.slice(-20),
          user_id: user?.id || null,
          session_id: null,
        }),
      })
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply }])
    } catch {
      toast({ title: 'Stella is unavailable right now', status: 'error', duration: 2500, position: 'top-right' })
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m having a moment — please try again shortly. You can also reach our team at info@lightyear.ng.',
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <MotionBox
            position="fixed" bottom={6} right={6} zIndex={900}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Box
              as="button"
              onClick={() => setOpen(true)}
              w="60px" h="60px"
              bg="brand.500"
              display="flex" alignItems="center" justifyContent="center"
              color="white"
              boxShadow="0 8px 32px rgba(200,150,62,0.5)"
              transition="all 0.3s"
              _hover={{ bg: 'brand.400', transform: 'scale(1.08)', boxShadow: '0 12px 40px rgba(200,150,62,0.6)' }}
              position="relative"
            >
              <ChatIcon />
              {/* Pulse ring */}
              <Box
                position="absolute" inset="-4px"
                border="2px solid"
                borderColor="brand.500"
                opacity={0.4}
                animation="ping 2s cubic-bezier(0,0,0.2,1) infinite"
                sx={{ '@keyframes ping': { '75%,100%': { transform: 'scale(1.3)', opacity: 0 } } }}
              />
            </Box>
            <Box
              position="absolute" bottom="-2px" left="50%" transform="translateX(-50%)"
              bg="brand.500" px={2} py={0.5} whiteSpace="nowrap"
            >
              <Text fontFamily="mono" fontSize="8px" color="white" letterSpacing="0.1em">STELLA AI</Text>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <MotionBox
            position="fixed" bottom={6} right={6} zIndex={901}
            w={{ base: 'calc(100vw - 24px)', sm: '400px' }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Box
              border="1px solid" borderColor="stellar.border"
              bg="stellar.surface"
              boxShadow="0 24px 80px rgba(0,0,0,0.7)"
              overflow="hidden"
            >
              {/* Header */}
              <Box h="2px" bgGradient="linear(to-r, brand.700, brand.400, brand.700)" />
              <Flex align="center" justify="space-between" px={4} py={3}
                borderBottom="1px solid" borderColor="stellar.border" bg="stellar.card">
                <HStack spacing={3}>
                  <Box w="32px" h="32px" bg="brand.500"
                    display="flex" alignItems="center" justifyContent="center"
                    fontFamily="heading" fontSize="sm" fontWeight="900" color="white">
                    S
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="stellar.text">Stella</Text>
                    <HStack spacing={1}>
                      <Box w={2} h={2} bg="green.400" borderRadius="50%"
                        animation="pulse 2s infinite"
                        sx={{ '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } } }}
                      />
                      <Text fontSize="xs" color="stellar.muted">AI Assistant · Online</Text>
                    </HStack>
                  </Box>
                </HStack>
                <IconButton aria-label="Close" icon={<CloseIcon />} size="sm" variant="ghost"
                  color="stellar.muted" _hover={{ color: 'brand.400', bg: 'transparent' }}
                  onClick={() => setOpen(false)} />
              </Flex>

              {/* Messages */}
              <Box h="360px" overflowY="auto" p={4}
                sx={{
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-thumb': { bg: 'stellar.border', borderRadius: '2px' },
                }}>
                <VStack spacing={3} align="stretch">
                  {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                  {loading && (
                    <Flex>
                      <Box w="28px" h="28px" bg="brand.500" flexShrink={0}
                        display="flex" alignItems="center" justifyContent="center"
                        mr={2} fontSize="xs" fontWeight="700" color="white" fontFamily="heading">
                        S
                      </Box>
                      <Box px={3} py={2} bg="stellar.card" border="1px solid" borderColor="stellar.border">
                        <HStack spacing={1}>
                          {[0, 1, 2].map(i => (
                            <Box key={i} w={2} h={2} bg="brand.500" borderRadius="50%"
                              animation={`bounce 1.2s infinite ${i * 0.2}s`}
                              sx={{ '@keyframes bounce': { '0%,80%,100%': { transform: 'scale(0)' }, '40%': { transform: 'scale(1)' } } }}
                            />
                          ))}
                        </HStack>
                      </Box>
                    </Flex>
                  )}
                  <div ref={bottomRef} />
                </VStack>
              </Box>

              {/* Suggestions (only when empty) */}
              {messages.length <= 1 && (
                <Box px={4} pb={3}>
                  <Text fontSize="xs" fontFamily="mono" color="stellar.muted" letterSpacing="0.1em" mb={2}>
                    QUICK QUESTIONS
                  </Text>
                  <VStack spacing={1} align="stretch">
                    {SUGGESTIONS.map(s => (
                      <Box key={s} as="button" textAlign="left" px={3} py={2}
                        border="1px solid" borderColor="stellar.border"
                        fontSize="xs" color="stellar.muted"
                        transition="all 0.2s"
                        _hover={{ borderColor: 'brand.700', color: 'brand.400', bg: 'rgba(200,150,62,0.04)' }}
                        onClick={() => send(s)}>
                        {s}
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}

              {/* Input */}
              <Box p={3} borderTop="1px solid" borderColor="stellar.border" bg="stellar.card">
                <HStack spacing={2}>
                  <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    placeholder="Ask Stella anything..."
                    bg="stellar.bg" border="1px solid" borderColor="stellar.border"
                    borderRadius="2px" fontSize="sm" color="stellar.text"
                    _placeholder={{ color: 'stellar.muted', fontSize: 'sm' }}
                    _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                    size="sm"
                    disabled={loading}
                  />
                  <IconButton
                    aria-label="Send" icon={<SendIcon />}
                    size="sm" variant="gold" isLoading={loading}
                    onClick={() => send()}
                    minW="36px"
                  />
                </HStack>
                <Text fontSize="10px" color="stellar.muted" mt={1} textAlign="center" letterSpacing="0.05em">
                  Powered by Groq · Stella may make mistakes
                </Text>
              </Box>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  )
}
