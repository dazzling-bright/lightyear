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
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBarChart2,
  FiTrendingUp,
  FiSearch,
  FiHardDrive,
  FiZap,
  FiMap,
  FiTool,
  FiUsers,
  FiX,
  FiCheck,
} from "react-icons/fi";
import {
  GiArchiveResearch,
  GiPencilRuler,
  GiFamilyHouse,
  GiCrane,
  
  GiBrickWall,
  
  GiPylon,
  GiBridge,
} from "react-icons/gi";
import { FaBuilding } from "react-icons/fa";

const MotionBox = motion(Box);

const CloseIcon = () => <FiX size={20} />;
const CheckIcon = () => <FiCheck size={14} />;

// Same 8 services from ServicesPage with React icons
const SERVICES = [
  {
    id: "project-studies",
    title: "Project Studies",
    shortDesc:
      "Comprehensive analysis of project viability, scope definition, and strategic planning for optimal outcomes.",
    detailedDesc:
      "Our project studies provide a thorough examination of your proposed development, covering technical requirements, resource allocation, timeline estimation, and risk assessment. We deliver actionable insights that inform go/no-go decisions and strategic planning.",
    items: [
      "Site Selection & Analysis",
      "Regulatory Compliance Review",
      "Resource Requirement Planning",
      "Timeline & Milestone Definition",
      "Risk Identification Matrix",
    ],
    icon: <GiArchiveResearch size={32} />,
  },
  {
    id: "feasibility-study",
    title: "Feasibility Study",
    shortDesc:
      "Technical and economic viability analysis ensuring informed investment decisions.",
    detailedDesc:
      "Before a single brick is laid, our feasibility studies give clients clear-eyed analysis of technical viability, cost projections, and risk landscape — empowering confident investment decisions.",
    items: [
      "Technical & Environmental Surveys",
      "Cost-Benefit Analysis",
      "Risk Assessment & Mitigation",
      "Investment Viability Reports",
    ],
    icon: <FiBarChart2 size={32} />,
  },
  {
    id: "design-review",
    title: "Design Review",
    shortDesc:
      "Expert evaluation of design documents for compliance, constructability, and optimization.",
    detailedDesc:
      "Our design review service provides independent, expert evaluation of architectural and engineering designs. We identify potential issues, recommend optimizations, and ensure compliance.",
    items: [
      "Code Compliance Verification",
      "Constructability Analysis",
      "Value Engineering",
      "Clash Detection",
    ],
    icon: <FiSearch size={32} />,
  },
  {
    id: "structural-engineering",
    title: "Structural Engineering Drawing",
    shortDesc:
      "Precision structural drawings and calculations for safe, durable building systems.",
    detailedDesc:
      "Our structural engineering team produces detailed drawings and calculations that ensure your building stands the test of time.",
    items: [
      "Foundation Plans",
      "Reinforcement Details",
      "Load Calculations",
      "Connection Specifications",
    ],
    icon: <GiPylon size={32} />,
  },
  {
    id: "mechanical-electrical",
    title: "Mechanical & Electrical Design",
    shortDesc:
      "Integrated MEP systems design for efficient building operations.",
    detailedDesc:
      "We design comprehensive mechanical, electrical, and plumbing systems that work in harmony for energy efficiency.",
    items: [
      "HVAC Design",
      "Electrical Planning",
      "Plumbing Systems",
      "Fire Protection",
    ],
    icon: <FiZap size={32} />,
  },
  {
    id: "civil-engineering",
    title: "Civil Engineering Design",
    shortDesc:
      "Site development, drainage, and infrastructure design solutions.",
    detailedDesc:
      "Our civil engineering team delivers comprehensive site development designs including grading, drainage, and utilities.",
    items: [
      "Site Grading",
      "Stormwater Management",
      "Utility Infrastructure",
      "Roadway Design",
    ],
    icon: <GiBridge size={32} />,
  },
  {
    id: "working-drawing",
    title: "Complete Working Drawing",
    shortDesc:
      "Comprehensive construction documentation for seamless execution.",
    detailedDesc:
      "Our complete working drawing packages include all necessary details, dimensions, and specifications for construction.",
    items: [
      "Architectural Plans",
      "Structural Drawings",
      "MEP Drawings",
      "Specifications",
    ],
    icon: <FaBuilding size={32} />,
  },
  {
    id: "supervision",
    title: "Residency / Supervision",
    shortDesc:
      "On-site quality assurance, progress monitoring, and construction oversight.",
    detailedDesc:
      "Our resident supervision services provide continuous on-site oversight to ensure construction adheres to specifications.",
    items: [
      "Progress Monitoring",
      "Quality Control",
      "Material Verification",
      "Safety Audits",
    ],
    icon: <GiCrane size={32} />,
  },
];

// Service Card Component with onClick drawer
function ServiceCard({
  service,
  index,
  onServiceClick,
}: {
  service: (typeof SERVICES)[0];
  index: number;
  onServiceClick: (service: (typeof SERVICES)[0]) => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      h="full"
      cursor="pointer"
      onClick={() => onServiceClick(service)}
    >
      <Box
        p={6}
        h="full"
        bg="stellar.card"
        border="1px solid"
        borderColor="stellar.border"
        position="relative"
        overflow="hidden"
        display="flex"
        flexDir="column"
        role="group"
        transition="all 0.35s"
        _hover={{
          borderColor: "rgba(200,150,62,0.4)",
          transform: "translateY(-6px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <Text
          position="absolute"
          top={3}
          right={4}
          fontFamily="mono"
          fontSize="2xl"
          fontWeight="900"
          color="stellar.border"
          lineHeight="1"
        >
          {String(index + 1).padStart(2, "0")}
        </Text>

        <Box color="brand.500" mb={3}>
          {service.icon}
        </Box>

        <Text
          fontFamily="heading"
          fontSize="lg"
          fontWeight="700"
          color="stellar.text"
          mb={3}
          letterSpacing="-0.01em"
        >
          {service.title}
        </Text>

        <Text
          fontSize="sm"
          color="stellar.muted"
          lineHeight="1.7"
          mb={4}
          flex={1}
        >
          {service.shortDesc}
        </Text>

        <Button
          variant="link"
          fontSize="xs"
          fontWeight="600"
          letterSpacing="0.1em"
          textTransform="uppercase"
          color="brand.500"
          alignSelf="flex-start"
          _hover={{ textDecoration: "none", color: "brand.400" }}
          rightIcon={<Text as="span">→</Text>}
        >
          Learn More
        </Button>
      </Box>
    </MotionBox>
  );
}

// Drawer Component (same as ServicesPage)
function ServiceDetailDrawer({
  isOpen,
  onClose,
  service,
}: {
  isOpen: boolean;
  onClose: () => void;
  service: (typeof SERVICES)[0] | null;
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

            <Box p={8} pt={16}>
              <VStack align="stretch" spacing={6}>
                <Box>
                  <Text
                    fontFamily="mono"
                    fontSize="xs"
                    color="brand.500"
                    letterSpacing="0.2em"
                    mb={2}
                  >
                    Service
                  </Text>
                  <Heading size="xl" color="stellar.text" fontWeight="800">
                    {service.title}
                  </Heading>
                </Box>

                <Divider borderColor="stellar.border" />

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
                    {service.detailedDesc}
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
                          <CheckIcon />
                        </Box>
                        <Text fontSize="sm" color="stellar.light">
                          {item}
                        </Text>
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Button
                  as={Link}
                  to="/services"
                  variant="gold"
                  size="sm"
                  w="full"
                  onClick={onClose}
                >
                  View All Services
                </Button>
              </VStack>
            </Box>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default function ServicesSection() {
  const headRef = useRef(null);
  const headInView = useInView(headRef, { once: true });
  const [selectedService, setSelectedService] = useState<
    (typeof SERVICES)[0] | null
  >(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleServiceClick = (service: (typeof SERVICES)[0]) => {
    setSelectedService(service);
    onOpen();
  };

  return (
    <>
      <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.bg">
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
          <MotionBox
            ref={headRef}
            initial={{ opacity: 0, y: 30 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            mb={16}
          >
            <Box>
              <Box display="flex" alignItems="center" gap={4} mb={4}>
                <Box h="1px" w="40px" bg="brand.500" />
                <Text
                  fontFamily="mono"
                  fontSize="xs"
                  color="brand.500"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                >
                  What We Do
                </Text>
              </Box>
              <Text
                as="h2"
                fontFamily="heading"
                fontWeight="800"
                fontSize={{ base: "3xl", md: "5xl" }}
                color="stellar.text"
                lineHeight="1.2"
                mb={6}
              >
                Comprehensive{" "}
                <Box as="span" color="brand.400">
                  Services
                </Box>
              </Text>
              <Text
                fontSize="sm"
                color="stellar.muted"
                maxW="500px"
                lineHeight="1.8"
              >
                End-to-end engineering and construction solutions tailored to
                your project requirements
              </Text>
            </Box>
          </MotionBox>

          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2,1fr)",
              lg: "repeat(4,1fr)",
            }}
            gap={6}
          >
            {SERVICES.map((s, i) => (
              <GridItem key={s.title} h="full">
                <ServiceCard
                  service={s}
                  index={i}
                  onServiceClick={handleServiceClick}
                />
              </GridItem>
            ))}
          </Grid>
        </Box>
      </Box>

      <ServiceDetailDrawer
        isOpen={isOpen}
        onClose={onClose}
        service={selectedService}
      />
    </>
  );
}
