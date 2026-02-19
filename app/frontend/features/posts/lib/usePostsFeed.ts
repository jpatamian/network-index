import { useEffect, useState } from "react";
import { postsApi } from "@/lib/api";
import { Post } from "@/types/post";
import { postsErrorMessages, toErrorMessage } from "@/features/posts/lib/utils";

interface UsePostsFeedParams {
  viewingMine: boolean;
  zipcode: string | null;
  query: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

export function usePostsFeed({
  viewingMine,
  zipcode,
  query,
  token,
  isAuthenticated,
  isAuthLoading,
}: UsePostsFeedParams) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      if (viewingMine && isAuthLoading) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = viewingMine
          ? await fetchMinePosts(isAuthenticated, token)
          : await postsApi.getAll({ zipcode, query });

        if (isMounted) {
          setPosts(data);
        }
      } catch (err) {
        if (isMounted) {
          setPosts([]);
          setError(toErrorMessage(err, postsErrorMessages.loadPostsFailed));
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
  }, [zipcode, query, viewingMine, token, isAuthenticated, isAuthLoading]);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (id: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return {
    posts,
    loading,
    error,
    handlePostCreated,
    handlePostDeleted,
  };
}

async function fetchMinePosts(isAuthenticated: boolean, token: string | null) {
  if (!isAuthenticated || !token) {
    throw new Error(postsErrorMessages.signInToViewMine);
  }

  return postsApi.getMine(token);
}
