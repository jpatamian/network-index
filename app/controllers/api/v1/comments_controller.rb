class Api::V1::CommentsController < Api::BaseController
  include Authenticable
  include ResponseSerializable

  skip_before_action :verify_authenticity_token
  skip_before_action :authorize_request, only: [:index]
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
      if @post.user_id != current_user.id
        actor_name = current_user.username || current_user.email || 'Someone'
        Notification.create(
          user_id: @post.user_id,
          actor_user: current_user,
          post: @post,
          comment: comment,
          notification_type: 'comment',
          message: "#{actor_name} commented on your post"
        )
      end
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
    render json: { message: 'Comment deleted successfully' }, status: :ok
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

  def comment_params
    params.require(:comment).permit(:message)
  end
end
