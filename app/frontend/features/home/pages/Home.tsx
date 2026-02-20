import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  HStack,
  Image,
  Icon,
} from "@chakra-ui/react";
import { FaPen } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import HowItWorks from "@/features/home/components/HowItWorks";
import FindYourNeighborhood from "@/features/home/components/FindYourNeighborhood";
import YourNeighborhood from "@/features/neighborhood/components/YourNeighborhood";
import communityHeroImage from "@/assets/images/community-hero.svg";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const needsZipcode = isAuthenticated && user?.zipcode === "00000";

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
          {needsZipcode && (
            <Box
              mb={6}
              bg="orange.50"
              border="1px"
              borderColor="orange.200"
              borderRadius="lg"
              p={4}
            >
              <HStack
                justify="space-between"
                align="center"
                flexWrap="wrap"
                gap={3}
              >
                <Text color="orange.800" fontSize="sm" fontWeight="500">
                  Finish setting up your account by adding your zipcode.
                </Text>
                <Button
                  size="sm"
                  bg="orange.500"
                  color="white"
                  _hover={{ bg: "orange.600" }}
                  onClick={() => {
                    window.location.href = "/profile";
                  }}
                >
                  Add Zipcode
                </Button>
              </HStack>
            </Box>
          )}

          {!isAuthenticated && (
            <Box
              mb={6}
              bg="teal.50"
              border="1px"
              borderColor="teal.200"
              borderRadius="lg"
              p={4}
            >
              <HStack
                justify="space-between"
                align="center"
                flexWrap="wrap"
                gap={3}
              >
                <HStack gap={2.5} color="teal.800">
                  <Icon as={FaPen} />
                  <Text fontSize="sm" fontWeight="600">
                    Need help or want to offer support? Post now — no account
                    required.
                  </Text>
                </HStack>
                <Button
                  size="sm"
                  bg="teal.600"
                  color="white"
                  _hover={{ bg: "teal.700" }}
                  onClick={() => {
                    window.location.href = "/posts/new";
                  }}
                >
                  Create a Post
                </Button>
              </HStack>
            </Box>
          )}

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
                  : "Your Neighborhood, Connected"}
              </Heading>
              <Text fontSize="lg" color="fg.muted" lineHeight={1.6}>
                {isAuthenticated
                  ? "Connect with neighbors to share resources, ask for help, and build community."
                  : "Share resources, ask for help, and build genuine connections with neighbors near you."}
              </Text>
            </Stack>
          </Stack>

          {!isAuthenticated && (
            <HStack gap={4} justify="center" pt={4}>
              <Button
                onClick={() => {
                  window.location.href = "/signup";
                }}
                bg="teal.600"
                color="white"
                size="lg"
                fontWeight="600"
                borderRadius="md"
                _hover={{
                  bg: "teal.700",
                  transform: "translateY(-1px)",
                  boxShadow: "md",
                }}
                transition="all 0.2s"
              >
                Get Started
              </Button>
              <Button
                onClick={() => {
                  window.location.href = "/login";
                }}
                variant="outline"
                size="lg"
                fontWeight="600"
                borderRadius="md"
                borderColor="border"
                color="fg"
                _hover={{
                  bg: "bg.subtle",
                  transform: "translateY(-1px)",
                  boxShadow: "md",
                }}
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
      {isAuthenticated && user && user.username && user.email && (
        <YourNeighborhood
          user={{
            zipcode: user.zipcode ?? undefined,
            username: user.username,
            email: user.email,
          }}
        />
      )}

      {/* Features Section */}
      <HowItWorks />
    </Box>
  );
}
