import { useState, useEffect, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
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
  Input,
  Icon,
  Fieldset,
  chakra,
} from "@chakra-ui/react";
import { postsApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/post";
import PostCard from "@/features/posts/components/PostCard";
import CreatePost from "@/features/posts/components/CreatePost";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";

export default function Posts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const zipcode = searchParams.get("zipcode");
  const query = searchParams.get("q");
  const filter = searchParams.get("filter");
  const viewingMine = filter === "mine";
  const { token, isAuthenticated, isLoading } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zipcodeInput, setZipcodeInput] = useState(zipcode ?? "");
  const [queryInput, setQueryInput] = useState(query ?? "");

  const hasSearchFilters = Boolean(zipcode) || Boolean(query);
  const hasFilter = hasSearchFilters || viewingMine;
  const pageTitle = viewingMine ? "My Posts" : "Community Feed";
  const subtitle = viewingMine
    ? "Posts you have shared with neighbors. Keep the community updated."
    : zipcode
      ? `Posts from your neighborhood (${zipcode}). Share what you need, offer what you can.`
      : "Share what you need, offer what you can. Let's build together.";
  const clearFilterLabel = viewingMine ? "View all posts" : "Reset filters";
  const isSearchFormDirty =
    Boolean(zipcodeInput.trim()) || Boolean(queryInput.trim());
  const canResetSearch = hasSearchFilters || isSearchFormDirty;

  useEffect(() => {
    setZipcodeInput(zipcode ?? "");
  }, [zipcode]);

  useEffect(() => {
    setQueryInput(query ?? "");
  }, [query]);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      if (viewingMine && isLoading) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        let data: Post[];

        if (viewingMine) {
          if (!isAuthenticated || !token) {
            throw new Error("Sign in to view your posts.");
          }
          data = await postsApi.getMine(token);
        } else {
          data = await postsApi.getAll({ zipcode, query });
        }

        if (isMounted) {
          setPosts(data);
        }
      } catch (err) {
        if (isMounted) {
          setPosts([]);
          setError(err instanceof Error ? err.message : "Failed to load posts");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [zipcode, query, viewingMine, token, isAuthenticated, isLoading]);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (id: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (zipcodeInput.trim()) {
      params.set("zipcode", zipcodeInput.trim());
    } else {
      params.delete("zipcode");
    }

    if (queryInput.trim()) {
      params.set("q", queryInput.trim());
    } else {
      params.delete("q");
    }

    params.delete("filter");
    setSearchParams(params);
  };

  const handleSearchReset = () => {
    setZipcodeInput("");
    setQueryInput("");
    const params = new URLSearchParams(searchParams);
    params.delete("zipcode");
    params.delete("q");
    setSearchParams(params);
  };

  const handleClearFilter = () => {
    setZipcodeInput("");
    setQueryInput("");
    setSearchParams(new URLSearchParams());
  };

  if (loading) {
    return (
      <Box py={12} bg="bg.subtle" minH="100vh">
        <Container maxW="3xl">
          <Center>
            <Stack align="center" gap={4}>
              <Spinner size="lg" color="teal.600" />
              <Text color="fg.muted" fontSize="lg">
                Loading posts...
              </Text>
            </Stack>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="bg.subtle" minH="100vh">
      {/* Hero Section */}
      <Box
        bg="bg"
        py={{ base: 10, md: 12 }}
        borderBottomWidth="1px"
        borderColor="border.subtle"
      >
        <Container maxW="3xl">
          <Stack gap={4}>
            <HStack justify="space-between" align="center">
              <Heading as="h1" size="2xl" color="fg" fontWeight="700">
                {pageTitle}
              </Heading>
              {viewingMine ? (
                <Badge
                  bg="teal.50"
                  color="teal.700"
                  fontWeight="600"
                  px={3}
                  py={1.5}
                  borderRadius="full"
                >
                  <HStack gap={1} fontSize="sm">
                    <span>🙋</span>
                    <Text>My posts</Text>
                  </HStack>
                </Badge>
              ) : (
                zipcode && (
                  <Badge
                    bg="teal.50"
                    color="teal.700"
                    fontWeight="600"
                    px={3}
                    py={1.5}
                    borderRadius="full"
                  >
                    <HStack gap={1} fontSize="sm">
                      <span>📍</span>
                      <Text>{zipcode}</Text>
                    </HStack>
                  </Badge>
                )
              )}
            </HStack>
            <Stack gap={3}>
              <Text fontSize="lg" color="fg.muted" lineHeight="1.6">
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
                  _hover={{ bg: "teal.50" }}
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
          {/* Create Post Section */}
          <Box py={{ base: 10, md: 12 }}>
            <CreatePost onPostCreated={handlePostCreated} />
          </Box>

          <Stack gap={8}>
            {/* Search & Filter */}
            {!viewingMine && (
              <Box
                bg="bg"
                borderWidth="1px"
                borderColor="border.subtle"
                borderRadius="lg"
                p={6}
                boxShadow="sm"
              >
                <chakra.form
                  gap={4}
                  onSubmit={handleSearchSubmit}
                  display="flex"
                  flexDirection="column"
                >
                  <Stack gap={1}>
                    <Heading size="md" color="fg" fontWeight="700">
                      Find the right posts
                    </Heading>
                    <Text fontSize="sm" color="fg.muted">
                      Combine zipcode with keywords to quickly surface what's
                      relevant to you.
                    </Text>
                  </Stack>

                  <Stack direction={{ base: "column", md: "row" }} gap={4}>
                    <Fieldset.Root flex="1" gap={2}>
                      <Fieldset.Legend fontSize="sm" color="fg.muted">
                        Zipcode
                      </Fieldset.Legend>
                      <Fieldset.Content>
                        <Box position="relative">
                          <Icon
                            as={FaMapMarkerAlt}
                            color="fg.subtle"
                            fontSize="sm"
                            position="absolute"
                            left={3}
                            top="50%"
                            transform="translateY(-50%)"
                            pointerEvents="none"
                          />
                          <Input
                            value={zipcodeInput}
                            onChange={(e) => setZipcodeInput(e.target.value)}
                            placeholder="Enter zipcode"
                            borderRadius="md"
                            bg="bg"
                            borderColor="border"
                            pl={9}
                          />
                        </Box>
                      </Fieldset.Content>
                    </Fieldset.Root>

                    <Fieldset.Root flex="1" gap={2}>
                      <Fieldset.Legend fontSize="sm" color="fg.muted">
                        Search text
                      </Fieldset.Legend>
                      <Fieldset.Content>
                        <Box position="relative">
                          <Icon
                            as={FaSearch}
                            color="fg.subtle"
                            fontSize="sm"
                            position="absolute"
                            left={3}
                            top="50%"
                            transform="translateY(-50%)"
                            pointerEvents="none"
                          />
                          <Input
                            value={queryInput}
                            onChange={(e) => setQueryInput(e.target.value)}
                            placeholder={'Try "rides to market"'}
                            borderRadius="md"
                            bg="bg"
                            borderColor="border"
                            pl={9}
                          />
                        </Box>
                      </Fieldset.Content>
                    </Fieldset.Root>
                  </Stack>

                  <HStack justify="flex-end" gap={3}>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleSearchReset}
                      disabled={!canResetSearch}
                      fontWeight="600"
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      bg="teal.600"
                      color="white"
                      fontWeight="600"
                      borderRadius="md"
                      _hover={{
                        bg: "teal.700",
                        transform: "translateY(-1px)",
                        boxShadow: "md",
                      }}
                    >
                      Apply filters
                    </Button>
                  </HStack>
                </chakra.form>
              </Box>
            )}

            {/* Error Message */}
            {error && (
              <Box
                bg="red.50"
                borderLeft="4px"
                borderColor="red.500"
                p={4}
                borderRadius="md"
              >
                <Heading size="sm" color="red.800" mb={2}>
                  Failed to load posts
                </Heading>
                <Text color="red.700" fontSize="sm">
                  {error}
                </Text>
              </Box>
            )}

            {/* Posts List */}
            {posts.length === 0 ? (
              <Center py={12}>
                <Stack align="center" gap={3}>
                  <Text fontSize="lg" fontWeight="600" color="fg">
                    No posts yet
                  </Text>
                  <Text color="fg.subtle">
                    Be the first to share with your community!
                  </Text>
                </Stack>
              </Center>
            ) : (
              <Stack gap={6}>
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={handlePostDeleted}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
