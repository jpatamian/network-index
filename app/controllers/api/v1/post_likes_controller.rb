class Api::V1::PostLikesController < Api::BaseController
  include Authenticable

  skip_before_action :verify_authenticity_token
  before_action :require_authentication!
  before_action :set_post

  # POST /api/v1/posts/:post_id/likes
  def create
    like = @post.post_likes.find_by(user_id: current_user.id)

    unless like
      like = @post.post_likes.build(user: current_user)
      like.save!

      if @post.user_id != current_user.id
        actor_name = current_user.username || current_user.email || 'Someone'
        Notification.create(
          user_id: @post.user_id,
          actor_user: current_user,
          post: @post,
          notification_type: 'like',
          message: "#{actor_name} liked your post"
        )
      end
    end

    render json: like_response, status: :ok
  end

  # DELETE /api/v1/posts/:post_id/likes
  def destroy
    like = @post.post_likes.find_by(user_id: current_user.id)
    like&.destroy

    render json: like_response, status: :ok
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end

  def like_response
    {
      post_id: @post.id,
      likes_count: @post.reload.likes_count,
      liked_by_current_user: @post.post_likes.exists?(user_id: current_user.id)
    }
  end
end
