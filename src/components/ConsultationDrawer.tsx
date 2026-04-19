import { useState } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerCloseButton,
  Box,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  Select,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Divider,
  Link as ChakraLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const EMAIL_EDGE_URL =
  "https://poyztenrzdbkerchqbsr.supabase.co/functions/v1/send-consultation-email";

const WHATSAPP = "https://wa.me/2347032082725";
const LINKEDIN = "https://linkedin.com/company/lightyear-engineering";
const PHONE = "tel:+2347032082725";
const EMAIL = "mailto:lightyearconsult@gmail.com";
const STEPS = ["Your Details", "Project Info", "Review & Submit"];

export default function ConsultationDrawer({ isOpen, onClose }: Props) {
  const { profile } = useAuth();

  const drawerBg = useColorModeValue("white", "#0F1929");
  const borderC = useColorModeValue("#E2E8F0", "#1E2E4A");
  const inputBg = useColorModeValue("#F8FAFC", "#0D1726");
  const textC = useColorModeValue("#111827", "#EEF2F7");
  const labelC = useColorModeValue("#64748B", "#8899AA");
  const mutedC = useColorModeValue("#374151", "#C8D6E8");
  const reviewBg = useColorModeValue("#F8FAFC", "#080C14");

  const iS = {
    bg: inputBg,
    border: "1px solid",
    borderColor: borderC,
    borderRadius: "2px",
    color: textC,
    fontSize: "sm",
    _placeholder: { color: labelC },
    _focus: { borderColor: "brand.500", boxShadow: "0 0 0 1px #C8963E" },
    _hover: { borderColor: "brand.700" },
  };
  const lS = {
    fontSize: "xs" as const,
    fontFamily: "mono",
    color: labelC,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    mb: 1,
  };

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: "",
    service_type: "",
    project_type: "",
    budget_range: "",
    timeline: "",
    message: "",
  });

  const f =
    (k: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Save to Supabase DB
      const { error: dbErr } = await supabase
        .from("consultations")
        .insert({ ...form, user_id: profile?.id || null });
      if (dbErr) throw new Error(dbErr.message);

      // 2. Trigger email via Edge Function (non-blocking — don't fail if email fails)
      fetch(EMAIL_EDGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch((e) => console.warn("Email edge fn failed (non-fatal):", e));

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Submission failed. Please contact us directly.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setSubmitted(false);
      setError("");
    }, 400);
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} placement="right" size="md">
      <DrawerOverlay backdropFilter="blur(8px)" bg="rgba(8,12,20,0.7)" />
      <DrawerContent
        bg={drawerBg}
        borderLeft="1px solid"
        borderColor={borderC}
        maxW="520px"
      >
        <Box
          h="2px"
          bgGradient="linear(to-r, brand.700, brand.400, brand.700)"
        />
        <DrawerCloseButton
          color={labelC}
          mt={2}
          _hover={{ color: "brand.400" }}
        />
        <DrawerBody p={0}>
          {submitted ? (
            <Box p={10} textAlign="center" pt={16}>
              <Box
                w="68px"
                h="68px"
                bg="rgba(200,150,62,0.1)"
                border="1px solid"
                borderColor="brand.600"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={6}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C8963E"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </Box>
              <Text
                fontFamily="heading"
                fontSize="2xl"
                fontWeight="700"
                color={textC}
                mb={2}
              >
                Request Received!
              </Text>
              <Text
                fontSize="sm"
                color={labelC}
                lineHeight="1.8"
                maxW="300px"
                mx="auto"
                mb={2}
              >
                Thank you, <strong>{form.full_name.split(" ")[0]}</strong>. A
                confirmation email has been sent to{" "}
                <strong>{form.email}</strong>.
              </Text>
              <Text fontSize="xs" color={labelC} mb={8}>
                Our team will be in touch within 1 business day.
              </Text>
              <Divider borderColor={borderC} mb={7} />
              <Text
                fontSize="xs"
                fontFamily="mono"
                color="brand.500"
                letterSpacing="0.15em"
                textTransform="uppercase"
                mb={4}
              >
                Reach Us Directly
              </Text>
              <VStack spacing={2} mb={8}>
                {[
                  {
                    href: WHATSAPP,
                    label: "💬 WhatsApp — +234 703 208 2725",
                    ext: true,
                  },
                  {
                    href: PHONE,
                    label: "📞 Call — +234 703 208 2725",
                    ext: false,
                  },
                  {
                    href: EMAIL,
                    label: "✉️ lightyearconsult@gmail.com",
                    ext: false,
                  },
                  { href: LINKEDIN, label: "🔗 LinkedIn", ext: true },
                ].map((c) => (
                  <ChakraLink
                    key={c.label}
                    href={c.href}
                    isExternal={c.ext}
                    w="full"
                  >
                    <Button variant="ghost_light" w="full" size="sm">
                      {c.label}
                    </Button>
                  </ChakraLink>
                ))}
              </VStack>
              <Button variant="gold" size="sm" px={8} onClick={handleClose}>
                Close
              </Button>
            </Box>
          ) : (
            <Box p={8}>
              <Text
                fontFamily="heading"
                fontSize="2xl"
                fontWeight="700"
                color={textC}
                mb={1}
              >
                Book a Consultation
              </Text>
              <Text fontSize="sm" color={labelC} mb={4}>
                Fill the form or reach us directly:
              </Text>
              <HStack spacing={2} mb={6} flexWrap="wrap">
                {[
                  {
                    href: WHATSAPP,
                    label: "💬 WhatsApp",
                    color: "green.500",
                    ext: true,
                  },
                  {
                    href: PHONE,
                    label: "📞 Call",
                    color: "brand.400",
                    ext: false,
                  },
                  {
                    href: LINKEDIN,
                    label: "🔗 LinkedIn",
                    color: "blue.400",
                    ext: true,
                  },
                  {
                    href: EMAIL,
                    label: "✉️ Email",
                    color: "brand.400",
                    ext: false,
                  },
                ].map((c) => (
                  <ChakraLink
                    key={c.label}
                    href={c.href}
                    isExternal={c.ext}
                    fontSize="xs"
                    color={c.color}
                    fontWeight="600"
                  >
                    {c.label}
                  </ChakraLink>
                ))}
              </HStack>

              {/* Steps */}
              <HStack spacing={0} mb={7}>
                {STEPS.map((label, i) => (
                  <Box key={label} flex={1}>
                    <Box
                      h="2px"
                      bg={i <= step ? "brand.500" : borderC}
                      transition="background 0.3s"
                    />
                    <Text
                      fontSize="9px"
                      fontFamily="mono"
                      color={i <= step ? "brand.400" : labelC}
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      mt={1.5}
                      noOfLines={1}
                    >
                      {label}
                    </Text>
                  </Box>
                ))}
              </HStack>

              {step === 0 && (
                <VStack spacing={4}>
                  <Grid templateColumns="1fr 1fr" gap={4} w="full">
                    <FormControl isRequired>
                      <FormLabel {...lS}>Full Name</FormLabel>
                      <Input
                        {...iS}
                        placeholder="John Doe"
                        value={form.full_name}
                        onChange={f("full_name")}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel {...lS}>Email</FormLabel>
                      <Input
                        {...iS}
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={f("email")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid templateColumns="1fr 1fr" gap={4} w="full">
                    <FormControl>
                      <FormLabel {...lS}>Phone</FormLabel>
                      <Input
                        {...iS}
                        placeholder="+234 000 000 0000"
                        value={form.phone}
                        onChange={f("phone")}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel {...lS}>Location</FormLabel>
                      <Input
                        {...iS}
                        placeholder="Lagos, Nigeria"
                        value={form.location}
                        onChange={f("location")}
                      />
                    </FormControl>
                  </Grid>
                  <Button
                    variant="gold"
                    w="full"
                    mt={1}
                    onClick={() => setStep(1)}
                    isDisabled={!form.full_name || !form.email}
                  >
                    Continue →
                  </Button>
                </VStack>
              )}

              {step === 1 && (
                <VStack spacing={4}>
                  <FormControl w="full">
                    <FormLabel {...lS}>Service Needed</FormLabel>
                    <Select
                      {...iS}
                      value={form.service_type}
                      onChange={f("service_type")}
                      placeholder="Select a service"
                    >
                      <option>Feasibility Studies</option>
                      <option>Foundation Investigation</option>
                      <option>Design & Engineering</option>
                      <option>Project Management</option>
                      <option>Pre-Construction Planning</option>
                      <option>Construction Services</option>
                      <option>Advisory & Consulting</option>
                    </Select>
                  </FormControl>
                  <FormControl w="full">
                    <FormLabel {...lS}>Project Type</FormLabel>
                    <Select
                      {...iS}
                      value={form.project_type}
                      onChange={f("project_type")}
                      placeholder="Select type"
                    >
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Industrial</option>
                      <option>Infrastructure</option>
                      <option>Renovation</option>
                    </Select>
                  </FormControl>
                  <Grid templateColumns="1fr 1fr" gap={4} w="full">
                    <FormControl>
                      <FormLabel {...lS}>Budget Range</FormLabel>
                      <Select
                        {...iS}
                        value={form.budget_range}
                        onChange={f("budget_range")}
                        placeholder="Select"
                      >
                        <option>Under ₦5M</option>
                        <option>₦5M – ₦20M</option>
                        <option>₦20M – ₦100M</option>
                        <option>₦100M – ₦500M</option>
                        <option>Above ₦500M</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel {...lS}>Timeline</FormLabel>
                      <Select
                        {...iS}
                        value={form.timeline}
                        onChange={f("timeline")}
                        placeholder="When?"
                      >
                        <option>Immediately</option>
                        <option>1–3 months</option>
                        <option>3–6 months</option>
                        <option>6+ months</option>
                        <option>Just exploring</option>
                      </Select>
                    </FormControl>
                  </Grid>
                  <FormControl isRequired w="full">
                    <FormLabel {...lS}>Project Description</FormLabel>
                    <Textarea
                      {...iS}
                      rows={4}
                      resize="none"
                      placeholder="Describe your project, goals, and requirements..."
                      value={form.message}
                      onChange={f("message")}
                    />
                  </FormControl>
                  <HStack w="full" gap={3}>
                    <Button
                      variant="ghost_light"
                      flex={1}
                      onClick={() => setStep(0)}
                    >
                      ← Back
                    </Button>
                    <Button
                      variant="gold"
                      flex={2}
                      onClick={() => setStep(2)}
                      isDisabled={!form.message}
                    >
                      Review →
                    </Button>
                  </HStack>
                </VStack>
              )}

              {step === 2 && (
                <VStack spacing={0} align="stretch">
                  {error && (
                    <Box
                      p={3}
                      mb={4}
                      border="1px solid"
                      borderColor="red.500"
                      bg="rgba(239,68,68,0.06)"
                    >
                      <Text fontSize="sm" color="red.400">
                        {error}
                      </Text>
                    </Box>
                  )}
                  <Box
                    mb={4}
                    p={3}
                    bg="rgba(200,150,62,0.06)"
                    border="1px solid"
                    borderColor="brand.700"
                  >
                    <Text
                      fontSize="xs"
                      fontFamily="mono"
                      color="brand.500"
                      letterSpacing="0.08em"
                    >
                      📧 A confirmation will be sent to{" "}
                      <strong>{form.email}</strong>
                    </Text>
                  </Box>
                  {[
                    ["Name", form.full_name],
                    ["Email", form.email],
                    ["Phone", form.phone || "—"],
                    ["Location", form.location || "—"],
                    ["Service", form.service_type || "—"],
                    ["Project Type", form.project_type || "—"],
                    ["Budget", form.budget_range || "—"],
                    ["Timeline", form.timeline || "—"],
                  ].map(([k, v]) => (
                    <HStack
                      key={k}
                      py={2.5}
                      borderBottom="1px solid"
                      borderColor={borderC}
                      justify="space-between"
                    >
                      <Text
                        fontSize="xs"
                        fontFamily="mono"
                        color={labelC}
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                      >
                        {k}
                      </Text>
                      <Text
                        fontSize="sm"
                        color={textC}
                        fontWeight="500"
                        textAlign="right"
                        maxW="58%"
                      >
                        {v}
                      </Text>
                    </HStack>
                  ))}
                  <Box
                    mt={4}
                    p={4}
                    bg={reviewBg}
                    border="1px solid"
                    borderColor={borderC}
                  >
                    <Text
                      fontSize="xs"
                      fontFamily="mono"
                      color={labelC}
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      mb={2}
                    >
                      Message
                    </Text>
                    <Text fontSize="sm" color={mutedC} lineHeight="1.7">
                      {form.message}
                    </Text>
                  </Box>
                  <HStack mt={6} gap={3}>
                    <Button
                      variant="ghost_light"
                      flex={1}
                      onClick={() => setStep(1)}
                    >
                      ← Edit
                    </Button>
                    <Button
                      variant="gold"
                      flex={2}
                      isLoading={loading}
                      onClick={handleSubmit}
                    >
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
  );
}
