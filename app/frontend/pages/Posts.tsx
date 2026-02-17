import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { postsApi } from '@/lib/api'
import { Post } from '@/types/post'
import PostCard from '@/components/PostCard'
import CreatePost from '@/components/CreatePost'
import { Link } from 'react-router-dom'

export default function Posts() {
  const { isAuthenticated } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const data = await postsApi.getAll()
      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts])
  }

  const handlePostDeleted = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id))
  }

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">Loading posts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Community Feed</h1>

        {isAuthenticated ? (
          <CreatePost onPostCreated={handlePostCreated} />
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <Link to="/login" className="font-medium underline">
                Sign in
              </Link>{' '}
              or{' '}
              <Link to="/signup" className="font-medium underline">
                create an account
              </Link>{' '}
              to create posts
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet. Be the first to post!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
