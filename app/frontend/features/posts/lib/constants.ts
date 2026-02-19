export const postsErrorMessages = {
  createPostFailed: "Failed to create post",
  deletePostFailed: "Failed to delete post",
  loadPostsFailed: "Failed to load posts",
  loadCommentsFailed: "Failed to load comments",
  addCommentFailed: "Failed to add comment",
  deleteCommentFailed: "Failed to delete comment",
  signInToViewMine: "Sign in to view your posts.",
  anonymousZipRequired: "Zipcode is required for anonymous posts",
};

export const postsText = {
  deletePostConfirm: "Are you sure you want to delete this post?",
  createPostTitlePlaceholder: "Post title",
  createPostContentPlaceholder:
    "What's on your mind? Share what you need or offer...",
  anonymousZipPlaceholder: "Your zipcode *",
  searchZipPlaceholder: "Enter zipcode",
  searchQueryPlaceholder: 'Try "rides to market"',
  commentInputPlaceholder: "Share your thoughts...",
};

export const postCardDateFormat: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

export const commentDateFormat: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};
