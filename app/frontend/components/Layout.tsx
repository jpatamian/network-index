import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Container,
  Button,
  HStack,
  VStack,
  Text,
  Center,
  Icon,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { FaHome, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { GiEyeShield } from "react-icons/gi";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";

export default function Layout() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (url: string) => {
    navigate(url);
    setMobileMenuOpen(false);
  };

  return (
    <Flex direction="column" minH="100vh">
      {/* Navigation */}
      <Box
        as="nav"
        bg="bg"
        boxShadow="sm"
        borderBottomWidth="1px"
        borderColor="border.subtle"
      >
        <Container maxW="7xl">
          <Flex justify="space-between" align="center" h={14}>
            {/* Logo */}
            <Box
              as="button"
              onClick={() => handleNavigation("/")}
              _hover={{ opacity: 0.8 }}
              transition="all 0.2s"
              bg="none"
              border="none"
              cursor="pointer"
              p={0}
            >
              <HStack gap={3}>
                <Box display="flex" gap={1} fontSize="2xl" color="teal.600">
                  <Icon as={FaHome} />
                  <Icon as={GiEyeShield} />
                </Box>
                <Heading
                  color="fg"
                  size="lg"
                  fontWeight="700"
                  letterSpacing="tight"
                >
                  Mutual Aid Club
                </Heading>
              </HStack>
            </Box>

            {/* Desktop Navigation Links */}
            <HStack gap={6} display={{ base: "none", md: "flex" }}>
              <Button
                onClick={() => handleNavigation("/")}
                variant="ghost"
                color="fg"
                fontWeight="500"
                _hover={{ color: "teal.600", bg: "transparent" }}
              >
                Home
              </Button>
              <Button
                onClick={() => handleNavigation("/posts")}
                variant="ghost"
                color="fg"
                fontWeight="500"
                _hover={{ color: "teal.600", bg: "transparent" }}
              >
                Feed
              </Button>

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Button
                        onClick={() => handleNavigation("/profile")}
                        variant="ghost"
                        color="gray.700"
                        size="sm"
                        fontWeight="500"
                        _hover={{ color: "teal.600", bg: "transparent" }}
                      >
                        {user?.username || user?.email || "User"}
                      </Button>
                      <Button
                        onClick={logout}
                        variant="ghost"
                        color="gray.700"
                        size="sm"
                        fontWeight="500"
                        _hover={{ color: "teal.600", bg: "transparent" }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleNavigation("/login")}
                        variant="ghost"
                        color="gray.700"
                        size="sm"
                        fontWeight="500"
                        _hover={{ color: "teal.600", bg: "transparent" }}
                      >
                        Log In
                      </Button>
                      <Button
                        onClick={() => handleNavigation("/signup")}
                        bg="teal.600"
                        color="white"
                        size="sm"
                        fontWeight="600"
                        borderRadius="md"
                        _hover={{ bg: "teal.700" }}
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </>
              )}
            </HStack>

            {/* Mobile Hamburger Button */}
            <IconButton
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              variant="ghost"
              color="fg"
              display={{ base: "flex", md: "none" }}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <Icon as={mobileMenuOpen ? FaTimes : FaBars} fontSize="xl" />
            </IconButton>
          </Flex>
        </Container>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <Box
            display={{ base: "block", md: "none" }}
            bg="bg"
            borderTopWidth="1px"
            borderColor="border.subtle"
            px={4}
            py={4}
          >
            <VStack align="stretch" gap={2}>
              <Button
                onClick={() => handleNavigation("/")}
                variant="ghost"
                color="fg"
                fontWeight="500"
                justifyContent="flex-start"
                _hover={{ color: "teal.600", bg: "bg.subtle" }}
              >
                Home
              </Button>
              <Button
                onClick={() => handleNavigation("/posts")}
                variant="ghost"
                color="fg"
                fontWeight="500"
                justifyContent="flex-start"
                _hover={{ color: "teal.600", bg: "bg.subtle" }}
              >
                Feed
              </Button>

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Button
                        onClick={() => handleNavigation("/profile")}
                        variant="ghost"
                        color="gray.700"
                        fontWeight="500"
                        justifyContent="flex-start"
                        _hover={{ color: "teal.600", bg: "bg.subtle" }}
                      >
                        {user?.username || user?.email || "User"}
                      </Button>
                      <Button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        variant="ghost"
                        color="gray.700"
                        fontWeight="500"
                        justifyContent="flex-start"
                        _hover={{ color: "teal.600", bg: "bg.subtle" }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleNavigation("/login")}
                        variant="ghost"
                        color="gray.700"
                        fontWeight="500"
                        justifyContent="flex-start"
                        _hover={{ color: "teal.600", bg: "bg.subtle" }}
                      >
                        Log In
                      </Button>
                      <Button
                        onClick={() => handleNavigation("/signup")}
                        bg="teal.600"
                        color="white"
                        fontWeight="600"
                        borderRadius="md"
                        _hover={{ bg: "teal.700" }}
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </>
              )}
            </VStack>
          </Box>
        )}
      </Box>

      {/* Main Content */}
      <Box as="main" flex="1">
        <Outlet />
      </Box>

      {/* Footer */}
      <Box as="footer" bg="bg" borderTop="1px" borderColor="border">
        <Container maxW="7xl" py={6}>
          <Center>
            <Text fontSize="sm" color="fg.subtle" textAlign="center">
              © 2026 Mutual Aid Club. Built by the community, for the community.
              All rights reserved.
            </Text>
          </Center>
        </Container>
      </Box>

      {/* Global Toast Notifications */}
      <Toaster />
    </Flex>
  );
}
