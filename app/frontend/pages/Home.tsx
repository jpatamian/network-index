import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  HStack,
  VStack,
  Card,
  SimpleGrid,
  Center,
  Badge,
  Grid,
  Icon,
} from '@chakra-ui/react'
import { FaHandsHelping, FaUsers, FaMapMarkerAlt, FaShieldAlt, FaHeart, FaHome, FaMapPin, FaUserCheck, FaUser, FaEnvelope } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { user, isAuthenticated } = useAuth()

  const features = [
    {
      icon: FaHandsHelping,
      title: 'Mutual Aid',
      description: 'Help and support your neighbors with what they need',
    },
    {
      icon: FaUsers,
      title: 'Community',
      description: 'Connect with people in your local area',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Neighborhood',
      description: 'Share resources and opportunities nearby',
    },
    {
      icon: FaShieldAlt,
      title: 'Safe & Secure',
      description: 'Your privacy and safety are our priority',
    },
  ]

  return (
    <Box>

      {/* Hero Section */}
      <Box
        bg="linear-gradient(to bottom, #f0fdf4, #f0fef9)"
        py={{ base: 8, md: 12 }}
        borderBottomWidth="1px"
        borderColor="emerald.100"
      >
        <Container maxW="7xl">
          <Center mb={12}>
            <Stack textAlign="center" padding={8} maxW="2xl">
              <VStack padding={4}>
              <Heading
                  as="h1"
                  size="3xl"
                  fontWeight="bold"
                  bgGradient="linear(90deg, #059669, #0891b2)"
                  bgClip="text"
                >
                  {isAuthenticated
                    ? `Welcome back, ${user?.username || user?.email}!`
                    : 'Welcome to Mutual Aid Club'}
                </Heading>
                <Text fontSize="xl" color="gray.600" lineHeight={1.8}>
                  {isAuthenticated
                    ? 'Your community networking platform'
                    : 'A community networking platform for mutual aid and resource sharing in your neighborhood.'}
                </Text>
              </VStack>

              {!isAuthenticated && (
                <HStack padding={4} justify="center" pt={4}>
                  <Button
                    as={RouterLink}
                    onClick={() => {
                      window.location.href = '/signup'
                    }}
                    colorScheme="green"
                    size="lg"
                    fontWeight="bold"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    Get Started
                  </Button>
                  <Button
                    as={RouterLink}
                    onClick={() => {
                      window.location.href = '/login'
                    }}                    
                    variant="outline"
                    size="lg"
                    fontWeight="bold"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    Sign In
                  </Button>
                </HStack>
              )}
            </Stack>
          </Center>
        </Container>
      </Box>

      {/* Features Section */}
      {!isAuthenticated && (
        <Box py={{ base: 6, md: 8 }} bg="white" borderBottomWidth="1px" borderColor="emerald.100">
          <Container maxW="7xl">
            <Stack padding={12}>
              <Center>
                <Stack textAlign="center" padding={3}>
                  <Heading size="xl">What We Offer</Heading>
                  <Text fontSize="md" color="gray.600" maxW="xl">
                    Connect with your community and make a real difference
                  </Text>
                </Stack>
              </Center>

              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                {features.map((feature, idx) => (
                  <Card.Root key={idx} _hover={{ boxShadow: 'lg', transform: 'translateY(-4px)' }} transition="all 0.3s">
                    <Card.Body>
                      <VStack padding={4} textAlign="center">
                  <Box color="emerald.600" fontSize="3xl" p={2} bg="emerald.50" borderRadius="full">
                          <Icon as={feature.icon} />
                        </Box>
                        <Heading size="sm">{feature.title}</Heading>
                        <Text fontSize="sm" color="gray.600">
                          {feature.description}
                        </Text>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                ))}
              </Grid>
            </Stack>
          </Container>
        </Box>
      )}

      {/* Authenticated User Profile Section */}
      {isAuthenticated && user && (
        <Box py={{ base: 6, md: 8 }} bg="emerald.50" borderTopWidth="1px" borderColor="emerald.100">
          <Container maxW="7xl">
            <Card.Root>
              <Card.Body>
                <Stack padding={8}>
                  <HStack justify="space-between" align="center" gap={3}>
                    <HStack gap={2}>
                      <Box color="emerald.600" fontSize="xl">
                        <Icon as={FaUserCheck} />
                      </Box>
                      <Heading size="lg">Your Profile</Heading>
                    </HStack>
                    <Badge colorScheme={user.anonymous ? 'gray' : 'green'}>
                      <Text>
                        {user.anonymous ? 'Anonymous' : 'Verified'}
                      </Text>
                    </Badge>
                  </HStack>

                  <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} padding={6}>
                    <Box bg="emerald.100" p={4} borderRadius="lg">
                      <HStack gap={3} mb={2}>
                        <Icon as={FaEnvelope} color="emerald.600" />
                        <Text fontWeight="semibold" color="gray.600" fontSize="sm">
                          Email
                        </Text>
                      </HStack>
                      <Text fontWeight="bold" color="gray.900">
                        {user.email || 'Not set'}
                      </Text>
                    </Box>

                    <Box bg="teal.100" p={4} borderRadius="lg">
                      <HStack gap={3} mb={2}>
                        <Icon as={FaUser} color="teal.600" />
                        <Text fontWeight="semibold" color="gray.600" fontSize="sm">
                          Username
                        </Text>
                      </HStack>
                      <Text fontWeight="bold" color="gray.900">
                        {user.username || 'Not set'}
                      </Text>
                    </Box>

                    <Box bg="cyan.100" p={4} borderRadius="lg">
                      <HStack gap={3} mb={2}>
                        <Icon as={FaMapPin} color="cyan.600" />
                        <Text fontWeight="semibold" color="gray.600" fontSize="sm">
                          Zipcode
                        </Text>
                      </HStack>
                      <Text fontWeight="bold" color="gray.900">
                        {user.zipcode}
                      </Text>
                    </Box>

                    <Box bg="rose.100" p={4} borderRadius="lg">
                      <HStack gap={3} mb={2}>
                        <Icon as={FaHeart} color="rose.600" />
                        <Text fontWeight="semibold" color="gray.600" fontSize="sm">
                          Account Type
                        </Text>
                      </HStack>
                      <Text fontWeight="bold" color="gray.900">
                        {user.anonymous ? 'Anonymous' : 'Authenticated'}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Stack>
              </Card.Body>
            </Card.Root>
          </Container>
        </Box>
      )}
    </Box>
  )
}
