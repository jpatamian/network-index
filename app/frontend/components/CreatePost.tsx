import { useState } from 'react'
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
} from '@chakra-ui/react'
import { FaUser, FaPen, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { postsApi } from '@/lib/api'
import { Post } from '@/types/post'

interface CreatePostProps {
  onPostCreated: (post: Post) => void
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { token, isAuthenticated, user } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    zipcode: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated && !formData.zipcode.trim()) {
      setError('Zipcode is required for anonymous posts')
      return
    }

    setError('')
    setLoading(true)

    try {
      const postData: { title: string; content: string; zipcode?: string } = {
        title: formData.title,
        content: formData.content,
      }

      if (!isAuthenticated) {
        postData.zipcode = formData.zipcode
      }

      const response = await postsApi.create(postData, token)
      onPostCreated(response)
      setFormData({ title: '', content: '', zipcode: '' })
      setIsExpanded(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  if (!isExpanded) {
    return (
      <Card.Root borderRadius="lg" boxShadow="sm" mb={6} borderWidth="1px" borderColor="gray.100" bg="white">
        <Card.Body p={4}>
          <HStack
            gap={3}
            onClick={() => setIsExpanded(true)}
            cursor="pointer"
            p={3}
            bg="gray.50"
            borderRadius="lg"
            _hover={{ bg: 'gray.100' }}
            transition="all 0.2s"
          >
            <Box fontSize="lg" color="teal.600">
              <Icon as={FaUser} />
            </Box>
            <Input
              placeholder={isAuthenticated ? `What's on your mind, ${user?.username || 'friend'}?` : "What's on your mind?"}
              border="none"
              bg="transparent"
              _placeholder={{ color: 'gray.500' }}
              _focus={{ outline: 'none' }}
              pointer-events="none"
              fontSize="sm"
              color="gray.600"
            />
          </HStack>
        </Card.Body>
      </Card.Root>
    )
  }

  return (
    <Card.Root borderRadius="lg" boxShadow="sm" mb={6} borderWidth="1px" borderColor="gray.100" bg="white">
      <Card.Body p={6}>
        <VStack align="stretch" gap={4}>
          {/* Header */}
          <HStack gap={3}>
            <Box fontSize="lg" color="teal.600">
              <Icon as={FaPen} />
            </Box>
            <Heading size="md" color="gray.900" fontWeight="700">
              {isAuthenticated ? 'Share with Your Community' : 'Post Anonymously'}
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
              <Icon as={FaInfoCircle} color="blue.600" fontSize="lg" flexShrink={0} />
              <Box>
                <Heading size="xs" color="blue.800" mb={1} fontWeight="700">
                  Anonymous Post
                </Heading>
                <Box fontSize="sm" color="blue.700" lineHeight="1.4">
                  Your zipcode will be associated with this post for community context.
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
              <Icon as={FaExclamationCircle} color="red.600" fontSize="lg" flex="shrink: 0" />
              <Box fontSize="sm" color="red.700">
                {error}
              </Box>
            </HStack>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack gap={4}>
              {/* Zipcode Input */}
              {!isAuthenticated && (
                <Input
                  type="text"
                  placeholder="Your zipcode *"
                  value={formData.zipcode}
                  onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                  borderRadius="lg"
                  borderColor="gray.200"
                  _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px #14b8a6' }}
                  required
                />
              )}

              {/* Title Input */}
              <Input
                type="text"
                placeholder="Post title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                borderRadius="lg"
                borderColor="gray.200"
                _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px #14b8a6' }}
                required
                maxLength={200}
                fontWeight="medium"
              />

              {/* Content Textarea */}
              <Textarea
                placeholder="What's on your mind? Share what you need or offer..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                borderRadius="lg"
                borderColor="gray.200"
                minH="120px"
                _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px #14b8a6' }}
                required
                maxLength={5000}
                resize="vertical"
              />

              {/* Action Buttons */}
              <HStack justify="flex-end" gap={3}>
                <Button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false)
                    setFormData({ title: '', content: '', zipcode: '' })
                    setError('')
                  }}
                  variant="outline"
                  borderRadius="lg"
                  _hover={{ bg: 'gray.50' }}
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
                  _hover={{ bg: 'teal.700', transform: 'translateY(-1px)', boxShadow: 'md' }}
                  transition="all 0.2s"
                >
                  {loading ? 'Posting...' : isAuthenticated ? 'Share' : 'Post Anonymously'}
                </Button>
              </HStack>
            </Stack>
          </form>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}
