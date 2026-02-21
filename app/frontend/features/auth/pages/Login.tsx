import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";
import { useFormData } from "@/hooks/useFormData";
import FormInput from "@/components/FormInput";
import PasswordInput from "@/components/PasswordInput";
import ErrorBox from "@/components/ErrorBox";
import OrDivider from "@/components/OrDivider";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleClientIdConfigured = Boolean(
    import.meta.env.VITE_GOOGLE_CLIENT_ID,
  );

  const { formData, handleChange } = useFormData({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response: CredentialResponse) => {
    const credential = response.credential;
    if (!credential) {
      setError("Google authentication failed");
      return;
    }
    setError("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle(credential);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="bg.subtle"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={12}
      px={4}
    >
      <Container maxW="sm">
        <VStack gap={8} align="stretch">
          <VStack align="center" gap={2}>
            <Heading
              as="h1"
              size="2xl"
              color="fg"
              fontWeight="700"
              textAlign="center"
            >
              Discover your neighborhood
            </Heading>
          </VStack>

          <VStack gap={3} w="100%">
            {googleClientIdConfigured ? (
              <Box
                w="100%"
                display="flex"
                justifyContent="center"
                opacity={googleLoading ? 0.6 : 1}
              >
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setError("Google authentication failed")}
                  text="continue_with"
                  shape="pill"
                  size="large"
                />
              </Box>
            ) : (
              <Button
                disabled
                w="100%"
                h={{ base: "48px", md: "56px" }}
                bg="bg.muted"
                color="fg.subtle"
                fontSize="md"
                fontWeight="600"
                borderRadius="full"
              >
                Google OAuth not configured
              </Button>
            )}
          </VStack>

          <OrDivider />

          {error && <ErrorBox>{error}</ErrorBox>}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack gap={4}>
              <FormInput
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <PasswordInput
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                type="submit"
                disabled={loading}
                w="100%"
                h={{ base: "48px", md: "56px" }}
                bg="teal.600"
                color="white"
                fontSize="lg"
                fontWeight="700"
                borderRadius="full"
                _hover={{ bg: "teal.700" }}
                _disabled={{ bg: "teal.400" }}
              >
                {loading ? "Continuing..." : "Continue"}
              </Button>
            </VStack>
          </form>

          <VStack gap={4} align="center" w="100%">
            <Text
              fontSize="xs"
              color="fg.subtle"
              textAlign="center"
              lineHeight={1.4}
            >
              By continuing with sign up, you agree to our{" "}
              <ChakraLink
                href="#"
                textDecoration="underline"
                color="fg"
                fontWeight="600"
              >
                Privacy Policy
              </ChakraLink>
              ,{" "}
              <ChakraLink
                href="#"
                textDecoration="underline"
                color="fg"
                fontWeight="600"
              >
                Cookie Policy
              </ChakraLink>
              , and{" "}
              <ChakraLink
                href="#"
                textDecoration="underline"
                color="fg"
                fontWeight="600"
              >
                Member Agreement
              </ChakraLink>
              .
            </Text>
          </VStack>

          <Text fontSize="sm" color="fg.muted" textAlign="center">
            Don't have an account?{" "}
            <ChakraLink
              href="/signup"
              color="teal.600"
              fontWeight="600"
              textDecoration="underline"
              _hover={{ color: "teal.700" }}
            >
              Sign up
            </ChakraLink>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
