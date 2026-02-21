import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FlagReview } from "@/types/flag";
import { PROFILE_TEXT } from "@/features/profile/lib/constants";

interface ModerationQueueCardProps {
  flags: FlagReview[];
  isLoading: boolean;
  error: string;
  onAcknowledge: (flagId: number) => void;
}

export const ModerationQueueCard = ({
  flags,
  isLoading,
  error,
  onAcknowledge,
}: ModerationQueueCardProps) => {
  return (
    <Box
      bg="bg"
      border="1px"
      borderColor="border.subtle"
      borderRadius="xl"
      p={{ base: 5, md: 6 }}
    >
      <HStack justify="space-between" align="center" mb={4}>
        <Heading size="md" color="fg">
          {PROFILE_TEXT.moderationQueueTitle}
        </Heading>
        <Badge colorPalette="green" variant="subtle">
          {PROFILE_TEXT.moderationQueueBadge}
        </Badge>
      </HStack>

      {isLoading && (
        <Text fontSize="sm" color="fg.muted">
          {PROFILE_TEXT.flagsLoading}
        </Text>
      )}

      {error && (
        <Text fontSize="sm" color="red.500">
          {error}
        </Text>
      )}

      {!isLoading && !error && flags.length === 0 && (
        <Text fontSize="sm" color="fg.muted">
          {PROFILE_TEXT.noPendingFlags}
        </Text>
      )}

      <Stack gap={3}>
        {flags.map((flag) => (
          <Box
            key={flag.id}
            borderWidth="1px"
            borderColor="border.bold"
            borderRadius="md"
            p={3}
          >
            <HStack justify="space-between" align="flex-start" mb={2}>
              <Text fontWeight="600" fontSize="sm" color="fg">
                {flag.flaggable_type} flagged
              </Text>
              <Badge variant="subtle" colorPalette="red">
                {flag.reason}
              </Badge>
            </HStack>
            <Text fontSize="xs" color="fg.subtle" mb={2}>
              Other flags on this item: {flag.other_flags_count}
            </Text>
            {flag.flaggable_type === "Post" && (
              <Text fontSize="sm" color="fg">
                {flag.flaggable?.title}
              </Text>
            )}
            {flag.flaggable_type === "Comment" && (
              <Text fontSize="sm" color="fg">
                {flag.flaggable?.message}
              </Text>
            )}
            {flag.description && (
              <Text fontSize="xs" color="fg.subtle" mt={2}>
                {flag.description}
              </Text>
            )}
            <Text fontSize="xs" color="fg.subtle" mt={2}>
              Reported by {flag.flagger.name}
            </Text>
            <HStack justify="flex-end" mt={3}>
              <Button
                size="xs"
                variant="outline"
                colorPalette="teal"
                onClick={() => onAcknowledge(flag.id)}
              >
                {PROFILE_TEXT.acknowledgeLabel}
              </Button>
            </HStack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
