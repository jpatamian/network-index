import { Post } from '@/types/post'
import { useAuth } from '@/hooks/useAuth'
import { postsApi } from '@/lib/api'
import { useState } from 'react'

interface PostCardProps {
  post: Post
  onDelete?: (id: number) => void
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const { user, token } = useAuth()
  const [deleting, setDeleting] = useState(false)
  const isAuthor = user?.id === post.author.id

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return
    if (!token) return

    setDeleting(true)
    try {
      await postsApi.delete(post.id, token)
      onDelete?.(post.id)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete post')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            By {post.author.name} • {formatDate(post.created_at)}
          </p>
        </div>
        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
    </div>
  )
}
