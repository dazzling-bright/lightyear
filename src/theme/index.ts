import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// Only brand gold here — never changes between light/dark
const colors = {
  brand: {
    50: "#FFF8E8",
    100: "#FCECC5",
    200: "#F8D98A",
    300: "#F0C050",
    400: "#E8B84B",
    500: "#C8963E",
    600: "#A87830",
    700: "#875C22",
    800: "#664216",
    900: "#442B0A",
  },
};

// ALL surface/text/bg colors are semantic tokens.
// Any component using bg="stellar.bg" etc. automatically flips on toggle.
const semanticTokens = {
  colors: {
    "stellar.bg": { default: "#F7F8FA", _dark: "#080C14" },
    "stellar.surface": { default: "#FFFFFF", _dark: "#0F1929" },
    "stellar.card": { default: "#F8FAFC", _dark: "#141F33" },
    "stellar.border": { default: "#E2E8F0", _dark: "#1E2E4A" },
    "stellar.muted": { default: "#64748B", _dark: "#8899AA" },
    "stellar.text": { default: "#111827", _dark: "#EEF2F7" },
    "stellar.light": { default: "#374151", _dark: "#C8D6E8" },
    "page-bg": { default: "#F7F8FA", _dark: "#080C14" },
    "surface-bg": { default: "#FFFFFF", _dark: "#0F1929" },
    "card-bg": { default: "#F8FAFC", _dark: "#141F33" },
    "border-color": { default: "#E2E8F0", _dark: "#1E2E4A" },
    "text-primary": { default: "#111827", _dark: "#EEF2F7" },
    "text-muted": { default: "#64748B", _dark: "#8899AA" },
    "text-light": { default: "#374151", _dark: "#C8D6E8" },
    "input-bg": { default: "#F1F5F9", _dark: "#0D1726" },
  },
};

const fonts = {
  heading: `'Playfair Display', Georgia, serif`,
  body: `'DM Sans', system-ui, sans-serif`,
  mono: `'Space Mono', monospace`,
};

// Semantic tokens in styles.global means the ENTIRE app body flips
const styles = {
  global: {
    "html, body": {
      bg: "stellar.bg",
      color: "stellar.text",
      fontFamily: "body",
    },
    "::selection": { bg: "brand.500", color: "white" },
    "::-webkit-scrollbar": { width: "6px" },
    "::-webkit-scrollbar-track": { bg: "stellar.bg" },
    "::-webkit-scrollbar-thumb": { bg: "brand.600", borderRadius: "3px" },
  },
};

const components = {
  Button: {
    baseStyle: {
      fontFamily: "body",
      fontWeight: "600",
      borderRadius: "2px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontSize: "xs",
      whiteSpace: "nowrap",
      transition: "all 0.3s ease",
    },
    variants: {
      gold: {
        bg: "brand.500",
        color: "white",
        _hover: {
          bg: "brand.400",
          transform: "translateY(-1px)",
          boxShadow: "0 8px 30px rgba(200,150,62,0.35)",
        },
        _active: { bg: "brand.600", transform: "translateY(0)" },
      },
      ghost_light: {
        bg: "transparent",
        color: "text-primary",
        border: "1px solid",
        borderColor: "border-color",
        _hover: {
          borderColor: "brand.500",
          color: "brand.400",
          bg: "rgba(200,150,62,0.06)",
        },
      },
      outline_gold: {
        bg: "transparent",
        color: "brand.400",
        border: "1px solid",
        borderColor: "brand.500",
        _hover: {
          bg: "brand.500",
          color: "white",
          transform: "translateY(-1px)",
        },
      },
    },
    defaultProps: { variant: "gold" },
  },
  Heading: { baseStyle: { fontFamily: "heading", color: "text-primary" } },
  Text: { baseStyle: { fontFamily: "body", color: "text-light" } },
  Link: {
    baseStyle: {
      transition: "color 0.2s",
      _hover: { textDecoration: "none", color: "brand.400" },
    },
  },
  Modal: { baseStyle: { dialog: { bg: "stellar.surface" } } },
};

const theme = extendTheme({
  config,
  colors,
  semanticTokens,
  fonts,
  styles,
  components,
});
export default theme;
