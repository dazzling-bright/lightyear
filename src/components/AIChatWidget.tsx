

import { useState, useRef, useEffect, useCallback } from "react";
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
import Groq from "groq-sdk";

const MotionBox = motion(Box);

// Groq API configuration - client side!
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;
const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // Allow browser usage
});

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT = `You are Stella, Lightyear Engineering's AI assistant. You specialize in:
- Construction and civil engineering
- Foundation investigation and geotechnical engineering
- Project management and pre-construction planning
- Building materials and costs in Nigeria
- Permits and regulations in Nigeria
- Sustainable building practices

Keep responses concise (under 150 words), friendly, and professional. Use plain text (no markdown). If you don't know something, suggest contacting Lightyear directly at lightyearconsult@gmail.com or +234 703 208 2725.`;

const SUGGESTIONS = [
  "How much to build a 3-bedroom house in Abuja?",
  "Why is waterproofing critical in Nigeria?",
  "What permits do I need to build?",
  "What is a foundation investigation?",
];

const SendIcon = () => (
  <svg
    width="15"
    height="15"
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
    width="14"
    height="14"
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
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const DragIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="currentColor"
    opacity={0.4}
  >
    <circle cx="9" cy="5" r="1.5" />
    <circle cx="15" cy="5" r="1.5" />
    <circle cx="9" cy="12" r="1.5" />
    <circle cx="15" cy="12" r="1.5" />
    <circle cx="9" cy="19" r="1.5" />
    <circle cx="15" cy="19" r="1.5" />
  </svg>
);

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const aiBg = useColorModeValue("#F1F5F9", "#141F33");
  const aiText = useColorModeValue("#1A202C", "#EEF2F7");
  return (
    <Flex justify={isUser ? "flex-end" : "flex-start"} w="full">
      {!isUser && (
        <Box
          w="24px"
          h="24px"
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
            fontSize="9px"
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
        borderRadius="2px"
        bg={isUser ? "brand.600" : aiBg}
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

// ── Drag threshold — only commit to dragging after moving 6px ─────────────────
const DRAG_THRESHOLD = 6;

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();

  // ── Drag state ──────────────────────────────────────────────────────────────
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const isPressing = useRef(false);
  const pressStart = useRef<{
    mx: number;
    my: number;
    px: number;
    py: number;
  } | null>(null);

  // Mouse drag handlers
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-nodrag]")) return;
      e.preventDefault();
      hasDragged.current = false;
      isPressing.current = true;
      pressStart.current = {
        mx: e.clientX,
        my: e.clientY,
        px: pos.x,
        py: pos.y,
      };
    },
    [pos],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isPressing.current || !pressStart.current) return;
      const dx = e.clientX - pressStart.current.mx;
      const dy = e.clientY - pressStart.current.my;
      if (!hasDragged.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      hasDragged.current = true;
      setPos({ x: pressStart.current.px + dx, y: pressStart.current.py + dy });
    };
    const onUp = () => {
      isPressing.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // Touch drag handlers
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if ((e.target as HTMLElement).closest("[data-nodrag]")) return;
      const t = e.touches[0];
      hasDragged.current = false;
      isPressing.current = true;
      pressStart.current = {
        mx: t.clientX,
        my: t.clientY,
        px: pos.x,
        py: pos.y,
      };
    },
    [pos],
  );

  useEffect(() => {
    const onMove = (e: TouchEvent) => {
      if (!isPressing.current || !pressStart.current) return;
      const t = e.touches[0];
      const dx = t.clientX - pressStart.current.mx;
      const dy = t.clientY - pressStart.current.my;
      if (!hasDragged.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      hasDragged.current = true;
      e.preventDefault();
      setPos({ x: pressStart.current.px + dx, y: pressStart.current.py + dy });
    };
    const onEnd = () => {
      isPressing.current = false;
    };
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

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
          content: `Hi ${name}! 👋 I'm **Stella**, Lightyear Engineering's AI assistant.\n\nAsk me anything about construction, materials, costs, permits, or our services. How can I help?`,
        },
      ]);
    }
  }, [open, greeted, profile]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");

    const userMessage: Message = { role: "user", content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Call Groq directly from client-side!
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...updatedMessages.slice(-10), // Last 10 messages for context
        ],
        model: "llama-3.3-70b-versatile", // or "mixtral-8x7b-32768"
        temperature: 0.7,
        max_tokens: 300,
        top_p: 1,
        stream: false,
      });

      const reply =
        chatCompletion.choices[0]?.message?.content ||
        "I apologize, but I couldn't generate a response. Please try again or contact us directly at lightyearconsult@gmail.com";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      console.error("Stella error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm unavailable right now. Please contact us directly:\n📞 +234 703 208 2725\n✉️ lightyearconsult@gmail.com",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = useCallback(() => {
    if (!hasDragged.current) setOpen(true);
  }, []);

  const panelBg = useColorModeValue("white", "#0F1929");
  const headerBg = useColorModeValue("#F8FAFC", "#141F33");
  const inputBg = useColorModeValue("#F1F5F9", "#080C14");
  const borderC = useColorModeValue("#E2E8F0", "#1E2E4A");
  const mutedC = useColorModeValue("#64748B", "#8899AA");
  const suggBg = useColorModeValue("#F8FAFC", "#080C14");

  const baseRight = 24;
  const baseBottom = 24;

  return (
    <>
      {/* ── Floating button ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!open && (
          <MotionBox
            position="fixed"
            bottom={`${baseBottom - pos.y}px`}
            right={`${baseRight - pos.x}px`}
            zIndex={900}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            cursor={
              isPressing.current && hasDragged.current ? "grabbing" : "grab"
            }
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
          >
            <Box
              as="button"
              onClick={handleButtonClick}
              w="56px"
              h="56px"
              bg="brand.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              boxShadow="0 8px 32px rgba(242,101,34,0.4)"
              transition="background 0.2s"
              _hover={{ bg: "brand.400" }}
              aria-label="Open Stella AI"
              position="relative"
            >
              <ChatIcon />
              <Box
                position="absolute"
                inset="-4px"
                border="2px solid"
                borderColor="brand.500"
                opacity={0.35}
                animation="stellaPing 2.5s infinite"
                sx={{
                  "@keyframes stellaPing": {
                    "0%": { transform: "scale(1)", opacity: 0.35 },
                    "70%,100%": { transform: "scale(1.4)", opacity: 0 },
                  },
                }}
              />
            </Box>
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

      {/* ── Chat panel ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <MotionBox
            position="fixed"
            bottom={`${baseBottom - pos.y}px`}
            right={`${baseRight - pos.x}px`}
            zIndex={901}
            w={{ base: "calc(100vw - 24px)", sm: "390px" }}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Box
              bg={panelBg}
              border="1px solid"
              borderColor={borderC}
              boxShadow="0 24px 80px rgba(0,0,0,0.2)"
              overflow="hidden"
            >
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
                cursor="grab"
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                userSelect="none"
              >
                <HStack spacing={3}>
                  <Box
                    w="28px"
                    h="28px"
                    bg="brand.500"
                    borderRadius="2px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
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
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="text-primary">
                      Stella AI
                    </Text>
                    <HStack spacing={1}>
                      <Box
                        w="6px"
                        h="6px"
                        bg="green.400"
                        borderRadius="full"
                        animation="dot 2s infinite"
                        sx={{
                          "@keyframes dot": {
                            "0%,100%": { opacity: 1 },
                            "50%": { opacity: 0.4 },
                          },
                        }}
                      />
                      <Text fontSize="xs" color={mutedC}>
                        Online · Lightyear Engineering
                      </Text>
                    </HStack>
                  </Box>
                </HStack>
                <HStack spacing={1}>
                  <Box color={mutedC}>
                    <DragIcon />
                  </Box>
                  <IconButton
                    aria-label="Close"
                    icon={<CloseIcon />}
                    size="sm"
                    variant="ghost"
                    color={mutedC}
                    _hover={{ color: "brand.500", bg: "transparent" }}
                    onClick={() => setOpen(false)}
                    data-nodrag="true"
                  />
                </HStack>
              </Flex>

              {/* Messages */}
              <Box
                h="330px"
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
                  {messages.map((m, i) => (
                    <Bubble key={i} msg={m} />
                  ))}
                  {loading && (
                    <Flex>
                      <Box
                        w="24px"
                        h="24px"
                        bg="brand.500"
                        borderRadius="2px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mr={2}
                        flexShrink={0}
                      >
                        <Text
                          fontFamily="heading"
                          fontSize="9px"
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
                              w="5px"
                              h="5px"
                              bg="brand.500"
                              borderRadius="full"
                              animation={`bounce 1.2s infinite ${i * 0.2}s`}
                              sx={{
                                "@keyframes bounce": {
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

              {/* Suggestions */}
              {messages.length <= 1 && (
                <Box px={4} pb={3}>
                  <Text
                    fontSize="9px"
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
                        transition="all 0.15s"
                        _hover={{
                          bg: headerBg,
                          color: "brand.500",
                          borderColor: "brand.700",
                        }}
                        onClick={() => send(s)}
                        data-nodrag="true"
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
                data-nodrag="true"
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
                    _placeholder={{ color: mutedC }}
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
                    minW="32px"
                    data-nodrag="true"
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