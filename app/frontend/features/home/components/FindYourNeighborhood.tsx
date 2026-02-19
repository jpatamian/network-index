import { useState } from 'react'
import { Box, Container, Heading, Text, Button, VStack, Stack, Icon, Input, HStack, Image } from '@chakra-ui/react'
import { FaMapPin, FaSearch } from 'react-icons/fa'
import neighborhoodMapImage from '@/assets/images/neighborhood-map.svg'

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
    <Box py={{ base: 12, md: 16 }} bg="bg" borderBottomWidth="1px" borderColor="border.subtle">
      <Container maxW="7xl">
        <VStack gap={8} align="center" textAlign="center">
          {/* Neighborhood map image */}
          <Box maxW="lg" w="100%">
            <Image
              src={neighborhoodMapImage}
              alt="Map of neighborhoods with location pins"
              w="100%"
              h="auto"
              borderRadius="lg"
              boxShadow="md"
            />
          </Box>
          
          <Box color="teal.600" fontSize="4xl">
            <Icon as={FaMapPin} />
          </Box>
          <Stack gap={3} maxW="2xl">
            <Heading size="lg" color="fg" fontWeight="700">
              Find Your Neighborhood
            </Heading>
            <Text fontSize="md" color="fg.muted" lineHeight="1.6">
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
              bg="bg"
              borderColor="border"
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
              disabled={!zipcode.trim()}
            >
            <Icon as={FaSearch} />
              Search
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}
