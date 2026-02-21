import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { User } from "@/types/user";
import { PROFILE_TEXT } from "@/features/profile/lib/constants";

interface AccountSidebarProps {
  user: User;
  notificationsCount: number;
  onEdit: () => void;
  onBrowse: () => void;
}

export const AccountSidebar = ({
  user,
  notificationsCount,
  onEdit,
  onBrowse,
}: AccountSidebarProps) => {
  return (
    <Stack
      w={{ base: "full", lg: "320px" }}
      gap={6}
      position={{ lg: "sticky" }}
      top={{ lg: "96px" }}
    >
      <Box
        bg="bg"
        border="1px"
        borderColor="border.subtle"
        borderRadius="xl"
        p={{ base: 5, md: 6 }}
      >
        <Heading size="sm" color="fg" mb={3}>
          {PROFILE_TEXT.accountStatusTitle}
        </Heading>
        <Stack gap={3}>
          <HStack justify="space-between">
            <Text fontSize="sm" color="fg.muted">
              Account type
            </Text>
            <Badge variant="subtle" colorPalette="teal">
              {user.anonymous ? "Anonymous" : "Verified"}
            </Badge>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm" color="fg.muted">
              Role
            </Text>
            <Badge
              variant="subtle"
              colorPalette={user.is_moderator ? "purple" : "gray"}
            >
              {user.is_moderator ? "Moderator" : "Member"}
            </Badge>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm" color="fg.muted">
              Notifications
            </Text>
            <Text fontSize="sm" color="fg">
              {notificationsCount}
            </Text>
          </HStack>
        </Stack>
      </Box>

      <Box
        bg="bg"
        border="1px"
        borderColor="border.subtle"
        borderRadius="xl"
        p={{ base: 5, md: 6 }}
      >
        <Heading size="sm" color="fg" mb={3}>
          {PROFILE_TEXT.quickActionsTitle}
        </Heading>
        <Stack gap={2}>
          <Button
            size="sm"
            variant="outline"
            colorPalette="teal"
            onClick={onEdit}
          >
            {PROFILE_TEXT.quickEditLabel}
          </Button>
          <Button size="sm" variant="ghost" onClick={onBrowse}>
            {PROFILE_TEXT.quickBrowseLabel}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};
