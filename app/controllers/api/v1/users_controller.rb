class Api::V1::UsersController < Api::BaseController
  def index
    users = User.all.limit(10)
    render json: users.as_json(only: [:id, :username, :email, :zipcode, :anonymous, :created_at])
  end

  def show
    user = User.find(params[:id])
    render json: user.as_json(only: [:id, :username, :email, :zipcode, :anonymous, :created_at])
  end
end
