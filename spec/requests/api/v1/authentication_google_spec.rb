require 'rails_helper'

RSpec.describe 'Api::V1::Authentication Google', type: :request do
  describe 'POST /api/v1/auth/google' do
    let(:endpoint) { '/api/v1/auth/google' }
    let(:client_id) { 'google-client-id.apps.googleusercontent.com' }
    let(:validator) { instance_double(GoogleIDToken::Validator) }

    before do
      allow(ENV).to receive(:[]).and_call_original
      allow(ENV).to receive(:[]).with('GOOGLE_CLIENT_ID').and_return(client_id)
      allow(GoogleIDToken::Validator).to receive(:new).and_return(validator)
    end

    it 'logs in an existing user when credential is valid' do
      user = create(:user, email: 'existing@example.com', zipcode: '10001')
      allow(validator).to receive(:check).and_return(
        {
          'email' => 'existing@example.com',
          'email_verified' => true,
          'name' => 'Existing User'
        }
      )

      post endpoint, params: { credential: 'valid_google_token' }

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body['token']).to be_present
      expect(body.dig('user', 'id')).to eq(user.id)
      expect(body.dig('user', 'email')).to eq('existing@example.com')
    end

    it 'creates a new user when credential is valid and zipcode is provided' do
      allow(validator).to receive(:check).and_return(
        {
          'email' => 'newuser@example.com',
          'email_verified' => true,
          'name' => 'New User'
        }
      )

      expect do
        post endpoint, params: { credential: 'valid_google_token', zipcode: '30301' }
      end.to change(User, :count).by(1)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body['token']).to be_present
      expect(body.dig('user', 'email')).to eq('newuser@example.com')
      expect(body.dig('user', 'anonymous')).to eq(false)
      expect(User.find(body.dig('user', 'id')).zipcode).to eq('30301')
    end

    it 'returns unprocessable_entity when credential is missing' do
      post endpoint, params: { zipcode: '30301' }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)['error']).to eq('Google credential is required')
    end

    it 'creates a new user without zipcode when zipcode is missing for first-time signup' do
      allow(validator).to receive(:check).and_return(
        {
          'email' => 'firsttimer@example.com',
          'email_verified' => true,
          'name' => 'First Timer'
        }
      )

      expect do
        post endpoint, params: { credential: 'valid_google_token' }
      end.to change(User, :count).by(1)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body['token']).to be_present
      expect(User.find(body.dig('user', 'id')).zipcode).to be_nil
    end

    it 'returns unauthorized when credential validation fails' do
      allow(validator).to receive(:check).and_raise(GoogleIDToken::ValidationError, 'invalid token')

      post endpoint, params: { credential: 'bad_token' }

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)['error']).to eq('Invalid Google credential')
    end
  end
end
