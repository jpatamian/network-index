import { useState } from "react";
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
  FaHeart,
  FaMapPin,
  FaUserCheck,
  FaUser,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { usersApi } from "@/lib/api";
import { toaster } from "@/components/ui/toaster";

export default function Profile() {
  const { user, token } = useAuth();
  const needsZipcode = user?.zipcode === "00000";
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    zipcode: user?.zipcode || "",
  });

  const handleBack = () => {
    window.location.href = "/";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      // Refresh the page to update the auth context
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

  return (
    <ProtectedRoute>
      <Box minH="100vh" bg="bg.subtle">
        {/* Back Button */}
        <Box py={6} bg="bg" borderBottomWidth="1px" borderColor="border.subtle">
          <Container maxW="7xl">
            <Button
              onClick={handleBack}
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

        {/* Profile Section */}
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

                <HStack justify="space-between" align="center">
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
                        <Badge
                          bg="teal.50"
                          color="teal.700"
                          fontWeight="600"
                          px={3}
                          py={1}
                          borderRadius="full"
                        >
                          <Text>
                            {user.anonymous ? "Anonymous" : "Verified"}
                          </Text>
                        </Badge>
                      </>
                    )}
                  </HStack>
                </HStack>

                <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
                  <Box
                    bg="bg"
                    border="1px"
                    borderColor="border.subtle"
                    p={4}
                    borderRadius="lg"
                  >
                    <HStack gap={3} mb={3}>
                      <Icon as={FaEnvelope} color="teal.600" fontSize="lg" />
                      <Text fontWeight="600" color="fg" fontSize="sm">
                        Email
                      </Text>
                    </HStack>
                    {isEditing ? (
                      <Input
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        type="email"
                        placeholder="Email"
                        size="sm"
                        borderRadius="md"
                      />
                    ) : (
                      <Text fontWeight="600" color="fg" fontSize="sm">
                        {user.email || "Not set"}
                      </Text>
                    )}
                  </Box>

                  <Box
                    bg="bg"
                    border="1px"
                    borderColor="border.subtle"
                    p={4}
                    borderRadius="lg"
                  >
                    <HStack gap={3} mb={3}>
                      <Icon as={FaUser} color="teal.600" fontSize="lg" />
                      <Text fontWeight="600" color="fg" fontSize="sm">
                        Username
                      </Text>
                    </HStack>
                    {isEditing ? (
                      <Input
                        value={formData.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        type="text"
                        placeholder="Username"
                        size="sm"
                        borderRadius="md"
                      />
                    ) : (
                      <Text fontWeight="600" color="fg" fontSize="sm">
                        {user.username || "Not set"}
                      </Text>
                    )}
                  </Box>

                  <Box
                    bg="bg"
                    border="1px"
                    borderColor="border.subtle"
                    p={4}
                    borderRadius="lg"
                  >
                    <HStack gap={3} mb={3}>
                      <Icon as={FaMapPin} color="teal.600" fontSize="lg" />
                      <Text fontWeight="600" color="fg" fontSize="sm">
                        Zipcode
                      </Text>
                    </HStack>
                    {isEditing ? (
                      <Input
                        value={formData.zipcode}
                        onChange={(e) =>
                          handleInputChange("zipcode", e.target.value)
                        }
                        type="text"
                        placeholder="Zipcode"
                        size="sm"
                        borderRadius="md"
                      />
                    ) : (
                      <Text fontWeight="600" color="fg" fontSize="sm">
                        {user.zipcode}
                      </Text>
                    )}
                  </Box>

                  <Box
                    bg="bg"
                    border="1px"
                    borderColor="border.subtle"
                    p={4}
                    borderRadius="lg"
                  >
                    <HStack gap={3} mb={3}>
                      <Icon as={FaHeart} color="teal.600" fontSize="lg" />
                      <Text fontWeight="600" color="fg" fontSize="sm">
                        Type
                      </Text>
                    </HStack>
                    <Text fontWeight="600" color="gray.900" fontSize="sm">
                      {user.anonymous ? "Anonymous" : "Verified"}
                    </Text>
                  </Box>
                </SimpleGrid>
              </Stack>
            </Container>
          </Box>
        )}
      </Box>
    </ProtectedRoute>
  );
}
