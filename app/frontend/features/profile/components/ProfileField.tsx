import { Box, HStack, Icon, Input, Text } from "@chakra-ui/react";
import { ProfileFieldProps } from "@/types/user";

export const ProfileField = ({
  icon,
  label,
  display,
  field,
  inputType = "text",
  isEditing,
  value,
  onChange,
  readOnly,
}: ProfileFieldProps) => {
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
};
