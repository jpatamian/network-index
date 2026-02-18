class Api::V1::PostsController < Api::BaseController
  include Authenticable

  skip_before_action :verify_authenticity_token
  skip_before_action :authorize_request, only: [:index, :show, :create]
  before_action :require_authentication!, only: [:update, :destroy, :my_posts]
  before_action :set_post, only: [:show, :update, :destroy]
  before_action :authorize_post_owner!, only: [:update, :destroy]

  # GET /api/v1/posts
  def index
    posts = Post.includes(:user, :comments).recent
    
    # Filter by zipcode if provided
    posts = posts.by_zipcode(params[:zipcode]) if params[:zipcode].present?

    # Free-text search across title/content
    posts = posts.search_query(params[:q]) if params[:q].present?
    
    posts = posts.limit(50)
    render json: posts.map { |post| post_response(post) }
  end

  # GET /api/v1/posts/:id
  def show
    render json: post_response(@post)
  end

  def my_posts
    posts = current_user.posts.includes(:user, :comments).recent.limit(50)
    render json: posts.map { |post| post_response(post) }
  end

  # POST /api/v1/posts
  def create
    user = current_user || create_anonymous_user

    unless user
      render json: { error: 'Zipcode is required for anonymous posts' }, status: :unprocessable_entity
      return
    end

    post = user.posts.build(post_params)

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

  def create_anonymous_user
    zipcode = params.dig(:post, :zipcode)
    return nil if zipcode.blank?

    User.create(zipcode: zipcode, anonymous: true)
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
      comment_count: post.comments.size,
      created_at: post.created_at,
      updated_at: post.updated_at
    }
  end
end
