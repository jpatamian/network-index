import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  Input,
  Badge,
  Link,
} from "@chakra-ui/react";
import { FaHandsHelping, FaSearch, FaMapMarkerAlt } from "react-icons/fa";

interface FindResourcesProps {
  zipcode?: string;
}

export default function FindResources({
  zipcode: propZipcode,
}: FindResourcesProps) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    const zip = (propZipcode ?? inputValue).trim();
    if (zip) {
      navigate(`/resources?zipcode=${encodeURIComponent(zip)}`);
    } else {
      navigate("/resources");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Box
      py={{ base: 6, md: 8 }}
      bg="bg.subtle"
      borderBottomWidth="1px"
      borderColor="border.subtle"
    >
      <Container maxW="7xl">
        <VStack gap={6} align="center" textAlign="center">
          <Box color="orange.600" fontSize="4xl">
            <Icon as={FaHandsHelping} />
          </Box>

          <VStack gap={3} maxW="2xl">
            <Heading size="lg" color="fg" fontWeight="700">
              Find Free Resources Near You
            </Heading>
            <Text fontSize="md" color="fg.muted" lineHeight="1.6">
              Food banks, shelters, community centers, healthcare, legal aid,
              and more — all in one place.
            </Text>
          </VStack>

          {propZipcode ? (
            /* Authed user with zipcode — show it pre-filled */
            <VStack gap={3}>
              <HStack gap={2}>
                <Badge
                  bg="teal.50"
                  color="teal.700"
                  fontWeight="600"
                  px={3}
                  py={1.5}
                  borderRadius="full"
                  fontSize="sm"
                >
                  <HStack gap={1.5}>
                    <Icon as={FaMapMarkerAlt} fontSize="xs" />
                    <Text>{propZipcode}</Text>
                  </HStack>
                </Badge>
              </HStack>
              <Button
                onClick={handleSearch}
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
                gap={2}
              >
                <Icon as={FaSearch} />
                Find Resources Near Me
              </Button>
            </VStack>
          ) : (
            /* Unauthed or authed without zipcode — show input */
            <HStack gap={3} maxW="sm" w="100%">
              <Input
                placeholder="Enter your zipcode"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
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
                _hover={{
                  bg: "teal.700",
                  transform: "translateY(-1px)",
                  boxShadow: "md",
                }}
                transition="all 0.2s"
                gap={2}
                flexShrink={0}
              >
                <Icon as={FaSearch} />
                Search
              </Button>
            </HStack>
          )}

          <Link
            onClick={() => navigate("/resources")}
            color="teal.600"
            fontSize="sm"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
          >
            Browse all resources →
          </Link>
        </VStack>
      </Container>
    </Box>
  );
}
