import { useState } from "react";
import {
  Card,
  Box,
  Heading,
  Stack,
  Input,
  Textarea,
  Button,
  HStack,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { FaPen, FaInfoCircle, FaExclamationCircle } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { postsApi } from "@/lib/api";
import { Post } from "@/types/post";
import {
  postsErrorMessages,
  postsText,
  toErrorMessage,
} from "@/features/posts/lib/utils";
import { PostInput } from "./PostInput";

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
  forceExpanded?: boolean;
  onCancel?: () => void;
}

const initialFormData = {
  title: "",
  content: "",
  zipcode: "",
};

export const CreatePost = ({
  onPostCreated,
  forceExpanded = false,
  onCancel,
}: CreatePostProps) => {
  const { token, isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const isFormVisible = forceExpanded || isExpanded;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated && !formData.zipcode.trim()) {
      setError(postsErrorMessages.anonymousZipRequired);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const postData: { title: string; content: string; zipcode?: string } = {
        title: formData.title,
        content: formData.content,
      };

      if (!isAuthenticated) {
        postData.zipcode = formData.zipcode;
      }

      const response = await postsApi.create(postData, token);
      onPostCreated(response);
      setFormData(initialFormData);
      if (!forceExpanded) {
        setIsExpanded(false);
      }
    } catch (err) {
      setError(toErrorMessage(err, postsErrorMessages.createPostFailed));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setError("");

    if (forceExpanded) {
      onCancel?.();
    } else {
      setIsExpanded(false);
    }
  };

  const handleFieldChange = (
    field: "title" | "content" | "zipcode",
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isFormVisible) {
    return <PostInput setIsExpanded={setIsExpanded} />;
  }

  return (
    <Card.Root
      borderRadius="lg"
      boxShadow="sm"
      mb={6}
      borderWidth="1px"
      borderColor="border.subtle"
      bg="bg"
    >
      <Card.Body p={6}>
        <VStack align="stretch" gap={4}>
          {/* Header */}
          <HStack gap={3}>
            <Box fontSize="lg" color="teal.600">
              <Icon as={FaPen} />
            </Box>
            <Heading size="md" color="fg" fontWeight="700">
              {isAuthenticated
                ? "Share with Your Community"
                : "Post Anonymously"}
            </Heading>
          </HStack>

          {/* Anonymous Warning */}
          {!isAuthenticated && (
            <HStack
              gap={3}
              p={4}
              borderRadius="lg"
              bg="blue.50"
              borderLeft="4px"
              borderColor="blue.400"
            >
              <Icon
                as={FaInfoCircle}
                color="blue.600"
                fontSize="lg"
                flexShrink={0}
              />
              <Box>
                <Heading size="xs" color="blue.800" mb={1} fontWeight="700">
                  Anonymous Post
                </Heading>
                <Box fontSize="sm" color="blue.700" lineHeight="1.4">
                  Your zipcode will be associated with this post for community
                  context.
                </Box>
              </Box>
            </HStack>
          )}

          {/* Error Message */}
          {error && (
            <HStack
              gap={3}
              p={4}
              borderRadius="lg"
              bg="red.50"
              borderLeft="4px"
              borderColor="red.400"
            >
              <Icon
                as={FaExclamationCircle}
                color="red.600"
                fontSize="lg"
                flex="shrink: 0"
              />
              <Box fontSize="sm" color="red.700">
                {error}
              </Box>
            </HStack>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Stack gap={4}>
              {/* Zipcode Input */}
              {!isAuthenticated && (
                <Input
                  type="text"
                  placeholder={postsText.anonymousZipPlaceholder}
                  value={formData.zipcode}
                  onChange={(e) => handleFieldChange("zipcode", e.target.value)}
                  borderRadius="lg"
                  borderColor="border"
                  _focus={{
                    borderColor: "teal.500",
                    boxShadow: "0 0 0 1px #14b8a6",
                  }}
                  required
                />
              )}

              {/* Title Input */}
              <Input
                type="text"
                placeholder={postsText.createPostTitlePlaceholder}
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                borderRadius="lg"
                borderColor="gray.200"
                _focus={{
                  borderColor: "teal.500",
                  boxShadow: "0 0 0 1px #14b8a6",
                }}
                required
                maxLength={200}
                fontWeight="medium"
              />

              {/* Content Textarea */}
              <Textarea
                placeholder={postsText.createPostContentPlaceholder}
                value={formData.content}
                onChange={(e) => handleFieldChange("content", e.target.value)}
                borderRadius="lg"
                borderColor="gray.200"
                minH="120px"
                _focus={{
                  borderColor: "teal.500",
                  boxShadow: "0 0 0 1px #14b8a6",
                }}
                required
                maxLength={5000}
                resize="vertical"
              />

              {/* Action Buttons */}
              <HStack justify="flex-end" gap={3}>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  borderRadius="lg"
                  _hover={{ bg: "bg.subtle" }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  bg="teal.600"
                  color="white"
                  borderRadius="lg"
                  fontWeight="600"
                  _hover={{
                    bg: "teal.700",
                    transform: "translateY(-1px)",
                    boxShadow: "md",
                  }}
                  transition="all 0.2s"
                >
                  {loading
                    ? "Posting..."
                    : isAuthenticated
                      ? "Share"
                      : "Post Anonymously"}
                </Button>
              </HStack>
            </Stack>
          </form>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
