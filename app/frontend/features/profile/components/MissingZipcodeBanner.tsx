import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { PROFILE_TEXT } from "@/features/profile/lib/constants";

interface MissingZipcodeBannerProps {
  isEditing: boolean;
  onUpdate: () => void;
}

export const MissingZipcodeBanner = ({
  isEditing,
  onUpdate,
}: MissingZipcodeBannerProps) => {
  return (
    <Box
      bg="orange.50"
      border="1px"
      borderColor="orange.200"
      borderRadius="lg"
      p={4}
    >
      <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Text color="orange.800" fontSize="sm" fontWeight="500">
          {PROFILE_TEXT.missingZipcodeMessage}
        </Text>
        {!isEditing && (
          <Button
            size="sm"
            bg="orange.500"
            color="white"
            _hover={{ bg: "orange.600" }}
            onClick={onUpdate}
          >
            {PROFILE_TEXT.updateZipcodeLabel}
          </Button>
        )}
      </HStack>
    </Box>
  );
};
