import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaUserCheck } from "react-icons/fa";
import { PROFILE_TEXT } from "@/features/profile/lib/constants";

interface ProfileHeaderCardProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileHeaderCard = ({
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
}: ProfileHeaderCardProps) => {
  return (
    <Box
      bg="bg"
      border="1px"
      borderColor="border.subtle"
      borderRadius="xl"
      px={{ base: 5, md: 6 }}
      py={{ base: 5, md: 6 }}
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        gap={4}
      >
        <Stack gap={2}>
          <HStack gap={3}>
            <Box color="teal.600" fontSize="xl">
              <Icon as={FaUserCheck} />
            </Box>
            <Heading
              size="lg"
              color="fg"
              fontWeight="700"
              fontFamily="Space Grotesk, ui-sans-serif, system-ui"
            >
              {PROFILE_TEXT.headerTitle}
            </Heading>
          </HStack>
          <Text color="fg.muted" fontSize="sm">
            {PROFILE_TEXT.headerSubtitle}
          </Text>
        </Stack>
        <HStack gap={3}>
          {isEditing ? (
            <>
              <Button
                onClick={onSave}
                bg="teal.600"
                color="white"
                size="sm"
                fontWeight="600"
                borderRadius="md"
                loading={isSaving}
                _hover={{ bg: "teal.700" }}
              >
                {PROFILE_TEXT.saveLabel}
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                size="sm"
                fontWeight="600"
                borderRadius="md"
                disabled={isSaving}
              >
                {PROFILE_TEXT.cancelLabel}
              </Button>
            </>
          ) : (
            <Button
              onClick={onEdit}
              variant="outline"
              borderColor="teal.600"
              color="teal.600"
              size="sm"
              fontWeight="600"
              borderRadius="md"
              _hover={{ bg: "teal.50" }}
            >
              {PROFILE_TEXT.editLabel}
            </Button>
          )}
        </HStack>
      </Stack>
    </Box>
  );
};
