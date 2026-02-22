import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  SimpleGrid,
  Card,
  VStack,
  HStack,
  Icon,
  Badge,
  Input,
  Link,
  Spinner,
  Center,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaClock,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useLocalResources } from "@/features/resources/lib/useLocalResources";

interface LocalResourcesProps {
  zipcode?: string;
}

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  Food: { color: "orange.600", bg: "orange.50" },
  "Housing & Shelter": { color: "blue.600", bg: "blue.50" },
  Healthcare: { color: "red.600", bg: "red.50" },
  "Community Center": { color: "teal.600", bg: "teal.50" },
  "Social Services": { color: "purple.600", bg: "purple.50" },
};

function categoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? { color: "gray.600", bg: "gray.100" };
}

const PAGE_SIZE = 10;

const radiusOptions = createListCollection({
  items: [
    { label: "5 miles", value: "5" },
    { label: "10 miles", value: "10" },
    { label: "15 miles", value: "15" },
    { label: "20 miles (default)", value: "20" },
    { label: "30 miles", value: "30" },
    { label: "50 miles", value: "50" },
  ],
});

export default function LocalResources({
  zipcode: propZipcode,
}: LocalResourcesProps) {
  const [inputValue, setInputValue] = useState(propZipcode ?? "");
  const [activeZipcode, setActiveZipcode] = useState(propZipcode ?? "");
  const [radius, setRadius] = useState("20");
  const [page, setPage] = useState(0);

  const { resources, isLoading, error } = useLocalResources(
    activeZipcode,
    parseInt(radius),
  );

  useEffect(() => {
    setPage(0);
  }, [activeZipcode]);

  const pageCount = Math.ceil(resources.length / PAGE_SIZE);
  const visibleResources = resources.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    if (trimmed) setActiveZipcode(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Box
      py={{ base: 12, md: 16 }}
      bg="bg"
      borderBottomWidth="1px"
      borderColor="border.subtle"
    >
      <Container maxW="7xl">
        <Stack gap={8}>
          {/* Header */}
          <Stack gap={4} align="center" textAlign="center">
            <Heading size="lg" color="fg" fontWeight="700">
              Free Local Resources
            </Heading>
            <Text fontSize="md" color="fg.muted" maxW="xl">
              Real services near you — food banks, shelters, community centers,
              and more.
            </Text>

            {!propZipcode && (
              <Stack gap={3} maxW="sm" w="100%">
                <HStack gap={2} w="100%">
                  <Input
                    placeholder="Enter zipcode"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    size="md"
                    borderColor="border"
                  />
                  <Button
                    onClick={handleSearch}
                    bg="teal.600"
                    color="white"
                    size="md"
                    disabled={!inputValue.trim()}
                    _hover={{ bg: "teal.700" }}
                    gap={2}
                  >
                    <Icon as={FaSearch} />
                    Search
                  </Button>
                </HStack>
                {activeZipcode && (
                  <Select.Root
                    collection={radiusOptions}
                    value={[radius]}
                    onValueChange={(value) => setRadius(value.value[0])}
                    size="md"
                  >
                    <Select.Content>
                      {radiusOptions.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              </Stack>
            )}

            {activeZipcode && !isLoading && !error && (
              <Badge
                bg="teal.50"
                color="teal.700"
                fontWeight="600"
                px={3}
                py={1.5}
                borderRadius="full"
                fontSize="sm"
              >
                {resources.length} service{resources.length !== 1 ? "s" : ""}{" "}
                found near {activeZipcode}
              </Badge>
            )}
          </Stack>

          {/* Loading */}
          {isLoading && (
            <Center py={12}>
              <VStack gap={3}>
                <Spinner size="lg" color="teal.500" />
                <Text color="fg.muted" fontSize="sm">
                  Searching for services near {activeZipcode}...
                </Text>
              </VStack>
            </Center>
          )}

          {/* Error */}
          {error && !isLoading && (
            <Box
              bg="red.50"
              border="1px"
              borderColor="red.200"
              borderRadius="lg"
              p={4}
              textAlign="center"
            >
              <Text color="red.700" fontSize="sm">
                {error}
              </Text>
            </Box>
          )}

          {/* No zipcode entered yet */}
          {!activeZipcode && !isLoading && (
            <Box
              bg="bg.subtle"
              border="1px"
              borderColor="border.subtle"
              borderRadius="lg"
              p={8}
              textAlign="center"
            >
              <Text color="fg.muted" fontSize="sm">
                Enter a zipcode above to find real local services in your area.
              </Text>
            </Box>
          )}

          {/* Results */}
          {!isLoading && resources.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
              {visibleResources.map((r) => {
                const { color, bg } = categoryStyle(r.category);
                return (
                  <Card.Root
                    key={r.id}
                    borderColor="border.subtle"
                    borderWidth="1px"
                    _hover={{ boxShadow: "sm" }}
                    transition="all 0.2s"
                  >
                    <Card.Body>
                      <VStack align="start" gap={3}>
                        <HStack justify="space-between" w="100%">
                          <Badge
                            bg={bg}
                            color={color}
                            fontWeight="600"
                            px={2}
                            py={0.5}
                            borderRadius="md"
                            fontSize="xs"
                          >
                            {r.category}
                          </Badge>
                          {r.distanceMiles !== undefined && (
                            <Text fontSize="xs" color="fg.muted">
                              {r.distanceMiles.toFixed(1)} mi
                            </Text>
                          )}
                        </HStack>

                        <Text
                          fontWeight="600"
                          fontSize="sm"
                          color="fg"
                          lineHeight="1.3"
                        >
                          {r.name}
                        </Text>

                        <VStack align="start" gap={1.5} w="100%">
                          {r.address && (
                            <HStack gap={1.5} align="start">
                              <Icon
                                as={FaMapMarkerAlt}
                                color="fg.muted"
                                fontSize="xs"
                                mt={0.5}
                                flexShrink={0}
                              />
                              <Text
                                fontSize="xs"
                                color="fg.muted"
                                lineHeight="1.4"
                              >
                                {r.address}
                              </Text>
                            </HStack>
                          )}

                          {r.phone && (
                            <HStack gap={1.5}>
                              <Icon
                                as={FaPhone}
                                color="fg.muted"
                                fontSize="xs"
                                flexShrink={0}
                              />
                              <Link
                                href={`tel:${r.phone}`}
                                color="teal.600"
                                fontSize="xs"
                                _hover={{ textDecoration: "underline" }}
                              >
                                {r.phone}
                              </Link>
                            </HStack>
                          )}

                          {r.hours && (
                            <HStack gap={1.5} align="start">
                              <Icon
                                as={FaClock}
                                color="fg.muted"
                                fontSize="xs"
                                mt={0.5}
                                flexShrink={0}
                              />
                              <Text
                                fontSize="xs"
                                color="fg.muted"
                                lineHeight="1.4"
                              >
                                {r.hours}
                              </Text>
                            </HStack>
                          )}

                          {r.website && (
                            <HStack gap={1.5}>
                              <Icon
                                as={FaGlobe}
                                color="fg.muted"
                                fontSize="xs"
                                flexShrink={0}
                              />
                              <Link
                                href={
                                  r.website.startsWith("http")
                                    ? r.website
                                    : `https://${r.website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                color="teal.600"
                                fontSize="xs"
                                _hover={{ textDecoration: "underline" }}
                              >
                                <HStack gap={1}>
                                  <Text>Website</Text>
                                  <Icon as={FaExternalLinkAlt} fontSize="2xs" />
                                </HStack>
                              </Link>
                            </HStack>
                          )}
                        </VStack>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                );
              })}
            </SimpleGrid>
          )}

          {/* Pagination */}
          {!isLoading && pageCount > 1 && (
            <HStack justify="center" gap={4}>
              <Button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                variant="outline"
                size="sm"
                borderColor="border"
                color="fg"
                _hover={{ bg: "bg.subtle" }}
              >
                Previous
              </Button>
              <Text fontSize="sm" color="fg.muted">
                Page {page + 1} of {pageCount}
              </Text>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= pageCount - 1}
                variant="outline"
                size="sm"
                borderColor="border"
                color="fg"
                _hover={{ bg: "bg.subtle" }}
              >
                Next
              </Button>
            </HStack>
          )}

          {/* Empty state after search */}
          {!isLoading && !error && activeZipcode && resources.length === 0 && (
            <Box
              bg="bg.subtle"
              border="1px"
              borderColor="border.subtle"
              borderRadius="lg"
              p={8}
              textAlign="center"
            >
              <VStack gap={3}>
                <Text color="fg.muted" fontSize="sm">
                  No results found in OpenStreetMap for this area. Try these
                  national directories instead:
                </Text>
                <HStack gap={4} flexWrap="wrap" justify="center">
                  <Link
                    href={`https://www.211.org/?zip=${encodeURIComponent(activeZipcode)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="teal.600"
                    fontWeight="600"
                    fontSize="sm"
                    _hover={{ textDecoration: "underline" }}
                  >
                    211.org →
                  </Link>
                  <Link
                    href={`https://findhelp.org?postal=${encodeURIComponent(activeZipcode)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="teal.600"
                    fontWeight="600"
                    fontSize="sm"
                    _hover={{ textDecoration: "underline" }}
                  >
                    findhelp.org →
                  </Link>
                </HStack>
              </VStack>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
