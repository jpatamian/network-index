class Api::V1::CommentsController < Api::BaseController
  include Authenticable
  include ResponseSerializable

  skip_before_action :verify_authenticity_token
  skip_before_action :authorize_request, only: [ :index ]
  before_action :require_authentication!, only: [ :create, :destroy ]
  before_action :set_post
  before_action :set_comment, only: [ :destroy ]
  before_action :authorize_comment_owner!, only: [ :destroy ]

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
      NotificationService.notify_post_owner_of_comment(post: @post, comment: comment, actor: current_user)
      render json: comment_response(comment), status: :created
    else
      render_errors(comment, message: "Failed to create comment")
    end
  end

  # DELETE /api/v1/posts/:post_id/comments/:id
  def destroy
    @comment.destroy
    render json: { message: "Comment deleted successfully" }, status: :ok
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end

  def set_comment
    @comment = @post.comments.find(params[:id])
  end

  def authorize_comment_owner!
    render_forbidden unless @comment.user_id == current_user.id
  end

  def comment_params
    params.require(:comment).permit(:message)
  end
end
