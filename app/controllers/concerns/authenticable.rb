module Authenticable
  extend ActiveSupport::Concern

  included do
    before_action :authorize_request
  end

  private

  def authorize_request
    header = request.headers["Authorization"]
    header = header.split(" ").last if header

    begin
      @decoded = JsonWebToken.decode(header)
      @current_user = User.find(@decoded[:user_id]) if @decoded
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError, JWT::ExpiredSignature, JWT::ImmatureSignature, JWT::VerificationError
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end

  def require_authentication!
    render json: { error: "Unauthorized" }, status: :unauthorized unless current_user
  end
end
