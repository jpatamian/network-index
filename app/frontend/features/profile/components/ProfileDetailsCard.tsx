import { Badge, Box, Heading, HStack, SimpleGrid } from "@chakra-ui/react";
import { FaEnvelope, FaMapPin, FaUser } from "react-icons/fa";
import { User } from "@/types/user";
import { ProfileField } from "@/features/profile/components/ProfileField";
import { PROFILE_TEXT } from "@/features/profile/lib/constants";

interface ProfileDetailsCardProps {
  user: User;
  formData: {
    username: string;
    email: string;
    zipcode: string;
  };
  isEditing: boolean;
  onChange: (field: string, value: string) => void;
}

export const ProfileDetailsCard = ({
  user,
  formData,
  isEditing,
  onChange,
}: ProfileDetailsCardProps) => {
  return (
    <Box
      bg="bg"
      border="1px"
      borderColor="border.subtle"
      borderRadius="xl"
      p={{ base: 5, md: 6 }}
    >
      <HStack justify="space-between" mb={4}>
        <Heading size="md" color="fg" fontWeight="700">
          {PROFILE_TEXT.profileDetailsTitle}
        </Heading>
      </HStack>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
        <ProfileField
          icon={FaEnvelope}
          label="Email"
          display={user.email || "Not set"}
          field="email"
          inputType="email"
          isEditing={isEditing}
          value={formData.email}
          onChange={onChange}
        />
        <ProfileField
          icon={FaUser}
          label="Username"
          display={user.username || "Not set"}
          field="username"
          isEditing={isEditing}
          value={formData.username}
          onChange={onChange}
        />
        <ProfileField
          icon={FaMapPin}
          label="Zipcode"
          display={user.zipcode || "Not set"}
          field="zipcode"
          isEditing={isEditing}
          value={formData.zipcode}
          onChange={onChange}
        />
      </SimpleGrid>
    </Box>
  );
};
