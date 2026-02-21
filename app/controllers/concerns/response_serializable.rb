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

  def post_response(post)
    {
      id: post.id,
      title: post.title,
      content: post.content,
      post_type: post.post_type,
      metadata: post.metadata,
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
        name: comment.user.display_name,
        username: comment.user.username
      },
      created_at: comment.created_at
    }
  end

  def flag_response(flag)
    base = {
      id: flag.id,
      reason: flag.reason,
      description: flag.description,
      status: flag.status,
      is_auto_flagged: flag.is_auto_flagged,
      created_at: flag.created_at,
      flaggable_type: flag.flaggable_type,
      flaggable_id: flag.flaggable_id,
      flagger: {
        id: flag.flagger_user&.id,
        name: flag.flagger_user&.display_name || 'Anonymous User'
      }
    }

    if flag.flaggable.is_a?(Post)
      base[:flaggable] = {
        title: flag.flaggable.title,
        content: flag.flaggable.content
      }
    elsif flag.flaggable.is_a?(Comment)
      base[:flaggable] = {
        message: flag.flaggable.message,
        post_id: flag.flaggable.post_id
      }
    end

    base
  end

  def notification_response(notification)
    {
      id: notification.id,
      message: notification.message,
      notification_type: notification.notification_type,
      created_at: notification.created_at,
      read_at: notification.read_at,
      post_id: notification.post_id,
      comment_id: notification.comment_id,
      post_title: notification.post&.title,
      actor: {
        id: notification.actor_user&.id,
        name: notification.actor_user&.display_name || 'Anonymous User'
      }
    }
  end
end
