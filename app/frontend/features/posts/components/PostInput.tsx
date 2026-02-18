import { Card, Box, Input, HStack, Icon } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

interface PostInputProps {
  setIsExpanded: (expanded: boolean) => void;
}

export const PostInput = ({ setIsExpanded }: PostInputProps) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Card.Root
      borderRadius="lg"
      boxShadow="sm"
      mb={6}
      borderWidth="1px"
      borderColor="border.subtle"
      bg="bg"
    >
      <Card.Body p={4}>
        <HStack
          gap={3}
          onClick={() => setIsExpanded(true)}
          cursor="pointer"
          p={3}
          bg="bg.subtle"
          borderRadius="lg"
          _hover={{ bg: "bg.muted" }}
          transition="all 0.2s"
        >
          <Box fontSize="lg" color="teal.600">
            <Icon as={FaUser} />
          </Box>
          <Input
            placeholder={
              isAuthenticated
                ? `What's on your mind, ${user?.username || "friend"}?`
                : "What's on your mind?"
            }
            border="none"
            bg="transparent"
            _placeholder={{ color: "fg.subtle" }}
            _focus={{ outline: "none" }}
            pointerEvents="none"
            fontSize="sm"
            color="fg.muted"
          />
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
