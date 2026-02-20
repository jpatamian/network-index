class Api::V1::FlagsController < Api::BaseController
  include Authenticable

  skip_before_action :verify_authenticity_token
  before_action :require_authentication!
  before_action :set_post, only: [:create]
  before_action :set_comment, only: [:create], if: -> { params[:comment_id].present? }

  # GET /api/v1/flags
  def index
    unless current_user.is_moderator?
      render json: { error: 'Unauthorized' }, status: :forbidden
      return
    end

    status = params[:status].presence || 'pending'
    flags = Flag.includes(:flagger_user, flaggable: :post)
      .where(status: status)
      .order(created_at: :desc)
      .limit(50)

    render json: flags.map { |flag| flag_response(flag) }
  end

  # POST /api/v1/posts/:post_id/flags
  # POST /api/v1/posts/:post_id/comments/:comment_id/flags
  def create
    flaggable = @comment || @post

    if flaggable.user_id == current_user.id
      render json: { error: 'Cannot report your own content' }, status: :forbidden
      return
    end

    if Flag.exists?(flagger_user_id: current_user.id, flaggable: flaggable)
      render json: { error: 'You already reported this content' }, status: :unprocessable_entity
      return
    end

    flag = Flag.new(flag_params)
    flag.flaggable = flaggable
    flag.flagger_user = current_user
    flag.status = 'pending'
    flag.is_auto_flagged = false

    if flag.save
      update_flag_state!(flaggable)
      render json: { message: 'Flag submitted successfully' }, status: :created
    else
      render json: {
        error: 'Failed to submit flag',
        details: flag.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end

  def set_comment
    @comment = @post.comments.find(params[:comment_id])
  end

  def flag_params
    params.require(:flag).permit(:reason, :description)
  end

  def update_flag_state!(flaggable)
    flag_count = flaggable.flags.count
    flaggable.update!(
      flag_count: flag_count,
      is_flagged: flag_count.positive?,
      is_hidden: flag_count >= 3
    )
  end

  def flag_response(flag)
    base = {
      id: flag.id,
      reason: flag.reason,
      description: flag.description,
      status: flag.status,
      is_auto_flagged: flag.is_auto_flagged,
      created_at: flag.created_at,
      flaggable_type: flag.flaggable_type,
      flaggable_id: flag.flaggable_id,
      flagger: {
        id: flag.flagger_user&.id,
        name: flag.flagger_user&.username || flag.flagger_user&.email || 'Anonymous User'
      }
    }

    if flag.flaggable.is_a?(Post)
      base[:flaggable] = {
        title: flag.flaggable.title,
        content: flag.flaggable.content
      }
    elsif flag.flaggable.is_a?(Comment)
      base[:flaggable] = {
        message: flag.flaggable.message,
        post_id: flag.flaggable.post_id
      }
    end

    base
  end
end
