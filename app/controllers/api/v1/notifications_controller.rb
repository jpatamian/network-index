class Api::V1::NotificationsController < Api::BaseController
  include Authenticable
  include ResponseSerializable

  skip_before_action :verify_authenticity_token
  before_action :require_authentication!

  # GET /api/v1/notifications
  def index
    notifications = Notification
      .includes(:actor_user, :post, :comment)
      .for_user(current_user.id)
      .order(created_at: :desc)
      .limit(30)

    render json: notifications.map { |notification| notification_response(notification) }
  end
end
