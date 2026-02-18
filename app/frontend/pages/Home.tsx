import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  HStack,
  VStack,
  Badge,
  Icon,
  Center,
  SimpleGrid,
} from '@chakra-ui/react'
import { FaMapMarkerAlt, FaHeart, FaMapPin, FaUserCheck, FaUser, FaEnvelope } from 'react-icons/fa'
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
      {isAuthenticated && user && <YourNeighborhood user={user} />}

      {/* Features Section */}
      {!isAuthenticated && <HowItWorks />}

      {/* Authenticated User Profile Section */}
      {isAuthenticated && user && (
        <Box py={{ base: 12, md: 16 }} bg="white" borderTopWidth="1px" borderColor="gray.100">
          <Container maxW="7xl">
          <Container maxW="7xl">
            <Stack gap={8}>
              <HStack justify="space-between" align="center">
                <HStack gap={3}>
                  <Box color="teal.600" fontSize="xl">
                    <Icon as={FaUserCheck} />
                  </Box>
                  <Heading size="lg" color="gray.900" fontWeight="700">Your Profile</Heading>
                </HStack>
                <Badge bg="teal.50" color="teal.700" fontWeight="600" px={3} py={1} borderRadius="full">
                  <Text>
                    {user.anonymous ? 'Anonymous' : 'Verified'}
                  </Text>
                </Badge>
              </HStack>

              <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
                <Box bg="white" border="1px" borderColor="gray.100" p={4} borderRadius="lg">
                  <HStack gap={3} mb={3}>
                    <Icon as={FaEnvelope} color="teal.600" fontSize="lg" />
                    <Text fontWeight="600" color="gray.700" fontSize="sm">
                      Email
                    </Text>
                  </HStack>
                  <Text fontWeight="600" color="gray.900" fontSize="sm">
                    {user.email || 'Not set'}
                  </Text>
                </Box>

                <Box bg="white" border="1px" borderColor="gray.100" p={4} borderRadius="lg">
                  <HStack gap={3} mb={3}>
                    <Icon as={FaUser} color="teal.600" fontSize="lg" />
                    <Text fontWeight="600" color="gray.700" fontSize="sm">
                      Username
                    </Text>
                  </HStack>
                  <Text fontWeight="600" color="gray.900" fontSize="sm">
                    {user.username || 'Not set'}
                  </Text>
                </Box>

                <Box bg="white" border="1px" borderColor="gray.100" p={4} borderRadius="lg">
                  <HStack gap={3} mb={3}>
                    <Icon as={FaMapPin} color="teal.600" fontSize="lg" />
                    <Text fontWeight="600" color="gray.700" fontSize="sm">
                      Zipcode
                    </Text>
                  </HStack>
                  <Text fontWeight="600" color="gray.900" fontSize="sm">
                    {user.zipcode}
                  </Text>
                </Box>

                <Box bg="white" border="1px" borderColor="gray.100" p={4} borderRadius="lg">
                  <HStack gap={3} mb={3}>
                    <Icon as={FaHeart} color="teal.600" fontSize="lg" />
                    <Text fontWeight="600" color="gray.700" fontSize="sm">
                      Type
                    </Text>
                  </HStack>
                  <Text fontWeight="600" color="gray.900" fontSize="sm">
                    {user.anonymous ? 'Anonymous' : 'Verified'}
                  </Text>
                </Box>
              </SimpleGrid>
            </Stack>
          </Container>
          </Container>
        </Box>
      )}
    </Box>
  )
}
