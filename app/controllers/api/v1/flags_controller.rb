class Api::V1::FlagsController < Api::BaseController
  include Authenticable
  include ResponseSerializable

  skip_before_action :verify_authenticity_token
  before_action :require_authentication!
  before_action :set_post, only: [ :create ]
  before_action :set_comment, only: [ :create ], if: -> { params[:comment_id].present? }
  before_action :set_flag, only: [ :update ]

  # GET /api/v1/flags
  def index
    binding.pry
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

    return render_forbidden("Cannot report your own content") if flaggable.user_id == current_user.id

    if Flag.exists?(flagger_user_id: current_user.id, flaggable: flaggable)
      return render json: { error: "You already reported this content" }, status: :unprocessable_entity
    end

    flag = Flag.new(flag_params)
    flag.flaggable = flaggable
    flag.flagger_user = current_user
    flag.status = Flag::STATUSES[:pending]
    flag.is_auto_flagged = false

    if flag.save
      Flag.update_flaggable_state!(flaggable)
      render json: { message: "Flag submitted successfully" }, status: :created
    else
      render_errors(flag, message: "Failed to submit flag")
    end
  end

  # PATCH /api/v1/flags/:id
  def update
    unless current_user.is_moderator?
      render json: { error: "Unauthorized" }, status: :forbidden
      return
    end

    if @flag.update(status: "seen", reviewed_at: Time.current, reviewed_by_user_id: current_user.id)
      render json: flag_response(@flag), status: :ok
    else
      render json: {
        error: "Failed to acknowledge flag",
        details: @flag.errors.full_messages
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

  def set_flag
    @flag = Flag.find(params[:id])
  end

  def flag_params
    params.require(:flag).permit(:reason, :description)
  end
end
