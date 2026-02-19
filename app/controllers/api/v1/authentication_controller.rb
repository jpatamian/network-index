class Api::V1::AuthenticationController < Api::BaseController
  include ResponseSerializable

  skip_before_action :verify_authenticity_token

  # POST /api/v1/auth/signup
  def signup
    user = User.new(signup_params)
    user.anonymous = false

    if user.save
      token = JsonWebToken.encode(user_id: user.id)
      render json: {
        token: token,
        user: user_response(user)
      }, status: :created
    else
      render json: {
        error: 'Signup failed',
        details: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # POST /api/v1/auth/login
  def login
    user = User.find_by(email: login_params[:email])

    if user&.authenticate(login_params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      render json: {
        token: token,
        user: user_response(user)
      }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  # POST /api/v1/auth/google
  def google
    normalized_google_params = google_params
    credential = normalized_google_params[:credential]

    if credential.blank?
      render json: { error: 'Google credential is required' }, status: :unprocessable_entity
      return
    end

    payload = verify_google_credential(credential)
    return if performed?

    email = payload['email']
    email_verified = ActiveModel::Type::Boolean.new.cast(payload['email_verified'])

    unless email.present? && email_verified
      render json: { error: 'Google account email is not verified' }, status: :unprocessable_entity
      return
    end

    user = User.find_by(email: email)

    if user.nil?
      zipcode = normalized_google_params[:zipcode].presence || '00000'

      random_password = SecureRandom.hex(24)
      user = User.new(
        email: email,
        display_name: payload['name'],
        username: nil,
        zipcode: zipcode,
        anonymous: false,
        password: random_password,
        password_confirmation: random_password
      )

      unless user.save
        render json: {
          error: 'Google signup failed',
          details: user.errors.full_messages
        }, status: :unprocessable_entity
        return
      end
    end

    token = JsonWebToken.encode(user_id: user.id)
    render json: {
      token: token,
      user: user_response(user)
    }, status: :ok
  rescue GoogleIDToken::ValidationError
    render json: { error: 'Invalid Google credential' }, status: :unauthorized
  end

  # GET /api/v1/auth/me
  def me
    header = request.headers['Authorization']
    token = header.split(' ').last if header

    decoded = JsonWebToken.decode(token)

    if decoded
      user = User.find_by(id: decoded[:user_id])
      if user
        render json: { user: user_response(user) }, status: :ok
      else
        render json: { error: 'User not found' }, status: :not_found
      end
    else
      render json: { error: 'Invalid token' }, status: :unauthorized
    end
  end

  private

  def verify_google_credential(credential)
    client_id =
      ENV['GOOGLE_CLIENT_ID'].presence ||
      ENV['VITE_GOOGLE_CLIENT_ID'].presence ||
      Rails.application.credentials.dig(:google, :client_id).presence

    if client_id.blank?
      render json: {
        error: 'Google OAuth is not configured',
        details: 'Set GOOGLE_CLIENT_ID (or VITE_GOOGLE_CLIENT_ID) in server environment'
      }, status: :internal_server_error
      return
    end

    GoogleIDToken::Validator.new.check(credential, client_id)
  end

  def signup_params
    params.require(:user).permit(:email, :phone, :username, :zipcode, :password, :password_confirmation)
  end

  def login_params
    params.require(:user).permit(:email, :password)
  end

  def google_params
    permitted = params.permit(:credential, :zipcode, authentication: [:credential, :zipcode])
    nested = permitted[:authentication] || {}

    {
      credential: permitted[:credential].presence || nested[:credential],
      zipcode: permitted[:zipcode].presence || nested[:zipcode]
    }
  end
end
