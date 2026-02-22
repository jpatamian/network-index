import { Box, Container, Stack, Grid, GridItem } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import { CreatePost } from "@/features/posts/components/CreatePost";
import { LoadingState } from "@/features/posts/components/LoadingState";
import { PostsList } from "@/features/posts/components/PostsList";
import { PostsHero } from "@/features/posts/components/PostsHero";
import { SearchAndFilter } from "@/features/posts/components/SearchAndFilter";
import { getPostsPageMeta } from "@/features/posts/lib/postsPageMeta";
import { usePostsFeed } from "@/features/posts/lib/usePostsFeed";
import { usePostsSearchFilters } from "@/features/posts/lib/usePostsSearchFilters";

export const Posts = () => {
  const { token, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const { params, state, actions } = usePostsSearchFilters();
  const { zipcode, query, postType, radius, viewingMine } = params;

  const { posts, loading, error, handlePostCreated, handlePostDeleted } =
    usePostsFeed({
      viewingMine,
      zipcode,
      query,
      postType,
      radius,
      token,
      isAuthenticated,
      isAuthLoading,
    });

  const { pageTitle, subtitle, clearFilterLabel } = getPostsPageMeta({
    viewingMine,
    zipcode,
  });

  const hasFilter = state.hasSearchFilters || viewingMine;
  const heroMeta = { pageTitle, subtitle, viewingMine, zipcode };
  const heroFilter = {
    hasFilter,
    clearFilterLabel,
    onClearFilter: actions.handleClearFilter,
  };
  const searchState = {
    zipcodeInput: state.zipcodeInput,
    queryInput: state.queryInput,
    postTypeInput: state.postTypeInput,
    radiusInput: state.radiusInput,
    canResetSearch: state.canResetSearch,
  };
  const searchActions = {
    onZipcodeInputChange: actions.setZipcodeInput,
    onQueryInputChange: actions.setQueryInput,
    onPostTypeInputChange: actions.setPostTypeInput,
    onRadiusInputChange: actions.setRadiusInput,
    onSearchSubmit: actions.handleSearchSubmit,
    onSearchReset: actions.handleSearchReset,
  };

  if (loading) {
    return <LoadingState message="Loading posts..." />;
  }

  return (
    <Box bg="bg.subtle" minH="100vh">
      <PostsHero meta={heroMeta} filter={heroFilter} />

      <Box py={{ base: 6, md: 8 }}>
        <Container maxW="7xl">
          <Grid
            templateColumns={{
              base: "1fr",
              lg: !viewingMine ? "350px 1fr" : "1fr",
            }}
            gap={6}
          >
            {/* Sidebar */}
            {!viewingMine && (
              <GridItem>
                <Box
                  position={{ base: "relative", lg: "sticky" }}
                  top={{ lg: "24px" }}
                >
                  <SearchAndFilter
                    state={searchState}
                    actions={searchActions}
                  />
                </Box>
              </GridItem>
            )}

            {/* Main Content */}
            <GridItem>
              <Stack gap={5}>
                <Box>
                  <CreatePost onPostCreated={handlePostCreated} />
                </Box>

                <PostsList
                  posts={posts}
                  error={error}
                  onDelete={handlePostDeleted}
                />
              </Stack>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};
