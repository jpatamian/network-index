import { Box, Icon, Input, NativeSelect, Fieldset } from "@chakra-ui/react";
import type { IconType } from "react-icons";

interface FilterFieldProps {
  label: string;
  icon: IconType;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type: "input" | "select";
  options?: Array<{ value: string; label: string }>;
}

export const FilterField = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type,
  options,
}: FilterFieldProps) => {
  return (
    <Fieldset.Root gap={2}>
      <Fieldset.Legend fontSize="sm" color="fg.muted">
        {label}
      </Fieldset.Legend>
      <Fieldset.Content>
        <Box position="relative">
          <Icon
            as={icon}
            color="fg.subtle"
            fontSize="sm"
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
            zIndex={type === "select" ? 0 : undefined}
          />
          {type === "input" ? (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              borderRadius="md"
              bg="bg"
              borderColor="border"
              pl={9}
            />
          ) : (
            <NativeSelect.Root>
              <NativeSelect.Field
                value={value}
                onChange={(event) => onChange(event.target.value)}
                borderRadius="md"
                bg="bg"
                borderColor="border"
                pl={9}
              >
                {options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          )}
        </Box>
      </Fieldset.Content>
    </Fieldset.Root>
  );
};
