import { Badge, Button, Container, HStack, Icon, Box } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import { User } from "@/types/user";
import { PROFILE_TEXT } from "@/features/profile/lib/constants";

interface ProfileTopBarProps {
  user: User | null;
  onBack: () => void;
}

export const ProfileTopBar = ({ user, onBack }: ProfileTopBarProps) => {
  return (
    <Box py={5} bg="bg" borderBottomWidth="1px" borderColor="border.subtle">
      <Container maxW="6xl">
        <HStack justify="space-between" align="center">
          <Button
            onClick={onBack}
            variant="ghost"
            color="teal.600"
            fontWeight="600"
            gap={2}
            fontSize="sm"
            _hover={{ bg: "teal.50" }}
          >
            <Icon as={FaArrowLeft} />
            {PROFILE_TEXT.backLabel}
          </Button>
          {user && (
            <Badge
              variant="subtle"
              colorPalette={user.is_moderator ? "purple" : "teal"}
            >
              {user.is_moderator ? "Moderator" : "Member"}
            </Badge>
          )}
        </HStack>
      </Container>
    </Box>
  );
};
