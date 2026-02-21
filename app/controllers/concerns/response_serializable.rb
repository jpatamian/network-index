module ResponseSerializable
  extend ActiveSupport::Concern

  private

  def user_response(user)
    {
      id: user.id,
      email: user.email,
      phone: user.phone,
      username: user.username,
      zipcode: user.zipcode,
      anonymous: user.anonymous,
      is_moderator: user.is_moderator,
      created_at: user.created_at
    }
  end

  def post_response(post, current_user = nil)
    {
      id: post.id,
      title: post.title,
      content: post.content,
      post_type: post.post_type,
      metadata: post.metadata,
      likes_count: post.likes_count || 0,
      liked_by_current_user: current_user ? post.post_likes.exists?(user_id: current_user.id) : false,
      author: {
        id: post.user.id,
        name: post.author_name,
        username: post.user.username,
        email: post.user.email
      },
      comment_count: post.comments.size,
      created_at: post.created_at,
      updated_at: post.updated_at
    }
  end

  def comment_response(comment)
    {
      id: comment.id,
      message: comment.message,
      author: {
        id: comment.user.id,
        name: comment.user.username || comment.user.email || "Anonymous User",
        username: comment.user.username
      },
      created_at: comment.created_at
    }
  end
end
