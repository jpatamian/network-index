import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Button,
  Input,
  Text,
  Avatar,
  Alert,
  Spinner,
  Flex,
} from '@chakra-ui/react'
import { useAuth } from '@/hooks/useAuth'
import { commentsApi } from '@/lib/api'
import { Comment } from '@/types/post'
import { formatDate } from '@/lib/date'

interface CommentSectionProps {
  postId: number
  commentCount: number
}

export default function CommentSection({ postId, commentCount }: CommentSectionProps) {
  const { user, token, isAuthenticated } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [count, setCount] = useState(commentCount)

  const loadComments = async () => {
    setLoading(true)
    try {
      const data = await commentsApi.getByPost(postId)
      setComments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  const handleExpand = () => {
    if (!isExpanded) {
      loadComments()
    }
    setIsExpanded(!isExpanded)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !message.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const newComment = await commentsApi.create(postId, message.trim(), token)
      setComments([...comments, newComment])
      setCount(count + 1)
      setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: number) => {
    if (!token) return

    try {
      await commentsApi.delete(postId, commentId, token)
      setComments(comments.filter((c) => c.id !== commentId))
      setCount(count - 1)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete comment')
    }
  }

  return (
    <Box borderTop="1px" borderColor="border" mt={4} pt={4}>
      <Button
        onClick={handleExpand}
        variant="ghost"
        size="sm"
        fontWeight="600"
        color="fg.muted"
        _hover={{ color: 'teal.600' }}
      >
        {isExpanded ? '▼ Hide Comments' : `▶ Comments (${count})`}
      </Button>

      {isExpanded && (
        <VStack gap={4} mt={4}>
          {error && (
            <Alert.Root status="error" borderRadius="md" fontSize="sm">
              {error}
            </Alert.Root>
          )}

          {loading && (
            <Flex justify="center" w="full">
              <Spinner color="teal.600" size="sm" />
            </Flex>
          )}

          {!loading && comments.length === 0 && (
            <Text fontSize="sm" color="fg.subtle" w="full" textAlign="center">
              No comments yet. Be the first to share your thoughts!
            </Text>
          )}

          {comments.map((comment) => (
            <Box key={comment.id} w="full">
              <HStack gap={3} align="flex-start">
                <Avatar.Root size="sm">
                  <Avatar.Image />
                  <Avatar.Fallback bg="teal.600" color="white" fontWeight="bold">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
                <Box flex={1} minW={0}>
                  <Flex justify="space-between" align="flex-start">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="fg">
                        {comment.author.name}
                      </Text>
                      <Text fontSize="xs" color="fg.subtle">
                        {formatDate(comment.created_at, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </Box>
                    {user?.id === comment.author.id && (
                      <Button
                        onClick={() => handleDelete(comment.id)}
                        size="xs"
                        variant="ghost"
                        color="red.500"
                        fontWeight="500"
                        _hover={{ bg: 'red.50' }}
                      >
                        Delete
                      </Button>
                    )}
                  </Flex>
                  <Text fontSize="sm" color="fg" mt={2}>
                    {comment.message}
                  </Text>
                </Box>
              </HStack>
            </Box>
          ))}

          {isAuthenticated ? (
            <Box as="form" onSubmit={handleSubmit} w="full">
              <VStack gap={2} align="stretch">
                <HStack gap={2} align="flex-end">
                  <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your thoughts..."
                    size="sm"
                    borderRadius="md"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={submitting || !message.trim()}
                    size="sm"
                    bg="teal.600"
                    color="white"
                    fontWeight="600"
                    _hover={{ bg: 'teal.700' }}
                    _disabled={{ bg: 'gray.300', cursor: 'not-allowed' }}
                    minW="70px"
                  >
                    {submitting ? <Spinner size="xs" /> : 'Post'}
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ) : (
            <Text fontSize="xs" color="fg.subtle" fontStyle="italic" w="full" textAlign="center">
              Sign in to leave a comment
            </Text>
          )}
        </VStack>
      )}
    </Box>
  )
}
