require 'rails_helper'

RSpec.describe 'Api::V1::Posts', type: :request do
  let(:user) { create(:user) }
  let(:token) { JsonWebToken.encode(user_id: user.id) }
  let(:auth_headers) { { 'Authorization' => "Bearer #{token}" } }

  describe 'POST /api/v1/posts' do
    context 'when creating as an authenticated user' do
      let(:valid_params) do
        {
          post: {
            title: 'Need help with groceries',
            content: 'Looking for someone to help pick up groceries this weekend.',
            post_type: 'food',
            metadata: { pickup_window: 'Saturday 10am-2pm' }
          }
        }
      end

      it 'creates a post' do
        expect {
          post '/api/v1/posts', params: valid_params, headers: auth_headers
        }.to change(Post, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it 'associates the post with the authenticated user' do
        post '/api/v1/posts', params: valid_params, headers: auth_headers

        expect(Post.last.user).to eq(user)
      end

      it 'returns the created post in the response' do
        post '/api/v1/posts', params: valid_params, headers: auth_headers

        body = JSON.parse(response.body)
        expect(body['title']).to eq('Need help with groceries')
        expect(body['post_type']).to eq('food')
      end
    end

    context 'when creating as an anonymous user' do
      let(:anonymous_params) do
        {
          post: {
            title: 'Emergency childcare needed',
            content: 'Need someone to watch my kids this afternoon.',
            post_type: 'childcare',
            zipcode: '02145',
            metadata: { needed_by: 1.day.from_now.iso8601, children_count: 2 }
          }
        }
      end

      it 'creates a post without authentication' do
        expect {
          post '/api/v1/posts', params: anonymous_params
        }.to change(Post, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it 'creates an anonymous user with the provided zipcode' do
        expect {
          post '/api/v1/posts', params: anonymous_params
        }.to change(User, :count).by(1)

        created_user = User.last
        expect(created_user.anonymous).to be true
        expect(created_user.zipcode).to eq('02145')
      end

      it 'associates the post with the anonymous user' do
        post '/api/v1/posts', params: anonymous_params

        created_post = Post.last
        created_user = User.last

        expect(created_post.user).to eq(created_user)
        expect(created_post.user.anonymous).to be true
      end

      it 'returns the created post in the response' do
        post '/api/v1/posts', params: anonymous_params

        body = JSON.parse(response.body)
        expect(body['title']).to eq('Emergency childcare needed')
        expect(body['post_type']).to eq('childcare')
        expect(body['author']['username']).to be_nil
      end

      it 'returns an error when zipcode is missing' do
        params_without_zipcode = anonymous_params.deep_dup
        params_without_zipcode[:post].delete(:zipcode)

        post '/api/v1/posts', params: params_without_zipcode

        expect(response).to have_http_status(:unprocessable_entity)
        body = JSON.parse(response.body)
        expect(body['error']).to eq('Zipcode is required for anonymous posts')
      end

      it 'returns an error when zipcode is blank' do
        blank_zipcode_params = anonymous_params.deep_dup
        blank_zipcode_params[:post][:zipcode] = ''

        post '/api/v1/posts', params: blank_zipcode_params

        expect(response).to have_http_status(:unprocessable_entity)
        body = JSON.parse(response.body)
        expect(body['error']).to eq('Zipcode is required for anonymous posts')
      end

      it 'allows different zipcode formats' do
        extended_zipcode_params = anonymous_params.deep_dup
        extended_zipcode_params[:post][:zipcode] = '02145-6789'

        post '/api/v1/posts', params: extended_zipcode_params

        expect(response).to have_http_status(:created)
        expect(User.last.zipcode).to eq('02145-6789')
      end
    end

    context 'with invalid post data' do
      let(:invalid_params) do
        {
          post: {
            title: '',
            content: '',
            post_type: 'other'
          }
        }
      end

      it 'returns validation errors' do
        post '/api/v1/posts', params: invalid_params, headers: auth_headers

        expect(response).to have_http_status(:unprocessable_entity)
        body = JSON.parse(response.body)
        expect(body['error']).to be_present
        expect(body['details']).to be_present
      end

      it 'does not create a post' do
        expect {
          post '/api/v1/posts', params: invalid_params, headers: auth_headers
        }.not_to change(Post, :count)
      end
    end

    context 'with metadata requirements' do
      it 'validates childcare metadata requirements' do
        incomplete_childcare = {
          post: {
            title: 'Need childcare',
            content: 'Looking for childcare',
            post_type: 'childcare',
            metadata: {}
          }
        }

        post '/api/v1/posts', params: incomplete_childcare, headers: auth_headers

        expect(response).to have_http_status(:unprocessable_entity)
        body = JSON.parse(response.body)
        expect(body['details'].join(', ')).to include('Metadata')
      end

      it 'validates ride_share metadata requirements' do
        incomplete_ride = {
          post: {
            title: 'Need a ride',
            content: 'Looking for a ride',
            post_type: 'ride_share',
            metadata: { from: 'Boston' }
          }
        }

        post '/api/v1/posts', params: incomplete_ride, headers: auth_headers

        expect(response).to have_http_status(:unprocessable_entity)
        body = JSON.parse(response.body)
        expect(body['details'].join(', ')).to include('Metadata')
      end
    end
  end

  describe 'GET /api/v1/posts' do
    it 'returns all posts' do
      create_list(:post, 3, user: user)

      get '/api/v1/posts'

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body.length).to eq(3)
    end

    it 'does not require authentication' do
      create(:post, user: user)

      get '/api/v1/posts'

      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /api/v1/posts/:id' do
    let(:post_record) { create(:post, user: user) }

    it 'returns the post' do
      get "/api/v1/posts/#{post_record.id}"

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body['id']).to eq(post_record.id)
    end

    it 'does not require authentication' do
      get "/api/v1/posts/#{post_record.id}"

      expect(response).to have_http_status(:ok)
    end
  end

  describe 'PATCH /api/v1/posts/:id' do
    let(:post_record) { create(:post, user: user) }
    let(:update_params) do
      {
        post: {
          title: 'Updated title',
          content: 'Updated content'
        }
      }
    end

    it 'updates the post when authenticated as owner' do
      patch "/api/v1/posts/#{post_record.id}", params: update_params, headers: auth_headers

      expect(response).to have_http_status(:ok)
      expect(post_record.reload.title).to eq('Updated title')
    end

    it 'requires authentication' do
      patch "/api/v1/posts/#{post_record.id}", params: update_params

      expect(response).to have_http_status(:unauthorized)
    end

    it 'prevents updating another user\'s post' do
      other_user = create(:user)
      other_post = create(:post, user: other_user)

      patch "/api/v1/posts/#{other_post.id}", params: update_params, headers: auth_headers

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe 'DELETE /api/v1/posts/:id' do
    let(:post_record) { create(:post, user: user) }

    it 'deletes the post when authenticated as owner' do
      delete "/api/v1/posts/#{post_record.id}", headers: auth_headers

      expect(response).to have_http_status(:ok)
      expect(Post.exists?(post_record.id)).to be false
    end

    it 'requires authentication' do
      delete "/api/v1/posts/#{post_record.id}"

      expect(response).to have_http_status(:unauthorized)
    end

    it 'prevents deleting another user\'s post' do
      other_user = create(:user)
      other_post = create(:post, user: other_user)

      delete "/api/v1/posts/#{other_post.id}", headers: auth_headers

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe 'GET /api/v1/posts/my_posts' do
    it 'returns the current user\'s posts' do
      create_list(:post, 2, user: user)
      other_user = create(:user)
      create(:post, user: other_user)

      get '/api/v1/posts/my_posts', headers: auth_headers

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body.length).to eq(2)
      expect(body.all? { |p| p['author']['id'] == user.id }).to be true
    end

    it 'requires authentication' do
      get '/api/v1/posts/my_posts'

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
