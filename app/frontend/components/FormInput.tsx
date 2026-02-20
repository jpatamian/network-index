import { Input } from "@chakra-ui/react";

interface FormInputProps {
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function FormInput({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: FormInputProps) {
  return (
    <Input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      h="56px"
      fontSize="base"
      borderColor="border"
      borderRadius="lg"
      _placeholder={{ color: "fg.subtle" }}
      _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px #14b8a6" }}
    />
  );
}
