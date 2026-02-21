class Api::V1::FlagsController < Api::BaseController
  include Authenticable
  include ResponseSerializable

  skip_before_action :verify_authenticity_token
  before_action :require_authentication!
  before_action :set_post, only: [:create]
  before_action :set_comment, only: [:create], if: -> { params[:comment_id].present? }

  # GET /api/v1/flags
  def index
    return render_forbidden unless current_user.is_moderator?

    status = params[:status].presence || Flag::STATUSES[:pending]
    flags = Flag.includes(:flagger_user, flaggable: :post)
      .by_status(status)
      .order(created_at: :desc)
      .limit(50)

    render json: flags.map { |flag| flag_response(flag) }
  end

  # POST /api/v1/posts/:post_id/flags
  # POST /api/v1/posts/:post_id/comments/:comment_id/flags
  def create
    flaggable = @comment || @post

    return render_forbidden('Cannot report your own content') if flaggable.user_id == current_user.id

    if Flag.exists?(flagger_user_id: current_user.id, flaggable: flaggable)
      return render json: { error: 'You already reported this content' }, status: :unprocessable_entity
    end

    flag = Flag.new(flag_params)
    flag.flaggable = flaggable
    flag.flagger_user = current_user
    flag.status = Flag::STATUSES[:pending]
    flag.is_auto_flagged = false

    if flag.save
      Flag.update_flaggable_state!(flaggable)
      render json: { message: 'Flag submitted successfully' }, status: :created
    else
      render_errors(flag, message: 'Failed to submit flag')
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
end
