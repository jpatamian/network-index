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

export default function Layout() {
  const { user, logout, isLoading, isAuthenticated } = useAuth()

  const handleNavigation = (url: string) => {
    window.location.href = url
  }

  return (
    <Flex direction="column" minH="100vh">
      {/* Navigation */}
      <Box as="nav" bg="linear-gradient(to right, #10b981, #14b8a6)" boxShadow="lg" borderBottomWidth="1px" borderColor="emerald.600">
        <Container maxW="7xl">
          <Flex justify="space-between" align="center" h={16}>
            {/* Logo */}
            <Box as="button" onClick={() => handleNavigation('/')} _hover={{ opacity: 0.8 }} transition="all 0.2s" bg="none" border="none" cursor="pointer" p={0}>
              <HStack gap={3}>
                <Box fontSize="2xl" color="white">
                  <Icon as={FaHome} />
                </Box>
                <Heading color="white" size="lg" fontWeight="bold">
                  Mutual Aid Club
                </Heading>
              </HStack>
            </Box>

            {/* Navigation Links */}
            <HStack gap={4}>
              <Button onClick={() => handleNavigation('/')} variant="ghost" color="white" _hover={{ bg: 'rgba(255,255,255,0.1)' }}>
                Home
              </Button>
              <Button onClick={() => handleNavigation('/posts')} variant="ghost" color="white" _hover={{ bg: 'rgba(255,255,255,0.1)' }}>
                Posts
              </Button>

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Text color="white" fontSize="sm" fontWeight="medium">
                        {user?.username || user?.email || 'User'}
                      </Text>
                      <Button onClick={logout} variant="ghost" color="white" size="sm" _hover={{ bg: 'rgba(255,255,255,0.1)' }}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleNavigation('/login')} variant="ghost" color="white" size="sm" _hover={{ bg: 'rgba(255,255,255,0.1)' }}>
                        Login
                      </Button>
                      <Button
                        onClick={() => handleNavigation('/signup')}
                        bg="white"
                        color='rgb(16,185,129)'
                        size="sm"
                        fontWeight="bold"
                        _hover={{ bg: 'gray.100' }}
                      >
                        Sign up
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
