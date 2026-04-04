import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const colors = {
  brand: {
    50:  '#FFF8E8',
    100: '#FCECC5',
    200: '#F8D98A',
    300: '#F0C050',
    400: '#E8B84B',
    500: '#C8963E',  // primary gold
    600: '#A87830',
    700: '#875C22',
    800: '#664216',
    900: '#442B0A',
  },
  stellar: {
    bg:      '#080C14',
    surface: '#0F1929',
    card:    '#141F33',
    border:  '#1E2E4A',
    muted:   '#8899AA',
    text:    '#EEF2F7',
    light:   '#C8D6E8',
  },
}

const fonts = {
  heading: `'Playfair Display', Georgia, serif`,
  body: `'DM Sans', system-ui, sans-serif`,
  mono: `'Space Mono', monospace`,
}

const styles = {
  global: {
    'html, body': {
      bg: 'stellar.bg',
      color: 'stellar.text',
      fontFamily: 'body',
    },
    '::selection': {
      bg: 'brand.500',
      color: 'white',
    },
    '::-webkit-scrollbar': {
      width: '6px',
    },
    '::-webkit-scrollbar-track': {
      bg: 'stellar.bg',
    },
    '::-webkit-scrollbar-thumb': {
      bg: 'brand.600',
      borderRadius: '3px',
    },
  },
}

const components = {
  Button: {
    baseStyle: {
      fontFamily: 'body',
      fontWeight: '600',
      borderRadius: '2px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontSize: 'xs',
      transition: 'all 0.3s ease',
    },
    variants: {
      gold: {
        bg: 'brand.500',
        color: 'white',
        _hover: { bg: 'brand.400', transform: 'translateY(-1px)', boxShadow: '0 8px 30px rgba(200,150,62,0.35)' },
        _active: { bg: 'brand.600', transform: 'translateY(0)' },
      },
      ghost_light: {
        bg: 'transparent',
        color: 'stellar.text',
        border: '1px solid',
        borderColor: 'stellar.border',
        _hover: { borderColor: 'brand.500', color: 'brand.400', bg: 'rgba(200,150,62,0.06)' },
      },
      outline_gold: {
        bg: 'transparent',
        color: 'brand.400',
        border: '1px solid',
        borderColor: 'brand.500',
        _hover: { bg: 'brand.500', color: 'white', transform: 'translateY(-1px)' },
      },
    },
    defaultProps: { variant: 'gold' },
  },
  Heading: {
    baseStyle: { fontFamily: 'heading', color: 'stellar.text' },
  },
  Text: {
    baseStyle: { fontFamily: 'body', color: 'stellar.light' },
  },
  Link: {
    baseStyle: {
      _hover: { textDecoration: 'none', color: 'brand.400' },
      transition: 'color 0.2s',
    },
  },
}

const theme = extendTheme({ config, colors, fonts, styles, components })
export default theme
