require 'rails_helper'

RSpec.describe 'Api::V1::Notifications', type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:token) { JsonWebToken.encode(user_id: user.id) }
  let(:auth_headers) { { 'Authorization' => "Bearer #{token}" } }

  describe 'GET /api/v1/notifications' do
    it 'returns the current user\'s notifications' do
      create(:notification, user: user, message: 'Alice liked your post')
      create(:notification, user: other_user, message: 'Someone else\'s notification')

      get '/api/v1/notifications', headers: auth_headers

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body.length).to eq(1)
      expect(body.first['message']).to eq('Alice liked your post')
    end

    it 'returns notifications in descending order by created_at' do
      older = create(:notification, user: user, message: 'Older', created_at: 2.hours.ago)
      newer = create(:notification, user: user, message: 'Newer', created_at: 1.hour.ago)

      get '/api/v1/notifications', headers: auth_headers

      body = JSON.parse(response.body)
      expect(body.map { |n| n['id'] }).to eq([newer.id, older.id])
    end

    it 'returns at most 30 notifications' do
      create_list(:notification, 35, user: user)

      get '/api/v1/notifications', headers: auth_headers

      body = JSON.parse(response.body)
      expect(body.length).to eq(30)
    end

    it 'returns an empty array when the user has no notifications' do
      get '/api/v1/notifications', headers: auth_headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq([])
    end

    it 'returns the expected response fields' do
      notification = create(:notification,
        user: user,
        actor_user: other_user,
        notification_type: 'like',
        message: 'Someone liked your post')

      get '/api/v1/notifications', headers: auth_headers

      body = JSON.parse(response.body)
      n = body.first
      expect(n['id']).to eq(notification.id)
      expect(n['message']).to eq('Someone liked your post')
      expect(n['notification_type']).to eq('like')
      expect(n).to have_key('created_at')
      expect(n).to have_key('read_at')
      expect(n).to have_key('post_id')
      expect(n).to have_key('post_title')
      expect(n['actor']).to be_a(Hash)
      expect(n['actor']['id']).to eq(other_user.id)
    end

    it 'returns actor name as username when actor has a username' do
      actor = create(:user, :with_username)
      create(:notification, user: user, actor_user: actor, message: 'Liked')

      get '/api/v1/notifications', headers: auth_headers

      body = JSON.parse(response.body)
      expect(body.first['actor']['name']).to eq(actor.username)
    end

    it 'returns actor name as email when actor has no username' do
      actor = create(:user, username: nil)
      create(:notification, user: user, actor_user: actor, message: 'Liked')

      get '/api/v1/notifications', headers: auth_headers

      body = JSON.parse(response.body)
      expect(body.first['actor']['name']).to eq(actor.email)
    end

    it 'returns 401 when not authenticated' do
      get '/api/v1/notifications'

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
