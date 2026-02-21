require 'rails_helper'

RSpec.describe 'Api::V1::Flags', type: :request do
  let(:moderator) { create(:user, is_moderator: true) }
  let(:reporter) { create(:user) }
  let(:post_author) { create(:user) }
  let(:post_record) { create(:post, user: post_author) }

  let(:moderator_token) { JsonWebToken.encode(user_id: moderator.id) }
  let(:reporter_token) { JsonWebToken.encode(user_id: reporter.id) }
  let(:author_token) { JsonWebToken.encode(user_id: post_author.id) }

  let(:moderator_headers) { { 'Authorization' => "Bearer #{moderator_token}" } }
  let(:reporter_headers) { { 'Authorization' => "Bearer #{reporter_token}" } }
  let(:author_headers) { { 'Authorization' => "Bearer #{author_token}" } }

  let(:flag_params) { { flag: { reason: 'spam', description: 'This is spam' } } }

  describe 'GET /api/v1/flags' do
    before do
      create(:flag, :for_post, status: 'pending')
      create(:flag, :for_post, status: 'seen')
    end

    it 'returns pending flags by default for a moderator' do
      get '/api/v1/flags', headers: moderator_headers

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body).to be_an(Array)
      expect(body).to all(include('status' => 'pending'))
    end

    it 'returns flags filtered by status param' do
      get '/api/v1/flags', params: { status: 'seen' }, headers: moderator_headers

      body = JSON.parse(response.body)
      expect(body).to all(include('status' => 'seen'))
    end

    it 'returns at most 50 flags' do
      create_list(:flag, 55, :for_post, status: 'pending')

      get '/api/v1/flags', headers: moderator_headers

      body = JSON.parse(response.body)
      expect(body.length).to be <= 50
    end

    it 'returns 403 when the user is not a moderator' do
      get '/api/v1/flags', headers: reporter_headers

      expect(response).to have_http_status(:forbidden)
    end

    it 'returns 401 when not authenticated' do
      get '/api/v1/flags'

      expect(response).to have_http_status(:unauthorized)
    end

    it 'includes flaggable content in the response' do
      get '/api/v1/flags', headers: moderator_headers

      body = JSON.parse(response.body)
      expect(body.first).to have_key('flaggable')
      expect(body.first).to have_key('flagger')
    end
  end

  describe 'POST /api/v1/posts/:post_id/flags' do
    it 'creates a flag on a post' do
      expect do
        post "/api/v1/posts/#{post_record.id}/flags", params: flag_params, headers: reporter_headers
      end.to change(Flag, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it 'returns a success message' do
      post "/api/v1/posts/#{post_record.id}/flags", params: flag_params, headers: reporter_headers

      body = JSON.parse(response.body)
      expect(body['message']).to eq('Flag submitted successfully')
    end

    it 'marks the post as flagged after the first flag' do
      post "/api/v1/posts/#{post_record.id}/flags", params: flag_params, headers: reporter_headers

      expect(post_record.reload.is_flagged).to be true
      expect(post_record.reload.flag_count).to eq(1)
    end

    it 'hides the post when flag_count reaches 3' do
      # create 2 flags from other users first
      user2 = create(:user)
      user3 = create(:user)
      create(:flag, flaggable: post_record, flagger_user: user2,
             reason: 'spam', status: 'pending')
      post_record.update!(flag_count: 1, is_flagged: true)
      create(:flag, flaggable: post_record, flagger_user: user3,
             reason: 'spam', status: 'pending')
      post_record.update!(flag_count: 2, is_flagged: true)

      post "/api/v1/posts/#{post_record.id}/flags", params: flag_params, headers: reporter_headers

      expect(post_record.reload.flag_count).to eq(3)
      expect(post_record.reload.is_hidden).to be true
    end

    it 'prevents flagging your own content' do
      post "/api/v1/posts/#{post_record.id}/flags", params: flag_params, headers: author_headers

      expect(response).to have_http_status(:forbidden)
      body = JSON.parse(response.body)
      expect(body['error']).to eq('Cannot report your own content')
    end

    it 'prevents duplicate flags from the same user' do
      post "/api/v1/posts/#{post_record.id}/flags", params: flag_params, headers: reporter_headers
      post "/api/v1/posts/#{post_record.id}/flags", params: flag_params, headers: reporter_headers

      expect(response).to have_http_status(:unprocessable_entity)
      body = JSON.parse(response.body)
      expect(body['error']).to eq('You already reported this content')
    end

    it 'returns 401 when not authenticated' do
      post "/api/v1/posts/#{post_record.id}/flags", params: flag_params

      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns 404 when the post does not exist' do
      post '/api/v1/posts/999999/flags', params: flag_params, headers: reporter_headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST /api/v1/posts/:post_id/comments/:comment_id/flags' do
    let(:comment) { create(:comment, post: post_record, user: post_author) }

    it 'creates a flag on a comment' do
      expect do
        post "/api/v1/posts/#{post_record.id}/comments/#{comment.id}/flags",
             params: flag_params,
             headers: reporter_headers
      end.to change(Flag, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it 'prevents flagging your own comment' do
      post "/api/v1/posts/#{post_record.id}/comments/#{comment.id}/flags",
           params: flag_params,
           headers: author_headers

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe 'PATCH /api/v1/flags/:id' do
    let!(:flag) { create(:flag, :for_post, status: 'pending') }

    it 'marks the flag as seen for a moderator' do
      patch "/api/v1/flags/#{flag.id}", headers: moderator_headers

      expect(response).to have_http_status(:ok)
      expect(flag.reload.status).to eq('seen')
    end

    it 'records the reviewer and reviewed_at timestamp' do
      patch "/api/v1/flags/#{flag.id}", headers: moderator_headers

      flag.reload
      expect(flag.reviewed_by_user_id).to eq(moderator.id)
      expect(flag.reviewed_at).to be_present
    end

    it 'returns the updated flag in the response' do
      patch "/api/v1/flags/#{flag.id}", headers: moderator_headers

      body = JSON.parse(response.body)
      expect(body['status']).to eq('seen')
      expect(body['id']).to eq(flag.id)
    end

    it 'returns 403 when the user is not a moderator' do
      patch "/api/v1/flags/#{flag.id}", headers: reporter_headers

      expect(response).to have_http_status(:forbidden)
      expect(flag.reload.status).to eq('pending')
    end

    it 'returns 401 when not authenticated' do
      patch "/api/v1/flags/#{flag.id}"

      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns 404 when the flag does not exist' do
      patch '/api/v1/flags/999999', headers: moderator_headers

      expect(response).to have_http_status(:not_found)
    end
  end
end
