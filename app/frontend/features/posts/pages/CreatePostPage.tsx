import { Box, Container, Heading, Text, Stack, Button, HStack, Icon } from '@chakra-ui/react'
import { FaArrowLeft, FaPen } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import CreatePost from '@/features/posts/components/CreatePost'
import { toaster } from '@/components/ui/toaster'
import { Post } from '@/types/post'

export default function CreatePostPage() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/posts')
  }

  const handlePostCreated = (_post: Post) => {
    toaster.success({
      title: 'Post published',
      description: 'Your update is live in the community feed.',
    })

    navigate('/posts')
  }

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="3xl">
        <Stack gap={8}>
          <Button
            onClick={handleBack}
            variant="ghost"
            color="teal.600"
            fontWeight="600"
            gap={2}
            w="fit-content"
            _hover={{ bg: 'teal.50' }}
          >
            <Icon as={FaArrowLeft} />
            Back to feed
          </Button>

          <Box bg="white" borderRadius="lg" p={{ base: 6, md: 8 }} borderWidth="1px" borderColor="gray.100" boxShadow="sm">
            <Stack gap={4}>
              <HStack gap={3}>
                <Box color="teal.600" fontSize="2xl">
                  <Icon as={FaPen} />
                </Box>
                <Heading size="lg" color="gray.900" fontWeight="700">
                  Share something new
                </Heading>
              </HStack>
              <Text color="gray.600" lineHeight="1.6">
                Start a conversation, ask for support, or offer help to your neighborhood. Posts shared here will appear in the community feed.
              </Text>
            </Stack>
          </Box>

          <CreatePost onPostCreated={handlePostCreated} forceExpanded onCancel={handleBack} />
        </Stack>
      </Container>
    </Box>
  )
}
