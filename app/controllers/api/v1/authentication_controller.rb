class Api::V1::AuthenticationController < Api::BaseController
  include ResponseSerializable

  skip_before_action :verify_authenticity_token

  # POST /api/v1/auth/signup
  def signup
    user = User.new(signup_params)
    user.anonymous = false

    if user.save
      render json: { token: JsonWebToken.encode(user_id: user.id), user: user_response(user) }, status: :created
    else
      render_errors(user, message: 'Signup failed')
    end
  end

  # POST /api/v1/auth/login
  def login
    user = User.find_by(email: login_params[:email])

    if user&.authenticate(login_params[:password])
      render json: { token: JsonWebToken.encode(user_id: user.id), user: user_response(user) }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  # POST /api/v1/auth/google
  def google
    normalized = google_params
    credential = normalized[:credential]

    if credential.blank?
      return render json: { error: 'Google credential is required' }, status: :unprocessable_entity
    end

    user = GoogleAuthService.authenticate(credential: credential, zipcode: normalized[:zipcode])
    render json: { token: JsonWebToken.encode(user_id: user.id), user: user_response(user) }, status: :ok
  end

  # GET /api/v1/auth/me
  def me
    header = request.headers['Authorization']
    token = header&.split(' ')&.last

    decoded = JsonWebToken.decode(token)
    user = decoded && User.find_by(id: decoded[:user_id])

    if user
      render json: { user: user_response(user) }, status: :ok
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

  def google_params
    permitted = params.permit(:credential, :zipcode, authentication: [:credential, :zipcode])
    nested = permitted[:authentication] || {}

    {
      credential: permitted[:credential].presence || nested[:credential],
      zipcode: permitted[:zipcode].presence || nested[:zipcode]
    }
  end
end
