class NotificationService
  def self.notify_post_owner_of_comment(post:, comment:, actor:)
    return if post.user_id == actor.id

    Notification.create!(
      user_id: post.user_id,
      actor_user: actor,
      post: post,
      comment: comment,
      notification_type: Notification::TYPES[:comment],
      message: "#{actor.display_name} commented on your post"
    )
  end
end
