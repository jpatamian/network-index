import { Box, Container, Heading, Text, Stack } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import LocalResources from "@/features/home/components/LocalResources";
import FreeOnlineResources from "@/features/home/components/FreeOnlineResources";

export default function Resources() {
  const { user } = useAuth();

  return (
    <Box>
      {/* Page Header */}
      <Box
        bg="bg"
        py={{ base: 10, md: 14 }}
        borderBottomWidth="1px"
        borderColor="border.subtle"
      >
        <Container maxW="7xl">
          <Stack textAlign="center" maxW="2xl" gap={4} mx="auto">
            <Heading as="h1" size="2xl" fontWeight="700" color="fg" lineHeight="1.2">
              Free Resources
            </Heading>
            <Text fontSize="lg" color="fg.muted" lineHeight={1.6}>
              A directory of free local services and national programs available
              to anyone in need.
            </Text>
          </Stack>
        </Container>
      </Box>

      <LocalResources zipcode={user?.zipcode ?? undefined} />
      <FreeOnlineResources />
    </Box>
  );
}
