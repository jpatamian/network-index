import { Badge, Box, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { NotificationItem } from "@/types/notification";
import { PROFILE_TEXT } from "@/features/profile/lib/constants";
import { formatNotificationDate } from "@/features/profile/lib/utils";

interface NotificationsCardProps {
  notifications: NotificationItem[];
  isLoading: boolean;
  error: string;
}

export const NotificationsCard = ({
  notifications,
  isLoading,
  error,
}: NotificationsCardProps) => {
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
          {PROFILE_TEXT.notificationsTitle}
        </Heading>
        <Badge variant="subtle" colorPalette="teal">
          {PROFILE_TEXT.notificationsBadge}
        </Badge>
      </HStack>

      {isLoading && (
        <Text fontSize="sm" color="fg.muted">
          {PROFILE_TEXT.notificationsLoading}
        </Text>
      )}

      {error && (
        <Text fontSize="sm" color="red.500">
          {error}
        </Text>
      )}

      {!isLoading && !error && notifications.length === 0 && (
        <Text fontSize="sm" color="fg.muted">
          {PROFILE_TEXT.noNotifications}
        </Text>
      )}

      <Stack gap={3}>
        {notifications.map((notification) => (
          <Box
            key={notification.id}
            borderWidth="1px"
            borderColor="border.subtle"
            borderRadius="md"
            p={3}
          >
            <Text fontWeight="600" fontSize="sm" color="fg">
              {notification.message}
            </Text>
            {notification.post_title && (
              <Text fontSize="sm" color="fg.subtle" mt={1}>
                {notification.post_title}
              </Text>
            )}
            <Text fontSize="xs" color="fg.subtle" mt={2}>
              {formatNotificationDate(notification.created_at)}
            </Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
