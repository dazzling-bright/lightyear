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

// Contact details
const WHATSAPP = "https://wa.me/2347032082725";
const LINKEDIN = "https://linkedin.com/company/lightyear-engineering";
const PHONE = "tel:+2347032082725";
const EMAIL = "mailto:lightyearconsult@gmail.com";

const STEPS = ["Your Details", "Project Info", "Review & Submit"];

export default function ConsultationDrawer({ isOpen, onClose }: Props) {
  const { profile } = useAuth();

  const drawerBg = useColorModeValue("white", "#0F1929");
  const borderC = useColorModeValue("#E2E8F0", "#1E2E4A");
  const inputBg = useColorModeValue("#F8FAFC", "#080C14");
  const labelC = useColorModeValue("#64748B", "#8899AA");
  const textC = useColorModeValue("#111827", "#EEF2F7");
  const mutedC = useColorModeValue("#374151", "#C8D6E8");
  const reviewBg = useColorModeValue("#F8FAFC", "#080C14");

  const iStyles = {
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
  const lStyles = {
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
      // Save directly to Supabase — no backend needed
      const { error: sbError } = await supabase.from("consultations").insert({
        ...form,
        user_id: profile?.id || null,
      });

      if (sbError) throw new Error(sbError.message);
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
            // ── Success ─────────────────────────────────────────────────
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
                mb={8}
              >
                Thank you, <strong>{form.full_name.split(" ")[0]}</strong>. Our
                team will review your request and reach out within 1 business
                day.
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
                <ChakraLink href={WHATSAPP} isExternal w="full">
                  <Button
                    variant="ghost_light"
                    w="full"
                    size="sm"
                    leftIcon={
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L0 24l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.006-1.374l-.358-.213-3.722.976.993-3.623-.234-.372A9.816 9.816 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                      </svg>
                    }
                  >
                    WhatsApp — +234 703 208 2725
                  </Button>
                </ChakraLink>

                <ChakraLink href={PHONE} w="full">
                  <Button variant="ghost_light" w="full" size="sm">
                    📞 Call — +234 703 208 2725
                  </Button>
                </ChakraLink>

                <ChakraLink href={EMAIL} w="full">
                  <Button variant="ghost_light" w="full" size="sm">
                    ✉️ lightyearconsult@gmail.com
                  </Button>
                </ChakraLink>

                <ChakraLink href={LINKEDIN} isExternal w="full">
                  <Button variant="ghost_light" w="full" size="sm">
                    🔗 LinkedIn
                  </Button>
                </ChakraLink>
              </VStack>

              <Button variant="gold" size="sm" px={8} onClick={handleClose}>
                Close
              </Button>
            </Box>
          ) : (
            // ── Form ────────────────────────────────────────────────────
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
                Fill the form below, or reach us directly:
              </Text>

              {/* Inline contact links */}
              <HStack spacing={3} mb={6} flexWrap="wrap">
                <ChakraLink
                  href={WHATSAPP}
                  isExternal
                  fontSize="xs"
                  color="green.500"
                  fontWeight="600"
                >
                  💬 WhatsApp
                </ChakraLink>
                <Text fontSize="xs" color={labelC}>
                  ·
                </Text>
                <ChakraLink
                  href={PHONE}
                  fontSize="xs"
                  color="brand.400"
                  fontWeight="600"
                >
                  📞 Call Us
                </ChakraLink>
                <Text fontSize="xs" color={labelC}>
                  ·
                </Text>
                <ChakraLink
                  href={LINKEDIN}
                  isExternal
                  fontSize="xs"
                  color="blue.400"
                  fontWeight="600"
                >
                  🔗 LinkedIn
                </ChakraLink>
                <Text fontSize="xs" color={labelC}>
                  ·
                </Text>
                <ChakraLink
                  href={EMAIL}
                  fontSize="xs"
                  color="brand.400"
                  fontWeight="600"
                >
                  ✉️ Email
                </ChakraLink>
              </HStack>

              {/* Step indicators */}
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

              {/* ── Step 0 ── */}
              {step === 0 && (
                <VStack spacing={4}>
                  <Grid templateColumns="1fr 1fr" gap={4} w="full">
                    <FormControl isRequired>
                      <FormLabel {...lStyles}>Full Name</FormLabel>
                      <Input
                        {...iStyles}
                        placeholder="John Doe"
                        value={form.full_name}
                        onChange={f("full_name")}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel {...lStyles}>Email</FormLabel>
                      <Input
                        {...iStyles}
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={f("email")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid templateColumns="1fr 1fr" gap={4} w="full">
                    <FormControl>
                      <FormLabel {...lStyles}>Phone</FormLabel>
                      <Input
                        {...iStyles}
                        placeholder="+234 000 000 0000"
                        value={form.phone}
                        onChange={f("phone")}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel {...lStyles}>Location</FormLabel>
                      <Input
                        {...iStyles}
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

              {/* ── Step 1 ── */}
              {step === 1 && (
                <VStack spacing={4}>
                  <FormControl w="full">
                    <FormLabel {...lStyles}>Service Needed</FormLabel>
                    <Select
                      {...iStyles}
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
                    <FormLabel {...lStyles}>Project Type</FormLabel>
                    <Select
                      {...iStyles}
                      value={form.project_type}
                      onChange={f("project_type")}
                      placeholder="Select project type"
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
                      <FormLabel {...lStyles}>Budget Range</FormLabel>
                      <Select
                        {...iStyles}
                        value={form.budget_range}
                        onChange={f("budget_range")}
                        placeholder="Select range"
                      >
                        <option>Under ₦5M</option>
                        <option>₦5M – ₦20M</option>
                        <option>₦20M – ₦100M</option>
                        <option>₦100M – ₦500M</option>
                        <option>Above ₦500M</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel {...lStyles}>Timeline</FormLabel>
                      <Select
                        {...iStyles}
                        value={form.timeline}
                        onChange={f("timeline")}
                        placeholder="When to start?"
                      >
                        <option>Immediately</option>
                        <option>1 – 3 months</option>
                        <option>3 – 6 months</option>
                        <option>6+ months</option>
                        <option>Just exploring</option>
                      </Select>
                    </FormControl>
                  </Grid>
                  <FormControl isRequired w="full">
                    <FormLabel {...lStyles}>Project Description</FormLabel>
                    <Textarea
                      {...iStyles}
                      rows={4}
                      resize="none"
                      placeholder="Describe your project, goals, and any specific requirements..."
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

              {/* ── Step 2 ── */}
              {step === 2 && (
                <VStack spacing={0} align="stretch">
                  {/* Error */}
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

                  {[
                    { label: "Name", value: form.full_name },
                    { label: "Email", value: form.email },
                    { label: "Phone", value: form.phone || "—" },
                    { label: "Location", value: form.location || "—" },
                    { label: "Service", value: form.service_type || "—" },
                    { label: "Project Type", value: form.project_type || "—" },
                    { label: "Budget", value: form.budget_range || "—" },
                    { label: "Timeline", value: form.timeline || "—" },
                  ].map((row) => (
                    <HStack
                      key={row.label}
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
                        {row.label}
                      </Text>
                      <Text
                        fontSize="sm"
                        color={textC}
                        fontWeight="500"
                        textAlign="right"
                        maxW="58%"
                      >
                        {row.value}
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
