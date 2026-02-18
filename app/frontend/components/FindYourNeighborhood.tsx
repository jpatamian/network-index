import { useState } from 'react'
import { Box, Container, Heading, Text, Button, VStack, Stack, Icon, Input, HStack } from '@chakra-ui/react'
import { FaMapPin, FaSearch } from 'react-icons/fa'

export default function FindYourNeighborhood() {
  const [zipcode, setZipcode] = useState('')

  const handleSearch = () => {
    if (zipcode.trim()) {
      window.location.href = `/posts?zipcode=${encodeURIComponent(zipcode.trim())}`
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Box py={{ base: 12, md: 16 }} bg="white" borderBottomWidth="1px" borderColor="gray.100">
      <Container maxW="7xl">
        <VStack gap={8} align="center" textAlign="center">
          <Box color="teal.600" fontSize="4xl">
            <Icon as={FaMapPin} />
          </Box>
          <Stack gap={3} maxW="2xl">
            <Heading size="lg" color="gray.900" fontWeight="700">
              Find Your Neighborhood
            </Heading>
            <Text fontSize="md" color="gray.600" lineHeight="1.6">
              Enter your zipcode to find resources and connect with neighbors in your area.
            </Text>
          </Stack>
          <HStack gap={3} maxW="sm" w="100%">
            <Input
              placeholder="Enter your zipcode"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              onKeyPress={handleKeyPress}
              type="text"
              size="lg"
              borderRadius="md"
              focusBorderColor="teal.600"
              bg="white"
              borderColor="gray.300"
            />
            <Button
              onClick={handleSearch}
              bg="teal.600"
              color="white"
              size="lg"
              fontWeight="600"
              borderRadius="md"
              _hover={{ bg: 'teal.700', transform: 'translateY(-1px)', boxShadow: 'md' }}
              transition="all 0.2s"
              gap={2}
              leftIcon={<Icon as={FaSearch} />}
              isDisabled={!zipcode.trim()}
            >
              Search
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}
