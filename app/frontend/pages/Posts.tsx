import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Center,
  Spinner,
  HStack,
  Badge,
  Button,
} from '@chakra-ui/react'
import { postsApi } from '@/lib/api'
import { Post } from '@/types/post'
import PostCard from '@/components/PostCard'
import CreatePost from '@/components/CreatePost'

export default function Posts() {
  const [searchParams] = useSearchParams()
  const zipcode = searchParams.get('zipcode')
  
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPosts()
  }, [zipcode])

  const loadPosts = async () => {
    try {
      const data = await postsApi.getAll(zipcode)
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

  const handleClearFilter = () => {
    window.location.href = '/posts'
  }

  if (loading) {
    return (
      <Box py={12} bg="gray.50" minH="100vh">
        <Container maxW="3xl">
          <Center>
            <Stack align="center" gap={4}>
              <Spinner size="lg" color="teal.600" />
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
            <HStack justify="space-between" align="center">
              <Heading
                as="h1"
                size="2xl"
                color="gray.900"
                fontWeight="700"
              >
                Community Feed
              </Heading>
              {zipcode && (
                <Badge bg="teal.50" color="teal.700" fontWeight="600" px={3} py={1.5} borderRadius="full">
                  <HStack gap={1} fontSize="sm">
                    <span>📍</span>
                    <Text>{zipcode}</Text>
                  </HStack>
                </Badge>
              )}
            </HStack>
            <Stack gap={3}>
              <Text fontSize="lg" color="gray.600" lineHeight="1.6">
                {zipcode
                  ? `Posts from your neighborhood (${zipcode}). Share what you need, offer what you can.`
                  : 'Share what you need, offer what you can. Let\'s build together.'}
              </Text>
              {zipcode && (
                <Button
                  onClick={handleClearFilter}
                  variant="ghost"
                  color="teal.600"
                  fontSize="sm"
                  fontWeight="600"
                  w="fit-content"
                  _hover={{ bg: 'teal.50' }}
                >
                  ✕ Clear location filter
                </Button>
              )}
            </Stack>
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
