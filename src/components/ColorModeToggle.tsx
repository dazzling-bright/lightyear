import { useColorMode, Box, IconButton } from '@chakra-ui/react'

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

export default function ColorModeToggle({ size = 'sm' }: { size?: string }) {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      aria-label={colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      onClick={toggleColorMode}
      variant="ghost"
      size={size}
      color={colorMode === 'dark' ? 'brand.400' : 'gray.600'}
      border="1px solid"
      borderColor={colorMode === 'dark' ? 'stellar.border' : 'gray.200'}
      borderRadius="2px"
      _hover={{
        borderColor: 'brand.500',
        color: 'brand.400',
        bg: 'rgba(200,150,62,0.08)',
      }}
      transition="all 0.2s"
    />
  )
}
