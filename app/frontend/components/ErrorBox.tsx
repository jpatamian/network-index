import { Box, Text } from "@chakra-ui/react";

export default function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <Box bg="red.50" border="1px" borderColor="red.200" p={4} borderRadius="lg">
      <Text color="red.700" fontSize="sm">
        {children}
      </Text>
    </Box>
  );
}
