import { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Input,
  NativeSelect,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaFlag } from "react-icons/fa";
import { flagsApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toaster } from "@/components/ui/toaster";
import { FlagButtonProps } from "@/types/flag";

const FLAG_REASONS = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "profanity", label: "Profanity" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "off_topic", label: "Off-topic" },
  { value: "other", label: "Other" },
];

export const FlagButton = ({
  isDisabled,
  ariaLabel,
  ...target
}: FlagButtonProps) => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("spam");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!token) return;

    const trimmedDescription = description.trim();
    if (reason === "other" && !trimmedDescription) {
      setError("Please share a short explanation for 'Other'.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        reason,
        description: trimmedDescription || undefined,
      };

      if (target.target === "post") {
        await flagsApi.createForPost(target.postId, payload, token);
      } else {
        await flagsApi.createForComment(
          target.postId,
          target.commentId,
          payload,
          token,
        );
      }
      setSubmitted(true);
      setIsOpen(false);
      toaster.success({
        title: "Thanks for reporting",
        description: "We'll review this soon.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box position="relative">
      <IconButton
        aria-label={ariaLabel || "Report content"}
        size="xs"
        variant="ghost"
        color={submitted ? "orange.600" : "fg.muted"}
        disabled={isDisabled || submitted}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Icon as={FaFlag} boxSize={3} />
      </IconButton>

      {isOpen && !submitted && (
        <Box
          position="absolute"
          right={0}
          top="100%"
          mt={2}
          bg="bg"
          borderWidth="1px"
          borderColor="border.subtle"
          borderRadius="md"
          boxShadow="md"
          p={3}
          minW="220px"
          zIndex={10}
        >
          <VStack align="stretch" gap={2}>
            <Text fontSize="xs" color="fg.muted">
              Why are you reporting this?
            </Text>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                borderRadius="md"
                bg="bg"
                borderColor="border"
              >
                {FLAG_REASONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            {reason === "other" && (
              <Input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Share a short reason"
                size="sm"
                borderRadius="md"
              />
            )}

            {error && (
              <Text fontSize="xs" color="red.500">
                {error}
              </Text>
            )}

            <HStack justify="flex-end" gap={2}>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="xs"
                bg="teal.600"
                color="white"
                onClick={handleSubmit}
                disabled={submitting}
                _hover={{ bg: "teal.700" }}
              >
                {submitting ? "Submitting" : "Submit"}
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}
    </Box>
  );
};
