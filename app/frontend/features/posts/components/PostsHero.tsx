import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  HStack,
  Badge,
  Button,
} from "@chakra-ui/react";

import { PostsHeroProps } from "@/types/post";

export const PostsHero = ({ meta, filter }: PostsHeroProps) => {
  const { pageTitle, subtitle, viewingMine, zipcode } = meta;
  const { hasFilter, clearFilterLabel, onClearFilter } = filter;

  return (
    <Box
      bg="bg"
      py={{ base: 10, md: 12 }}
      borderBottomWidth="1px"
      borderColor="border.subtle"
    >
      <Container maxW="3xl">
        <Stack gap={4}>
          <HStack justify="space-between" align="center">
            <Heading as="h1" size="2xl" color="fg" fontWeight="700">
              {pageTitle}
            </Heading>
            {viewingMine ? (
              <Badge
                bg="teal.50"
                color="teal.700"
                fontWeight="600"
                px={3}
                py={1.5}
                borderRadius="full"
              >
                <HStack gap={1} fontSize="sm">
                  <span>🙋</span>
                  <Text>My posts</Text>
                </HStack>
              </Badge>
            ) : (
              zipcode && (
                <Badge
                  bg="teal.50"
                  color="teal.700"
                  fontWeight="600"
                  px={3}
                  py={1.5}
                  borderRadius="full"
                >
                  <HStack gap={1} fontSize="sm">
                    <span>📍</span>
                    <Text>{zipcode}</Text>
                  </HStack>
                </Badge>
              )
            )}
          </HStack>

          <Stack gap={3}>
            <Text fontSize="lg" color="fg.muted" lineHeight="1.6">
              {subtitle}
            </Text>
            {hasFilter && (
              <Button
                onClick={onClearFilter}
                variant="ghost"
                color="teal.600"
                fontSize="sm"
                fontWeight="600"
                w="fit-content"
                _hover={{ bg: "teal.50" }}
              >
                {clearFilterLabel}
              </Button>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
