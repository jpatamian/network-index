import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  HStack,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { FaPen, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import HowItWorks from "@/features/home/components/HowItWorks";
import FindYourNeighborhood from "@/features/home/components/FindYourNeighborhood";
import YourNeighborhood from "@/features/neighborhood/components/YourNeighborhood";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const needsZipcode = isAuthenticated && user?.zipcode === null;
  const [showSupportBanner, setShowSupportBanner] = useState(true);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(
      "home-support-banner-dismissed",
    );
    if (storedValue === "true") {
      setShowSupportBanner(false);
    }
  }, []);

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
          <Stack textAlign="center" maxW="2xl" gap={6} mx="auto">
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
        </Container>
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
                    navigate("/profile");
                  }}
                >
                  Add Zipcode
                </Button>
              </HStack>
            </Box>
          )}

          {!isAuthenticated && showSupportBanner && (
            <Box
              mt={4}
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
                <HStack gap={2} align="center">
                  <Button
                    size="sm"
                    bg="teal.600"
                    color="white"
                    _hover={{ bg: "teal.700" }}
                    onClick={() => {
                      navigate("/posts/new");
                    }}
                  >
                    Create a Post
                  </Button>
                  <IconButton
                    aria-label="Dismiss banner"
                    size="sm"
                    variant="ghost"
                    color="teal.800"
                    onClick={() => {
                      window.localStorage.setItem(
                        "home-support-banner-dismissed",
                        "true",
                      );
                      setShowSupportBanner(false);
                    }}
                  >
                    <Icon as={FaTimes} boxSize={3} />
                  </IconButton>
                </HStack>
              </HStack>
            </Box>
          )}

          {!isAuthenticated && <FindYourNeighborhood />}
        </Container>
      </Box>

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
