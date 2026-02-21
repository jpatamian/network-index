require 'rails_helper'

RSpec.describe 'Api::V1::Posts filtering', type: :request do
  describe 'GET /api/v1/posts with post_type filter' do
    it 'returns only posts matching requested post_type' do
      user = create(:user)
      food_post = create(:post, :food, user: user)
      create(:post, :ride_share, user: user)

      get '/api/v1/posts', params: { post_type: 'food' }

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body.map { |post| post['id'] }).to eq([ food_post.id ])
      expect(body.first['post_type']).to eq('food')
    end
  end
end
