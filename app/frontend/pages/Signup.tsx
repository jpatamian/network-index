import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Input,
  Link as ChakraLink,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    zipcode: '',
    password: '',
    password_confirmation: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)

    try {
      await signup(formData)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth
    setError('Google signup coming soon')
  }

  return (
    <Box minH="100vh" bg="white" display="flex" alignItems="center" justifyContent="center" py={12} px={4}>
      <Container maxW="sm">
        <VStack gap={8} align="stretch">
          {/* Header */}
          <VStack align="center" gap={2}>
            <Heading as="h1" size="2xl" color="gray.900" fontWeight="700" textAlign="center">
              Discover your neighborhood
            </Heading>
          </VStack>

          {/* OAuth Buttons */}
          <VStack gap={3} w="100%">
            <Button
              onClick={handleGoogleSignup}
              w="100%"
              h="56px"
              bg="gray.100"
              color="gray.900"
              fontSize="md"
              fontWeight="600"
              borderRadius="full"
              _hover={{ bg: 'gray.200' }}
              gap={3}
            >
              <Icon as={FaGoogle} fontSize="lg" color="red.500" />
              Continue with Google
            </Button>
          </VStack>

          {/* Divider */}
          <HStack w="100%" gap={0}>
            <Box flex={1} h="1px" bg="gray.300" />
            <Text color="gray.500" fontSize="sm" fontWeight="600" px={3} whiteSpace="nowrap">
              or
            </Text>
            <Box flex={1} h="1px" bg="gray.300" />
          </HStack>

          {/* Error Message */}
          {error && (
            <Box bg="red.50" border="1px" borderColor="red.200" p={4} borderRadius="lg">
              <Text color="red.700" fontSize="sm">
                {error}
              </Text>
            </Box>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack gap={4}>
              {/* Email Input */}
              <Input
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                h="56px"
                fontSize="base"
                borderColor="gray.300"
                borderRadius="lg"
                _placeholder={{ color: 'gray.400' }}
                _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px #14b8a6' }}
              />

              {/* Username Input */}
              <Input
                name="username"
                type="text"
                placeholder="Username (optional)"
                value={formData.username}
                onChange={handleChange}
                h="56px"
                fontSize="base"
                borderColor="gray.300"
                borderRadius="lg"
                _placeholder={{ color: 'gray.400' }}
                _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px #14b8a6' }}
              />

              {/* Zipcode Input */}
              <Input
                name="zipcode"
                type="text"
                placeholder="Zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                required
                h="56px"
                fontSize="base"
                borderColor="gray.300"
                borderRadius="lg"
                _placeholder={{ color: 'gray.400' }}
                _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px #14b8a6' }}
              />

              {/* Password Input */}
              <Box position="relative">
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  h="56px"
                  fontSize="base"
                  borderColor="gray.300"
                  borderRadius="lg"
                  _placeholder={{ color: 'gray.400' }}
                  _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px #14b8a6' }}
                  pr="48px"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  position="absolute"
                  right="8px"
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={() => setShowPassword(!showPassword)}
                  color="gray.500"
                  _hover={{ color: 'gray.700', bg: 'transparent' }}
                >
                  {showPassword ? <Icon as={FaEyeSlash} /> : <Icon as={FaEye} />}
                </Button>
              </Box>

              {/* Confirm Password Input */}
              <Box position="relative">
                <Input
                  name="password_confirmation"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  h="56px"
                  fontSize="base"
                  borderColor="gray.300"
                  borderRadius="lg"
                  _placeholder={{ color: 'gray.400' }}
                  _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px #14b8a6' }}
                  pr="48px"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  position="absolute"
                  right="8px"
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  color="gray.500"
                  _hover={{ color: 'gray.700', bg: 'transparent' }}
                >
                  {showPasswordConfirm ? <Icon as={FaEyeSlash} /> : <Icon as={FaEye} />}
                </Button>
              </Box>

              {/* Continue Button */}
              <Button
                type="submit"
                disabled={loading}
                w="100%"
                h="56px"
                bg="teal.600"
                color="white"
                fontSize="lg"
                fontWeight="700"
                borderRadius="full"
                _hover={{ bg: 'teal.700' }}
                _disabled={{ bg: 'teal.400' }}
              >
                {loading ? 'Creating account...' : 'Continue'}
              </Button>
            </VStack>
          </form>

          {/* Footer Links */}
          <VStack gap={4} align="center" w="100%">
            <Text fontSize="xs" color="gray.500" textAlign="center" lineHeight={1.4}>
              By continuing with sign up, you agree to our{' '}
              <ChakraLink href="#" textDecoration="underline" color="gray.900" fontWeight="600">
                Privacy Policy
              </ChakraLink>
              ,{' '}
              <ChakraLink href="#" textDecoration="underline" color="gray.900" fontWeight="600">
                Cookie Policy
              </ChakraLink>
              , and{' '}
              <ChakraLink href="#" textDecoration="underline" color="gray.900" fontWeight="600">
                Member Agreement
              </ChakraLink>
              .
            </Text>
          </VStack>

          {/* Login Link */}
          <Text fontSize="sm" color="gray.600" textAlign="center">
            Already have an account?{' '}
            <ChakraLink
              href="/login"
              color="teal.600"
              fontWeight="600"
              textDecoration="underline"
              _hover={{ color: 'teal.700' }}
            >
              Log in
            </ChakraLink>
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}
