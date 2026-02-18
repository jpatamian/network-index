import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  HStack,
  Card,
  SimpleGrid,
  Center,
} from '@chakra-ui/react'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { user, isAuthenticated } = useAuth()

  return (
    <Box py={12}>
      <Container maxW="7xl">
        <Center mb={12}>
          <Stack textAlign="center" spacing={6}>
            <Heading as="h1" size="2xl">
              {isAuthenticated ? `Welcome back, ${user?.username || user?.email}!` : 'Welcome to Mutual Aid Club'}
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              {isAuthenticated
                ? 'Your community networking platform'
                : 'A community networking platform for mutual aid and resource sharing in your neighborhood.'}
            </Text>

            {!isAuthenticated && (
              <HStack spacing={4} justify="center">
                <Button
                  as={RouterLink}
                  to="/signup"
                  colorScheme="blue"
                  size="lg"
                >
                  Get started
                </Button>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="outline"
                  size="lg"
                >
                  Sign in
                </Button>
              </HStack>
            )}
          </Stack>
        </Center>

        {isAuthenticated && user && (
          <Card.Root>
            <Card.Body>
              <Stack spacing={6}>
                <Heading size="md">Your Profile</Heading>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
                  <Box>
                    <Text fontWeight="medium" color="gray.600" fontSize="sm">
                      Email
                    </Text>
                    <Text mt={1}>{user.email || 'Not set'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.600" fontSize="sm">
                      Username
                    </Text>
                    <Text mt={1}>{user.username || 'Not set'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.600" fontSize="sm">
                      Zipcode
                    </Text>
                    <Text mt={1}>{user.zipcode}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.600" fontSize="sm">
                      Account Type
                    </Text>
                    <Text mt={1}>
                      {user.anonymous ? 'Anonymous' : 'Authenticated'}
                    </Text>
                  </Box>
                </SimpleGrid>
              </Stack>
            </Card.Body>
          </Card.Root>
        )}
      </Container>
    </Box>
  )
}
