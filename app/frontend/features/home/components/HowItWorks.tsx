import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Card,
  VStack,
  Icon,
  Center,
  Image,
} from '@chakra-ui/react'
import { FaHandsHelping, FaUsers, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa'

export default function HowItWorks() {
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
    <Box py={{ base: 12, md: 16 }} bg="bg.subtle" borderBottomWidth="1px" borderColor="border.subtle">
      <Container maxW="7xl">
        <Stack padding={4} gap={8}>
          <Center>
            <Stack textAlign="center" gap={4}>
              <Heading size="lg" color="fg" fontWeight="700">
                How It Works
              </Heading>
              <Text fontSize="md" color="fg.muted" maxW="2xl">
                Connect with neighbors to share, help, and grow together
              </Text>
              {/* Community helping image */}
              <Box maxW="lg" mx="auto" mt={4}>
                <Image
                  src="/images/helping-hands.svg"
                  alt="Community members helping each other"
                  w="100%"
                  h="auto"
                  borderRadius="lg"
                />
              </Box>
            </Stack>
          </Center>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {features.map((feature, idx) => (
              <Card.Root
                key={idx}
                _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.3s"
                borderColor="border.subtle"
                borderWidth="1px"
              >
                <Card.Body>
                  <VStack gap={4} textAlign="center">
                    <Box
                      color="teal.600"
                      fontSize="3xl"
                      p={3}
                      bg="teal.50"
                      borderRadius="lg"
                      w="fit-content"
                      mx="auto"
                    >
                      <Icon as={feature.icon} />
                    </Box>
                    <Heading size="sm" color="fg" fontWeight="600">
                      {feature.title}
                    </Heading>
                    <Text fontSize="sm" color="fg.muted" lineHeight="1.5">
                      {feature.description}
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  )
}
