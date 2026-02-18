import { Box, Container, Heading, Text, Button, VStack, HStack, Badge, Icon, SimpleGrid } from '@chakra-ui/react'
import { FaMapPin, FaMapMarkerAlt, FaPlus, FaSearch, FaHistory } from 'react-icons/fa'
import { neighborhoodActions } from '@/features/neighborhood/lib/neighborhoodActions'

interface YourNeighborhoodProps {
  user: {
    zipcode?: string
    username?: string
    email?: string
  }
}

export default function YourNeighborhood({ user }: YourNeighborhoodProps) {

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
            <VStack gap={6} align="stretch" w="100%">
              <VStack gap={3} align="stretch">
                <Text color="gray.600" fontSize="md" lineHeight="1.6">
                  Posts and resources from your area (zipcode {user.zipcode})
                </Text>
                <Button
                  onClick={() => neighborhoodActions.browseFeed(user)}
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

              {/* Quick Actions */}
              <Box>
                <Text color="gray.700" fontSize="sm" fontWeight="600" mb={3}>
                  Quick Actions
                </Text>
                <SimpleGrid columns={{ base: 3, sm: 3 }} gap={3}>
                  <Button
                    onClick={() => neighborhoodActions.createPost()}
                    variant="outline"
                    borderColor="teal.200"
                    color="teal.600"
                    fontWeight="600"
                    borderRadius="md"
                    gap={2}
                    height="fit-content"
                    py={4}
                    flexDirection="column"
                    _hover={{ bg: 'teal.50' }}
                    transition="all 0.2s"
                  >
                    <Icon as={FaPlus} fontSize="lg" />
                    <Text fontSize="sm">Create Post</Text>
                  </Button>

                  <Button
                    onClick={() => neighborhoodActions.searchNeighborhood(user)}
                    variant="outline"
                    borderColor="teal.200"
                    color="teal.600"
                    fontWeight="600"
                    borderRadius="md"
                    gap={2}
                    height="fit-content"
                    py={4}
                    flexDirection="column"
                    _hover={{ bg: 'teal.50' }}
                    transition="all 0.2s"
                  >
                    <Icon as={FaSearch} fontSize="lg" />
                    <Text fontSize="sm">Search Area</Text>
                  </Button>

                  <Button
                    onClick={() => neighborhoodActions.viewMyPosts()}
                    variant="outline"
                    borderColor="teal.200"
                    color="teal.600"
                    fontWeight="600"
                    borderRadius="md"
                    gap={2}
                    height="fit-content"
                    py={4}
                    flexDirection="column"
                    _hover={{ bg: 'teal.50' }}
                    transition="all 0.2s"
                  >
                    <Icon as={FaHistory} fontSize="lg" />
                    <Text fontSize="sm">My Posts</Text>
                  </Button>
                </SimpleGrid>
              </Box>
            </VStack>
          ) : (
            <VStack gap={4} align="stretch" w="100%" p={6} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200">
              <Text color="gray.600" fontSize="md">
                Add your zipcode to discover resources and connect with neighbors in your area.
              </Text>
              <Button
                onClick={() => neighborhoodActions.updateProfile()}
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
