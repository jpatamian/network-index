import { Box, HStack, Text } from "@chakra-ui/react";

export default function OrDivider() {
  return (
    <HStack w="100%" gap={0}>
      <Box flex={1} h="1px" bg="border" />
      <Text color="fg.subtle" fontSize="sm" fontWeight="600" px={3} whiteSpace="nowrap">
        or
      </Text>
      <Box flex={1} h="1px" bg="border" />
    </HStack>
  );
}
