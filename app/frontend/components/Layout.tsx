import { Outlet, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Flex,
  Container,
  Button,
  HStack,
  Text,
  Center,
} from '@chakra-ui/react'
import { useAuth } from '@/hooks/useAuth'

export default function Layout() {
  const { user, logout, isLoading, isAuthenticated } = useAuth()

  return (
    <Flex direction="column" minH="100vh">
      {/* Navigation */}
      <Box as="nav" bg="white" boxShadow="sm" borderBottom="1px" borderColor="gray.200">
        <Container maxW="7xl">
          <Flex justify="space-between" align="center" h={16}>
            {/* Logo */}
            <RouterLink to="/">
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                Mutual Aid Club
              </Text>
            </RouterLink>

            {/* Navigation Links */}
            <HStack spacing={4}>
              <Button as={RouterLink} to="/" variant="ghost">
                Home
              </Button>
              <Button as={RouterLink} to="/posts" variant="ghost">
                Posts
              </Button>

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Text color="gray.700" fontSize="sm">
                        {user?.username || user?.email || 'User'}
                      </Text>
                      <Button onClick={logout} variant="ghost" size="sm">
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button as={RouterLink} to="/login" variant="ghost" size="sm">
                        Login
                      </Button>
                      <Button
                        as={RouterLink}
                        to="/signup"
                        colorScheme="blue"
                        size="sm"
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
