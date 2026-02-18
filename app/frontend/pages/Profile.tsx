import { Box, Container, Heading, Text, Button, Stack, HStack, Badge, Icon, SimpleGrid, VStack } from '@chakra-ui/react'
import { FaHeart, FaMapPin, FaUserCheck, FaUser, FaEnvelope, FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Profile() {
  const { user } = useAuth()

  const handleBack = () => {
    window.location.href = '/'
  }

  return (
    <ProtectedRoute>
      <Box minH="100vh" bg="gray.50">
        {/* Back Button */}
        <Box py={6} bg="white" borderBottomWidth="1px" borderColor="gray.100">
          <Container maxW="7xl">
            <Button
              onClick={handleBack}
              variant="ghost"
              color="teal.600"
              fontWeight="600"
              gap={2}
              fontSize="sm"
              _hover={{ bg: 'teal.50' }}
            >
              <Icon as={FaArrowLeft} />
              Back to Home
            </Button>
          </Container>
        </Box>

        {/* Profile Section */}
        {user && (
          <Box py={{ base: 12, md: 16 }} bg="white" borderBottomWidth="1px" borderColor="gray.100">
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
          </Box>
        )}
      </Box>
    </ProtectedRoute>
  )
}
