require 'rails_helper'

RSpec.describe PostLike, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:post) }
  end

  describe 'validations' do
    it 'is valid with a user and a post' do
      post_like = build(:post_like)
      expect(post_like).to be_valid
    end

    it 'is invalid without a user' do
      post_like = build(:post_like, user: nil)
      expect(post_like).not_to be_valid
    end

    it 'is invalid without a post' do
      post_like = build(:post_like, post: nil)
      expect(post_like).not_to be_valid
    end

    it 'prevents a user from liking the same post twice' do
      user = create(:user)
      post = create(:post)
      create(:post_like, user: user, post: post)

      duplicate = build(:post_like, user: user, post: post)
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:user_id]).to include('has already been taken')
    end

    it 'allows different users to like the same post' do
      post = create(:post)
      user1 = create(:user)
      user2 = create(:user)

      create(:post_like, user: user1, post: post)
      second_like = build(:post_like, user: user2, post: post)

      expect(second_like).to be_valid
    end

    it 'allows the same user to like different posts' do
      user = create(:user)
      post1 = create(:post)
      post2 = create(:post)

      create(:post_like, user: user, post: post1)
      second_like = build(:post_like, user: user, post: post2)

      expect(second_like).to be_valid
    end
  end

  describe 'counter cache' do
    it 'increments the post likes_count on create' do
      post = create(:post)
      expect { create(:post_like, post: post) }.to change { post.reload.likes_count }.by(1)
    end

    it 'decrements the post likes_count on destroy' do
      post = create(:post)
      like = create(:post_like, post: post)
      expect { like.destroy }.to change { post.reload.likes_count }.by(-1)
    end
  end
end
