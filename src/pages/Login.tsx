import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const MotionBox = motion(Box);

const inputStyles = {
  bg: "stellar.bg",
  border: "1px solid",
  borderColor: "stellar.border",
  borderRadius: "2px",
  color: "stellar.text",
  fontSize: "sm",
  _placeholder: { color: "stellar.muted", fontSize: "sm" },
  _focus: {
    borderColor: "brand.500",
    boxShadow: "0 0 0 1px #C8963E",
    bg: "stellar.surface",
  },
  _hover: { borderColor: "brand.700" },
};
const lS = {
  fontSize: "xs" as const,
  fontFamily: "mono",
  color: "stellar.muted",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleLogin = async () => {
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = "Required";
    if (!form.password) errs.password = "Required";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);

    if (error) {
      setErrors({ form: error.message });
      return;
    }

    toast({
      title: "Welcome back!",
      status: "success",
      duration: 2000,
      position: "top",
    });
    navigate("/dashboard");
  };

  return (
    <Box
      minH="100vh"
      bg="stellar.bg"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      {/* Background grid */}
      <Box
        position="absolute"
        inset={0}
        opacity={0.02}
        backgroundImage="linear-gradient(rgba(200,150,62,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,150,62,1) 1px, transparent 1px)"
        backgroundSize="60px 60px"
        pointerEvents="none"
      />
      {/* Gold glow */}
      <Box
        position="absolute"
        top="35%"
        left="50%"
        transform="translate(-50%,-50%)"
        w="400px"
        h="300px"
        bg="brand.500"
        filter="blur(100px)"
        opacity={0.05}
      />

      <Box w="full" maxW="440px" mx="auto" px={4} py={12}>
        {/* Logo */}
        <Flex justify="center" mb={10}>
          <Link to="/">
            <Flex align="center" gap={3} role="group">
              <Box w="30px" h="30px" position="relative">
                <Box
                  position="absolute"
                  inset={0}
                  bg="brand.500"
                  transform="rotate(45deg)"
                  borderRadius="2px"
                  transition="all 0.3s"
                  sx={{
                    "[role=group]:hover &": { transform: "rotate(90deg)" },
                  }}
                />
                <Box
                  position="absolute"
                  inset="7px"
                  bg="stellar.bg"
                  transform="rotate(45deg)"
                />
              </Box>
              <Box>
                <Text
                  fontFamily="heading"
                  fontWeight="700"
                  fontSize="lg"
                  color="stellar.text"
                  lineHeight="1.1"
                >
                  Lightyear Engineering
                </Text>
                <Text
                  fontFamily="mono"
                  fontSize="8px"
                  color="brand.500"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                >
                  Consultancy Ltd
                </Text>
              </Box>
            </Flex>
          </Link>
        </Flex>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box
            p={8}
            border="1px solid"
            borderColor="stellar.border"
            bg="stellar.card"
            position="relative"
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
              fontFamily="heading"
              fontSize="2xl"
              fontWeight="700"
              color="stellar.text"
              mb={2}
            >
              Admin Sign In
            </Text>
            <Text fontSize="sm" color="stellar.muted" mb={7} lineHeight="1.6">
              This portal is for authorised staff only. Homeowners and clients
              are contacted directly by our engineering team.
            </Text>

            {errors.form && (
              <Box
                p={3}
                mb={5}
                border="1px solid"
                borderColor="red.700"
                bg="rgba(200,50,50,0.08)"
              >
                <Text fontSize="sm" color="red.400">
                  {errors.form}
                </Text>
              </Box>
            )}

            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel {...lS}>Email Address</FormLabel>
                <Input
                  {...inputStyles}
                  type="email"
                  placeholder="admin@lightyear.ng"
                  value={form.email}
                  onChange={f("email")}
                />
                <FormErrorMessage fontSize="xs">
                  {errors.email}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel {...lS}>Password</FormLabel>
                <Input
                  {...inputStyles}
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={f("password")}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <FormErrorMessage fontSize="xs">
                  {errors.password}
                </FormErrorMessage>
              </FormControl>
              <Button
                variant="gold"
                w="full"
                size="md"
                py={6}
                isLoading={loading}
                onClick={handleLogin}
              >
                Sign In →
              </Button>
            </VStack>

            <Box
              mt={7}
              p={4}
              border="1px solid"
              borderColor="stellar.border"
              bg="stellar.bg"
              borderLeft="2px solid"
              borderLeftColor="brand.600"
            >
              <Text fontSize="xs" color="stellar.muted" lineHeight="1.8">
                <strong style={{ color: "#C8963E" }}>Are you a client?</strong>
                <br />
                No account needed. Submit a consultation request from the home
                page, or contact us directly:
              </Text>
              <VStack align="start" spacing={1} mt={3}>
                <ChakraLink
                  href="https://wa.me/2347032082725"
                  isExternal
                  fontSize="xs"
                  color="green.400"
                  fontWeight="600"
                >
                  💬 WhatsApp — +234 703 208 2725
                </ChakraLink>
                <ChakraLink
                  href="mailto:lightyearconsult@gmail.com"
                  fontSize="xs"
                  color="brand.400"
                  fontWeight="600"
                >
                  ✉️ lightyearconsult@gmail.com
                </ChakraLink>
              </VStack>
            </Box>
          </Box>
        </MotionBox>
      </Box>
    </Box>
  );
}
