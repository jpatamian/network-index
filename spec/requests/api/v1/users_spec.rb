require 'rails_helper'

RSpec.describe 'Api::V1::Users', type: :request do
  let(:user) { create(:user, :with_username) }
  let(:other_user) { create(:user, :with_username) }
  let(:token) { JsonWebToken.encode(user_id: user.id) }
  let(:auth_headers) { { 'Authorization' => "Bearer #{token}" } }

  describe 'GET /api/v1/users' do
    it 'returns a list of users without authentication' do
      create_list(:user, 3)

      get '/api/v1/users'

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body).to be_an(Array)
    end

    it 'returns at most 10 users' do
      create_list(:user, 12)

      get '/api/v1/users'

      body = JSON.parse(response.body)
      expect(body.length).to be <= 10
    end

    it 'returns only safe public fields' do
      get '/api/v1/users'

      body = JSON.parse(response.body)
      first = body.first
      expect(first.keys).to include('id', 'username', 'email', 'zipcode', 'anonymous', 'created_at')
      expect(first.keys).not_to include('password_digest')
    end
  end

  describe 'GET /api/v1/users/:id' do
    it 'returns the user without authentication' do
      get "/api/v1/users/#{user.id}"

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body['id']).to eq(user.id)
      expect(body['email']).to eq(user.email)
    end

    it 'returns only safe public fields' do
      get "/api/v1/users/#{user.id}"

      body = JSON.parse(response.body)
      expect(body.keys).to include('id', 'username', 'email', 'zipcode', 'anonymous', 'created_at')
      expect(body.keys).not_to include('password_digest')
    end

    it 'returns 404 when the user does not exist' do
      get '/api/v1/users/999999'

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'PATCH /api/v1/users/:id' do
    let(:valid_params) { { user: { username: 'newname', zipcode: '12345' } } }

    it 'updates the user and returns 200 when authenticated as that user' do
      patch "/api/v1/users/#{user.id}", params: valid_params, headers: auth_headers

      expect(response).to have_http_status(:ok)
      expect(user.reload.username).to eq('newname')
      expect(user.reload.zipcode).to eq('12345')
    end

    it 'returns the updated user in the response' do
      patch "/api/v1/users/#{user.id}", params: valid_params, headers: auth_headers

      body = JSON.parse(response.body)
      expect(body['user']).to be_a(Hash)
      expect(body['user']['username']).to eq('newname')
    end

    it 'returns 401 when not authenticated' do
      patch "/api/v1/users/#{user.id}", params: valid_params

      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns 401 when trying to update a different user' do
      other_token = JsonWebToken.encode(user_id: other_user.id)

      patch "/api/v1/users/#{user.id}",
            params: valid_params,
            headers: { 'Authorization' => "Bearer #{other_token}" }

      expect(response).to have_http_status(:unauthorized)
      expect(user.reload.username).not_to eq('newname')
    end

    it 'returns 422 when validation fails (e.g., duplicate username)' do
      existing = create(:user, :with_username)
      patch "/api/v1/users/#{user.id}",
            params: { user: { username: existing.username } },
            headers: auth_headers

      expect(response).to have_http_status(:unprocessable_entity)
      body = JSON.parse(response.body)
      expect(body['error']).to eq('Failed to update profile')
    end

    it 'only permits username, email, and zipcode params' do
      patch "/api/v1/users/#{user.id}",
            params: { user: { zipcode: '99999', is_moderator: true } },
            headers: auth_headers

      expect(response).to have_http_status(:ok)
      expect(user.reload.is_moderator).to be false
      expect(user.reload.zipcode).to eq('99999')
    end
  end
end
