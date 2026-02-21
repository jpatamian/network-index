import { useEffect, useState } from "react";
import { Box, Container, Stack } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { flagsApi, notificationsApi, usersApi } from "@/lib/api";
import { toaster } from "@/components/ui/toaster";
import { FlagReview } from "@/types/flag";
import { NotificationItem } from "@/types/notification";
import { ProfileTopBar } from "@/features/profile/components/ProfileTopBar";
import { ProfileHeaderCard } from "@/features/profile/components/ProfileHeaderCard";
import { MissingZipcodeBanner } from "@/features/profile/components/MissingZipcodeBanner";
import { ProfileDetailsCard } from "@/features/profile/components/ProfileDetailsCard";
import { NotificationsCard } from "@/features/profile/components/NotificationsCard";
import { ModerationQueueCard } from "@/features/profile/components/ModerationQueueCard";
import { SeenFlagsCard } from "@/features/profile/components/SeenFlagsCard";
import { AccountSidebar } from "@/features/profile/components/AccountSidebar";

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
      if (formData.username !== user.username) {
        updateData.username = formData.username;
      }
      if (formData.email !== user.email) {
        updateData.email = formData.email;
      }
      if (formData.zipcode !== user.zipcode) {
        updateData.zipcode = formData.zipcode;
      }

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
      <Box minH="100vh" bgGradient="linear(to-b, #f6f2ee, #ffffff)">
        <ProfileTopBar user={user} onBack={() => navigate("/")} />

        {user && (
          <Box py={{ base: 10, md: 14 }}>
            <Container maxW="6xl">
              <Stack gap={{ base: 6, md: 8 }}>
                <ProfileHeaderCard
                  isEditing={isEditing}
                  isSaving={isSaving}
                  onEdit={() => setIsEditing(true)}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />

                <Stack
                  direction={{ base: "column", lg: "row" }}
                  align="flex-start"
                  gap={{ base: 6, lg: 8 }}
                >
                  <Stack gap={6} flex="1" w="full">
                    {needsZipcode && (
                      <MissingZipcodeBanner
                        isEditing={isEditing}
                        onUpdate={() => setIsEditing(true)}
                      />
                    )}

                    <ProfileDetailsCard
                      user={user}
                      formData={formData}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                    />

                    <NotificationsCard
                      notifications={notifications}
                      isLoading={notificationsLoading}
                      error={notificationsError}
                    />

                    {user.is_moderator && (
                      <ModerationQueueCard
                        flags={flagReviews}
                        isLoading={flagLoading}
                        error={flagError}
                        onAcknowledge={handleAcknowledge}
                      />
                    )}

                    {user.is_moderator && (
                      <SeenFlagsCard
                        flags={seenFlags}
                        isLoading={seenLoading}
                        error={seenError}
                      />
                    )}
                  </Stack>

                  <AccountSidebar
                    user={user}
                    notificationsCount={notifications.length}
                    onEdit={() => setIsEditing(true)}
                    onBrowse={() => navigate("/posts")}
                  />
                </Stack>
              </Stack>
            </Container>
          </Box>
        )}
      </Box>
    </ProtectedRoute>
  );
}
