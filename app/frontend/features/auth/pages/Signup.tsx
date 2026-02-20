import { useState } from "react";
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

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleClientIdConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const { formData, handleChange } = useFormData({
    email: "",
    username: "",
    zipcode: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signup(formData);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (response: CredentialResponse) => {
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
      setError(err instanceof Error ? err.message : "Google signup failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="white" display="flex" alignItems="center" justifyContent="center" py={12} px={4}>
      <Container maxW="sm">
        <VStack gap={8} align="stretch">
          <VStack align="center" gap={2}>
            <Heading as="h1" size="2xl" color="fg" fontWeight="700" textAlign="center">
              Discover your neighborhood
            </Heading>
          </VStack>

          <VStack gap={3} w="100%">
            {googleClientIdConfigured ? (
              <Box w="100%" display="flex" justifyContent="center" opacity={googleLoading ? 0.6 : 1}>
                <GoogleLogin
                  onSuccess={handleGoogleSignup}
                  onError={() => setError("Google authentication failed")}
                  text="continue_with"
                  shape="pill"
                  size="large"
                />
              </Box>
            ) : (
              <Button disabled w="100%" h="56px" bg="bg.muted" color="fg.subtle" fontSize="md" fontWeight="600" borderRadius="full">
                Google OAuth not configured
              </Button>
            )}
            <Text fontSize="xs" color="fg.subtle" textAlign="center">
              You can continue with Google now and add your zipcode later on your profile.
            </Text>
          </VStack>

          <OrDivider />

          {error && <ErrorBox>{error}</ErrorBox>}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack gap={4}>
              <FormInput name="email" type="email" placeholder="Email address" value={formData.email} onChange={handleChange} required />
              <FormInput name="username" placeholder="Username (optional)" value={formData.username} onChange={handleChange} />
              <FormInput name="zipcode" placeholder="Zipcode" value={formData.zipcode} onChange={handleChange} required />
              <PasswordInput name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} required />
              <PasswordInput name="password_confirmation" placeholder="Confirm password" value={formData.password_confirmation} onChange={handleChange} required />
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
                _hover={{ bg: "teal.700" }}
                _disabled={{ bg: "teal.400" }}
              >
                {loading ? "Creating account..." : "Continue"}
              </Button>
            </VStack>
          </form>

          <VStack gap={4} align="center" w="100%">
            <Text fontSize="xs" color="fg.subtle" textAlign="center" lineHeight={1.4}>
              By continuing with sign up, you agree to our{" "}
              <ChakraLink href="#" textDecoration="underline" color="fg" fontWeight="600">Privacy Policy</ChakraLink>,{" "}
              <ChakraLink href="#" textDecoration="underline" color="fg" fontWeight="600">Cookie Policy</ChakraLink>, and{" "}
              <ChakraLink href="#" textDecoration="underline" color="fg" fontWeight="600">Member Agreement</ChakraLink>.
            </Text>
          </VStack>

          <Text fontSize="sm" color="fg.muted" textAlign="center">
            Already have an account?{" "}
            <ChakraLink href="/login" color="teal.600" fontWeight="600" textDecoration="underline" _hover={{ color: "teal.700" }}>
              Log in
            </ChakraLink>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
