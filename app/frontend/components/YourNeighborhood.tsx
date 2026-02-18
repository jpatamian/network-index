import { Box, Container, Heading, Text, Button, VStack, HStack, Badge, Icon } from '@chakra-ui/react'
import { FaMapPin, FaMapMarkerAlt } from 'react-icons/fa'

interface YourNeighborhoodProps {
  user: {
    zipcode?: string
    username?: string
    email?: string
  }
}

export default function YourNeighborhood({ user }: YourNeighborhoodProps) {
  const handleBrowseFeed = () => {
    if (user.zipcode) {
      window.location.href = `/posts?zipcode=${encodeURIComponent(user.zipcode)}`
    } else {
      window.location.href = '/posts'
    }
  }

  const handleUpdateProfile = () => {
    // Link to profile/settings page when available
    window.location.href = '/profile'
  }

  return (
    <Box py={{ base: 12, md: 16 }} bg="gray.50" borderTopWidth="1px" borderColor="gray.100" borderBottomWidth="1px">
      <Container maxW="7xl">
        <VStack gap={8}>
          <HStack gap={3} w="100%">
            <Box color="teal.600" fontSize="2xl">
              <Icon as={FaMapPin} />
            </Box>
            <Heading size="lg" color="gray.900" fontWeight="700">
              Your Neighborhood
            </Heading>
            {user.zipcode && (
              <Badge bg="teal.50" color="teal.700" fontWeight="600" px={3} py={1.5} borderRadius="full">
                <HStack gap={1} fontSize="sm">
                  <Icon as={FaMapMarkerAlt} fontSize="sm" />
                  <Text>{user.zipcode}</Text>
                </HStack>
              </Badge>
            )}
          </HStack>

          {user.zipcode ? (
            <VStack gap={4} align="stretch" w="100%">
              <Text color="gray.600" fontSize="md" lineHeight="1.6">
                Posts and resources from your area (zipcode {user.zipcode})
              </Text>
              <Button
                onClick={handleBrowseFeed}
                bg="teal.600"
                color="white"
                size="lg"
                fontWeight="600"
                borderRadius="md"
                _hover={{ bg: 'teal.700', transform: 'translateY(-1px)', boxShadow: 'md' }}
                transition="all 0.2s"
                w="fit-content"
              >
                Browse Community Feed
              </Button>
            </VStack>
          ) : (
            <VStack gap={4} align="stretch" w="100%" p={6} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200">
              <Text color="gray.600" fontSize="md">
                Add your zipcode to discover resources and connect with neighbors in your area.
              </Text>
              <Button
                onClick={handleUpdateProfile}
                variant="outline"
                borderColor="teal.600"
                color="teal.600"
                size="md"
                fontWeight="600"
                borderRadius="md"
                _hover={{ bg: 'teal.50' }}
                w="fit-content"
              >
                Update Profile
              </Button>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  )
}
