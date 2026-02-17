class Api::V1::CommentsController < Api::BaseController
  skip_before_action :verify_authenticity_token
  before_action :require_authentication!, only: [:create, :destroy]
  before_action :set_post
  before_action :set_comment, only: [:destroy]
  before_action :authorize_comment_owner!, only: [:destroy]

  # GET /api/v1/posts/:post_id/comments
  def index
    comments = @post.comments.includes(:user).order(created_at: :asc)
    render json: comments.map { |comment| comment_response(comment) }
  end

  # POST /api/v1/posts/:post_id/comments
  def create
    comment = @post.comments.build(comment_params)
    comment.user = current_user

    if comment.save
      render json: comment_response(comment), status: :created
    else
      render json: {
        error: 'Failed to create comment',
        details: comment.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/posts/:post_id/comments/:id
  def destroy
    @comment.destroy
    head :no_content
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end

  def set_comment
    @comment = @post.comments.find(params[:id])
  end

  def authorize_comment_owner!
    unless @comment.user_id == current_user.id
      render json: { error: 'Unauthorized' }, status: :forbidden
    end
  end

  def current_user
    return @current_user if defined?(@current_user)

    header = request.headers['Authorization']
    token = header.split(' ').last if header
    decoded = JsonWebToken.decode(token)

    @current_user = User.find_by(id: decoded[:user_id]) if decoded
  end

  def require_authentication!
    render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user
  end

  def comment_params
    params.require(:comment).permit(:message)
  end

  def comment_response(comment)
    {
      id: comment.id,
      message: comment.message,
      author: {
        id: comment.user.id,
        name: comment.user.username || comment.user.email || 'Anonymous User',
        username: comment.user.username
      },
      created_at: comment.created_at
    }
  end
end
