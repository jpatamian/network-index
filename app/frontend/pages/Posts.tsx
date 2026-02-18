import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Center,
  Spinner,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { FaComments } from 'react-icons/fa'
import { postsApi } from '@/lib/api'
import { Post } from '@/types/post'
import PostCard from '@/components/PostCard'
import CreatePost from '@/components/CreatePost'

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const data = await postsApi.getAll()
      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts])
  }

  const handlePostDeleted = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id))
  }

  if (loading) {
    return (
      <Box py={12} bg="gray.50" minH="100vh">
        <Container maxW="3xl">
          <Center>
            <Stack align="center" gap={4}>
              <Spinner size="lg" color="teal.600" thickness="4px" />
              <Text color="gray.600" fontSize="lg">
                Loading posts...
              </Text>
            </Stack>
          </Center>
        </Container>
      </Box>
    )
  }

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Hero Section */}
      <Box
        bg="white"
        py={{ base: 10, md: 12 }}
        borderBottomWidth="1px"
        borderColor="gray.100"
      >
        <Container maxW="3xl">
          <Stack gap={4}>
            <Heading
              as="h1"
              size="2xl"
              color="gray.900"
              fontWeight="700"
            >
              Community Feed
            </Heading>
            <Text fontSize="lg" color="gray.600" lineHeight="1.6">
              Share what you need, offer what you can. Let's build together.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Content Section */}
      <Box py={{ base: 10, md: 12 }}>
        <Container maxW="3xl">
          <Stack gap={8}>
            {/* Create Post Section */}
            <Box>
              <CreatePost onPostCreated={handlePostCreated} />
            </Box>

            {/* Error Message */}
            {error && (
              <Box
                bg="red.50"
                borderLeft="4px"
                borderColor="red.500"
                p={4}
                borderRadius="md"
              >
                <Heading size="sm" color="red.800" mb={2}>Failed to load posts</Heading>
                <Text color="red.700" fontSize="sm">{error}</Text>
              </Box>
            )}

            {/* Posts List */}
            {posts.length === 0 ? (
              <Center py={12}>
                <Stack align="center" gap={3}>
                  <Text fontSize="lg" fontWeight="600" color="gray.700">
                    No posts yet
                  </Text>
                  <Text color="gray.500">Be the first to share with your community!</Text>
                </Stack>
              </Center>
            ) : (
              <Stack gap={6}>
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />
                ))}
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
