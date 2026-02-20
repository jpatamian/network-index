import { CreatePostData, PostType, UpdatePostData } from "@/types/post";

const API_BASE_URL = "/api/v1";

interface ApiOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const { token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(
      error.error || error.details?.join(", ") || "Request failed",
    );
  }

  // Handle 204 No Content responses (e.g., DELETE requests)
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return null;
  }

  return response.json();
}

export const authApi = {
  signup: (userData: {
    email?: string;
    phone?: string;
    username?: string;
    zipcode?: string;
    password: string;
    password_confirmation: string;
  }) => {
    return apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ user: userData }),
    });
  },

  login: (email: string, password: string) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ user: { email, password } }),
    });
  },

  googleLogin: (credential: string) => {
    return apiRequest("/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential }),
    });
  },

  getCurrentUser: (token: string) => {
    return apiRequest("/auth/me", {
      token,
    });
  },
};

type PostsQuery = {
  zipcode?: string | null;
  query?: string | null;
  postType?: PostType | "all" | null;
};

export const postsApi = {
  getAll: (filters: PostsQuery = {}) => {
    const params = new URLSearchParams();

    if (filters.zipcode) {
      params.set("zipcode", filters.zipcode);
    }

    if (filters.query) {
      params.set("q", filters.query);
    }

    if (filters.postType && filters.postType !== "all") {
      params.set("post_type", filters.postType);
    }

    const queryString = params.toString();
    const url = queryString ? `/posts?${queryString}` : "/posts";
    return apiRequest(url);
  },

  getMine: (token: string) => {
    return apiRequest("/posts/my_posts", {
      token,
    });
  },

  getById: (id: number) => {
    return apiRequest(`/posts/${id}`);
  },

  create: (postData: CreatePostData, token?: string | null) => {
    return apiRequest("/posts", {
      method: "POST",
      body: JSON.stringify({ post: postData }),
      token,
    });
  },

  update: (id: number, postData: UpdatePostData, token: string) => {
    return apiRequest(`/posts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ post: postData }),
      token,
    });
  },

  delete: (id: number, token: string) => {
    return apiRequest(`/posts/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

export const commentsApi = {
  getByPost: (postId: number) => {
    return apiRequest(`/posts/${postId}/comments`);
  },

  create: (postId: number, message: string, token: string) => {
    return apiRequest(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ comment: { message } }),
      token,
    });
  },

  delete: (postId: number, commentId: number, token: string) => {
    return apiRequest(`/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
      token,
    });
  },
};

export const flagsApi = {
  createForPost: (
    postId: number,
    flagData: { reason: string; description?: string },
    token: string,
  ) => {
    return apiRequest(`/posts/${postId}/flags`, {
      method: "POST",
      body: JSON.stringify({ flag: flagData }),
      token,
    });
  },
  createForComment: (
    postId: number,
    commentId: number,
    flagData: { reason: string; description?: string },
    token: string,
  ) => {
    return apiRequest(`/posts/${postId}/comments/${commentId}/flags`, {
      method: "POST",
      body: JSON.stringify({ flag: flagData }),
      token,
    });
  },
  list: (token: string, status: string = "pending") => {
    const params = new URLSearchParams();
    if (status) {
      params.set("status", status);
    }
    const query = params.toString();
    const url = query ? `/flags?${query}` : "/flags";
    return apiRequest(url, { token });
  },
};

export const notificationsApi = {
  list: (token: string) => {
    return apiRequest("/notifications", { token });
  },
};

export const likesApi = {
  like: (postId: number, token: string) => {
    return apiRequest(`/posts/${postId}/likes`, {
      method: "POST",
      token,
    });
  },
  unlike: (postId: number, token: string) => {
    return apiRequest(`/posts/${postId}/likes`, {
      method: "DELETE",
      token,
    });
  },
};

export const usersApi = {
  update: (
    userId: number,
    userData: { username?: string; email?: string; zipcode?: string },
    token: string,
  ) => {
    return apiRequest(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ user: userData }),
      token,
    });
  },
};
