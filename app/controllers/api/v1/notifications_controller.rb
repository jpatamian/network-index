class Api::V1::NotificationsController < Api::BaseController
  include Authenticable

  skip_before_action :verify_authenticity_token
  before_action :require_authentication!

  # GET /api/v1/notifications
  def index
    notifications = Notification
      .includes(:actor_user, :post, :comment)
      .where(user_id: current_user.id)
      .order(created_at: :desc)
      .limit(30)

    render json: notifications.map { |notification| notification_response(notification) }
  end

  private

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
        name: notification.actor_user&.username || notification.actor_user&.email || "Someone"
      }
    }
  end
end
