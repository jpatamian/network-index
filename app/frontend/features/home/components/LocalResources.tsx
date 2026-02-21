import { useState } from "react";
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
} from "@chakra-ui/react";
import {
  FaUtensils,
  FaHospital,
  FaHome,
  FaStethoscope,
  FaGavel,
  FaBolt,
  FaGlobe,
  FaSearch,
} from "react-icons/fa";

interface LocalResourcesProps {
  zipcode?: string;
}

interface ResourceLink {
  name: string;
  description: string;
  getUrl: (zipcode?: string) => string;
}

interface ResourceCategory {
  icon: React.ElementType;
  category: string;
  color: string;
  bg: string;
  resources: ResourceLink[];
}

const categories: ResourceCategory[] = [
  {
    icon: FaGlobe,
    category: "All Services",
    color: "teal.600",
    bg: "teal.50",
    resources: [
      {
        name: "211.org",
        description: "Comprehensive directory of local social services",
        getUrl: (zip) =>
          zip
            ? `https://www.211.org/?zip=${encodeURIComponent(zip)}`
            : "https://www.211.org",
      },
      {
        name: "findhelp.org",
        description: "Find free or reduced-cost local programs",
        getUrl: (zip) =>
          zip
            ? `https://findhelp.org?postal=${encodeURIComponent(zip)}`
            : "https://findhelp.org",
      },
    ],
  },
  {
    icon: FaUtensils,
    category: "Food",
    color: "orange.600",
    bg: "orange.50",
    resources: [
      {
        name: "Feeding America",
        description: "Find your local food bank",
        getUrl: () => "https://www.feedingamerica.org/find-your-local-foodbank",
      },
      {
        name: "FoodPantries.org",
        description: "Local food pantries and meal programs",
        getUrl: (zip) =>
          zip
            ? `https://www.foodpantries.org/ci/${encodeURIComponent(zip)}`
            : "https://www.foodpantries.org",
      },
    ],
  },
  {
    icon: FaHospital,
    category: "Healthcare",
    color: "red.600",
    bg: "red.50",
    resources: [
      {
        name: "FreeClinics.com",
        description: "Free and low-cost medical clinics near you",
        getUrl: () => "https://www.freeclinics.com",
      },
      {
        name: "NeedyMeds",
        description: "Prescription assistance and low-cost care programs",
        getUrl: () => "https://www.needymeds.org",
      },
    ],
  },
  {
    icon: FaHome,
    category: "Housing",
    color: "blue.600",
    bg: "blue.50",
    resources: [
      {
        name: "HUD Rental Assistance",
        description: "Federal housing programs and rental help",
        getUrl: () => "https://www.hud.gov/topics/rental_assistance",
      },
      {
        name: "NLIHC Emergency Assistance",
        description: "Emergency rental and housing assistance locator",
        getUrl: () => "https://nlihc.org/rental-assistance",
      },
    ],
  },
  {
    icon: FaStethoscope,
    category: "Mental Health",
    color: "purple.600",
    bg: "purple.50",
    resources: [
      {
        name: "SAMHSA Treatment Locator",
        description: "Find mental health and substance use treatment",
        getUrl: () => "https://findtreatment.gov",
      },
      {
        name: "Open Path Collective",
        description: "Affordable therapy sessions ($30–$80)",
        getUrl: () => "https://openpathcollective.org",
      },
    ],
  },
  {
    icon: FaGavel,
    category: "Legal Aid",
    color: "gray.600",
    bg: "gray.100",
    resources: [
      {
        name: "LawHelp.org",
        description: "Free legal information and aid referrals by state",
        getUrl: () => "https://www.lawhelp.org",
      },
      {
        name: "Legal Services Corp.",
        description: "Find a free civil legal aid office near you",
        getUrl: () =>
          "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help",
      },
    ],
  },
  {
    icon: FaBolt,
    category: "Utilities",
    color: "yellow.600",
    bg: "yellow.50",
    resources: [
      {
        name: "LIHEAP",
        description: "Energy bill assistance for low-income households",
        getUrl: () =>
          "https://www.acf.hhs.gov/ocs/programs/liheap",
      },
      {
        name: "NeedHelpPayingBills.com",
        description: "Utility assistance programs by state",
        getUrl: () =>
          "https://www.needhelppayingbills.com/html/utility_assistance.html",
      },
    ],
  },
];

export default function LocalResources({ zipcode: propZipcode }: LocalResourcesProps) {
  const [inputValue, setInputValue] = useState(propZipcode ?? "");
  const [activeZipcode, setActiveZipcode] = useState(propZipcode ?? "");

  const handleSearch = () => {
    if (inputValue.trim()) {
      setActiveZipcode(inputValue.trim());
    }
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
          <Stack gap={4} align="center" textAlign="center">
            <Heading size="lg" color="fg" fontWeight="700">
              Free Local Resources
            </Heading>
            <Text fontSize="md" color="fg.muted" maxW="xl">
              Find free services in your community. Enter a zipcode to get
              personalized links for your area.
            </Text>

            {!propZipcode && (
              <HStack gap={2} maxW="sm" w="100%">
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
                  Find
                </Button>
              </HStack>
            )}

            {activeZipcode && (
              <Badge
                bg="teal.50"
                color="teal.700"
                fontWeight="600"
                px={3}
                py={1.5}
                borderRadius="full"
                fontSize="sm"
              >
                Showing resources for {activeZipcode}
              </Badge>
            )}
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {categories.map((cat) => (
              <Card.Root
                key={cat.category}
                borderColor="border.subtle"
                borderWidth="1px"
                _hover={{ boxShadow: "sm" }}
                transition="all 0.2s"
              >
                <Card.Body>
                  <VStack align="start" gap={3}>
                    <HStack gap={3}>
                      <Box
                        color={cat.color}
                        fontSize="lg"
                        p={2}
                        bg={cat.bg}
                        borderRadius="md"
                      >
                        <Icon as={cat.icon} />
                      </Box>
                      <Text fontWeight="600" color="fg" fontSize="sm">
                        {cat.category}
                      </Text>
                    </HStack>

                    <VStack align="start" gap={3} w="100%">
                      {cat.resources.map((resource) => (
                        <Link
                          key={resource.name}
                          href={resource.getUrl(activeZipcode || undefined)}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="teal.600"
                          _hover={{ color: "teal.800", textDecoration: "underline" }}
                        >
                          <VStack align="start" gap={0.5}>
                            <Text fontWeight="600" fontSize="sm">
                              {resource.name}
                            </Text>
                            <Text color="fg.muted" fontSize="xs" lineHeight="1.4">
                              {resource.description}
                            </Text>
                          </VStack>
                        </Link>
                      ))}
                    </VStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>

          <Text fontSize="xs" color="fg.subtle" textAlign="center">
            These are external services. We are not affiliated with any of the
            organizations listed above.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
