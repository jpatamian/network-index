interface PostsPageMetaParams {
  viewingMine: boolean;
  zipcode: string | null;
}

interface PostsPageMeta {
  pageTitle: string;
  subtitle: string;
  clearFilterLabel: string;
}

export function getPostsPageMeta({
  viewingMine,
  zipcode,
}: PostsPageMetaParams): PostsPageMeta {
  return {
    pageTitle: viewingMine ? "My Posts" : "Community Feed",
    subtitle: viewingMine
      ? "Posts you have shared with neighbors. Keep the community updated."
      : zipcode
        ? `Posts from your neighborhood (${zipcode}). Share what you need, offer what you can.`
        : "Share what you need, offer what you can. Let's build together.",
    clearFilterLabel: viewingMine ? "View all posts" : "Reset filters",
  };
}
