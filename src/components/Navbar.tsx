import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  Button,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  VStack,
  useDisclosure,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ColorModeToggle from "./ColorModeToggle";

// Services list for dropdown (no categories, just flat list)
const SERVICES_DROPDOWN = [
  { label: "Project Studies", href: "/services#project-studies" },
  { label: "Feasibility Study", href: "/services#feasibility-study" },
  { label: "Design Review", href: "/services#design-review" },
  {
    label: "Structural Engineering Drawing",
    href: "/services#structural-engineering",
  },
  {
    label: "Mechanical and Electrical Design",
    href: "/services#mechanical-electrical",
  },
  { label: "Civil Engineering Design", href: "/services#civil-engineering" },
  { label: "Complete Working Drawing", href: "/services#working-drawing" },
  { label: "Residency / Supervision", href: "/services#supervision" },
];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Who We Are", href: "/who-we-are" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Projects", href: "/project-studies" },
  { label: "Calculators", href: "/calculators" },
  { label: "Contact", href: "/contact" },
];

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <line
      x1="2"
      y1="4"
      x2="18"
      y2="4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="2"
      y1="10"
      x2="18"
      y2="10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="2"
      y1="16"
      x2="18"
      y2="16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <line
      x1="4"
      y1="4"
      x2="16"
      y2="16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="16"
      y1="4"
      x2="4"
      y2="16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ChevronDown = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

interface NavbarProps {
  onOpenConsultation: () => void;
}

export default function Navbar({ onOpenConsultation }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // Dynamic navbar background based on scroll and color mode
  const navBg = useColorModeValue(
    scrolled ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.95)",
    scrolled ? "rgba(8,12,20,0.97)" : "rgba(8,12,20,0.88)",
  );

  const borderColor = useColorModeValue(
    scrolled ? "#E2E8F0" : "rgba(200,150,62,0.15)",
    scrolled ? "#1E2E4A" : "rgba(200,150,62,0.12)",
  );

  const linkColor = useColorModeValue("#374151", "#8899AA");
  const linkHoverColor = useColorModeValue("#111827", "#EEF2F7");
  const menuBg = useColorModeValue("white", "#0F1929");
  const menuBorder = useColorModeValue("#E2E8F0", "#1E2E4A");
  const menuItemText = useColorModeValue("#374151", "#8899AA");

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href === "/services") return location.pathname === "/services";
    return location.pathname.startsWith(href);
  };

  const handleServiceClick = (href: string) => {
    navigate(href);
    if (location.pathname === "/services") {
      const elementId = href.split("#")[1];
      if (elementId) {
        setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  };

  return (
    <>
      <Box
        as="nav"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        bg={navBg}
        backdropFilter="blur(18px)"
        borderBottom="1px solid"
        borderColor={borderColor}
        boxShadow={
          scrolled
            ? isDark
              ? "0 4px 30px rgba(0,0,0,0.5)"
              : "0 2px 12px rgba(0,0,0,0.08)"
            : "none"
        }
        transition="background 0.35s, border-color 0.35s, box-shadow 0.35s"
      >
        <Box
          h="2px"
          bgGradient="linear(to-r, transparent, brand.500, transparent)"
          opacity={0.85}
        />

        <Flex
          maxW="1440px"
          mx="auto"
          px={{ base: 4, md: 6, xl: 10 }}
          h="68px"
          align="center"
          justify="space-between"
          gap={4}
        >
          {/* Logo with curved edges and proper blending */}
          <Box position="relative" height="44px" width="auto">
            <Box
              position="relative"
              height="44px"
              width="auto"
              borderRadius="xl"
              overflow="hidden"
              bg={isDark ? "rgba(15,25,41,0.8)" : "white"}
              boxShadow={
                isDark
                  ? "0 0 0 1px rgba(242,101,34,0.2)"
                  : "0 1px 3px rgba(0,0,0,0.1)"
              }
              px={2}
              py={1}
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              transition="all 0.3s ease"
            >
              <Image
                src="/lightyearLogo.jpeg"
                alt="Lightyear Logo"
                height="32px"
                width="auto"
                objectFit="contain"
                style={{ borderRadius: "8px" }}
              />
            </Box>
          </Box>

          {/* Desktop links */}
          <HStack
            as="ul"
            listStyleType="none"
            spacing={0}
            display={{ base: "none", xl: "flex" }}
            align="center"
            flex={1}
            justify="center"
          >
            {NAV_LINKS.map((link) => (
              <Box as="li" key={link.href}>
                {link.hasDropdown ? (
                  <Menu>
                    <MenuButton
                      as={Button}
                      variant="ghost"
                      px={3}
                      py={2}
                      fontSize="xs"
                      fontWeight="500"
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      whiteSpace="nowrap"
                      color={isActive(link.href) ? "brand.500" : linkColor}
                      _hover={{
                        color: linkHoverColor,
                        bg: "transparent",
                      }}
                      rightIcon={<ChevronDown />}
                      minW="auto"
                    >
                      {link.label}
                    </MenuButton>
                    <MenuList
                      bg={menuBg}
                      border="1px solid"
                      borderColor={menuBorder}
                      borderRadius="lg"
                      boxShadow="0 16px 40px rgba(0,0,0,0.15)"
                      minW="260px"
                      py={2}
                    >
                      {SERVICES_DROPDOWN.map((service) => (
                        <MenuItem
                          key={service.label}
                          onClick={() => handleServiceClick(service.href)}
                          bg="transparent"
                          fontSize="sm"
                          fontWeight="500"
                          color={menuItemText}
                          _hover={{
                            color: "brand.500",
                            bg: "rgba(242,101,34,0.06)",
                          }}
                          px={4}
                          py={2.5}
                        >
                          {service.label}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                ) : (
                  <ChakraLink
                    as={Link}
                    to={link.href}
                    display="block"
                    px={3}
                    py={2}
                    fontSize="xs"
                    fontWeight="500"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    whiteSpace="nowrap"
                    borderBottom="1.5px solid transparent"
                    color={isActive(link.href) ? "brand.500" : linkColor}
                    transition="color 0.2s"
                    _hover={{
                      color: linkHoverColor,
                      textDecoration: "none",
                    }}
                    position="relative"
                    sx={{
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: "0",
                        left: "12px",
                        right: "12px",
                        height: "1.5px",
                        background: "brand.500",
                        transform: isActive(link.href)
                          ? "scaleX(1)"
                          : "scaleX(0)",
                        transformOrigin: "left center",
                        transition: "transform 0.25s ease",
                      },
                      "&:hover::after": { transform: "scaleX(1)" },
                    }}
                  >
                    {link.label}
                  </ChakraLink>
                )}
              </Box>
            ))}
          </HStack>

          {/* Right actions */}
          <HStack
            spacing={2}
            display={{ base: "none", xl: "flex" }}
            flexShrink={0}
          >
            <ColorModeToggle />
            <Button
              variant="ghost_light"
              size="sm"
              px={4}
              whiteSpace="nowrap"
              onClick={onOpenConsultation}
            >
              Book Consultation
            </Button>
          </HStack>

          {/* Mobile */}
          <HStack spacing={2} display={{ base: "flex", xl: "none" }}>
            <ColorModeToggle />
            <IconButton
              aria-label={isOpen ? "Close" : "Menu"}
              icon={isOpen ? <XIcon /> : <HamburgerIcon />}
              variant="ghost"
              size="sm"
              color={useColorModeValue("#374151", "#C8D6E8")}
              _hover={{ bg: "rgba(242,101,34,0.1)", color: "brand.500" }}
              onClick={isOpen ? onClose : onOpen}
            />
          </HStack>
        </Flex>
      </Box>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay
          backdropFilter="blur(8px)"
          bg={useColorModeValue("rgba(0,0,0,0.4)", "rgba(8,12,20,0.65)")}
        />
        <DrawerContent
          bg={useColorModeValue("white", "#0F1929")}
          borderLeft="1px solid"
          borderColor={useColorModeValue("#E2E8F0", "#1E2E4A")}
        >
          <DrawerBody p={0}>
            <Box pt="82px" pb={8} px={6}>
              <VStack align="stretch" spacing={0}>
                {NAV_LINKS.map((link) => (
                  <Box key={link.href}>
                    <ChakraLink
                      as={Link}
                      to={link.href}
                      onClick={onClose}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      py={3.5}
                      px={4}
                      fontSize="sm"
                      fontWeight="600"
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      whiteSpace="nowrap"
                      color={
                        isActive(link.href)
                          ? "brand.500"
                          : useColorModeValue("#374151", "#C8D6E8")
                      }
                      borderBottom="1px solid"
                      borderColor={useColorModeValue("#E2E8F0", "#1E2E4A")}
                      transition="all 0.2s"
                      _hover={{
                        color: "brand.500",
                        pl: "24px",
                        bg: "rgba(242,101,34,0.04)",
                        textDecoration: "none",
                      }}
                    >
                      {link.label}
                      <Text as="span" opacity={0.3} fontSize="xs">
                        →
                      </Text>
                    </ChakraLink>
                    {/* Show services sub-items in mobile drawer */}
                    {link.hasDropdown && (
                      <Box pl={6} pr={4} pb={2}>
                        {SERVICES_DROPDOWN.map((service) => (
                          <ChakraLink
                            key={service.label}
                            as={Link}
                            to={service.href}
                            onClick={onClose}
                            display="block"
                            py={2}
                            px={3}
                            fontSize="xs"
                            color={useColorModeValue("#4B5563", "#8899AA")}
                            _hover={{
                              color: "brand.500",
                              bg: "rgba(242,101,34,0.04)",
                            }}
                            borderRadius="md"
                          >
                            {service.label}
                          </ChakraLink>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </VStack>
              <Box
                mt={6}
                p={4}
                border="1px solid"
                borderColor={useColorModeValue("#E2E8F0", "#1E2E4A")}
              >
                <VStack spacing={2}>
                  <Button
                    variant="gold"
                    w="full"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onOpenConsultation();
                    }}
                  >
                    Book Consultation
                  </Button>
                </VStack>
              </Box>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Box h="70px" />
    </>
  );
}
