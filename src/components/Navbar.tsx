

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
  MenuDivider,
  useColorMode,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ColorModeToggle from "./ColorModeToggle";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Who We Are", href: "/who-we-are" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/project-studies" },
  { label: "Calculators", href: "/calculators" },
  // { label: "Internship", href: "/internship" },
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
  const { user, profile, signOut } = useAuth();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const navBg = useColorModeValue(
    scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.88)",
    scrolled ? "rgba(8,12,20,0.97)" : "rgba(8,12,20,0.78)",
  );
  const borderC = useColorModeValue(
    scrolled ? "#E2E8F0" : "rgba(200,150,62,0.15)",
    scrolled ? "#1E2E4A" : "rgba(200,150,62,0.12)",
  );
  const linkColor = useColorModeValue("#4B5563", "#8899AA");
  const logoColor = useColorModeValue("#111827", "#EEF2F7");
  const drawerBg = useColorModeValue("white", "#0F1929");
  const drawerBd = useColorModeValue("#E2E8F0", "#1E2E4A");
  const menuBg = useColorModeValue("white", "#0F1929");
  const menuBd = useColorModeValue("#E2E8F0", "#1E2E4A");
  const menuText = useColorModeValue("#4B5563", "#8899AA");

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const isActive = (href: string) =>
    href === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(href);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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
        borderColor={borderC}
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
        
          <Image src="/lightyearLogo.jpeg" alt="Lightyear Logo" height={"40px"} objectFit={"cover"}/>

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
                  borderBottom={"1.5px solid transparent"}
                  color={isActive(link.href) ? "brand.400" : linkColor}
                  transition="color 0.2s"
                  _hover={{
                    color: isDark ? "#EEF2F7" : "#111827",
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
                      background: "var(--chakra-colors-brand-500)",
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
            {user ? (
              <Menu>
                <MenuButton
                  as={Button}
                  variant="gold"
                  size="sm"
                  px={4}
                  whiteSpace="nowrap"
                  rightIcon={<ChevronDown />}
                >
                  {profile?.full_name?.split(" ")[0] || "Admin"}
                </MenuButton>
                <MenuList
                  bg={menuBg}
                  border="1px solid"
                  borderColor={menuBd}
                  borderRadius="2px"
                  boxShadow="0 16px 40px rgba(0,0,0,0.15)"
                  minW="190px"
                  py={2}
                >
                  <MenuItem
                    as={Link}
                    to="/dashboard"
                    bg="transparent"
                    fontSize="sm"
                    color={menuText}
                    _hover={{ color: "brand.400", bg: "rgba(200,150,62,0.06)" }}
                    px={4}
                    py={2.5}
                  >
                    🏗️&nbsp; Dashboard
                  </MenuItem>
                  <MenuDivider borderColor={menuBd} my={1} />
                  <MenuItem
                    bg="transparent"
                    fontSize="sm"
                    color="red.400"
                    _hover={{ bg: "rgba(239,68,68,0.06)" }}
                    px={4}
                    py={2.5}
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                as={Link}
                to="/login"
                variant="gold"
                size="sm"
                px={5}
                whiteSpace="nowrap"
              >
                Admin Login
              </Button>
            )}
          </HStack>

          {/* Mobile */}
          <HStack spacing={2} display={{ base: "flex", xl: "none" }}>
            <ColorModeToggle />
            <IconButton
              aria-label={isOpen ? "Close" : "Menu"}
              icon={isOpen ? <XIcon /> : <HamburgerIcon />}
              variant="ghost"
              size="sm"
              color={isDark ? "#EEF2F7" : "#374151"}
              _hover={{ bg: "rgba(200,150,62,0.1)", color: "brand.400" }}
              onClick={isOpen ? onClose : onOpen}
            />
          </HStack>
        </Flex>
      </Box>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay backdropFilter="blur(8px)" bg="rgba(8,12,20,0.65)" />
        <DrawerContent
          bg={drawerBg}
          borderLeft="1px solid"
          borderColor={drawerBd}
        >
          <DrawerBody p={0}>
            <Box pt="82px" pb={8} px={6}>
              {user && (
                <Box
                  mb={5}
                  p={4}
                  border="1px solid"
                  borderColor={drawerBd}
                  bg={isDark ? "#141F33" : "#F8FAFC"}
                >
                  <Text
                    fontSize="xs"
                    fontFamily="mono"
                    color="brand.500"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    mb={1}
                  >
                    Admin
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={isDark ? "#EEF2F7" : "#111827"}
                  >
                    {profile?.full_name}
                  </Text>
                </Box>
              )}
              <VStack align="stretch" spacing={0}>
                {NAV_LINKS.map((link) => (
                  <ChakraLink
                    key={link.href}
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
                        ? "brand.400"
                        : isDark
                          ? "#C8D6E8"
                          : "#374151"
                    }
                    borderBottom="1px solid"
                    borderColor={drawerBd}
                    transition="all 0.2s"
                    _hover={{
                      color: "brand.400",
                      pl: "24px",
                      bg: "rgba(200,150,62,0.04)",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                    <Text as="span" opacity={0.3} fontSize="xs">
                      →
                    </Text>
                  </ChakraLink>
                ))}
              </VStack>
              <Box mt={6} p={4} border="1px solid" borderColor={drawerBd}>
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
                  {user ? (
                    <>
                      <Button
                        as={Link}
                        to="/dashboard"
                        onClick={onClose}
                        variant="ghost_light"
                        w="full"
                        size="sm"
                      >
                        Dashboard
                      </Button>
                      <Button
                        variant="ghost_light"
                        w="full"
                        size="sm"
                        color="red.400"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      as={Link}
                      to="/login"
                      onClick={onClose}
                      variant="ghost_light"
                      w="full"
                      size="sm"
                    >
                      Admin Login
                    </Button>
                  )}
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