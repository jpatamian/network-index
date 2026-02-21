require 'rails_helper'

RSpec.describe 'Api::V1::PostLikes', type: :request do
  let(:post_author) { create(:user) }
  let(:liker) { create(:user) }
  let(:post_record) { create(:post, user: post_author) }
  let(:liker_token) { JsonWebToken.encode(user_id: liker.id) }
  let(:liker_headers) { { 'Authorization' => "Bearer #{liker_token}" } }

  describe 'POST /api/v1/posts/:post_id/likes' do
    it 'creates a like and returns 200' do
      post "/api/v1/posts/#{post_record.id}/likes", headers: liker_headers

      expect(response).to have_http_status(:ok)
    end

    it 'increments the post likes_count' do
      expect do
        post "/api/v1/posts/#{post_record.id}/likes", headers: liker_headers
      end.to change { post_record.reload.likes_count }.by(1)
    end

    it 'returns liked_by_current_user as true after liking' do
      post "/api/v1/posts/#{post_record.id}/likes", headers: liker_headers

      body = JSON.parse(response.body)
      expect(body['liked_by_current_user']).to be true
      expect(body['post_id']).to eq(post_record.id)
      expect(body['likes_count']).to eq(1)
    end

    it 'is idempotent — does not create a duplicate like on repeated requests' do
      post "/api/v1/posts/#{post_record.id}/likes", headers: liker_headers
      post "/api/v1/posts/#{post_record.id}/likes", headers: liker_headers

      expect(PostLike.where(post: post_record, user: liker).count).to eq(1)
      expect(response).to have_http_status(:ok)
    end

    it 'creates a notification for the post author when liker differs' do
      expect do
        post "/api/v1/posts/#{post_record.id}/likes", headers: liker_headers
      end.to change(Notification, :count).by(1)

      notification = Notification.last
      expect(notification.user_id).to eq(post_author.id)
      expect(notification.notification_type).to eq('like')
    end

    it 'does not create a notification when the author likes their own post' do
      author_token = JsonWebToken.encode(user_id: post_author.id)
      author_headers = { 'Authorization' => "Bearer #{author_token}" }

      expect do
        post "/api/v1/posts/#{post_record.id}/likes", headers: author_headers
      end.not_to change(Notification, :count)
    end

    it 'does not create a duplicate notification on repeated like' do
      post "/api/v1/posts/#{post_record.id}/likes", headers: liker_headers
      expect do
        post "/api/v1/posts/#{post_record.id}/likes", headers: liker_headers
      end.not_to change(Notification, :count)
    end

    it 'returns 401 when not authenticated' do
      post "/api/v1/posts/#{post_record.id}/likes"

      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns 404 when the post does not exist' do
      post '/api/v1/posts/999999/likes', headers: liker_headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'DELETE /api/v1/posts/:post_id/likes' do
    before { create(:post_like, user: liker, post: post_record) }

    it 'destroys the like and returns 200' do
      delete "/api/v1/posts/#{post_record.id}/likes", headers: liker_headers

      expect(response).to have_http_status(:ok)
    end

    it 'decrements the post likes_count' do
      expect do
        delete "/api/v1/posts/#{post_record.id}/likes", headers: liker_headers
      end.to change { post_record.reload.likes_count }.by(-1)
    end

    it 'returns liked_by_current_user as false after unliking' do
      delete "/api/v1/posts/#{post_record.id}/likes", headers: liker_headers

      body = JSON.parse(response.body)
      expect(body['liked_by_current_user']).to be false
      expect(body['post_id']).to eq(post_record.id)
    end

    it 'is idempotent — does not error if the like does not exist' do
      delete "/api/v1/posts/#{post_record.id}/likes", headers: liker_headers
      delete "/api/v1/posts/#{post_record.id}/likes", headers: liker_headers

      expect(response).to have_http_status(:ok)
    end

    it 'returns 401 when not authenticated' do
      delete "/api/v1/posts/#{post_record.id}/likes"

      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns 404 when the post does not exist' do
      delete '/api/v1/posts/999999/likes', headers: liker_headers

      expect(response).to have_http_status(:not_found)
    end
  end
end
