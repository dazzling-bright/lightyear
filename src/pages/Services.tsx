

import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  List,
  ListItem,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Heading,
  Divider,
  IconButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const MotionBox = motion(Box);

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

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Updated services with short info and detailed content
const ALL_SERVICES = [
  {
    id: "project-studies",
    num: "01",
    title: "Project Studies",
    shortDesc:
      "Comprehensive analysis of project viability, scope definition, and strategic planning for optimal outcomes.",
    desc: "Our project studies provide a thorough examination of your proposed development, covering technical requirements, resource allocation, timeline estimation, and risk assessment. We deliver actionable insights that inform go/no-go decisions and strategic planning.",
    items: [
      "Site Selection & Analysis",
      "Regulatory Compliance Review",
      "Resource Requirement Planning",
      "Timeline & Milestone Definition",
      "Risk Identification Matrix",
    ],
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200",
  },
  {
    id: "feasibility-study",
    num: "02",
    title: "Feasibility Study",
    shortDesc:
      "Technical and economic viability analysis ensuring informed investment decisions.",
    desc: "Before a single brick is laid, our feasibility studies give clients clear-eyed analysis of technical viability, cost projections, and risk landscape — empowering confident investment decisions. We evaluate multiple scenarios and provide data-driven recommendations.",
    items: [
      "Technical & Environmental Surveys",
      "Cost-Benefit Analysis",
      "Risk Assessment & Mitigation",
      "Investment Viability Reports",
      "Site Evaluation",
      "Market Analysis",
    ],
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200",
  },
  {
    id: "design-review",
    num: "03",
    title: "Design Review",
    shortDesc:
      "Expert evaluation of design documents for compliance, constructability, and optimization.",
    desc: "Our design review service provides independent, expert evaluation of architectural and engineering designs. We identify potential issues, recommend optimizations, and ensure compliance with codes and standards before construction begins.",
    items: [
      "Code Compliance Verification",
      "Constructability Analysis",
      "Value Engineering Opportunities",
      "Clash Detection",
      "Documentation Completeness Check",
    ],
    image:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1200",
  },
  {
    id: "structural-engineering",
    num: "04",
    title: "Structural Engineering Drawing",
    shortDesc:
      "Precision structural drawings and calculations for safe, durable building systems.",
    desc: "Our structural engineering team produces detailed drawings and calculations that ensure your building stands the test of time. We use advanced analysis tools to optimize material usage while maintaining safety and performance standards.",
    items: [
      "Foundation & Framing Plans",
      "Reinforcement Details",
      "Load Calculations",
      "Connection Specifications",
      "Construction Sequence Drawings",
    ],
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200",
  },
  {
    id: "mechanical-electrical",
    num: "05",
    title: "Mechanical and Electrical Design",
    shortDesc:
      "Integrated MEP systems design for efficient building operations and occupant comfort.",
    desc: "We design comprehensive mechanical, electrical, and plumbing systems that work in harmony. Our integrated approach ensures energy efficiency, maintainability, and optimal performance throughout the building lifecycle.",
    items: [
      "HVAC System Design",
      "Electrical Load Planning",
      "Plumbing & Sanitary Systems",
      "Fire Protection Design",
      "Energy Modeling & Optimization",
    ],
    image:
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=1200",
  },
  {
    id: "civil-engineering",
    num: "06",
    title: "Civil Engineering Design",
    shortDesc:
      "Site development, earthworks, drainage, and infrastructure design solutions.",
    desc: "Our civil engineering team delivers comprehensive site development designs including grading, drainage, utilities, and transportation infrastructure. We ensure your project integrates seamlessly with its surroundings.",
    items: [
      "Site Grading & Earthworks",
      "Stormwater Management",
      "Utility Infrastructure",
      "Roadway & Pavement Design",
      "Erosion Control Plans",
    ],
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200",
  },
  {
    id: "working-drawing",
    num: "07",
    title: "Complete Working Drawing",
    shortDesc:
      "Comprehensive construction documentation for seamless project execution.",
    desc: "Our complete working drawing packages include all necessary details, dimensions, and specifications required for construction. These comprehensive documents serve as the primary communication tool between design teams and contractors.",
    items: [
      "Architectural Plans & Elevations",
      "Structural Drawings",
      "MEP Coordination Drawings",
      "Sections & Details",
      "Schedules & Specifications",
    ],
    image:
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=1200",
  },
  {
    id: "supervision",
    num: "08",
    title: "Residency / Supervision",
    shortDesc:
      "On-site quality assurance, progress monitoring, and construction oversight.",
    desc: "Our resident supervision services provide continuous on-site oversight to ensure construction adheres to drawings, specifications, and quality standards. We act as your eyes and ears on the ground throughout the construction phase.",
    items: [
      "Daily Progress Monitoring",
      "Quality Control Inspections",
      "Material Verification",
      "Safety Compliance Audits",
      "Progress Reporting & Documentation",
    ],
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200",
  },
];

function ServiceRow({
  service,
  reverse,
  onServiceClick,
}: {
  service: (typeof ALL_SERVICES)[0];
  reverse: boolean;
  onServiceClick: (service: (typeof ALL_SERVICES)[0]) => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <MotionBox
      ref={ref}
      id={service.id}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <Grid
        templateColumns={{ base: "1fr", lg: reverse ? "1fr 1fr" : "1fr 1fr" }}
        gap={0}
        border="1px solid"
        borderColor="stellar.border"
        overflow="hidden"
        mb={6}
        role="group"
        transition="border-color 0.3s, box-shadow 0.3s"
        _hover={{
          borderColor: "brand.700",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        }}
        cursor="pointer"
        onClick={() => onServiceClick(service)}
      >
        {/* Image */}
        <GridItem
          order={{ base: 0, lg: reverse ? 1 : 0 }}
          minH={{ base: "220px", md: "340px" }}
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            inset={0}
            bgImage={`url('${service.image}')`}
            bgSize="cover"
            bgPos="center"
            transition="transform 0.6s ease"
            sx={{ "[role=group]:hover &": { transform: "scale(1.04)" } }}
          />
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-br, rgba(8,12,20,0.5), rgba(8,12,20,0.1))"
          />
          <Box position="absolute" top={6} left={6}>
            <Text
              fontFamily="mono"
              fontSize="3xl"
              fontWeight="900"
              color="rgba(200,150,62,0.2)"
              lineHeight="1"
            >
              {service.num}
            </Text>
          </Box>
        </GridItem>

        {/* Content */}
        <GridItem
          order={{ base: 1, lg: reverse ? 0 : 1 }}
          p={{ base: 8, md: 12 }}
          bg="stellar.card"
          display="flex"
          flexDir="column"
          justifyContent="center"
        >
          <Text
            fontFamily="mono"
            fontSize="xs"
            color="brand.500"
            letterSpacing="0.2em"
            textTransform="uppercase"
            mb={3}
          >
            Service {service.num}
          </Text>
          <Text
            fontFamily="heading"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            color="stellar.text"
            lineHeight="1.2"
            mb={5}
            letterSpacing="-0.01em"
          >
            {service.title}
          </Text>
          <Text fontSize="sm" color="stellar.muted" lineHeight="1.8" mb={7}>
            {service.shortDesc}
          </Text>
          <List spacing={2}>
            {service.items.slice(0, 3).map((item) => (
              <ListItem key={item} display="flex" alignItems="center" gap={2}>
                <Box color="brand.500" flexShrink={0}>
                  <CheckIcon />
                </Box>
                <Text
                  fontSize="xs"
                  color="stellar.light"
                  letterSpacing="0.03em"
                >
                  {item}
                </Text>
              </ListItem>
            ))}
          </List>
          <Button
            variant="link"
            color="brand.500"
            fontSize="xs"
            fontWeight="600"
            letterSpacing="0.1em"
            textTransform="uppercase"
            mt={5}
            alignSelf="flex-start"
            _hover={{ textDecoration: "none", color: "brand.400" }}
            rightIcon={<Text as="span">→</Text>}
          >
            Read More
          </Button>
        </GridItem>
      </Grid>
    </MotionBox>
  );
}

// Service Detail Drawer Component
function ServiceDetailDrawer({
  isOpen,
  onClose,
  service,
}: {
  isOpen: boolean;
  onClose: () => void;
  service: (typeof ALL_SERVICES)[0] | null;
}) {
  if (!service) return null;

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
      <DrawerOverlay backdropFilter="blur(8px)" bg="rgba(8,12,20,0.65)" />
      <DrawerContent
        bg="stellar.bg"
        borderLeft="1px solid"
        borderColor="stellar.border"
      >
        <DrawerBody p={0}>
          <Box position="relative" h="full" overflowY="auto">
            {/* Close button */}
            <IconButton
              aria-label="Close drawer"
              icon={<CloseIcon />}
              position="sticky"
              top={4}
              right={4}
              float="right"
              zIndex={2}
              bg="rgba(0,0,0,0.6)"
              backdropFilter="blur(4px)"
              color="white"
              _hover={{ bg: "brand.500", color: "white" }}
              onClick={onClose}
              size="sm"
              m={4}
            />

            {/* Hero Image */}
            <Box
              h="280px"
              bgImage={`url('${service.image}')`}
              bgSize="cover"
              bgPos="center"
              position="relative"
            >
              <Box
                position="absolute"
                inset={0}
                bgGradient="linear(to-b, rgba(8,12,20,0.4), rgba(8,12,20,0.8))"
              />
              <Box position="absolute" bottom={6} left={8}>
                <Text
                  fontFamily="mono"
                  fontSize="xs"
                  color="brand.500"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                  mb={2}
                >
                  {service.num} / 08
                </Text>
                <Heading size="2xl" color="white" fontWeight="800">
                  {service.title}
                </Heading>
              </Box>
            </Box>

            {/* Content */}
            <Box p={8}>
              <VStack align="stretch" spacing={6}>
                <Box>
                  <Heading
                    size="md"
                    color="stellar.text"
                    mb={4}
                    fontWeight="700"
                  >
                    Service Overview
                  </Heading>
                  <Text fontSize="md" color="stellar.muted" lineHeight="1.8">
                    {service.desc}
                  </Text>
                </Box>

                <Divider borderColor="stellar.border" />

                <Box>
                  <Heading
                    size="md"
                    color="stellar.text"
                    mb={4}
                    fontWeight="700"
                  >
                    What We Deliver
                  </Heading>
                  <List spacing={3}>
                    {service.items.map((item) => (
                      <ListItem
                        key={item}
                        display="flex"
                        alignItems="center"
                        gap={3}
                      >
                        <Box color="brand.500" flexShrink={0}>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </Box>
                        <Text fontSize="sm" color="stellar.light">
                          {item}
                        </Text>
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Divider borderColor="stellar.border" />

                <Box>
                  <Heading
                    size="md"
                    color="stellar.text"
                    mb={4}
                    fontWeight="700"
                  >
                    Why Choose Lightyear
                  </Heading>
                  <Text fontSize="md" color="stellar.muted" lineHeight="1.8">
                    With years of experience delivering complex engineering
                    projects, our team brings technical excellence, innovative
                    solutions, and unwavering commitment to quality. We work
                    closely with clients to understand their unique needs and
                    deliver results that exceed expectations.
                  </Text>
                </Box>
              </VStack>
            </Box>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default function ServicesPage() {
  const headRef = useRef(null);
  const headInView = useInView(headRef, { once: true });
  const [selectedService, setSelectedService] = useState<
    (typeof ALL_SERVICES)[0] | null
  >(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  const handleServiceClick = (service: (typeof ALL_SERVICES)[0]) => {
    setSelectedService(service);
    onOpen();
  };

  // Handle hash navigation from navbar dropdown
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const elementId = hash.replace("#", "");
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  }, [location]);

  return (
    <>
      <Box
        py={{ base: 24, md: 32 }}
        bg="stellar.bg"
        position="relative"
        overflow="hidden"
        borderBottom="1px solid"
        borderColor="stellar.border"
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
              What We Offer
            </Text>
          </HStack>
          <Text
            as="h1"
            fontFamily="heading"
            fontWeight="900"
            fontSize={{ base: "4xl", md: "6xl" }}
            color="white"
            lineHeight="1.1"
            maxW="700px"
          >
            Our{" "}
            <Box as="span" color="brand.400">
              Services
            </Box>
          </Text>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="stellar.muted"
            mt={5}
            maxW="560px"
            lineHeight="1.8"
          >
            End-to-end engineering and construction solutions, tailored to your
            vision and executed to exacting standards.
          </Text>
        </Box>
      </Box>

      <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.bg">
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
          <MotionBox
            ref={headRef}
            initial={{ opacity: 0, y: 30 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            mb={14}
          >
            <Box h="1px" w="40px" bg="brand.500" mb={5} />
            <Text
              as="h2"
              fontFamily="heading"
              fontWeight="800"
              fontSize={{ base: "3xl", md: "5xl" }}
              color="stellar.text"
              lineHeight="1.1"
            >
              Comprehensive{" "}
              <Box as="span" color="brand.400">
                Capabilities
              </Box>
            </Text>
            <Text fontSize="md" color="stellar.muted" mt={4} maxW="600px">
              Click any service to learn more about how we can help bring your
              project to life.
            </Text>
          </MotionBox>

          {ALL_SERVICES.map((s, i) => (
            <ServiceRow
              key={s.num}
              service={s}
              reverse={i % 2 !== 0}
              onServiceClick={handleServiceClick}
            />
          ))}
        </Box>
      </Box>

      {/* Service Detail Drawer */}
      <ServiceDetailDrawer
        isOpen={isOpen}
        onClose={onClose}
        service={selectedService}
      />
    </>
  );
}