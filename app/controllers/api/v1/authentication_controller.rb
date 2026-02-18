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

  def signup_params
    params.require(:user).permit(:email, :phone, :username, :zipcode, :password, :password_confirmation)
  end

  def login_params
    params.require(:user).permit(:email, :password)
  end
end
