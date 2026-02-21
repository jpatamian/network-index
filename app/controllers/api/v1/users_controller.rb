class Api::V1::UsersController < Api::BaseController
  include Authenticable
  include ResponseSerializable

  skip_before_action :verify_authenticity_token
  skip_before_action :authorize_request, only: [ :index, :show ]
  before_action :require_authentication!, only: [ :update ]
  before_action :authorize_user!, only: [ :update ]

  def index
    users = User.all.limit(10)
    render json: users.as_json(only: [ :id, :username, :email, :zipcode, :anonymous, :created_at ])
  end

  def show
    user = User.find(params[:id])
    render json: user.as_json(only: [ :id, :username, :email, :zipcode, :anonymous, :created_at ])
  end

  def update
    user = User.find(params[:id])

    if user.update(user_params)
      render json: {
        user: user_response(user)
      }, status: :ok
    else
      render json: {
        error: "Failed to update profile",
        details: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def authorize_user!
    unless current_user&.id == params[:id].to_i
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  def user_params
    params.require(:user).permit(:username, :email, :zipcode)
  end
end
