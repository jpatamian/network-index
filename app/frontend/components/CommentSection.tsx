import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { commentsApi } from '@/lib/api'
import { Comment } from '@/types/post'

interface CommentSectionProps {
  postId: number
  commentCount: number
}

export default function CommentSection({ postId, commentCount }: CommentSectionProps) {
  const { user, token, isAuthenticated } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [count, setCount] = useState(commentCount)

  const loadComments = async () => {
    setLoading(true)
    try {
      const data = await commentsApi.getByPost(postId)
      setComments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  const handleExpand = () => {
    if (!isExpanded) {
      loadComments()
    }
    setIsExpanded(!isExpanded)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !message.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const newComment = await commentsApi.create(postId, message.trim(), token)
      setComments([...comments, newComment])
      setCount(count + 1)
      setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: number) => {
    if (!token) return

    try {
      await commentsApi.delete(postId, commentId, token)
      setComments(comments.filter((c) => c.id !== commentId))
      setCount(count - 1)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete comment')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="border-t border-gray-200 mt-4 pt-3">
      <button
        onClick={handleExpand}
        className="text-sm text-gray-500 hover:text-indigo-600 font-medium"
      >
        {isExpanded ? 'Hide Comments' : `Comments (${count})`}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {loading && <p className="text-sm text-gray-400">Loading comments...</p>}

          {error && (
            <div className="rounded-md bg-red-50 p-2">
              <p className="text-xs text-red-800">{error}</p>
            </div>
          )}

          {!loading && comments.length === 0 && (
            <p className="text-sm text-gray-400">No comments yet.</p>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="flex justify-between items-start bg-gray-50 rounded-md p-3">
              <div>
                <p className="text-sm text-gray-800">{comment.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {comment.author.name} &middot; {formatDate(comment.created_at)}
                </p>
              </div>
              {user?.id === comment.author.id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-red-500 hover:text-red-700 ml-2 shrink-0"
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {submitting ? '...' : 'Post'}
              </button>
            </form>
          ) : (
            <p className="text-xs text-gray-400">
              Sign in to leave a comment.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
