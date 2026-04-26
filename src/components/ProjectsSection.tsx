// src/components/ProjectsSection.tsx
import { useState, useRef } from "react";
import {
  Box,
  Grid,
  GridItem,
  Text,
  HStack,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ProjectDetailsDrawer from "./ProjectDetailsDrawer";

const MotionBox = motion(Box);

const CalendarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const PinIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Categories for filtering
const CATEGORIES = [
  "All",
  "Commercial",
  "Electrical",
  "Infrastructure",
  "Residential",
  "Industrial",
];

// Expanded project data with more projects (no financial/sensitive info)
const PROJECTS_WITH_DETAILS = [
  {
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200",
    category: "Commercial",
    title: "Innovation Business Hub",
    year: "2023",
    units: "120 Units",
    location: "Abuja, Nigeria",
    categoryColor: "brand.500",
    description:
      "A 12-storey mixed-use commercial complex featuring 120 office units, a conference center, and ground-floor retail — delivered 3 weeks ahead of schedule.",
    duration: "18 months",
    scope: [
      "Mixed-use Development",
      "Commercial Construction",
      "Conference Center",
      "Retail Space Integration",
      "Project Management",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1200",
    category: "Electrical",
    title: "Riverside Power Plant",
    year: "2024",
    units: "1 Facility",
    location: "Kogi State, Nigeria",
    categoryColor: "blue.400",
    description:
      "A 20MW diesel-hybrid power facility built to power a 5,000-home residential estate and adjacent industrial cluster.",
    duration: "24 months",
    scope: [
      "Feasibility Study",
      "Power Generation",
      "Hybrid Systems Integration",
      "Grid Connection",
      "Infrastructure Development",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200",
    category: "Infrastructure",
    title: "Innovation Transport Hub",
    year: "2023",
    units: "Multi-modal Facility",
    location: "Lagos, Nigeria",
    categoryColor: "teal.400",
    description:
      "A multi-modal transit facility integrating bus, rail, and ride-hailing services to serve over 100,000 daily commuters.",
    duration: "30 months",
    scope: [
      "Transportation Planning",
      "Structural Engineering",
      "Pedestrian Infrastructure",
      "Smart Transit Systems",
      "Accessibility Features",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200",
    category: "Residential",
    title: "Emerald Gardens Estate",
    year: "2022",
    units: "85 Units",
    location: "Enugu, Nigeria",
    categoryColor: "green.400",
    description:
      "A gated community of 85 premium residential units with landscaped amenities, a clubhouse, and solar-powered street lighting.",
    duration: "20 months",
    scope: [
      "Residential Construction",
      "Landscape Architecture",
      "Solar Power Integration",
      "Clubhouse Development",
      "Security Systems",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200",
    category: "Industrial",
    title: "AgriPro Processing Plant",
    year: "2022",
    units: "1 Facility",
    location: "Kaduna, Nigeria",
    categoryColor: "purple.400",
    description:
      "A state-of-the-art food processing facility designed for a 200-tonne daily throughput with full HACCP compliance.",
    duration: "16 months",
    scope: [
      "Industrial Construction",
      "Food Processing Systems",
      "HACCP Compliance",
      "Equipment Installation",
      "Quality Control Labs",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200",
    category: "Commercial",
    title: "Meridian Office Tower",
    year: "2021",
    units: "9 Stories",
    location: "Accra, Ghana",
    categoryColor: "brand.500",
    description:
      "A 9-storey grade-A office tower built to EDGE green building certification standards for a leading Pan-African bank.",
    duration: "22 months",
    scope: [
      "Commercial Tower",
      "Green Building Certification",
      "Bank Headquarters",
      "Modern Amenities",
      "Sustainable Design",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1575408264798-b50b252663e6?q=80&w=1200",
    category: "Residential",
    title: "Sunset Valley Estates",
    year: "2023",
    units: "150 Units",
    location: "Cape Town, South Africa",
    categoryColor: "green.400",
    description:
      "A premium residential development featuring modern apartments, recreational facilities, and eco-friendly infrastructure.",
    duration: "28 months",
    scope: [
      "Multi-family Housing",
      "Recreational Facilities",
      "Eco-friendly Design",
      "Landscape Integration",
      "Smart Home Technology",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200",
    category: "Infrastructure",
    title: "Coastal Highway Project",
    year: "2024",
    units: "45 km",
    location: "Mombasa, Kenya",
    categoryColor: "teal.400",
    description:
      "A major coastal highway expansion project reducing travel time by 40% and improving trade routes.",
    duration: "36 months",
    scope: [
      "Highway Construction",
      "Bridge Engineering",
      "Drainage Systems",
      "Safety Features",
      "Environmental Impact Mitigation",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1566406621532-6fcf9bd6a297?q=80&w=1200",
    category: "Electrical",
    title: "Solar Farm Initiative",
    year: "2023",
    units: "50 MW",
    location: "Northern Nigeria",
    categoryColor: "blue.400",
    description:
      "A large-scale solar farm providing renewable energy to 100,000+ households and reducing carbon emissions.",
    duration: "14 months",
    scope: [
      "Solar Array Installation",
      "Energy Storage Systems",
      "Grid Integration",
      "Environmental Assessment",
      "Community Engagement",
    ],
  },
];

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: (typeof PROJECTS_WITH_DETAILS)[0];
  index: number;
  onClick: () => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Truncate description to a specific number of characters or lines
  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      onClick={onClick}
      cursor="pointer"
      layout
      h="100%" // Ensure MotionBox takes full height
    >
      <Box
        role="group"
        overflow="hidden"
        border="1px solid"
        borderColor="stellar.border"
        bg="stellar.card"
        transition="all 0.4s"
        h="100%" // Make Box take full height of MotionBox
        display="flex"
        flexDir="column"
        _hover={{
          borderColor: "brand.700",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          transform: "translateY(-4px)",
        }}
      >
        {/* Image Section - Fixed height */}
        <Box position="relative" h="200px" overflow="hidden" flexShrink={0}>
          <Box
            position="absolute"
            inset={0}
            bgImage={`url('${project.image}')`}
            bgSize="cover"
            bgPos="center"
            transition="transform 0.6s ease"
            sx={{ "[role=group]:hover &": { transform: "scale(1.06)" } }}
          />
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-t, rgba(8,12,20,0.95) 0%, rgba(8,12,20,0.3) 50%, transparent 100%)"
          />
          <Box position="absolute" top={4} left={4}>
            <Text
              display="inline-block"
              px={3}
              py={1}
              bg="rgba(8,12,20,0.8)"
              border="1px solid"
              borderColor="brand.700"
              fontFamily="mono"
              fontSize="xs"
              color="brand.400"
              letterSpacing="0.12em"
              textTransform="uppercase"
              backdropFilter="blur(8px)"
            >
              {project.category}
            </Text>
          </Box>
        </Box>

        {/* Content Section - Flexible with fixed layout */}
        <Box p={6} flex={1} display="flex" flexDir="column">
          {/* Title - Fixed height area */}
          <Box minH="40px" mb={3}>
            <Text
              fontFamily="heading"
              fontSize="xl"
              fontWeight="700"
              color="stellar.text"
              lineHeight="1.3"
              letterSpacing="-0.01em"
              transition="color 0.2s"
              sx={{ "[role=group]:hover &": { color: "brand.400" } }}
              noOfLines={2} // Limit title to 2 lines
            >
              {project.title}
            </Text>
          </Box>

          {/* Description - Truncated to 3 lines for consistency */}
          <Box flex={1} mb={4}>
            <Text
              fontSize="sm"
              color="stellar.muted"
              lineHeight="1.6"
              noOfLines={3} // Chakra UI prop to limit to 3 lines
            >
              {project.description}
            </Text>
          </Box>

          {/* Location & Year - Fixed height area */}
          <Box mt="auto" pt={2}>
            <HStack justify="space-between">
              <HStack spacing={1.5}>
                <Box color="brand.600">
                  <PinIcon />
                </Box>
                <Text
                  fontSize="xs"
                  color="stellar.muted"
                  letterSpacing="0.05em"
                  noOfLines={1}
                >
                  {project.location}
                </Text>
              </HStack>
              <HStack spacing={1.5}>
                <Box color="brand.600">
                  <CalendarIcon />
                </Box>
                <Text
                  fontSize="xs"
                  color="stellar.muted"
                  letterSpacing="0.05em"
                >
                  {project.year}
                </Text>
              </HStack>
            </HStack>
          </Box>
        </Box>

        {/* Bottom hover bar */}
        <Box
          h="2px"
          bgGradient="linear(to-r, brand.700, brand.400)"
          transform="scaleX(0)"
          transformOrigin="left"
          transition="transform 0.4s ease"
          sx={{ "[role=group]:hover &": { transform: "scaleX(1)" } }}
        />
      </Box>
    </MotionBox>
  );
}

export default function ProjectsSection() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const headRef = useRef(null);
  const inView = useInView(headRef, { once: true });

  // Filter projects based on active category
  const filteredProjects =
    activeFilter === "All"
      ? PROJECTS_WITH_DETAILS
      : PROJECTS_WITH_DETAILS.filter((p) => p.category === activeFilter);

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    onOpen();
  };

  return (
    <>
      <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.surface">
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
          <MotionBox
            ref={headRef}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            mb={10}
          >
            <Box display="flex" alignItems="center" gap={4} mb={4}>
              <Box h="1px" w="40px" bg="brand.500" />
              <Text
                fontFamily="mono"
                fontSize="xs"
                color="brand.500"
                letterSpacing="0.2em"
                textTransform="uppercase"
              >
                Our Portfolio
              </Text>
            </Box>
            <Text
              as="h2"
              fontFamily="heading"
              fontWeight="800"
              fontSize={{ base: "3xl", md: "5xl" }}
              color="stellar.text"
              lineHeight="1.1"
              mb={6}
            >
              Featured{" "}
              <Box as="span" color="brand.400">
                Projects
              </Box>
            </Text>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="stellar.muted"
              maxW="700px"
              lineHeight="1.8"
            >
              A selection of landmark projects that showcase our breadth of
              capability, technical rigor, and commitment to excellence across
              Africa.
            </Text>
          </MotionBox>

          {/* Filter Buttons */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            mb={12}
          >
            <HStack spacing={2} flexWrap="wrap" gap={3}>
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  px={5}
                  variant={activeFilter === cat ? "gold" : "ghost_light"}
                  onClick={() => setActiveFilter(cat)}
                  _active={{ transform: "scale(0.95)" }}
                >
                  {cat}
                </Button>
              ))}
            </HStack>
          </MotionBox>

          {/* Projects Grid with Animation */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2,1fr)",
              lg: "repeat(3,1fr)",
            }}
            gap={6}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p, i) => (
                <GridItem key={p.title}>
                  <ProjectCard
                    project={p}
                    index={i}
                    onClick={() => handleProjectClick(p)}
                  />
                </GridItem>
              ))}
            </AnimatePresence>
          </Grid>

          {/* Show message when no projects match filter */}
          {filteredProjects.length === 0 && (
            <Box textAlign="center" py={12}>
              <Text color="stellar.muted" fontSize="lg">
                No projects found in this category. Please try another filter.
              </Text>
            </Box>
          )}
        </Box>
      </Box>

      <ProjectDetailsDrawer
        isOpen={isOpen}
        onClose={onClose}
        project={selectedProject}
      />
    </>
  );
}
