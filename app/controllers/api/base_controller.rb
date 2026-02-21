class Api::BaseController < ActionController::API
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection

  protect_from_forgery with: :exception, unless: -> { request.format.json? }

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
  rescue_from JWT::DecodeError, JWT::ExpiredSignature, JWT::ImmatureSignature, JWT::VerificationError, with: :invalid_token
  rescue_from GoogleAuthService::ValidationError, with: :invalid_google_credential
  rescue_from GoogleAuthService::ConfigurationError, with: :google_not_configured

  private

  def not_found
    render json: { error: 'Not found' }, status: :not_found
  end

  def unprocessable_entity(exception)
    render json: {
      error: 'Unprocessable entity',
      details: exception.record.errors.full_messages
    }, status: :unprocessable_entity
  end

  def invalid_token
    render json: { error: 'Invalid or expired token' }, status: :unauthorized
  end

  def invalid_google_credential
    render json: { error: 'Invalid Google credential' }, status: :unauthorized
  end

  def google_not_configured(exception)
    render json: {
      error: 'Google OAuth is not configured',
      details: exception.message
    }, status: :internal_server_error
  end

  def render_errors(resource, message:)
    render json: {
      error: message,
      details: resource.errors.full_messages
    }, status: :unprocessable_entity
  end

  def render_forbidden(message = 'Unauthorized')
    render json: { error: message }, status: :forbidden
  end
end
