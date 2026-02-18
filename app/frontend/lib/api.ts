const API_BASE_URL = '/api/v1'

interface ApiOptions extends RequestInit {
  token?: string | null
}

export async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const { token, ...fetchOptions } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(typeof fetchOptions.headers === 'object' && !Array.isArray(fetchOptions.headers) ? fetchOptions.headers : {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || error.details?.join(', ') || 'Request failed')
  }

  return response.json()
}

export const authApi = {
  signup: (userData: {
    email?: string
    phone?: string
    username?: string
    zipcode: string
    password: string
    password_confirmation: string
  }) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ user: userData }),
    })
  },

  login: (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ user: { email, password } }),
    })
  },

  getCurrentUser: (token: string) => {
    return apiRequest('/auth/me', {
      token,
    })
  },
}

type PostsQuery = {
  zipcode?: string | null
  query?: string | null
}

export const postsApi = {
  getAll: (filters: PostsQuery = {}) => {
    const params = new URLSearchParams()

    if (filters.zipcode) {
      params.set('zipcode', filters.zipcode)
    }

    if (filters.query) {
      params.set('q', filters.query)
    }

    const queryString = params.toString()
    const url = queryString ? `/posts?${queryString}` : '/posts'
    return apiRequest(url)
  },

  getMine: (token: string) => {
    return apiRequest('/posts/my_posts', {
      token,
    })
  },

  getById: (id: number) => {
    return apiRequest(`/posts/${id}`)
  },

  getByUser: (userId: number) => {
    return apiRequest(`/users/${userId}/posts`)
  },

  create: (postData: { title: string; content: string; zipcode?: string }, token?: string | null) => {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify({ post: postData }),
      token,
    })
  },

  update: (id: number, postData: { title?: string; content?: string }, token: string) => {
    return apiRequest(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ post: postData }),
      token,
    })
  },

  delete: (id: number, token: string) => {
    return apiRequest(`/posts/${id}`, {
      method: 'DELETE',
      token,
    })
  },
}

export const commentsApi = {
  getByPost: (postId: number) => {
    return apiRequest(`/posts/${postId}/comments`)
  },

  create: (postId: number, message: string, token: string) => {
    return apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment: { message } }),
      token,
    })
  },

  delete: (postId: number, commentId: number, token: string) => {
    return apiRequest(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      token,
    })
  },
}

export const usersApi = {
  update: (userId: number, userData: { username?: string; email?: string; zipcode?: string }, token: string) => {
    return apiRequest(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ user: userData }),
      token,
    })
  },
}
