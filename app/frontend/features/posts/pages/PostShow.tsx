import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { postsApi } from "@/lib/api";
import { toaster } from "@/components/ui/toaster";
import { Post } from "@/types/post";
import { formatDate } from "@/lib/date";
import { CommentSection } from "@/features/posts/components/CommentSection";
import { FlagButton } from "@/features/posts/components/FlagButton";

const detailDateFormat: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
};

const POST_TYPE_LABELS: Record<Post["post_type"], string> = {
  other: "general",
  childcare: "childcare",
  ride_share: "ride share",
  food: "food",
};

export const PostShow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    postsApi
      .getById(parseInt(id))
      .then(setPost)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load post")
      )
      .finally(() => setLoading(false));
  }, [id]);

  const canDelete =
    isAuthenticated && post && (user?.id === post.author.id || user?.is_moderator);

  const handleDelete = async () => {
    if (!token || !post) return;
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await postsApi.delete(post.id, token);
      toaster.success({ title: "Post deleted" });
      navigate("/posts");
    } catch (err) {
      toaster.error({
        title: "Failed to delete post",
        description: err instanceof Error ? err.message : "Please try again",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="wire-post-detail">
        <div className="wire-loading">loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="wire-post-detail">
        <div className="wire-error">
          {error || "Post not found or has been removed."}
        </div>
        <p style={{ marginTop: "10px" }}>
          <Link to="/posts">← back to posts</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="wire-post-detail">
      {/* Breadcrumb / back */}
      <div className="wire-breadcrumb">
        <Link to="/">local wire</Link>
        {" > "}
        <Link to="/posts">community</Link>
        {" > "}
        {POST_TYPE_LABELS[post.post_type]}
        {" > "}
        <span style={{ color: "#333" }}>{post.title}</span>
      </div>

      {/* Post header */}
      <div className="wire-post-detail-header">
        <h1 className="wire-post-detail-title">{post.title}</h1>
        <div className="wire-post-detail-meta">
          <span>posted: {formatDate(post.created_at, detailDateFormat)}</span>
          <span>·</span>
          <span className="wire-post-tag">{POST_TYPE_LABELS[post.post_type]}</span>
          <span>·</span>
          <span>by {post.author.name}</span>
          {!isAuthenticated || user?.id !== post.author.id ? (
            isAuthenticated && (
              <FlagButton
                target="post"
                postId={post.id}
                ariaLabel="flag this post"
              />
            )
          ) : null}
        </div>
      </div>

      {/* Post body */}
      <div className="wire-post-detail-body">{post.content}</div>

      {/* Actions */}
      <div className="wire-post-detail-actions">
        <Link to="/posts">← back to results</Link>
        {canDelete && (
          <button
            className="wire-btn wire-btn-danger wire-btn-sm"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "deleting..." : "delete post"}
          </button>
        )}
      </div>

      {/* Comments */}
      <CommentSection postId={post.id} commentCount={post.comment_count} />
    </div>
  );
};
