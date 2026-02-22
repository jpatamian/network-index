import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { commentsApi } from "@/lib/api";
import { Comment } from "@/types/post";
import { formatDate } from "@/lib/date";
import { FlagButton } from "./FlagButton";
import {
  commentDateFormat,
  postsErrorMessages,
  toErrorMessage,
} from "@/features/posts/lib/utils";

interface CommentSectionProps {
  postId: number;
  commentCount: number;
}

export const CommentSection = ({ postId, commentCount }: CommentSectionProps) => {
  const { user, token, isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(commentCount);

  const loadComments = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await commentsApi.getByPost(postId);
      setComments(data);
    } catch (err) {
      setError(toErrorMessage(err, postsErrorMessages.loadCommentsFailed));
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = () => {
    setIsExpanded((prev) => {
      if (!prev) loadComments();
      return !prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!token || !trimmed) return;
    setSubmitting(true);
    setError("");
    try {
      const newComment = await commentsApi.create(postId, trimmed, token);
      setComments((prev) => [...prev, newComment]);
      setCount((prev) => prev + 1);
      setMessage("");
    } catch (err) {
      setError(toErrorMessage(err, postsErrorMessages.addCommentFailed));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!token) return;
    try {
      await commentsApi.delete(postId, commentId, token);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setCount((prev) => prev - 1);
    } catch (err) {
      alert(toErrorMessage(err, postsErrorMessages.deleteCommentFailed));
    }
  };

  return (
    <div className="wire-comments">
      <div className="wire-comments-title" onClick={handleExpand}>
        {isExpanded ? "▼" : "▶"} comments ({count})
      </div>

      {isExpanded && (
        <>
          {error && <div className="wire-error">{error}</div>}
          {loading && <div className="wire-loading">loading comments...</div>}

          {!loading && comments.length === 0 && (
            <div className="wire-empty">no comments yet.</div>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="wire-comment">
              <div className="wire-comment-meta">
                <span className="wire-comment-author">{comment.author.name}</span>
                <span>{formatDate(comment.created_at, commentDateFormat)}</span>
                {isAuthenticated && user?.id !== comment.author.id && (
                  <FlagButton
                    target="comment"
                    postId={postId}
                    commentId={comment.id}
                    ariaLabel="flag comment"
                  />
                )}
                {user?.id === comment.author.id && (
                  <button
                    className="wire-btn-link"
                    style={{ color: "#c33", fontSize: "11px" }}
                    onClick={() => handleDelete(comment.id)}
                  >
                    delete
                  </button>
                )}
              </div>
              <div className="wire-comment-body">{comment.message}</div>
            </div>
          ))}

          {isAuthenticated ? (
            <form className="wire-comment-form" onSubmit={handleSubmit}>
              <input
                className="wire-comment-input"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="add a comment..."
                required
              />
              <button
                type="submit"
                className="wire-btn wire-btn-sm"
                disabled={submitting || !message.trim()}
              >
                {submitting ? "posting..." : "post"}
              </button>
            </form>
          ) : (
            <div className="wire-empty">
              <a href="/login">log in</a> to leave a comment
            </div>
          )}
        </>
      )}
    </div>
  );
};
