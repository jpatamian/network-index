import { Box, Container, Stack } from "@chakra-ui/react";
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
  const { zipcode, query, postType, viewingMine } = params;

  const { posts, loading, error, handlePostCreated, handlePostDeleted } =
    usePostsFeed({
      viewingMine,
      zipcode,
      query,
      postType,
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
    canResetSearch: state.canResetSearch,
  };
  const searchActions = {
    onZipcodeInputChange: actions.setZipcodeInput,
    onQueryInputChange: actions.setQueryInput,
    onPostTypeInputChange: actions.setPostTypeInput,
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
        <Container maxW="2xl">
          <Box py={{ base: 4, md: 6 }}>
            <CreatePost onPostCreated={handlePostCreated} />
          </Box>

          <Stack gap={5}>
            {!viewingMine && (
              <SearchAndFilter state={searchState} actions={searchActions} />
            )}

            <PostsList
              posts={posts}
              error={error}
              onDelete={handlePostDeleted}
            />
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
