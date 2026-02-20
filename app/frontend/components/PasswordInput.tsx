import { useState } from "react";
import { Box, Input, Button, Icon } from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function PasswordInput({
  name,
  placeholder,
  value,
  onChange,
  required,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <Box position="relative">
      <Input
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        h="56px"
        fontSize="base"
        borderColor="gray.300"
        borderRadius="lg"
        _placeholder={{ color: "gray.400" }}
        _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px #14b8a6" }}
        pr="48px"
      />
      <Button
        variant="ghost"
        size="sm"
        position="absolute"
        right="8px"
        top="50%"
        transform="translateY(-50%)"
        onClick={() => setShow(!show)}
        color="fg.subtle"
        _hover={{ color: "fg", bg: "transparent" }}
      >
        {show ? <Icon as={FaEyeSlash} /> : <Icon as={FaEye} />}
      </Button>
    </Box>
  );
}
