import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  HStack,
  Badge,
  Icon,
  Center,
} from '@chakra-ui/react'
import { FaMapPin } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import HowItWorks from '@/components/HowItWorks'
import FindYourNeighborhood from '@/components/FindYourNeighborhood'
import YourNeighborhood from '@/components/YourNeighborhood'

export default function Home() {
  const { user, isAuthenticated } = useAuth()

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg="white"
        py={{ base: 12, md: 16 }}
        borderBottomWidth="1px"
        borderColor="gray.100"
      >
        <Container maxW="7xl">
          <Center mb={8}>
            <Stack textAlign="center" maxW="2xl" gap={6}>
              <Heading
                  as="h1"
                  size="2xl"
                  fontWeight="700"
                  color="gray.900"
                  lineHeight="1.2"
                >
                  {isAuthenticated
                    ? `Welcome back, ${user?.username || user?.email}!`
                    : 'Your Neighborhood, Connected'}
                </Heading>
                <Text fontSize="lg" color="gray.600" lineHeight={1.6}>
                  {isAuthenticated
                    ? 'Connect with neighbors to share resources, ask for help, and build community.'
                    : 'Share resources, ask for help, and build genuine connections with neighbors near you.'}
                </Text>
              </Stack>
          </Center>

          {!isAuthenticated && (
            <HStack gap={4} justify="center" pt={4}>
              <Button
                onClick={() => {
                  window.location.href = '/signup'
                }}
                bg="teal.600"
                color="white"
                size="lg"
                fontWeight="600"
                borderRadius="md"
                _hover={{ bg: 'teal.700', transform: 'translateY(-1px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                Get Started
              </Button>
              <Button
                onClick={() => {
                  window.location.href = '/login'
                }}
                variant="outline"
                size="lg"
                fontWeight="600"
                borderRadius="md"
                borderColor="gray.300"
                color="gray.700"
                _hover={{ bg: 'gray.50', transform: 'translateY(-1px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                Sign In
              </Button>
            </HStack>
          )}
        </Container>
      </Box>

      {/* Find Your Neighborhood Section - For Unauthenticated Users */}
      {!isAuthenticated && <FindYourNeighborhood />}


      {/* Your Neighborhood Section - For Authenticated Users */}
      {isAuthenticated && user && (
        <YourNeighborhood
          user={{
            zipcode: user.zipcode ?? undefined,
            username: user.username ?? undefined,
            email: user.email ?? undefined,
          }}
        />
      )}

      {/* Features Section */}
      {!isAuthenticated && <HowItWorks />}
    </Box>
  )
}
