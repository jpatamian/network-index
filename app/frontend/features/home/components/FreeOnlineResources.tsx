import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Card,
  VStack,
  HStack,
  Icon,
  Badge,
  Link,
} from "@chakra-ui/react";
import {
  FaPhone,
  FaCommentAlt,
  FaHeartbeat,
  FaAppleAlt,
  FaMoneyBillAlt,
  FaGlobe,
  FaChild,
  FaHome,
} from "react-icons/fa";

interface CrisisResource {
  name: string;
  contact: string;
  contactType: "phone" | "text";
  description: string;
  urgent?: boolean;
}

interface OnlineResource {
  name: string;
  url: string;
  description: string;
  category: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

const crisisResources: CrisisResource[] = [
  {
    name: "988 Suicide & Crisis Lifeline",
    contact: "Call or text 988",
    contactType: "phone",
    description: "Free, confidential mental health crisis support, 24/7",
    urgent: true,
  },
  {
    name: "Crisis Text Line",
    contact: "Text HOME to 741741",
    contactType: "text",
    description: "Free text-based crisis counseling, available 24/7",
  },
  {
    name: "National DV Hotline",
    contact: "1-800-799-7233",
    contactType: "phone",
    description: "Confidential support for domestic violence survivors",
    urgent: true,
  },
  {
    name: "NAMI Helpline",
    contact: "1-800-950-6264",
    contactType: "phone",
    description: "Mental health information, support, and referrals",
  },
];

const onlineResources: OnlineResource[] = [
  {
    name: "Benefits.gov",
    url: "https://www.benefits.gov",
    description: "Screen for federal benefits you may be eligible for",
    category: "Benefits",
    icon: FaMoneyBillAlt,
    color: "blue.600",
    bg: "blue.50",
  },
  {
    name: "Healthcare.gov",
    url: "https://www.healthcare.gov",
    description: "Find affordable health insurance coverage options",
    category: "Healthcare",
    icon: FaHeartbeat,
    color: "red.600",
    bg: "red.50",
  },
  {
    name: "Feeding America",
    url: "https://www.feedingamerica.org",
    description: "National food bank network and food assistance resources",
    category: "Food",
    icon: FaAppleAlt,
    color: "orange.600",
    bg: "orange.50",
  },
  {
    name: "SAMHSA",
    url: "https://www.samhsa.gov",
    description: "Mental health and substance use disorder resources",
    category: "Mental Health",
    icon: FaHeartbeat,
    color: "purple.600",
    bg: "purple.50",
  },
  {
    name: "ChildCare.gov",
    url: "https://childcare.gov",
    description: "Find affordable childcare and financial assistance",
    category: "Childcare",
    icon: FaChild,
    color: "pink.600",
    bg: "pink.50",
  },
  {
    name: "HUD Resources",
    url: "https://www.hud.gov/topics/rental_assistance",
    description: "Federal rental and housing assistance programs",
    category: "Housing",
    icon: FaHome,
    color: "green.600",
    bg: "green.50",
  },
  {
    name: "LawHelp.org",
    url: "https://www.lawhelp.org",
    description: "Free legal information and aid referrals by state",
    category: "Legal",
    icon: FaGlobe,
    color: "gray.600",
    bg: "gray.100",
  },
  {
    name: "211.org",
    url: "https://www.211.org",
    description: "Call 2-1-1 or search online for local social services",
    category: "All Services",
    icon: FaPhone,
    color: "teal.600",
    bg: "teal.50",
  },
];

export default function FreeOnlineResources() {
  return (
    <Box
      py={{ base: 12, md: 16 }}
      bg="bg.subtle"
      borderBottomWidth="1px"
      borderColor="border.subtle"
    >
      <Container maxW="7xl">
        <Stack gap={10}>
          <Stack gap={3} textAlign="center">
            <Heading size="lg" color="fg" fontWeight="700">
              Free Online Resources
            </Heading>
            <Text fontSize="md" color="fg.muted">
              National resources available to everyone, no matter where you live.
            </Text>
          </Stack>

          {/* Crisis & Emergency */}
          <Stack gap={4}>
            <HStack>
              <Badge
                bg="red.100"
                color="red.700"
                fontWeight="600"
                px={3}
                py={1.5}
                borderRadius="full"
                fontSize="sm"
              >
                Crisis & Emergency Lines
              </Badge>
            </HStack>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
              {crisisResources.map((resource) => (
                <Card.Root
                  key={resource.name}
                  borderColor={resource.urgent ? "red.200" : "border.subtle"}
                  borderWidth="1px"
                  bg={resource.urgent ? "red.50" : "bg"}
                >
                  <Card.Body py={3} px={4}>
                    <HStack gap={3} align="start">
                      <Box
                        color={resource.contactType === "phone" ? "red.600" : "orange.500"}
                        fontSize="lg"
                        mt={0.5}
                        flexShrink={0}
                      >
                        <Icon
                          as={
                            resource.contactType === "phone"
                              ? FaPhone
                              : FaCommentAlt
                          }
                        />
                      </Box>
                      <VStack align="start" gap={0.5}>
                        <Text fontWeight="600" fontSize="sm" color="fg">
                          {resource.name}
                        </Text>
                        <Text
                          fontWeight="700"
                          fontSize="sm"
                          color={
                            resource.contactType === "phone"
                              ? "red.600"
                              : "orange.500"
                          }
                        >
                          {resource.contact}
                        </Text>
                        <Text fontSize="xs" color="fg.muted" lineHeight="1.4">
                          {resource.description}
                        </Text>
                      </VStack>
                    </HStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          </Stack>

          {/* Programs & Benefits */}
          <Stack gap={4}>
            <HStack>
              <Badge
                bg="teal.50"
                color="teal.700"
                fontWeight="600"
                px={3}
                py={1.5}
                borderRadius="full"
                fontSize="sm"
              >
                Programs & Benefits
              </Badge>
            </HStack>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
              {onlineResources.map((resource) => (
                <Link
                  key={resource.name}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  _hover={{ textDecoration: "none" }}
                >
                  <Card.Root
                    borderColor="border.subtle"
                    borderWidth="1px"
                    _hover={{
                      boxShadow: "md",
                      transform: "translateY(-2px)",
                      borderColor: "teal.200",
                    }}
                    transition="all 0.2s"
                    cursor="pointer"
                    h="100%"
                  >
                    <Card.Body>
                      <VStack align="start" gap={3}>
                        <HStack gap={2} justify="space-between" w="100%">
                          <Box
                            color={resource.color}
                            fontSize="lg"
                            p={2}
                            bg={resource.bg}
                            borderRadius="md"
                          >
                            <Icon as={resource.icon} />
                          </Box>
                          <Badge
                            bg="gray.100"
                            color="gray.600"
                            fontWeight="500"
                            px={2}
                            py={0.5}
                            borderRadius="md"
                            fontSize="xs"
                          >
                            {resource.category}
                          </Badge>
                        </HStack>
                        <VStack align="start" gap={1}>
                          <Text fontWeight="600" fontSize="sm" color="fg">
                            {resource.name}
                          </Text>
                          <Text
                            fontSize="xs"
                            color="fg.muted"
                            lineHeight="1.5"
                          >
                            {resource.description}
                          </Text>
                        </VStack>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                </Link>
              ))}
            </SimpleGrid>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
