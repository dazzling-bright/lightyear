import { useState, useRef, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Input,
  IconButton,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const MotionBox = motion(Box);

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Edge function URL 
const EDGE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stella-chat`;

const SUGGESTIONS = [
  "What is waterproofing and why is it critical?",
  "What permits do I need to build in Nigeria?",
  "How long does a typical construction project take?",
  "How much does it cost to build a 3-bedroom house in Abuja?",
];

const SendIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ChatIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const userBg = useColorModeValue("brand.600", "brand.600");
  const aiBg = useColorModeValue("gray.100", "stellar.card");
  const aiText = useColorModeValue("gray.800", "stellar.text");

  return (
    <Flex justify={isUser ? "flex-end" : "flex-start"} w="full">
      {!isUser && (
        <Box
          w="26px"
          h="26px"
          bg="brand.500"
          borderRadius="2px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mr={2}
          mt="2px"
          flexShrink={0}
        >
          <Text
            fontFamily="heading"
            fontSize="10px"
            fontWeight="900"
            color="white"
          >
            S
          </Text>
        </Box>
      )}
      <Box
        maxW="82%"
        px={3}
        py={2}
        bg={isUser ? userBg : aiBg}
        borderRadius="2px"
        border="1px solid"
        borderColor={isUser ? "brand.500" : "transparent"}
      >
        <Text
          fontSize="sm"
          color={isUser ? "white" : aiText}
          lineHeight="1.7"
          whiteSpace="pre-wrap"
        >
          {msg.content}
        </Text>
      </Box>
    </Flex>
  );
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();

  const panelBg = useColorModeValue("white", "stellar.surface");
  const headerBg = useColorModeValue("gray.50", "stellar.card");
  const inputBg = useColorModeValue("#F8FAFC", "stellar.bg");
  const borderC = useColorModeValue("gray.200", "stellar.border");
  const mutedC = useColorModeValue("gray.500", "stellar.muted");
  const suggBg = useColorModeValue("gray.50", "stellar.bg");
  const suggHover = useColorModeValue("gray.100", "stellar.surface");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open && !greeted) {
      setGreeted(true);
      const name = profile?.full_name?.split(" ")[0] || "there";
      setMessages([
        {
          role: "assistant",
          content: `Hi ${name}! 👋 I'm **Stella**, Lightyear Engineering's AI assistant.\n\nAsk me anything about construction costs, materials, engineering, permits in Nigeria, or our services. How can I help?`,
        },
      ]);
    }
  }, [open, greeted, profile]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");

    const updated: Message[] = [...messages, { role: "user", content }];
    setMessages(updated);
    setLoading(true);

    try {
      // Call Supabase Edge Function — works when hosted, no FastAPI needed
      const res = await fetch(EDGE_FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated.slice(-20) }),
      });

      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      console.error("Stella error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having a moment — please try again shortly, or reach us directly at lightyearconsult@gmail.com or +234 703 208 2725.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!open && (
          <MotionBox
            position="fixed"
            bottom={6}
            right={6}
            zIndex={900}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <Box
              as="button"
              onClick={() => setOpen(true)}
              w="58px"
              h="58px"
              bg="brand.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              boxShadow="0 8px 32px rgba(200,150,62,0.45)"
              transition="all 0.3s"
              _hover={{ bg: "brand.400", transform: "scale(1.08)" }}
              aria-label="Open Stella AI chat"
              position="relative"
            >
              <ChatIcon />
              {/* Pulse ring */}
              <Box
                position="absolute"
                inset="-4px"
                border="2px solid"
                borderColor="brand.500"
                opacity={0.4}
                animation="stellaPulse 2.5s cubic-bezier(0,0,0.2,1) infinite"
                sx={{
                  "@keyframes stellaPulse": {
                    "0%": { transform: "scale(1)", opacity: 0.4 },
                    "70%": { transform: "scale(1.35)", opacity: 0 },
                    "100%": { transform: "scale(1.35)", opacity: 0 },
                  },
                }}
              />
            </Box>
            {/* Label badge */}
            <Box
              position="absolute"
              bottom="-6px"
              left="50%"
              transform="translateX(-50%)"
              bg="brand.500"
              px={2}
              py="1px"
              whiteSpace="nowrap"
              pointerEvents="none"
            >
              <Text
                fontFamily="mono"
                fontSize="7px"
                color="white"
                letterSpacing="0.1em"
              >
                STELLA AI
              </Text>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <MotionBox
            position="fixed"
            bottom={6}
            right={6}
            zIndex={901}
            w={{ base: "calc(100vw - 24px)", sm: "400px" }}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Box
              bg={panelBg}
              border="1px solid"
              borderColor={borderC}
              boxShadow="0 24px 80px rgba(0,0,0,0.2)"
              overflow="hidden"
            >
              {/* Gold top line */}
              <Box
                h="2px"
                bgGradient="linear(to-r, brand.700, brand.400, brand.700)"
              />

              {/* Header */}
              <Flex
                align="center"
                justify="space-between"
                px={4}
                py={3}
                bg={headerBg}
                borderBottom="1px solid"
                borderColor={borderC}
              >
                <HStack spacing={3}>
                  <Box
                    w="30px"
                    h="30px"
                    bg="brand.500"
                    borderRadius="2px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontFamily="heading"
                      fontSize="xs"
                      fontWeight="900"
                      color="white"
                    >
                      S
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="text-primary">
                      Stella
                    </Text>
                    <HStack spacing={1}>
                      <Box
                        w={2}
                        h={2}
                        bg="green.400"
                        borderRadius="full"
                        animation="stellaDot 2s infinite"
                        sx={{
                          "@keyframes stellaDot": {
                            "0%,100%": { opacity: 1 },
                            "50%": { opacity: 0.4 },
                          },
                        }}
                      />
                      <Text fontSize="xs" color={mutedC}>
                        AI Assistant · Online
                      </Text>
                    </HStack>
                  </Box>
                </HStack>
                <IconButton
                  aria-label="Close chat"
                  icon={<CloseIcon />}
                  size="sm"
                  variant="ghost"
                  color={mutedC}
                  _hover={{ color: "brand.400", bg: "transparent" }}
                  onClick={() => setOpen(false)}
                />
              </Flex>

              {/* Messages */}
              <Box
                h="340px"
                overflowY="auto"
                p={4}
                sx={{
                  "&::-webkit-scrollbar": { width: "3px" },
                  "&::-webkit-scrollbar-thumb": {
                    bg: borderC,
                    borderRadius: "2px",
                  },
                }}
              >
                <VStack spacing={3} align="stretch">
                  {messages.map((msg, i) => (
                    <Bubble key={i} msg={msg} />
                  ))}

                  {loading && (
                    <Flex>
                      <Box
                        w="26px"
                        h="26px"
                        bg="brand.500"
                        borderRadius="2px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mr={2}
                        mt="2px"
                        flexShrink={0}
                      >
                        <Text
                          fontFamily="heading"
                          fontSize="10px"
                          fontWeight="900"
                          color="white"
                        >
                          S
                        </Text>
                      </Box>
                      <Box
                        px={3}
                        py={2}
                        bg={suggBg}
                        border="1px solid"
                        borderColor={borderC}
                      >
                        <HStack spacing={1}>
                          {[0, 1, 2].map((i) => (
                            <Box
                              key={i}
                              w="6px"
                              h="6px"
                              bg="brand.500"
                              borderRadius="full"
                              animation={`stellaBounce 1.2s infinite ${i * 0.2}s`}
                              sx={{
                                "@keyframes stellaBounce": {
                                  "0%,80%,100%": {
                                    transform: "scale(0)",
                                    opacity: 0.5,
                                  },
                                  "40%": { transform: "scale(1)", opacity: 1 },
                                },
                              }}
                            />
                          ))}
                        </HStack>
                      </Box>
                    </Flex>
                  )}
                  <div ref={bottomRef} />
                </VStack>
              </Box>

              {/* Suggestions — shown on first open */}
              {messages.length <= 1 && (
                <Box px={4} pb={3}>
                  <Text
                    fontSize="10px"
                    fontFamily="mono"
                    color={mutedC}
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    mb={2}
                  >
                    Quick Questions
                  </Text>
                  <VStack spacing={1} align="stretch">
                    {SUGGESTIONS.map((s) => (
                      <Box
                        key={s}
                        as="button"
                        textAlign="left"
                        px={3}
                        py={2}
                        bg={suggBg}
                        border="1px solid"
                        borderColor={borderC}
                        fontSize="xs"
                        color={mutedC}
                        transition="all 0.18s"
                        _hover={{
                          bg: suggHover,
                          color: "brand.400",
                          borderColor: "brand.700",
                        }}
                        onClick={() => send(s)}
                      >
                        {s}
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}

              {/* Input */}
              <Box
                p={3}
                borderTop="1px solid"
                borderColor={borderC}
                bg={headerBg}
              >
                <HStack spacing={2}>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && send()
                    }
                    placeholder="Ask Stella anything..."
                    bg={inputBg}
                    border="1px solid"
                    borderColor={borderC}
                    borderRadius="2px"
                    fontSize="sm"
                    color="text-primary"
                    _placeholder={{ color: mutedC, fontSize: "sm" }}
                    _focus={{ borderColor: "brand.500", boxShadow: "none" }}
                    size="sm"
                    isDisabled={loading}
                  />
                  <IconButton
                    aria-label="Send"
                    icon={<SendIcon />}
                    size="sm"
                    variant="gold"
                    isLoading={loading}
                    onClick={() => send()}
                    minW="34px"
                  />
                </HStack>
                <Text
                  fontSize="9px"
                  color={mutedC}
                  mt={1.5}
                  textAlign="center"
                  letterSpacing="0.05em"
                >
                  Powered by Groq · Stella may make mistakes
                </Text>
              </Box>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
}
