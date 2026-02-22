class Api::V1::PostsController < Api::BaseController
  include Authenticable
  include ResponseSerializable

  skip_before_action :verify_authenticity_token
  skip_before_action :authorize_request, only: [ :index, :show, :create ]
  before_action :require_authentication!, only: [ :update, :destroy, :my_posts ]
  before_action :set_post, only: [ :show, :update, :destroy ]
  before_action :authorize_post_action!, only: [ :update, :destroy ]

  # GET /api/v1/posts
  def index
    check_authentication_if_token_present
    posts = Post.includes(:user, :comments).recent.where.not(user_id: nil)
    posts = posts.by_zipcode(params[:zipcode]) if params[:zipcode].present?
    # Note: radius filtering is validated on the frontend for now
    # Full server-side radius filtering would require geocoding integration
    posts = posts.by_post_type(params[:post_type].to_s.downcase) if params[:post_type].present?
    posts = posts.search_query(params[:q]) if params[:q].present?
    posts = posts.limit(50)
    render json: posts.map { |post| post_response(post, current_user) }
  rescue StandardError => e
    Rails.logger.error "Error in PostsController#index: #{e.class} - #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { error: "Failed to load posts", details: e.message }, status: :internal_server_error
  end

  # GET /api/v1/posts/:id
  def show
    check_authentication_if_token_present
    render json: post_response(@post, current_user)
  end

  # GET /api/v1/posts/my_posts
  def my_posts
    posts = current_user.posts.includes(:user, :comments).recent.limit(50)
    render json: posts.map { |post| post_response(post, current_user) }
  end

  # POST /api/v1/posts
  def create
    check_authentication_if_token_present

    user = current_user || AnonymousUserCreator.create(zipcode: params[:post][:zipcode])

    unless user
      return render json: { error: "Zipcode is required for anonymous posts" }, status: :unprocessable_entity
    end

    post = user.posts.build(post_params.except(:zipcode))

    if post.save
      render json: post_response(post, current_user), status: :created
    else
      render_errors(post, message: "Failed to create post")
    end
  end

  # PATCH/PUT /api/v1/posts/:id
  def update
    if @post.update(post_params)
      render json: post_response(@post, current_user)
    else
      render_errors(@post, message: "Failed to update post")
    end
  end

  # DELETE /api/v1/posts/:id
  def destroy
    @post.destroy
    render json: { message: "Post deleted successfully" }, status: :ok
  end

  private

  def check_authentication_if_token_present
    header = request.headers["Authorization"]
    return unless header

    token = header.split(" ").last
    return if token.blank?

    decoded = JsonWebToken.decode(token)
    @current_user = User.find(decoded[:user_id]) if decoded
  rescue ActiveRecord::RecordNotFound, JWT::DecodeError, JWT::ExpiredSignature, JWT::ImmatureSignature, JWT::VerificationError
    @current_user = nil
  end

  def set_post
    @post = Post.find(params[:id])
  end

  def authorize_post_action!
    # Allow post owner or moderators to update/delete
    unless @post.user_id == current_user.id || current_user.is_moderator?
      render_forbidden
    end
  end

  def post_params
    params.require(:post).permit(:title, :content, :post_type, :zipcode, metadata: {})
  end
end
