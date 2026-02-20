import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  HStack,
  Badge,
  Icon,
  SimpleGrid,
  Input,
} from "@chakra-ui/react";
import {
  FaMapPin,
  FaUserCheck,
  FaUser,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { flagsApi, notificationsApi, usersApi } from "@/lib/api";
import { toaster } from "@/components/ui/toaster";
import { FlagReview } from "@/types/flag";
import { ProfileFieldProps } from "@/types/user";
import { NotificationItem } from "@/types/notification";

function ProfileField({
  icon,
  label,
  display,
  field,
  inputType = "text",
  isEditing,
  value,
  onChange,
  readOnly,
}: ProfileFieldProps) {
  return (
    <Box
      bg="bg"
      border="1px"
      borderColor="border.subtle"
      p={4}
      borderRadius="lg"
    >
      <HStack gap={3} mb={3}>
        <Icon as={icon} color="teal.600" fontSize="lg" />
        <Text fontWeight="600" color="fg" fontSize="sm">
          {label}
        </Text>
      </HStack>
      {isEditing && !readOnly && field ? (
        <Input
          value={value}
          onChange={(e) => onChange(field as string, e.target.value)}
          type={inputType}
          placeholder={label}
          size="sm"
          borderRadius="md"
        />
      ) : (
        <Text fontWeight="600" color="fg" fontSize="sm">
          {display}
        </Text>
      )}
    </Box>
  );
}

export default function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const needsZipcode = user?.zipcode === "00000";
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const [flagReviews, setFlagReviews] = useState<FlagReview[]>([]);
  const [seenFlags, setSeenFlags] = useState<FlagReview[]>([]);
  const [flagLoading, setFlagLoading] = useState(false);
  const [flagError, setFlagError] = useState("");
  const [seenLoading, setSeenLoading] = useState(false);
  const [seenError, setSeenError] = useState("");
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    zipcode: user?.zipcode || "",
  });

  useEffect(() => {
    const loadFlags = async () => {
      if (!user?.is_moderator || !token) return;
      setFlagLoading(true);
      setFlagError("");
      try {
        const data = await flagsApi.list(token, "pending");
        setFlagReviews(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        setFlagError(message || "Unable to load flags.");
      } finally {
        setFlagLoading(false);
      }
    };

    loadFlags();
  }, [token, user?.is_moderator]);

  useEffect(() => {
    const loadSeenFlags = async () => {
      if (!user?.is_moderator || !token) return;
      setSeenLoading(true);
      setSeenError("");
      try {
        const data = await flagsApi.list(token, "seen");
        setSeenFlags(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        setSeenError(message || "Unable to load seen flags.");
      } finally {
        setSeenLoading(false);
      }
    };

    loadSeenFlags();
  }, [token, user?.is_moderator]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!token) return;
      setNotificationsLoading(true);
      setNotificationsError("");
      try {
        const data = await notificationsApi.list(token);
        setNotifications(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        setNotificationsError(message || "Unable to load notifications.");
      } finally {
        setNotificationsLoading(false);
      }
    };

    loadNotifications();
  }, [token]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      zipcode: user?.zipcode || "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user || !token) return;
    setIsSaving(true);
    try {
      const updateData: {
        username?: string;
        email?: string;
        zipcode?: string;
      } = {};
      if (formData.username !== user.username)
        updateData.username = formData.username;
      if (formData.email !== user.email) updateData.email = formData.email;
      if (formData.zipcode !== user.zipcode)
        updateData.zipcode = formData.zipcode;

      if (Object.keys(updateData).length === 0) {
        toaster.create({
          title: "No changes",
          description: "No fields were modified",
          type: "info",
        });
        setIsEditing(false);
        return;
      }

      await usersApi.update(user.id, updateData, token);
      toaster.success({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      toaster.error({
        title: "Error updating profile",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAcknowledge = async (flagId: number) => {
    if (!token) return;
    try {
      await flagsApi.acknowledge(flagId, token);
      setFlagReviews((prev) => prev.filter((flag) => flag.id !== flagId));
      const seenFlag = flagReviews.find((flag) => flag.id === flagId);
      if (seenFlag) {
        setSeenFlags((prev) => [seenFlag, ...prev]);
      }
    } catch (error) {
      toaster.error({
        title: "Unable to acknowledge",
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  return (
    <ProtectedRoute>
      <Box minH="100vh" bg="bg.subtle">
        <Box py={6} bg="bg" borderBottomWidth="1px" borderColor="border.subtle">
          <Container maxW="7xl">
            <Button
              onClick={() => {
                navigate("/");
              }}
              variant="ghost"
              color="teal.600"
              fontWeight="600"
              gap={2}
              fontSize="sm"
              _hover={{ bg: "teal.50" }}
            >
              <Icon as={FaArrowLeft} />
              Back to Home
            </Button>
          </Container>
        </Box>

        {user && (
          <Box
            py={{ base: 12, md: 16 }}
            bg="bg"
            borderBottomWidth="1px"
            borderColor="border.subtle"
          >
            <Container maxW="7xl">
              <Stack gap={8}>
                {needsZipcode && (
                  <Box
                    bg="orange.50"
                    border="1px"
                    borderColor="orange.200"
                    borderRadius="lg"
                    p={4}
                  >
                    <HStack
                      justify="space-between"
                      align="center"
                      flexWrap="wrap"
                      gap={3}
                    >
                      <Text color="orange.800" fontSize="sm" fontWeight="500">
                        Your zipcode is missing. Add it now to complete your
                        profile.
                      </Text>
                      {!isEditing && (
                        <Button
                          size="sm"
                          bg="orange.500"
                          color="white"
                          _hover={{ bg: "orange.600" }}
                          onClick={() => setIsEditing(true)}
                        >
                          Update Zipcode
                        </Button>
                      )}
                    </HStack>
                  </Box>
                )}

                <Stack
                  direction={{ base: "column", sm: "row" }}
                  justify="space-between"
                  align={{ base: "stretch", sm: "center" }}
                  gap={3}
                >
                  <HStack gap={3}>
                    <Box color="teal.600" fontSize="xl">
                      <Icon as={FaUserCheck} />
                    </Box>
                    <Heading size="lg" color="fg" fontWeight="700">
                      Your Profile
                    </Heading>
                  </HStack>
                  <HStack gap={3}>
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleSave}
                          bg="teal.600"
                          color="white"
                          size="sm"
                          fontWeight="600"
                          borderRadius="md"
                          loading={isSaving}
                          _hover={{ bg: "teal.700" }}
                        >
                          Save Changes
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          size="sm"
                          fontWeight="600"
                          borderRadius="md"
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          borderColor="teal.600"
                          color="teal.600"
                          size="sm"
                          fontWeight="600"
                          borderRadius="md"
                          _hover={{ bg: "teal.50" }}
                        >
                          Edit Profile
                        </Button>
                      </>
                    )}
                  </HStack>
                </Stack>

                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
                  <ProfileField
                    icon={FaEnvelope}
                    label="Email"
                    display={user.email || "Not set"}
                    field="email"
                    inputType="email"
                    isEditing={isEditing}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <ProfileField
                    icon={FaUser}
                    label="Username"
                    display={user.username || "Not set"}
                    field="username"
                    isEditing={isEditing}
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                  <ProfileField
                    icon={FaMapPin}
                    label="Zipcode"
                    display={user.zipcode || "Not set"}
                    field="zipcode"
                    isEditing={isEditing}
                    value={formData.zipcode}
                    onChange={handleInputChange}
                  />
                </SimpleGrid>

                <Box
                  bg="bg"
                  border="1px"
                  borderColor="border.subtle"
                  borderRadius="lg"
                  p={5}
                >
                  <HStack justify="space-between" align="center" mb={4}>
                    <Heading size="md" color="fg">
                      Notifications
                    </Heading>
                  </HStack>

                  {notificationsLoading && (
                    <Text fontSize="sm" color="fg.muted">
                      Loading notifications...
                    </Text>
                  )}

                  {notificationsError && (
                    <Text fontSize="sm" color="red.500">
                      {notificationsError}
                    </Text>
                  )}

                  {!notificationsLoading &&
                    !notificationsError &&
                    notifications.length === 0 && (
                      <Text fontSize="sm" color="fg.muted">
                        No notifications yet.
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
                          {new Date(notification.created_at).toLocaleString()}
                        </Text>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {user.is_moderator && (
                  <Box
                    bg="bg"
                    border="1px"
                    borderColor="border.subtle"
                    borderRadius="lg"
                    p={5}
                  >
                    <HStack justify="space-between" align="center" mb={4}>
                      <Heading size="md" color="fg">
                        Moderation queue
                      </Heading>
                      <Badge colorPalette="green" variant="subtle">
                        Pending
                      </Badge>
                    </HStack>

                    {flagLoading && (
                      <Text fontSize="sm" color="fg.muted">
                        Loading flags...
                      </Text>
                    )}

                    {flagError && (
                      <Text fontSize="sm" color="red.500">
                        {flagError}
                      </Text>
                    )}

                    {!flagLoading && !flagError && flagReviews.length === 0 && (
                      <Text fontSize="sm" color="fg.muted">
                        No pending flags right now.
                      </Text>
                    )}

                    <Stack gap={3}>
                      {flagReviews.map((flag) => (
                        <Box
                          key={flag.id}
                          borderWidth="1px"
                          borderColor="border.bold"
                          borderRadius="md"
                          p={3}
                        >
                          <HStack
                            justify="space-between"
                            align="flex-start"
                            mb={2}
                          >
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
                              onClick={() => handleAcknowledge(flag.id)}
                            >
                              Acknowledge
                            </Button>
                          </HStack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {user.is_moderator && (
                  <Box
                    bg="bg"
                    border="1px"
                    borderColor="border.subtle"
                    borderRadius="lg"
                    p={5}
                  >
                    <HStack justify="space-between" align="center" mb={4}>
                      <Heading size="md" color="fg">
                        Seen flags
                      </Heading>
                      <Badge variant="subtle" colorPalette="gray">
                        Seen
                      </Badge>
                    </HStack>

                    {seenLoading && (
                      <Text fontSize="sm" color="fg.muted">
                        Loading seen flags...
                      </Text>
                    )}

                    {seenError && (
                      <Text fontSize="sm" color="red.500">
                        {seenError}
                      </Text>
                    )}

                    {!seenLoading && !seenError && seenFlags.length === 0 && (
                      <Text fontSize="sm" color="fg.muted">
                        No seen flags yet.
                      </Text>
                    )}

                    <Stack gap={3}>
                      {seenFlags.map((flag) => (
                        <Box
                          key={flag.id}
                          borderWidth="1px"
                          borderColor="border.subtle"
                          borderRadius="md"
                          p={3}
                        >
                          <HStack justify="space-between" align="center" mb={2}>
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
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Container>
          </Box>
        )}
      </Box>
    </ProtectedRoute>
  );
}
