require 'rails_helper'

RSpec.describe Rating, type: :model do
  describe 'associations' do
    it { should belong_to(:rater_user).class_name('User').with_foreign_key('rater_user_id') }
    it { should belong_to(:rated_user).class_name('User').with_foreign_key('rated_user_id') }
    it { should belong_to(:post).optional }
  end

  describe 'validations' do
    it { should validate_presence_of(:rating_value) }
    it { should validate_inclusion_of(:rating_value).in_range(1..5) }

    it 'is valid with valid attributes' do
      rater = create(:user)
      rated = create(:user)
      post = create(:post)
      rating = build(:rating, rater_user: rater, rated_user: rated, post: post, rating_value: 5)
      expect(rating).to be_valid
    end

    it 'requires a rater user' do
      rated = create(:user)
      post = create(:post)
      rating = build(:rating, rater_user: nil, rated_user: rated, post: post)
      expect(rating).not_to be_valid
    end

    it 'requires a rated user' do
      rater = create(:user)
      post = create(:post)
      rating = build(:rating, rater_user: rater, rated_user: nil, post: post)
      expect(rating).not_to be_valid
    end

    it 'validates rating value is between 1 and 5' do
      rater = create(:user)
      rated = create(:user)
      post = create(:post)
      [0, 6, 10].each do |invalid_value|
        rating = build(:rating, rater_user: rater, rated_user: rated, post: post, rating_value: invalid_value)
        expect(rating).not_to be_valid
      end
    end
  end

  describe 'rating values' do
    it 'accepts 1 star rating' do
      rating = build(:rating, rating_value: 1)
      expect(rating).to be_valid
    end

    it 'accepts 5 star rating' do
      rating = build(:rating, rating_value: 5)
      expect(rating).to be_valid
    end
  end
end
