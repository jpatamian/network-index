class Api::V1::FlagsController < Api::BaseController
  include Authenticable

  skip_before_action :verify_authenticity_token
  before_action :require_authentication!
  before_action :set_post

  # POST /api/v1/posts/:post_id/flags
  def create
    if @post.user_id == current_user.id
      render json: { error: 'Cannot report your own post' }, status: :forbidden
      return
    end

    if Flag.exists?(flagger_user_id: current_user.id, flaggable: @post)
      render json: { error: 'You already reported this post' }, status: :unprocessable_entity
      return
    end

    flag = Flag.new(flag_params)
    flag.flaggable = @post
    flag.flagger_user = current_user
    flag.status = 'pending'
    flag.is_auto_flagged = false

    if flag.save
      update_flag_state!(@post)
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

  def flag_params
    params.require(:flag).permit(:reason, :description)
  end

  def update_flag_state!(post)
    flag_count = post.flags.count
    post.update!(
      flag_count: flag_count,
      is_flagged: flag_count.positive?,
      is_hidden: flag_count >= 3
    )
  end
end
