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
import { useAuth } from '@/hooks/useAuth'
import { Post } from '@/types/post'
import PostCard from '@/features/posts/components/PostCard'
import CreatePost from '@/features/posts/components/CreatePost'

export default function Posts() {
  const [searchParams] = useSearchParams()
  const zipcode = searchParams.get('zipcode')
  const filter = searchParams.get('filter')
  const viewingMine = filter === 'mine'
  const { token, isAuthenticated, isLoading } = useAuth()
  
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const hasFilter = Boolean(zipcode) || viewingMine
  const pageTitle = viewingMine ? 'My Posts' : 'Community Feed'
  const subtitle = viewingMine
    ? 'Posts you have shared with neighbors. Keep the community updated.'
    : zipcode
      ? `Posts from your neighborhood (${zipcode}). Share what you need, offer what you can.`
      : 'Share what you need, offer what you can. Let\'s build together.'
  const clearFilterLabel = viewingMine ? 'View all posts' : '✕ Clear location filter'

  useEffect(() => {
    let isMounted = true

    const fetchPosts = async () => {
      if (viewingMine && isLoading) {
        return
      }

      setLoading(true)
      setError('')

      try {
        let data: Post[]

        if (viewingMine) {
          if (!isAuthenticated || !token) {
            throw new Error('Sign in to view your posts.')
          }
          data = await postsApi.getMine(token)
        } else {
          data = await postsApi.getAll(zipcode)
        }

        if (isMounted) {
          setPosts(data)
        }
      } catch (err) {
        if (isMounted) {
          setPosts([])
          setError(err instanceof Error ? err.message : 'Failed to load posts')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPosts()

    return () => {
      isMounted = false
    }
  }, [zipcode, viewingMine, token, isAuthenticated, isLoading])

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev])
  }

  const handlePostDeleted = (id: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== id))
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
                {pageTitle}
              </Heading>
              {viewingMine ? (
                <Badge bg="teal.50" color="teal.700" fontWeight="600" px={3} py={1.5} borderRadius="full">
                  <HStack gap={1} fontSize="sm">
                    <span>🙋</span>
                    <Text>My posts</Text>
                  </HStack>
                </Badge>
              ) : (
                zipcode && (
                  <Badge bg="teal.50" color="teal.700" fontWeight="600" px={3} py={1.5} borderRadius="full">
                    <HStack gap={1} fontSize="sm">
                      <span>📍</span>
                      <Text>{zipcode}</Text>
                    </HStack>
                  </Badge>
                )
              )}
            </HStack>
            <Stack gap={3}>
              <Text fontSize="lg" color="gray.600" lineHeight="1.6">
                {subtitle}
              </Text>
              {hasFilter && (
                <Button
                  onClick={handleClearFilter}
                  variant="ghost"
                  color="teal.600"
                  fontSize="sm"
                  fontWeight="600"
                  w="fit-content"
                  _hover={{ bg: 'teal.50' }}
                >
                  {clearFilterLabel}
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
