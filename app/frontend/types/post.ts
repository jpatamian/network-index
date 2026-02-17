export interface Post {
  id: number
  title: string
  content: string
  author: {
    id: number
    name: string
    username: string | null
    email: string | null
  }
  created_at: string
  updated_at: string
}

export interface CreatePostData {
  title: string
  content: string
}

export interface UpdatePostData {
  title?: string
  content?: string
}
