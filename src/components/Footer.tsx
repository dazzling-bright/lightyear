import {
  Box,
  Flex,
  Grid,
  GridItem,
  VStack,
  HStack,
  Text,
  Link as ChakraLink,
  IconButton,
  Divider,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const FacebookIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L0 24l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.006-1.374l-.358-.213-3.722.976.993-3.623-.234-.372A9.816 9.816 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
  </svg>
);
const MapPinIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const PhoneIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const MailIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const FOOTER_LINKS = {
  Company: [
    { label: "About Us", href: "/who-we-are" },
    { label: "Our Experience", href: "/experience" },
    { label: "Contact Us", href: "/contact" },
  ],
  Services: [
    { label: "Our Services", href: "/services" },
    { label: "Project Studies", href: "/project-studies" },
    { label: "Calculators", href: "/calculators" },
    { label: "Engineer Calculators", href: "/engineer-calculators" },
  ],
};

export default function Footer() {
  const bg = useColorModeValue("white", "#0F1929");
  const borderC = useColorModeValue("#E2E8F0", "#1E2E4A");
  const textC = useColorModeValue("#111827", "#EEF2F7");
  const mutedC = useColorModeValue("#64748B", "#8899AA");
  const iconBg = useColorModeValue("#F1F5F9", "#141F33");
  const iconBd = useColorModeValue("#E2E8F0", "#1E2E4A");

  return (
    <Box
      as="footer"
      bg={bg}
      borderTop="1px solid"
      borderColor={borderC}
      pt={16}
      pb={8}
    >
      <Box
        h="2px"
        bgGradient="linear(to-r, transparent, brand.500, transparent)"
        mb={16}
        opacity={0.6}
      />

      <Box maxW="1280px" mx="auto" px={{ base: 5, md: 8 }}>
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2,1fr)",
            lg: "2fr 1fr 1fr 1.5fr",
          }}
          gap={{ base: 10, md: 12 }}
          mb={12}
        >
          {/* Brand */}
          <GridItem>
            <Image
              src="/lightyearLogo.jpeg"
              alt="Lightyear Logo"
              height={"40px"}
              objectFit={"cover"}
            />

            <Text
              fontSize="sm"
              color={mutedC}
              maxW="280px"
              lineHeight="1.8"
              mb={2}
            >
              Quality construction. Inspired design. Unparalleled experience.
              Guided by integrity, honesty, dependability, compliance, and
              safety.
            </Text>
            <Text
              fontSize="xs"
              color="brand.500"
              fontFamily="mono"
              letterSpacing="0.1em"
              mb={6}
            >
              Est. 2006 · 18+ Years of Excellence
            </Text>

            <HStack spacing={2}>
              {[
                {
                  icon: <WhatsAppIcon />,
                  href: "https://wa.me/2347032082725",
                  label: "WhatsApp",
                },
                {
                  icon: <LinkedInIcon />,
                  href: "https://linkedin.com/company/lightyear-engineering",
                  label: "LinkedIn",
                },
                {
                  icon: <FacebookIcon />,
                  href: "https://facebook.com",
                  label: "Facebook",
                },
              ].map((s) => (
                <IconButton
                  key={s.label}
                  as="a"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  icon={s.icon}
                  size="sm"
                  variant="ghost"
                  color={mutedC}
                  border="1px solid"
                  borderColor={iconBd}
                  borderRadius="2px"
                  bg={iconBg}
                  _hover={{
                    color: "brand.400",
                    borderColor: "brand.600",
                    bg: "rgba(200,150,62,0.08)",
                  }}
                />
              ))}
            </HStack>
          </GridItem>

          {/* Nav links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <GridItem key={title}>
              <Text
                fontFamily="mono"
                fontSize="xs"
                fontWeight="700"
                letterSpacing="0.2em"
                textTransform="uppercase"
                color="brand.500"
                mb={5}
              >
                {title}
              </Text>
              <VStack align="start" spacing={3}>
                {links.map((l) => (
                  <ChakraLink
                    key={l.label}
                    as={Link}
                    to={l.href}
                    fontSize="sm"
                    color={mutedC}
                    _hover={{ color: textC, pl: 1 }}
                    transition="all 0.2s"
                  >
                    {l.label}
                  </ChakraLink>
                ))}
              </VStack>
            </GridItem>
          ))}

          {/* Contact */}
          <GridItem>
            <Text
              fontFamily="mono"
              fontSize="xs"
              fontWeight="700"
              letterSpacing="0.2em"
              textTransform="uppercase"
              color="brand.500"
              mb={5}
            >
              Contact Info
            </Text>
            <VStack align="start" spacing={4}>
              <HStack align="start" spacing={3}>
                <Box color="brand.500" mt="2px" flexShrink={0}>
                  <MapPinIcon />
                </Box>
                <Text fontSize="sm" color={mutedC} lineHeight="1.6">
                  179A, Maccido Royal Estate,
                  <br />
                  Galadimawa, Abuja
                </Text>
              </HStack>
              <HStack align="start" spacing={3}>
                <Box color="brand.500" mt="2px" flexShrink={0}>
                  <PhoneIcon />
                </Box>
                <Box>
                  <ChakraLink
                    href="tel:+2347032082725"
                    fontSize="sm"
                    color={textC}
                    fontWeight="500"
                  >
                    +234 703 208 2725
                  </ChakraLink>
                </Box>
              </HStack>
              <HStack align="start" spacing={3}>
                <Box color="brand.500" mt="2px" flexShrink={0}>
                  <MailIcon />
                </Box>
                <ChakraLink
                  href="mailto:lightyearconsult@gmail.com"
                  fontSize="sm"
                  color={mutedC}
                >
                  lightyearconsult@gmail.com
                </ChakraLink>
              </HStack>
              <Box
                mt={1}
                px={3}
                py={2}
                border="1px solid"
                borderColor={borderC}
                borderLeft="2px solid"
                borderLeftColor="brand.500"
              >
                <Text fontSize="xs" color={mutedC} letterSpacing="0.05em">
                  Mon – Fri: 8:00 AM – 6:00 PM WAT
                </Text>
              </Box>
            </VStack>
          </GridItem>
        </Grid>

        <Divider borderColor={borderC} mb={8} />

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "center" }}
          gap={4}
        >
          <Text fontSize="xs" color={mutedC} letterSpacing="0.05em">
            © {new Date().getFullYear()} Lightyear Engineering Consultancy Ltd.
            All rights reserved.
          </Text>
          <HStack spacing={6}>
            {["Privacy Policy", "Terms of Service"].map((l) => (
              <ChakraLink
                key={l}
                href="#"
                fontSize="xs"
                color={mutedC}
                _hover={{ color: "brand.400" }}
              >
                {l}
              </ChakraLink>
            ))}
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
}
