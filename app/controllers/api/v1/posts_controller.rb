class Api::V1::PostsController < Api::BaseController
  skip_before_action :verify_authenticity_token
  before_action :require_authentication!, only: [:create, :update, :destroy]
  before_action :set_post, only: [:show, :update, :destroy]
  before_action :authorize_post_owner!, only: [:update, :destroy]

  # GET /api/v1/posts
  def index
    posts = Post.includes(:user).recent.limit(50)
    render json: posts.map { |post| post_response(post) }
  end

  # GET /api/v1/posts/:id
  def show
    render json: post_response(@post)
  end

  # POST /api/v1/posts
  def create
    post = current_user.posts.build(post_params)

    if post.save
      render json: post_response(post), status: :created
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
      render json: post_response(@post)
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
    head :no_content
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def authorize_post_owner!
    unless @post.user_id == current_user.id
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

  def post_params
    params.require(:post).permit(:title, :content)
  end

  def post_response(post)
    {
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.user.id,
        name: post.author_name,
        username: post.user.username,
        email: post.user.email
      },
      created_at: post.created_at,
      updated_at: post.updated_at
    }
  end
end
