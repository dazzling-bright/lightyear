import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// GTBank Orange palette — primary: #F26522
const colors = {
  brand: {
    50: "#FFF3EC",
    100: "#FFE0CC",
    200: "#FFC49A",
    300: "#FFA368",
    400: "#FF8040", // hover / lighter orange
    500: "#F26522", // GTBank primary orange
    600: "#D4521A", // active / darker
    700: "#A83E12", // deep orange
    800: "#7A2B0C",
    900: "#4D1A06",
  },
};

// ALL surface/text/bg colors are semantic tokens.
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
      // Renamed from "gold" to keep same variant name — no component changes needed
      gold: {
        bg: "brand.500",
        color: "white",
        _hover: {
          bg: "brand.400",
          transform: "translateY(-1px)",
          boxShadow: "0 8px 30px rgba(242,101,34,0.35)",
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
          color: "brand.500",
          bg: "rgba(242,101,34,0.06)",
        },
      },
      outline_gold: {
        bg: "transparent",
        color: "brand.500",
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
      _hover: { textDecoration: "none", color: "brand.500" },
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
