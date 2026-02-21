require 'rails_helper'

RSpec.describe 'Api::V1::Comments', type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:post_record) { create(:post, user: other_user) }
  let(:token) { JsonWebToken.encode(user_id: user.id) }
  let(:auth_headers) { { 'Authorization' => "Bearer #{token}" } }

  describe 'GET /api/v1/posts/:post_id/comments' do
    it 'returns comments for the post ordered by created_at asc' do
      comment1 = create(:comment, post: post_record, created_at: 2.minutes.ago)
      comment2 = create(:comment, post: post_record, created_at: 1.minute.ago)

      get "/api/v1/posts/#{post_record.id}/comments"

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body.map { |c| c['id'] }).to eq([comment1.id, comment2.id])
    end

    it 'returns an empty array when the post has no comments' do
      get "/api/v1/posts/#{post_record.id}/comments"

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq([])
    end

    it 'returns 404 when the post does not exist' do
      get '/api/v1/posts/999999/comments'

      expect(response).to have_http_status(:not_found)
    end

    it 'does not require authentication' do
      create(:comment, post: post_record)

      get "/api/v1/posts/#{post_record.id}/comments"

      expect(response).to have_http_status(:ok)
    end

    it 'includes the comment author in the response' do
      create(:comment, post: post_record, user: user)

      get "/api/v1/posts/#{post_record.id}/comments"

      body = JSON.parse(response.body)
      expect(body.first).to have_key('user')
    end
  end

  describe 'POST /api/v1/posts/:post_id/comments' do
    let(:valid_params) { { comment: { message: 'This is a helpful comment' } } }

    it 'creates a comment when authenticated' do
      expect do
        post "/api/v1/posts/#{post_record.id}/comments", params: valid_params, headers: auth_headers
      end.to change(Comment, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it 'returns the created comment in the response' do
      post "/api/v1/posts/#{post_record.id}/comments", params: valid_params, headers: auth_headers

      body = JSON.parse(response.body)
      expect(body['message']).to eq('This is a helpful comment')
    end

    it 'associates the comment with the current user' do
      post "/api/v1/posts/#{post_record.id}/comments", params: valid_params, headers: auth_headers

      expect(Comment.last.user).to eq(user)
    end

    it 'creates a notification for the post author when commenter differs' do
      expect do
        post "/api/v1/posts/#{post_record.id}/comments", params: valid_params, headers: auth_headers
      end.to change(Notification, :count).by(1)

      notification = Notification.last
      expect(notification.user_id).to eq(post_record.user_id)
      expect(notification.notification_type).to eq('comment')
    end

    it 'does not create a notification when the author comments on their own post' do
      own_post = create(:post, user: user)

      expect do
        post "/api/v1/posts/#{own_post.id}/comments", params: valid_params, headers: auth_headers
      end.not_to change(Notification, :count)
    end

    it 'returns 401 when not authenticated' do
      post "/api/v1/posts/#{post_record.id}/comments", params: valid_params

      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns 422 when message is missing' do
      post "/api/v1/posts/#{post_record.id}/comments",
           params: { comment: { message: '' } },
           headers: auth_headers

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'returns 404 when the post does not exist' do
      post '/api/v1/posts/999999/comments', params: valid_params, headers: auth_headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'DELETE /api/v1/posts/:post_id/comments/:id' do
    let!(:comment) { create(:comment, post: post_record, user: user) }

    it 'deletes the comment when the owner requests it' do
      expect do
        delete "/api/v1/posts/#{post_record.id}/comments/#{comment.id}", headers: auth_headers
      end.to change(Comment, :count).by(-1)

      expect(response).to have_http_status(:ok)
    end

    it 'returns a success message' do
      delete "/api/v1/posts/#{post_record.id}/comments/#{comment.id}", headers: auth_headers

      body = JSON.parse(response.body)
      expect(body['message']).to eq('Comment deleted successfully')
    end

    it 'returns 403 when a different user tries to delete the comment' do
      other_token = JsonWebToken.encode(user_id: other_user.id)

      delete "/api/v1/posts/#{post_record.id}/comments/#{comment.id}",
             headers: { 'Authorization' => "Bearer #{other_token}" }

      expect(response).to have_http_status(:forbidden)
      expect(Comment.find_by(id: comment.id)).to be_present
    end

    it 'returns 401 when not authenticated' do
      delete "/api/v1/posts/#{post_record.id}/comments/#{comment.id}"

      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns 404 when the comment does not exist' do
      delete "/api/v1/posts/#{post_record.id}/comments/999999", headers: auth_headers

      expect(response).to have_http_status(:not_found)
    end
  end
end
