// import { Box, Grid, GridItem, Text, VStack, HStack, List, ListItem } from '@chakra-ui/react'
// import { motion, useInView } from 'framer-motion'
// import { useRef } from 'react'
// import { Link } from 'react-router-dom'

// const MotionBox = motion(Box)

// const ShieldIcon = () => (
//   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//     <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
//   </svg>
// )
// const BuildingIcon = () => (
//   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//     <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
//     <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
//     <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
//     <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
//   </svg>
// )
// const TargetIcon2 = () => (
//   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//     <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
//   </svg>
// )
// const UsersIcon = () => (
//   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//     <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
//     <circle cx="9" cy="7" r="4"/>
//     <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
//     <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
//   </svg>
// )
// const CheckIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//     <polyline points="20 6 9 17 4 12"/>
//   </svg>
// )

// const SERVICES = [
//   {
//     icon: <ShieldIcon />,
//     title: 'Feasibility Studies',
//     desc: 'Comprehensive technical and economic analysis, site evaluation, risk assessment, and investment viability studies for informed decision-making.',
//     items: ['Technical Surveys', 'Cost Analysis', 'Risk Assessment'],
//   },
//   {
//     icon: <BuildingIcon />,
//     title: 'Design & Engineering',
//     desc: 'Innovative architectural design, structural engineering, MEP systems, and sustainable building solutions using BIM technology.',
//     items: ['BIM Modeling', 'Structural Design', 'MEP Systems'],
//   },
//   {
//     icon: <TargetIcon2 />,
//     title: 'Project Management',
//     desc: 'End-to-end project delivery with rigorous quality control, budget management, and timeline optimization methodologies.',
//     items: ['Quality Control', 'Budget Management', 'Timeline Optimization'],
//   },
//   {
//     icon: <UsersIcon />,
//     title: 'Construction Services',
//     desc: 'Turnkey construction solutions from ground-up development to complex renovations and specialized infrastructure projects.',
//     items: ['Turnkey Solutions', 'Renovations', 'Infrastructure'],
//   },
// ]

// function ServiceCard({ icon, title, desc, items, index }: typeof SERVICES[0] & { index: number }) {
//   const ref = useRef(null)
//   const inView = useInView(ref, { once: true, margin: '-60px' })
//   return (
//     <MotionBox
//       ref={ref}
//       initial={{ opacity: 0, y: 40 }}
//       animate={inView ? { opacity: 1, y: 0 } : {}}
//       transition={{ duration: 0.55, delay: index * 0.1 }}
//       h="full"
//     >
//       <Box
//         p={8}
//         h="full"
//         bg="stellar.card"
//         border="1px solid"
//         borderColor="stellar.border"
//         position="relative"
//         overflow="hidden"
//         display="flex"
//         flexDir="column"
//         role="group"
//         transition="all 0.35s"
//         _hover={{
//           borderColor: 'rgba(200,150,62,0.4)',
//           transform: 'translateY(-6px)',
//           boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
//         }}
//       >
//         {/* Number watermark */}
//         <Text
//           position="absolute"
//           top={4} right={5}
//           fontFamily="mono"
//           fontSize="5xl"
//           fontWeight="900"
//           color="stellar.border"
//           lineHeight="1"
//           userSelect="none"
//           transition="color 0.3s"
//           sx={{ '[role=group]:hover &': { color: 'rgba(200,150,62,0.08)' } }}
//         >
//           {String(index + 1).padStart(2, '0')}
//         </Text>

//         {/* Icon */}
//         <Box
//           mb={6}
//           w="64px" h="64px"
//           bg="rgba(200,150,62,0.08)"
//           border="1px solid"
//           borderColor="rgba(200,150,62,0.15)"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           color="brand.500"
//           transition="all 0.3s"
//           sx={{
//             '[role=group]:hover &': {
//               bg: 'rgba(200,150,62,0.15)',
//               borderColor: 'brand.500',
//               transform: 'scale(1.05)',
//             }
//           }}
//         >
//           {icon}
//         </Box>

//         <Text
//           fontFamily="heading"
//           fontSize="xl"
//           fontWeight="700"
//           color="stellar.text"
//           mb={4}
//           letterSpacing="-0.01em"
//         >
//           {title}
//         </Text>
//         <Text fontSize="sm" color="stellar.muted" lineHeight="1.8" mb={6} flex={1}>
//           {desc}
//         </Text>

//         <List spacing={2} mb={6}>
//           {items.map(item => (
//             <ListItem key={item} display="flex" alignItems="center" gap={2}>
//               <Box color="brand.500" flexShrink={0}><CheckIcon /></Box>
//               <Text fontSize="xs" color="stellar.light" letterSpacing="0.03em">{item}</Text>
//             </ListItem>
//           ))}
//         </List>

//         <Box
//           as={Link}
//           to="/services"
//           display="inline-flex"
//           alignItems="center"
//           gap={2}
//           fontSize="xs"
//           fontWeight="700"
//           letterSpacing="0.1em"
//           textTransform="uppercase"
//           color="brand.500"
//           transition="all 0.2s"
//           _hover={{ color: 'brand.300', gap: 3 }}
//         >
//           Explore Service
//           <Box transition="transform 0.2s" sx={{ 'a:hover &': { transform: 'translateX(4px)' } }}>→</Box>
//         </Box>

//         {/* Left border accent */}
//         <Box
//           position="absolute" left={0} top="20%" bottom="20%"
//           w="2px"
//           bgGradient="linear(to-b, transparent, brand.500, transparent)"
//           opacity={0}
//           transition="opacity 0.3s"
//           sx={{ '[role=group]:hover &': { opacity: 1 } }}
//         />
//       </Box>
//     </MotionBox>
//   )
// }

// export default function ServicesSection() {
//   const headRef = useRef(null)
//   const headInView = useInView(headRef, { once: true })
//   return (
//     <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.bg">
//       <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
//         <MotionBox
//           ref={headRef}
//           initial={{ opacity: 0, y: 30 }}
//           animate={headInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6 }}
//           mb={16}
//           display="flex"
//           flexDir={{ base: 'column', md: 'row' }}
//           justifyContent="space-between"
//           alignItems={{ base: 'start', md: 'end' }}
//           gap={6}
//         >
//           <Box>
//             <Box display="flex" alignItems="center" gap={4} mb={4}>
//               <Box h="1px" w="40px" bg="brand.500" />
//               <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
//                 What We Do
//               </Text>
//             </Box>
//             <Text
//               as="h2"
//               fontFamily="heading"
//               fontWeight="800"
//               fontSize={{ base: '3xl', md: '5xl' }}
//               color="stellar.text"
//               lineHeight="1.1"
//             >
//               Comprehensive{' '}
//               <Box as="span" color="brand.400">Services</Box>
//             </Text>
//           </Box>
//           <Text fontSize="sm" color="stellar.muted" maxW="300px" lineHeight="1.8">
//             End-to-end engineering and construction solutions tailored to your project requirements
//           </Text>
//         </MotionBox>

//         <Grid
//           templateColumns={{ base: '1fr', md: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' }}
//           gap={6}
//         >
//           {SERVICES.map((s, i) => (
//             <GridItem key={s.title} h="full">
//               <ServiceCard {...s} index={i} />
//             </GridItem>
//           ))}
//         </Grid>
//       </Box>
//     </Box>
//   )
// }

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

const MotionBox = motion(Box);

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

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Same 8 services from ServicesPage
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
    icon: "📊",
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
    icon: "📈",
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
    icon: "🔍",
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
    icon: "🏗️",
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
    icon: "⚡",
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
    icon: "🏔️",
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
    icon: "📐",
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
    icon: "👷",
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

        <Text fontSize="3xl" mb={3}>
          {service.icon}
        </Text>

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
            display="flex"
            flexDir={{ base: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ base: "start", md: "end" }}
            gap={6}
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
                lineHeight="1.1"
              >
                Comprehensive{" "}
                <Box as="span" color="brand.400">
                  Services
                </Box>
              </Text>
            </Box>
            <Text
              fontSize="sm"
              color="stellar.muted"
              maxW="300px"
              lineHeight="1.8"
            >
              End-to-end engineering and construction solutions tailored to your
              project requirements
            </Text>
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