import { useState, useEffect } from "react";
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
  Stepper,
  Step,
  StepIndicator,
  StepNumber,
  StepTitle,
  StepDescription,
  StepStatus,
  StepSeparator,
  useSteps,
} from "@chakra-ui/react";
import emailjs from "@emailjs/browser";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// EmailJS configuration
const EMAILJS_SERVICE_ID = "lightyear_jw2012";
const EMAILJS_TEMPLATE_ID = "template_7bdc07a";
const EMAILJS_PUBLIC_KEY = "4SB9C7VIb-FClOgto";


const WHATSAPP = "https://wa.me/2347032082725";
// const LINKEDIN = "https://linkedin.com/company/lightyear-engineering";
const PHONE = "tel:+2347032082725";
const EMAIL = "mailto:lightyearconstruct@gmail.com";

const STEPS = [
  { title: "Step 1", description: "Details" },
  { title: "Step 2", description: "Project Info" },
  { title: "Step 3", description: "Review & Submit" },
];

export default function ConsultationDrawer({ isOpen, onClose }: Props) {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: STEPS.length,
  });

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

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
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
      const templateParams = {
        from_name: form.full_name,
        from_email: form.email,
        phone: form.phone || "Not provided",
        location: form.location || "Not provided",
        service_type: form.service_type || "Not specified",
        project_type: form.project_type || "Not specified",
        budget_range: form.budget_range || "Not specified",
        timeline: form.timeline || "Not specified",
        message: form.message,
        reply_to: form.email,

        // ✅ NEW (dynamic year)
        current_year: new Date().getFullYear(),
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY,
      );

      setSubmitted(true);
    } catch (err: any) {
      console.error("❌ Email failed:", err);

      let errorMsg = "Failed to send consultation request.";

      if (err?.status) {
        errorMsg += ` (Status: ${err.status})`;
      }

      if (err?.text) {
        errorMsg += ` ${err.text}`;
      } else if (err?.message) {
        errorMsg += ` ${err.message}`;
      }

      errorMsg += " Please try again or contact us directly.";

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setActiveStep(0);
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
                Thank you, <strong>{form.full_name.split(" ")[0]}</strong>. We
                have received your consultation request.
              </Text>
              <Text fontSize="xs" color={labelC} mb={8}>
                Our team will be in touch within 1-2 business days.
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
                    label: "💬 WhatsApp: +234 703 208 2725",
                    ext: true,
                  },
                  {
                    href: PHONE,
                    label: "📞 Call: +234 703 208 2725",
                    ext: false,
                  },
                  {
                    href: EMAIL,
                    label: "lightyearconsult@gmail.com",
                    ext: false,
                  },
                  // { href: LINKEDIN, label: "🔗 LinkedIn", ext: true },
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
                  // {
                  //   href: LINKEDIN,
                  //   label: "🔗 LinkedIn",
                  //   color: "blue.400",
                  //   ext: true,
                  // },
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

              {/* Stepper with step numbers */}
              <Stepper
                index={activeStep}
                mb={7}
                colorScheme="brand"
                size={"sm"}
              >
                {STEPS.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepNumber />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
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
                    onClick={() => setActiveStep(1)}
                    isDisabled={!form.full_name || !form.email}
                  >
                    Continue →
                  </Button>
                </VStack>
              )}

              {activeStep === 1 && (
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
                      onClick={() => setActiveStep(0)}
                    >
                      ← Back
                    </Button>
                    <Button
                      variant="gold"
                      flex={2}
                      onClick={() => setActiveStep(2)}
                      isDisabled={!form.message}
                    >
                      Review →
                    </Button>
                  </HStack>
                </VStack>
              )}

              {activeStep === 2 && (
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
                      We'll respond to <strong>{form.email}</strong> within 1-2
                      business days
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
                      onClick={() => setActiveStep(1)}
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
