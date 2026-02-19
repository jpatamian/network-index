import { Box, Container, Text, Stack, Center, Spinner } from "@chakra-ui/react";

interface LoadingStateProps {
  message: string;
}

export const LoadingState = ({ message }: LoadingStateProps) => {
  return (
    <Box py={12} bg="bg.subtle" minH="100vh">
      <Container maxW="3xl">
        <Center>
          <Stack align="center" gap={4}>
            <Spinner size="lg" color="teal.600" />
            <Text color="fg.muted" fontSize="lg">
              {message}
            </Text>
          </Stack>
        </Center>
      </Container>
    </Box>
  );
};
