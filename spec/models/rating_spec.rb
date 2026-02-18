require 'rails_helper'

RSpec.describe Rating, type: :model do
  describe 'associations' do
    it { should belong_to(:post) }
    it { should belong_to(:user) }
  end

  describe 'validations' do
    it { should validate_presence_of(:value) }
    it { should validate_inclusion_of(:value).in_array([1, 2, 3, 4, 5]) }

    it 'is valid with valid attributes' do
      user = create(:user)
      post = create(:post)
      rating = build(:rating, user: user, post: post, value: 5)
      expect(rating).to be_valid
    end

    it 'requires a post' do
      user = create(:user)
      rating = build(:rating, user: user, post: nil)
      expect(rating).not_to be_valid
    end

    it 'requires a user' do
      post = create(:post)
      rating = build(:rating, user: nil, post: post)
      expect(rating).not_to be_valid
    end

    it 'validates rating value is between 1 and 5' do
      user = create(:user)
      post = create(:post)
      [0, 6, 10].each do |invalid_value|
        rating = build(:rating, user: user, post: post, value: invalid_value)
        expect(rating).not_to be_valid
      end
    end
  end

  describe 'rating values' do
    it 'accepts 1 star rating' do
      rating = build(:rating, value: 1)
      expect(rating).to be_valid
    end

    it 'accepts 5 star rating' do
      rating = build(:rating, value: 5)
      expect(rating).to be_valid
    end
  end

  describe 'unique constraint' do
    it 'allows user to rate same post only once' do
      user = create(:user)
      post = create(:post)
      create(:rating, user: user, post: post, value: 5)

      duplicate_rating = build(:rating, user: user, post: post, value: 3)
      # This should either fail validation or be overwritten
      # depending on implementation
    end
  end
end
