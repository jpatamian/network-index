import { Box, Heading, Text, Stack, Center } from "@chakra-ui/react";
import { Post } from "@/types/post";
import { PostCard } from "@/features/posts/components/PostCard";

interface PostsListProps {
  posts: Post[];
  error: string;
  onDelete: (id: number) => void;
}

const PostsError = ({ error }: { error: string }) => (
  <Box
    bg="red.50"
    borderLeft="4px"
    borderColor="red.500"
    p={4}
    borderRadius="md"
  >
    <Heading size="sm" color="red.800" mb={2}>
      Failed to load posts
    </Heading>
    <Text color="red.700" fontSize="sm">
      {error}
    </Text>
  </Box>
);

export const PostsList = ({ posts, error, onDelete }: PostsListProps) => {
  if (posts.length === 0) {
    return (
      <>
        {error && <PostsError error={error} />}

        <Center py={12}>
          <Stack align="center" gap={3}>
            <Text fontSize="lg" fontWeight="600" color="fg">
              No posts yet
            </Text>
            <Text color="fg.subtle">
              Be the first to share with your community!
            </Text>
          </Stack>
        </Center>
      </>
    );
  }

  return (
    <Stack gap={4}>
      {error && <PostsError error={error} />}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={onDelete} />
      ))}
    </Stack>
  );
};
