import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Button,
  HStack,
  Icon,
  Heading,
  Text,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { postsApi } from "@/lib/api";
import { toaster } from "@/components/ui/toaster";
import { PostCard } from "@/features/posts/components/PostCard";
import { Post } from "@/types/post";

export const PostShow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setLoading(true);
      setError("");
      try {
        const response = await postsApi.getById(parseInt(id));
        setPost(response);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load post";
        setError(message);
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!token || !post) return;

    if (
      !confirm(
        "Are you sure you want to delete this post? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await postsApi.delete(post.id, token);
      toaster.success({
        title: "Post deleted",
        description: "The post has been deleted successfully",
      });
      navigate("/posts");
    } catch (err) {
      toaster.error({
        title: "Failed to delete post",
        description: err instanceof Error ? err.message : "Please try again",
      });
    } finally {
      setDeleting(false);
    }
  };

  const canDelete =
    isAuthenticated &&
    post &&
    (user?.id === post.author.id || user?.is_moderator);

  if (loading) {
    return (
      <Box
        minH="100vh"
        bg="bg.subtle"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner color="teal.600" size="lg" />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Box bg="bg.subtle" minH="100vh">
        <Container maxW="3xl" py={12}>
          <Center>
            <Stack align="center" gap={4}>
              <Heading size="md" color="fg">
                {error ? "Failed to load post" : "Post not found"}
              </Heading>
              <Text color="fg.muted">
                {error ||
                  "The post you're looking for doesn't exist or has been deleted."}
              </Text>
              <Button colorScheme="teal" onClick={() => navigate("/posts")}>
                Back to posts
              </Button>
            </Stack>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="bg.subtle" minH="100vh">
      <Box py={{ base: 6, md: 8 }}>
        <Container maxW="3xl">
          <Stack gap={6}>
            {/* Back button */}
            <HStack gap={2}>
              <Button
                variant="ghost"
                color="fg.muted"
                onClick={() => navigate("/posts")}
                fontSize="sm"
                fontWeight="600"
                p={0}
              >
                <Icon as={FaArrowLeft} />
                <Text>Back to posts</Text>
              </Button>
            </HStack>

            {/* Post card */}
            <PostCard post={post} onDelete={() => navigate("/posts")} />

            {/* Delete button for post author or moderators */}
            {canDelete && (
              <HStack
                justify="flex-end"
                pt={4}
                borderTopWidth="1px"
                borderColor="border.subtle"
                gap={2}
              >
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={handleDelete}
                  loading={deleting}
                >
                  <Icon as={FaTrash} />
                  <Text>Delete Post</Text>
                </Button>
              </HStack>
            )}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
