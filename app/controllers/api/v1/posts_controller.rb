class Api::V1::PostsController < Api::BaseController
  include Authenticable
  include ResponseSerializable

  skip_before_action :verify_authenticity_token
  skip_before_action :authorize_request, only: [:index, :show, :create]
  before_action :require_authentication!, only: [:update, :destroy, :my_posts]
  before_action :set_post, only: [:show, :update, :destroy]
  before_action :authorize_post_owner!, only: [:update, :destroy]

  # GET /api/v1/posts
  def index
    check_authentication_if_token_present
    posts = Post.includes(:user, :comments).recent
    
    # Filter by zipcode if provided
    posts = posts.by_zipcode(params[:zipcode]) if params[:zipcode].present?

    # Filter by post type if provided
    if params[:post_type].present?
      normalized_post_type = params[:post_type].to_s.downcase
      posts = posts.by_post_type(normalized_post_type)
    end

    # Free-text search across title/content
    posts = posts.search_query(params[:q]) if params[:q].present?
    
    posts = posts.limit(50)
    render json: posts.map { |post| post_response(post, current_user) }
  end

  # GET /api/v1/posts/:id
  def show
    check_authentication_if_token_present
    render json: post_response(@post, current_user)
  end

  def my_posts
    posts = current_user.posts.includes(:user, :comments).recent.limit(50)
    render json: posts.map { |post| post_response(post, current_user) }
  end

  # POST /api/v1/posts
  def create
    # Manually check for authentication since we skip authorize_request
    check_authentication_if_token_present
    
    user = current_user || create_anonymous_user

    unless user
      render json: { error: 'Zipcode is required for anonymous posts' }, status: :unprocessable_entity
      return
    end

    post = user.posts.build(post_params)

    if post.save
      render json: post_response(post, current_user), status: :created
    else
      render json: {
        error: 'Failed to create post',
        details: post.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/posts/:id
  def update
    if @post.update(post_params)
      render json: post_response(@post, current_user)
    else
      render json: {
        error: 'Failed to update post',
        details: @post.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/posts/:id
  def destroy
    @post.destroy
    render json: { message: 'Post deleted successfully' }, status: :ok
  end

  private

  def check_authentication_if_token_present
    header = request.headers['Authorization']
    return unless header
    
    token = header.split(' ').last
    return if token.blank?

    begin
      decoded = JsonWebToken.decode(token)
      @current_user = User.find(decoded[:user_id]) if decoded
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError, JWT::ExpiredSignature, JWT::ImmatureSignature, JWT::VerificationError
      # Invalid token, treat as anonymous
      @current_user = nil
    end
  end

  def set_post
    @post = Post.find(params[:id])
  end

  def authorize_post_owner!
    unless @post.user_id == current_user.id
      render json: { error: 'Unauthorized' }, status: :forbidden
    end
  end

  def create_anonymous_user
    zipcode = params.dig(:post, :zipcode)
    return nil if zipcode.blank?

    User.create(zipcode: zipcode, anonymous: true)
  end

  def post_params
    params.require(:post).permit(:title, :content, :post_type, metadata: {})
  end
end
