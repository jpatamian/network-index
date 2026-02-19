import { Post } from "@/types/post";
import { useAuth } from "@/hooks/useAuth";
import { postsApi } from "@/lib/api";
import { formatDate } from "@/lib/date";
import { toErrorMessage } from "@/features/posts/lib/utils";
import { useState } from "react";
import {
  Card,
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FaUser, FaClock, FaTrash } from "react-icons/fa";
import { CommentSection } from "./CommentSection";

interface PostCardProps {
  post: Post;
  onDelete?: (id: number) => void;
}

export const PostCard = ({ post, onDelete }: PostCardProps) => {
  const { user, token } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const isAuthor = user?.id === post.author.id;
  const createdAt = formatDate(post.created_at, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDelete = async () => {
    if (!token || !confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setDeleting(true);
    try {
      await postsApi.delete(post.id, token);
      onDelete?.(post.id);
    } catch (error) {
      alert(toErrorMessage(error, "Failed to delete post"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card.Root
      borderRadius="lg"
      overflow="hidden"
      borderWidth="1px"
      borderColor="border.subtle"
      bg="bg"
      _hover={{ boxShadow: "md", transform: "translateY(-1px)" }}
      transition="all 0.2s"
    >
      <Card.Body p={6}>
        <VStack align="stretch" gap={5}>
          {/* Header Section */}
          <HStack justify="space-between" align="flex-start">
            <VStack align="start" gap={2} flex={1}>
              <Heading size="lg" fontWeight="700" color="fg">
                {post.title}
              </Heading>
              <HStack gap={4} fontSize="sm" color="fg.subtle">
                <HStack gap={1.5}>
                  <Icon as={FaUser} color="teal.600" fontSize="xs" />
                  <Text fontWeight="500" color="fg">
                    {post.author.name}
                  </Text>
                </HStack>
                <HStack gap={1.5}>
                  <Icon as={FaClock} color="teal.600" fontSize="xs" />
                  <Text>{createdAt}</Text>
                </HStack>
              </HStack>
            </VStack>

            {/* Delete Button */}
            {isAuthor && (
              <Button
                onClick={handleDelete}
                disabled={deleting}
                variant="ghost"
                size="sm"
                color="red.600"
                gap={2}
                fontWeight="500"
                _hover={{ bg: "red.50" }}
              >
                <Icon as={FaTrash} fontSize="sm" />
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </HStack>

          {/* Content Section */}
          <Text
            fontSize="base"
            color="fg"
            whiteSpace="pre-wrap"
            lineHeight="1.6"
            py={2}
          >
            {post.content}
          </Text>

          {/* Comment Section */}
          <Box pt={2} borderTopWidth="1px" borderColor="border.subtle" w="100%">
            <CommentSection
              postId={post.id}
              commentCount={post.comment_count}
            />
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
