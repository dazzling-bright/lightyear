import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  List,
  ListItem,
} from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const MotionBox = motion(Box);

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

const TEAM = [
  {
    name: "Engr. John B. Ugwuagbo",
    role: "Chief Executive Officer",
    certs: "MNSE · ASCE · COREN",
    bio: "Over two decades of engineering excellence leading transformative infrastructure solutions worldwide.",
  },
  {
    name: "Engr. Adaeze Obi",
    role: "Director, Structural Engineering",
    certs: "MNSE · COREN",
    bio: "Specialist in high-rise structural design and seismic engineering across West Africa.",
  },
  {
    name: "Engr. Chukwuemeka Eze",
    role: "Head of Project Management",
    certs: "PMP · MNSE",
    bio: "Delivered over 25 large-scale projects on time and within budget across 8 countries.",
  },
  {
    name: "Arc. Funke Adeleke",
    role: "Lead Architect",
    certs: "NIA · ARCON",
    bio: "Award-winning architect with a focus on sustainable, human-centered design.",
  },
];

const VALUES = [
  "Integrity in every engagement",
  "Innovation-driven solutions",
  "Commitment to quality and safety",
  "Sustainable development practices",
  "Client-centered collaboration",
  "Continuous learning and growth",
];

function PageHero({ title, sub }: { title: React.ReactNode; sub: string }) {
  return (
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
        bgImage="url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070')"
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
            Lightyear Stellar Solutions
          </Text>
        </HStack>
        <Text
          as="h1"
          fontFamily="heading"
          fontWeight="900"
          fontSize={{ base: "4xl", md: "6xl" }}
          color="brand.50"
          lineHeight="1.1"
          maxW="700px"
        >
          {title}
        </Text>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          color="stellar.muted"
          mt={5}
          maxW="560px"
          lineHeight="1.8"
        >
          {sub}
        </Text>
      </Box>
    </Box>
  );
}

export default function WhoWeAre() {
  const aboutRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true });
  const teamRef = useRef(null);
  const teamInView = useInView(teamRef, { once: true, margin: "-80px" });
  const valRef = useRef(null);
  const valInView = useInView(valRef, { once: true });

  return (
    <>
      <PageHero
        title={
          <>
            Who{" "}
            <Box as="span" color="brand.400">
              We Are
            </Box>
          </>
        }
        sub="A team of certified engineers, architects, and construction experts united by a passion for building the future with precision and integrity."
      />

      {/* About section */}
      <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.surface">
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={16}
            alignItems="center"
          >
            <MotionBox
              ref={aboutRef}
              initial={{ opacity: 0, x: -40 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <Box h="1px" w="40px" bg="brand.500" mb={5} />
              <Text
                as="h2"
                fontFamily="heading"
                fontWeight="800"
                fontSize={{ base: "3xl", md: "4xl" }}
                color="stellar.text"
                lineHeight="1.15"
                mb={7}
              >
                Nearly Two Decades of{" "}
                <Box as="span" color="brand.400">
                  Engineering Excellence
                </Box>
              </Text>
              <VStack align="start" spacing={4}>
                {[
                  "Founded in 2006, Lightyear Stellar Solutions has grown from a lean consultancy into a full-spectrum engineering and construction firm operating across Nigeria and 12 countries internationally.",
                  "We combine deep technical expertise with a commitment to sustainable practices — delivering projects that don't just meet specifications, but set new benchmarks for quality and innovation.",
                  "Our multidisciplinary team of COREN-certified engineers, licensed architects, and project management professionals brings a holistic perspective to every engagement.",
                ].map((p, i) => (
                  <Text
                    key={i}
                    fontSize="sm"
                    color="stellar.muted"
                    lineHeight="1.9"
                  >
                    {p}
                  </Text>
                ))}
              </VStack>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, x: 40 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <Box
                position="relative"
                h={{ base: "300px", md: "420px" }}
                border="1px solid"
                borderColor="stellar.border"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  inset={0}
                  bgImage="url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200')"
                  bgSize="cover"
                  bgPos="center"
                />
                <Box
                  position="absolute"
                  inset={0}
                  bgGradient="linear(to-br, rgba(8,12,20,0.3), transparent)"
                />
                {/* Corner badge */}
                <Box
                  position="absolute"
                  bottom={6}
                  left={6}
                  px={5}
                  py={3}
                  bg="rgba(8,12,20,0.9)"
                  border="1px solid"
                  borderColor="brand.700"
                  backdropFilter="blur(10px)"
                >
                  <Text
                    fontFamily="heading"
                    fontSize="3xl"
                    fontWeight="900"
                    color="brand.400"
                    lineHeight="1"
                  >
                    18+
                  </Text>
                  <Text
                    fontFamily="mono"
                    fontSize="xs"
                    color="stellar.muted"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                  >
                    Years of Excellence
                  </Text>
                </Box>
              </Box>

              {/* Stats row */}
              <Grid templateColumns="repeat(3,1fr)" gap={3} mt={4}>
                {[
                  { v: "40+", l: "Projects" },
                  { v: "12", l: "Countries" },
                  { v: "10+", l: "Engineers" },
                ].map((s) => (
                  <Box
                    key={s.l}
                    p={4}
                    border="1px solid"
                    borderColor="stellar.border"
                    bg="stellar.card"
                    textAlign="center"
                  >
                    <Text
                      fontFamily="heading"
                      fontSize="2xl"
                      fontWeight="900"
                      color="brand.400"
                    >
                      {s.v}
                    </Text>
                    <Text
                      fontSize="xs"
                      color="stellar.muted"
                      letterSpacing="0.05em"
                    >
                      {s.l}
                    </Text>
                  </Box>
                ))}
              </Grid>
            </MotionBox>
          </Grid>
        </Box>
      </Box>

      {/* Values */}
      <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.bg">
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
          <MotionBox
            ref={valRef}
            initial={{ opacity: 0, y: 30 }}
            animate={valInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Grid
              templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
              gap={16}
              alignItems="center"
            >
              <Box>
                <Box h="1px" w="40px" bg="brand.500" mb={5} />
                <Text
                  as="h2"
                  fontFamily="heading"
                  fontWeight="800"
                  fontSize={{ base: "3xl", md: "4xl" }}
                  color="stellar.text"
                  lineHeight="1.15"
                  mb={5}
                >
                  The Values That{" "}
                  <Box as="span" color="brand.400">
                    Drive Us
                  </Box>
                </Text>
                <Text
                  fontSize="sm"
                  color="stellar.muted"
                  lineHeight="1.9"
                  mb={8}
                  maxW="420px"
                >
                  Our values aren't slogans — they're the operating principles
                  that guide every decision, design choice, and client
                  interaction.
                </Text>
                <List spacing={3}>
                  {VALUES.map((v) => (
                    <ListItem
                      key={v}
                      display="flex"
                      alignItems="center"
                      gap={3}
                    >
                      <Box
                        w="24px"
                        h="24px"
                        bg="rgba(200,150,62,0.1)"
                        border="1px solid"
                        borderColor="rgba(200,150,62,0.3)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="brand.400"
                        flexShrink={0}
                      >
                        <CheckIcon />
                      </Box>
                      <Text
                        fontSize="sm"
                        color="stellar.light"
                        fontWeight="500"
                      >
                        {v}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box
                p={8}
                border="1px solid"
                borderColor="stellar.border"
                bg="stellar.card"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h="2px"
                  bgGradient="linear(to-r, brand.700, brand.400, brand.700)"
                />
                <Text
                  fontFamily="mono"
                  fontSize="xs"
                  color="brand.500"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                  mb={6}
                >
                  Certifications & Memberships
                </Text>
                <VStack align="start" spacing={4}>
                  {[
                    {
                      code: "COREN",
                      name: "Council for the Regulation of Engineering in Nigeria",
                    },
                    {
                      code: "MNSE",
                      name: "Member, Nigerian Society of Engineers",
                    },
                    {
                      code: "ASCE",
                      name: "American Society of Civil Engineers",
                    },
                    { code: "NIA", name: "Nigerian Institute of Architects" },
                    {
                      code: "ARCON",
                      name: "Architects Registration Council of Nigeria",
                    },
                    { code: "PMP", name: "Project Management Professional" },
                  ].map((cert) => (
                    <HStack
                      key={cert.code}
                      spacing={4}
                      w="full"
                      py={3}
                      borderBottom="1px solid"
                      borderColor="stellar.border"
                      _last={{ borderBottom: "none" }}
                    >
                      <Box
                        px={3}
                        py={1}
                        bg="rgba(200,150,62,0.1)"
                        border="1px solid"
                        borderColor="rgba(200,150,62,0.25)"
                        flexShrink={0}
                      >
                        <Text
                          fontFamily="mono"
                          fontSize="xs"
                          color="brand.400"
                          fontWeight="700"
                          letterSpacing="0.1em"
                        >
                          {cert.code}
                        </Text>
                      </Box>
                      <Text
                        fontSize="xs"
                        color="stellar.muted"
                        lineHeight="1.5"
                      >
                        {cert.name}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </Grid>
          </MotionBox>
        </Box>
      </Box>

      {/* Team */}
      <Box as="section" py={{ base: 20, md: 28 }} bg="stellar.surface">
        <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
          <MotionBox
            ref={teamRef}
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
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
              Leadership{" "}
              <Box as="span" color="brand.400">
                Team
              </Box>
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
            {TEAM.map((member, i) => (
              <MotionBox
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <Box
                  p={6}
                  border="1px solid"
                  borderColor="stellar.border"
                  bg="stellar.card"
                  role="group"
                  transition="all 0.3s"
                  _hover={{
                    borderColor: "brand.700",
                    transform: "translateY(-4px)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
                  }}
                >
                  <Box
                    w="56px"
                    h="56px"
                    mb={5}
                    bg="rgba(200,150,62,0.1)"
                    border="1px solid"
                    borderColor="rgba(200,150,62,0.2)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontFamily="heading"
                    fontSize="xl"
                    fontWeight="900"
                    color="brand.400"
                  >
                    {member.name
                      .split(" ")
                      .filter((w) => /^[A-Z]/.test(w))
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </Box>
                  <Text
                    fontFamily="heading"
                    fontSize="md"
                    fontWeight="700"
                    color="stellar.text"
                    mb={1}
                  >
                    {member.name}
                  </Text>
                  <Text fontSize="xs" color="brand.500" fontWeight="600" mb={1}>
                    {member.role}
                  </Text>
                  <Text
                    fontFamily="mono"
                    fontSize="xs"
                    color="stellar.muted"
                    letterSpacing="0.08em"
                    mb={4}
                  >
                    {member.certs}
                  </Text>
                  <Text fontSize="xs" color="stellar.muted" lineHeight="1.7">
                    {member.bio}
                  </Text>
                  <Box
                    h="1px"
                    w="0"
                    bg="brand.500"
                    mt={4}
                    transition="width 0.4s"
                    sx={{ "[role=group]:hover &": { width: "100%" } }}
                  />
                </Box>
              </MotionBox>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
}
