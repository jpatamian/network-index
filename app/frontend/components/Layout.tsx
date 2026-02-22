import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
  Separator,
} from "@chakra-ui/react";
import {
  FaHome,
  FaBars,
  FaTimes,
  FaNewspaper,
  FaHandsHelping,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { GiEyeShield } from "react-icons/gi";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import type { IconType } from "react-icons";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  to?: string;
  onClick?: () => void;
  active?: boolean;
}

function SidebarItem({ icon, label, to, onClick, active }: SidebarItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      justifyContent="flex-start"
      gap={3}
      px={3}
      py={2}
      borderRadius="md"
      fontWeight={active ? "600" : "500"}
      color={active ? "teal.600" : "fg"}
      bg={active ? "teal.50" : "transparent"}
      _hover={{ bg: "orange.50", color: "teal.600" }}
      transition="all 0.15s"
      w="100%"
    >
      <Icon as={icon} fontSize="md" flexShrink={0} />
      <Text fontSize="sm">{label}</Text>
    </Button>
  );
}

export default function Layout() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (url: string) => {
    navigate(url);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <Flex direction="column" minH="100vh">
      {/* Top Navigation Bar */}
      <Box
        as="nav"
        bg="bg"
        boxShadow="sm"
        borderBottomWidth="1px"
        borderColor="border.subtle"
        position="sticky"
        top="0"
        zIndex="10"
      >
        <Container maxW="full" px={4}>
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

            {/* Desktop: auth buttons only (sidebar handles nav links) */}
            <HStack gap={3} display={{ base: "none", md: "flex" }}>
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <Text fontSize="sm" color="fg.subtle" fontWeight="500">
                      {user?.username || user?.email}
                    </Text>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleNavigation("/login")}
                        variant="ghost"
                        color="fg"
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
                gap={3}
                _hover={{ color: "teal.600", bg: "orange.50" }}
              >
                <Icon as={FaHome} />
                Home
              </Button>
              <Button
                onClick={() => handleNavigation("/posts")}
                variant="ghost"
                color="fg"
                fontWeight="500"
                justifyContent="flex-start"
                gap={3}
                _hover={{ color: "teal.600", bg: "orange.50" }}
              >
                <Icon as={FaNewspaper} />
                Feed
              </Button>
              <Button
                onClick={() => handleNavigation("/resources")}
                variant="ghost"
                color="fg"
                fontWeight="500"
                justifyContent="flex-start"
                gap={3}
                _hover={{ color: "teal.600", bg: "orange.50" }}
              >
                <Icon as={FaHandsHelping} />
                Resources
              </Button>

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Button
                        onClick={() => handleNavigation("/profile")}
                        variant="ghost"
                        color="fg"
                        fontWeight="500"
                        justifyContent="flex-start"
                        gap={3}
                        _hover={{ color: "teal.600", bg: "orange.50" }}
                      >
                        <Icon as={FaUser} />
                        {user?.username || user?.email || "Profile"}
                      </Button>
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        color="fg"
                        fontWeight="500"
                        justifyContent="flex-start"
                        gap={3}
                        _hover={{ color: "teal.600", bg: "orange.50" }}
                      >
                        <Icon as={FaSignOutAlt} />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleNavigation("/login")}
                        variant="ghost"
                        color="fg"
                        fontWeight="500"
                        justifyContent="flex-start"
                        gap={3}
                        _hover={{ color: "teal.600", bg: "orange.50" }}
                      >
                        <Icon as={FaSignInAlt} />
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

      {/* Body: Sidebar + Main Content */}
      <Flex flex="1" align="stretch">
        {/* Left Sidebar — desktop only */}
        <Box
          as="aside"
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          w="220px"
          flexShrink={0}
          bg="bg"
          borderRightWidth="1px"
          borderColor="border.subtle"
          px={3}
          py={4}
          position="sticky"
          top="56px"
          h="calc(100vh - 56px)"
          overflowY="auto"
        >
          {/* Main nav items */}
          <VStack align="stretch" gap={1} flex="1">
            <SidebarItem
              icon={FaHome}
              label="Home"
              to="/"
              active={location.pathname === "/"}
            />
            <SidebarItem
              icon={FaNewspaper}
              label="Feed"
              to="/posts"
              active={location.pathname.startsWith("/posts")}
            />
            <SidebarItem
              icon={FaHandsHelping}
              label="Resources"
              to="/resources"
              active={location.pathname.startsWith("/resources")}
            />
          </VStack>

          {/* Bottom: profile / auth */}
          {!isLoading && (
            <VStack align="stretch" gap={1}>
              <Separator mb={2} borderColor="border.subtle" />
              {isAuthenticated ? (
                <>
                  <SidebarItem
                    icon={FaUser}
                    label={user?.username || user?.email || "Profile"}
                    to="/profile"
                    active={location.pathname.startsWith("/profile")}
                  />
                  <SidebarItem
                    icon={FaSignOutAlt}
                    label="Logout"
                    onClick={logout}
                  />
                </>
              ) : (
                <>
                  <SidebarItem
                    icon={FaSignInAlt}
                    label="Log In"
                    to="/login"
                    active={location.pathname === "/login"}
                  />
                  <SidebarItem
                    icon={FaUserPlus}
                    label="Sign Up"
                    to="/signup"
                    active={location.pathname === "/signup"}
                  />
                </>
              )}
            </VStack>
          )}
        </Box>

        {/* Main Content */}
        <Box as="main" flex="1" minW="0">
          <Outlet />
        </Box>
      </Flex>

      {/* Footer */}
      <Box as="footer" bg="bg" borderTop="1px" borderColor="border">
        <Container maxW="full" px={4} py={6}>
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
