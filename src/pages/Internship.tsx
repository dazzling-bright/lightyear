import { useRef } from "react";
import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Button,
  Link as ChakraLink,
  Flex,
  List,
  ListItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";

const MotionBox = motion(Box);

// ── Replace this URL with your actual Google Form link ─────────────────────
// To get it: Google Forms → Share → Get pre-filled link → copy the /viewform URL
const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true";
const GOOGLE_FORM_EXTERNAL =
  "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform";

const UNIVERSITIES = [
  "Afe Babalola University (ABUAD)",
  "Nile University of Nigeria",
  "University of Ibadan",
  "University of Lagos",
  "Obafemi Awolowo University",
  "University of Nigeria, Nsukka",
  "Ahmadu Bello University",
  "Federal University of Technology, Akure",
];

const PROGRAMMES = [
  {
    title: "Structural Engineering Internship",
    duration: "3 months",
    level: "Final year / Post-graduate",
    skills: [
      "AutoCAD",
      "Structural Analysis",
      "Report Writing",
      "Site Supervision",
    ],
  },
  {
    title: "Civil Engineering Internship",
    duration: "3 – 6 months",
    level: "Penultimate / Final year",
    skills: [
      "Foundation Design",
      "Project Planning",
      "Material Testing",
      "Cost Estimation",
    ],
  },
  {
    title: "Architecture Internship",
    duration: "6 months",
    level: "Final year students",
    skills: [
      "AutoCAD / Revit",
      "Design Presentation",
      "Client Liaison",
      "BIM Basics",
    ],
  },
  {
    title: "Project Management Internship",
    duration: "3 months",
    level: "Any engineering discipline",
    skills: [
      "Scheduling",
      "Budget Tracking",
      "Stakeholder Reporting",
      "Risk Assessment",
    ],
  },
];

const CheckIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Internship() {
  const headRef = useRef(null);
  const inView = useInView(headRef, { once: true });

  const cardBg = useColorModeValue("white", "stellar.card");
  const borderC = useColorModeValue("#E2E8F0", "stellar.border");
  const textC = useColorModeValue("#111827", "stellar.text");
  const mutedC = useColorModeValue("#64748B", "stellar.muted");
  const lightC = useColorModeValue("#374151", "stellar.light");
  const infoBg = useColorModeValue("#F8FAFC", "stellar.bg");

  return (
    <>
      {/* Hero */}
      <Box
        py={{ base: 24, md: 32 }}
        bg="stellar.bg"
        position="relative"
        overflow="hidden"
        borderBottom="1px solid"
        borderColor={borderC}
      >
        <Box
          position="absolute"
          inset={0}
          bgImage="url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070')"
          bgSize="cover"
          bgPos="center"
          opacity={0.06}
        />
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-b, rgba(8,12,20,0.97), rgba(8,12,20,0.85))"
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h="1px"
          bgGradient="linear(to-r, transparent, brand.500, transparent)"
          opacity={0.5}
        />

        <Box
          maxW="1280px"
          mx="auto"
          px={{ base: 5, md: 8 }}
          position="relative"
          zIndex={1}
        >
          <HStack spacing={4} mb={5}>
            <Box h="1px" w="40px" bg="brand.500" />
            <Text
              fontFamily="mono"
              fontSize="xs"
              color="brand.500"
              letterSpacing="0.2em"
              textTransform="uppercase"
            >
              Education & Partnerships
            </Text>
          </HStack>
          <Text
            as="h1"
            fontFamily="heading"
            fontWeight="900"
            fontSize={{ base: "4xl", md: "6xl" }}
            color="stellar.text"
            lineHeight="1.1"
            maxW="700px"
          >
            Internship{" "}
            <Box as="span" color="brand.400">
              Programme
            </Box>
          </Text>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="stellar.muted"
            mt={5}
            maxW="580px"
            lineHeight="1.8"
          >
            We partner with leading Nigerian universities to develop the next
            generation of civil, structural, and construction engineers through
            hands-on industry experience.
          </Text>
          <ChakraLink
            href={GOOGLE_FORM_EXTERNAL}
            isExternal
            mt={8}
            display="inline-block"
          >
            <Button variant="gold" size="lg" px={8}>
              Apply Now →
            </Button>
          </ChakraLink>
        </Box>
      </Box>

      {/* Programmes */}
      <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.surface">
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
          <MotionBox
            ref={headRef}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            mb={14}
          >
            <Box h="1px" w="40px" bg="brand.500" mb={5} />
            <Text
              as="h2"
              fontFamily="heading"
              fontWeight="800"
              fontSize={{ base: "3xl", md: "4xl" }}
              color={textC}
              lineHeight="1.1"
            >
              Available{" "}
              <Box as="span" color="brand.400">
                Programmes
              </Box>
            </Text>
            <Text
              fontSize="sm"
              color={mutedC}
              mt={3}
              maxW="500px"
              lineHeight="1.8"
            >
              We accept applications from students in civil, structural,
              architectural, and construction engineering disciplines.
            </Text>
          </MotionBox>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }}
            gap={5}
            mb={16}
          >
            {PROGRAMMES.map((p, i) => (
              <MotionBox
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Box
                  p={7}
                  h="full"
                  bg={cardBg}
                  border="1px solid"
                  borderColor={borderC}
                  borderTop="3px solid"
                  borderTopColor="brand.500"
                  role="group"
                  transition="all 0.3s"
                  _hover={{
                    boxShadow: "0 16px 50px rgba(0,0,0,0.15)",
                    transform: "translateY(-4px)",
                  }}
                >
                  <Text
                    fontFamily="heading"
                    fontSize="xl"
                    fontWeight="700"
                    color={textC}
                    mb={2}
                  >
                    {p.title}
                  </Text>
                  <HStack spacing={4} mb={5}>
                    <Box
                      px={2}
                      py={1}
                      bg="rgba(200,150,62,0.1)"
                      border="1px solid"
                      borderColor="rgba(200,150,62,0.2)"
                    >
                      <Text
                        fontFamily="mono"
                        fontSize="xs"
                        color="brand.500"
                        letterSpacing="0.1em"
                      >
                        {p.duration}
                      </Text>
                    </Box>
                    <Text fontSize="xs" color={mutedC}>
                      {p.level}
                    </Text>
                  </HStack>
                  <Text
                    fontSize="xs"
                    fontFamily="mono"
                    color={mutedC}
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    mb={3}
                  >
                    Skills Gained
                  </Text>
                  <List spacing={2}>
                    {p.skills.map((s) => (
                      <ListItem
                        key={s}
                        display="flex"
                        alignItems="center"
                        gap={2}
                      >
                        <Box color="brand.500" flexShrink={0}>
                          <CheckIcon />
                        </Box>
                        <Text fontSize="sm" color={lightC}>
                          {s}
                        </Text>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </MotionBox>
            ))}
          </Grid>

          {/* Partner universities */}
          <Box
            p={8}
            bg={infoBg}
            border="1px solid"
            borderColor={borderC}
            borderLeft="4px solid"
            borderLeftColor="brand.500"
            mb={16}
          >
            <Text
              fontFamily="mono"
              fontSize="xs"
              color="brand.500"
              letterSpacing="0.2em"
              textTransform="uppercase"
              mb={5}
            >
              Partner Universities
            </Text>
            <Grid
              templateColumns={{ base: "repeat(2,1fr)", md: "repeat(4,1fr)" }}
              gap={3}
            >
              {UNIVERSITIES.map((u) => (
                <Box
                  key={u}
                  px={3}
                  py={2}
                  border="1px solid"
                  borderColor={borderC}
                  bg={cardBg}
                >
                  <Text fontSize="xs" color={lightC} lineHeight="1.5">
                    {u}
                  </Text>
                </Box>
              ))}
            </Grid>
            <Text fontSize="xs" color={mutedC} mt={4} lineHeight="1.7">
              We actively send formal partnership letters to these institutions
              and welcome inquiries from departments wishing to formalise
              internship arrangements.
            </Text>
          </Box>

          {/* What to expect */}
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={8}
            mb={16}
          >
            <Box>
              <Text
                fontFamily="heading"
                fontSize="2xl"
                fontWeight="700"
                color={textC}
                mb={5}
              >
                What to Expect
              </Text>
              <VStack align="start" spacing={4}>
                {[
                  {
                    icon: "🏗️",
                    text: "Real project exposure — site visits, design reviews, client meetings",
                  },
                  {
                    icon: "📐",
                    text: "Hands-on use of AutoCAD, Revit, and structural analysis tools",
                  },
                  {
                    icon: "📋",
                    text: "Mentorship from COREN-registered engineers",
                  },
                  {
                    icon: "📜",
                    text: "Formal internship certificate on successful completion",
                  },
                  {
                    icon: "🤝",
                    text: "Potential for full-time employment on graduation",
                  },
                  {
                    icon: "📊",
                    text: "Contribution to live projects across Nigeria and internationally",
                  },
                ].map((item) => (
                  <HStack key={item.text} spacing={3} align="start">
                    <Text fontSize="lg" flexShrink={0}>
                      {item.icon}
                    </Text>
                    <Text fontSize="sm" color={lightC} lineHeight="1.7">
                      {item.text}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>

            <Box>
              <Text
                fontFamily="heading"
                fontSize="2xl"
                fontWeight="700"
                color={textC}
                mb={5}
              >
                Eligibility
              </Text>
              <VStack align="start" spacing={4}>
                {[
                  "Currently enrolled in civil, structural, architectural, or construction engineering",
                  "Penultimate or final year undergraduate / postgraduate student",
                  "Strong academic standing (2:1 or above preferred)",
                  "Available for full-time internship (3–6 months)",
                  "Ability to commute to or relocate to Abuja",
                  "Passion for construction excellence and innovation",
                ].map((item, i) => (
                  <HStack key={i} spacing={3} align="start">
                    <Box
                      w="22px"
                      h="22px"
                      bg="rgba(200,150,62,0.1)"
                      border="1px solid"
                      borderColor="rgba(200,150,62,0.25)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                      mt="1px"
                    >
                      <CheckIcon />
                    </Box>
                    <Text fontSize="sm" color={lightC} lineHeight="1.7">
                      {item}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </Grid>
        </Box>
      </Box>

      {/* Application form */}
      <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.bg">
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
          <Box h="1px" w="40px" bg="brand.500" mb={5} />
          <Text
            as="h2"
            fontFamily="heading"
            fontWeight="800"
            fontSize={{ base: "3xl", md: "4xl" }}
            color={textC}
            mb={2}
          >
            Apply for an{" "}
            <Box as="span" color="brand.400">
              Internship
            </Box>
          </Text>
          <Text
            fontSize="sm"
            color={mutedC}
            mb={8}
            maxW="560px"
            lineHeight="1.8"
          >
            Complete the form below. Our HR team reviews applications monthly
            and will contact shortlisted candidates within 2 weeks.
          </Text>

          {/* Google Form embed */}
          <Box
            border="1px solid"
            borderColor={borderC}
            overflow="hidden"
            bg={cardBg}
            position="relative"
          >
            <Box
              h="2px"
              bgGradient="linear(to-r, brand.700, brand.400, brand.700)"
            />

            {/* Embedded Google Form */}
            <Box
              as="iframe"
              src={GOOGLE_FORM_URL}
              width="100%"
              height="900px"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Lightyear Engineering Internship Application"
              sx={{ display: "block" }}
            />

            {/* Fallback CTA if iframe blocked */}
            <Box
              p={6}
              borderTop="1px solid"
              borderColor={borderC}
              bg={infoBg}
              textAlign="center"
            >
              <Text fontSize="sm" color={mutedC} mb={3}>
                Can't see the form? Open it directly:
              </Text>
              <ChakraLink href={GOOGLE_FORM_EXTERNAL} isExternal>
                <Button variant="outline_gold" size="sm" px={6}>
                  Open Application Form →
                </Button>
              </ChakraLink>
            </Box>
          </Box>

          {/* Direct contact fallback */}
          <Box
            mt={8}
            p={6}
            bg={infoBg}
            border="1px solid"
            borderColor={borderC}
          >
            <Text
              fontFamily="mono"
              fontSize="xs"
              color="brand.500"
              letterSpacing="0.15em"
              textTransform="uppercase"
              mb={3}
            >
              Prefer to apply directly?
            </Text>
            <Text fontSize="sm" color={mutedC} lineHeight="1.8" mb={4}>
              Send your CV, cover letter, and current transcript to:
            </Text>
            <HStack spacing={4} flexWrap="wrap">
              <ChakraLink
                href="mailto:lightyearconsult@gmail.com?subject=Internship Application"
                fontSize="sm"
                color="brand.400"
                fontWeight="600"
              >
                ✉️ lightyearconsult@gmail.com
              </ChakraLink>
              <Text fontSize="sm" color={mutedC}>
                Subject: "Internship Application — [Your Name]"
              </Text>
            </HStack>
          </Box>
        </Box>
      </Box>
    </>
  );
}
