const API_BASE_URL = '/api/v1'

interface ApiOptions extends RequestInit {
  token?: string | null
}

export async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const { token, ...fetchOptions } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
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
