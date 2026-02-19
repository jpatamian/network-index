import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  HStack,
  Center,
  Image,
} from '@chakra-ui/react'
import { useAuth } from '@/hooks/useAuth'
import HowItWorks from '@/features/home/components/HowItWorks'
import FindYourNeighborhood from '@/features/home/components/FindYourNeighborhood'
import YourNeighborhood from '@/features/neighborhood/components/YourNeighborhood'
import communityHeroImage from '@/assets/images/community-hero.svg'

export default function Home() {
  const { user, isAuthenticated } = useAuth()

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg="bg"
        py={{ base: 12, md: 16 }}
        borderBottomWidth="1px"
        borderColor="border.subtle"
      >
        <Container maxW="7xl">
          <Stack gap={8} align="center">
            {/* Hero Image */}
            <Box
              w="100%"
              maxW="4xl"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="lg"
              bg="white"
            >
              <Image
                src={communityHeroImage}
                alt="Friendly neighborhood community with houses and people"
                w="100%"
                h="auto"
                objectFit="cover"
              />
            </Box>

            <Stack textAlign="center" maxW="2xl" gap={6}>
              <Heading
                as="h1"
                size="2xl"
                fontWeight="700"
                color="fg"
                lineHeight="1.2"
              >
                {isAuthenticated
                  ? `Welcome back, ${user?.username || user?.email}!`
                  : 'Your Neighborhood, Connected'}
              </Heading>
              <Text fontSize="lg" color="fg.muted" lineHeight={1.6}>
                {isAuthenticated
                  ? 'Connect with neighbors to share resources, ask for help, and build community.'
                  : 'Share resources, ask for help, and build genuine connections with neighbors near you.'}
              </Text>
            </Stack>
          </Stack>

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
                borderColor="border"
                color="fg"
                _hover={{ bg: 'bg.subtle', transform: 'translateY(-1px)', boxShadow: 'md' }}
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
      <HowItWorks />
    </Box>
  )
}
