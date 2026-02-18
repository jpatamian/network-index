import { Outlet } from 'react-router-dom'
import {
  Box,
  Flex,
  Container,
  Button,
  HStack,
  Text,
  Center,
  Icon,
  Heading,
} from '@chakra-ui/react'
import { FaHome } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { GiEyeShield } from "react-icons/gi";
export default function Layout() {
  const { user, logout, isLoading, isAuthenticated } = useAuth()

  const handleNavigation = (url: string) => {
    window.location.href = url
  }

  return (
    <Flex direction="column" minH="100vh">
      {/* Navigation */}
      <Box as="nav" bg="white" boxShadow="sm" borderBottomWidth="1px" borderColor="gray.100">
        <Container maxW="7xl">
          <Flex justify="space-between" align="center" h={16}>
            {/* Logo */}
            <Box as="button" onClick={() => handleNavigation('/')} _hover={{ opacity: 0.8 }} transition="all 0.2s" bg="none" border="none" cursor="pointer" p={0}>
              <HStack gap={3}>
                <Box display="flex" gap={1} fontSize="2xl" color="teal.600">
                  <Icon as={FaHome} />
                  <Icon as={GiEyeShield} />
                </Box>
                <Heading color="gray.900" size="lg" fontWeight="700" letterSpacing="tight">
                  Mutual Aid Club
                </Heading>
              </HStack>
            </Box>

            {/* Navigation Links */}
            <HStack gap={6}>
              <Button onClick={() => handleNavigation('/')} variant="ghost" color="gray.700" fontWeight="500" _hover={{ color: 'teal.600', bg: 'transparent' }}>
                Home
              </Button>
              <Button onClick={() => handleNavigation('/posts')} variant="ghost" color="gray.700" fontWeight="500" _hover={{ color: 'teal.600', bg: 'transparent' }}>
                Posts
              </Button>

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Text color="gray.700" fontSize="sm" fontWeight="500">
                        {user?.username || user?.email || 'User'}
                      </Text>
                      <Button onClick={logout} variant="ghost" color="gray.700" size="sm" fontWeight="500" _hover={{ color: 'teal.600', bg: 'transparent' }}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleNavigation('/login')} variant="ghost" color="gray.700" size="sm" fontWeight="500" _hover={{ color: 'teal.600', bg: 'transparent' }}>
                        Log In
                      </Button>
                      <Button
                        onClick={() => handleNavigation('/signup')}
                        bg="teal.600"
                        color="white"
                        size="sm"
                        fontWeight="600"
                        borderRadius="md"
                        _hover={{ bg: 'teal.700' }}
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Box as="main" flex="1">
        <Outlet />
      </Box>

      {/* Footer */}
      <Box as="footer" bg="white" borderTop="1px" borderColor="gray.200">
        <Container maxW="7xl" py={6}>
          <Center>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              © 2026 Mutual Aid Club. Built by the community, for the community. All rights reserved.
            </Text>
          </Center>
        </Container>
      </Box>
    </Flex>
  )
}
