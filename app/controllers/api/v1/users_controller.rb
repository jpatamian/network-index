class Api::V1::UsersController < Api::BaseController
  skip_before_action :verify_authenticity_token
  before_action :authorize_user!, only: [:update]

  def index
    users = User.all.limit(10)
    render json: users.as_json(only: [:id, :username, :email, :zipcode, :anonymous, :created_at])
  end

  def show
    user = User.find(params[:id])
    render json: user.as_json(only: [:id, :username, :email, :zipcode, :anonymous, :created_at])
  end

  def update
    user = User.find(params[:id])
    
    if user.update(user_params)
      render json: {
        user: user_response(user)
      }, status: :ok
    else
      render json: {
        error: 'Failed to update profile',
        details: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def authorize_user!
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    decoded = JsonWebToken.decode(token)
    
    unless decoded && decoded[:user_id].to_i == params[:id].to_i
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  rescue
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end

  def user_params
    params.require(:user).permit(:username, :email, :zipcode)
  end

  def user_response(user)
    {
      id: user.id,
      email: user.email,
      phone: user.phone,
      username: user.username,
      zipcode: user.zipcode,
      anonymous: user.anonymous,
      created_at: user.created_at
    }
  end
end
