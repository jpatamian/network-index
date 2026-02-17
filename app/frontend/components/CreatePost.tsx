import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { postsApi } from '@/lib/api'
import { Post } from '@/types/post'

interface CreatePostProps {
  onPostCreated: (post: Post) => void
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { token } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setError('')
    setLoading(true)

    try {
      const response = await postsApi.create(formData, token)
      onPostCreated(response)
      setFormData({ title: '', content: '' })
      setIsExpanded(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  if (!isExpanded) {
    return (
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full text-left px-4 py-3 border border-gray-300 rounded-md text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition"
        >
          What's on your mind?
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Create a Post</h3>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Post title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              maxLength={200}
            />
          </div>

          <div>
            <textarea
              placeholder="What's on your mind?"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
              required
              maxLength={5000}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false)
              setFormData({ title: '', content: '' })
              setError('')
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
