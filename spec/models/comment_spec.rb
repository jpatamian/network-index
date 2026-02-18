require 'rails_helper'

RSpec.describe Comment, type: :model do
  describe 'associations' do
    it { should belong_to(:post) }
    it { should belong_to(:user) }
    it { should have_many(:comment_histories).dependent(:destroy) }
    it { should have_many(:flags).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:message) }

    it 'is valid with valid attributes' do
      post = create(:post)
      user = create(:user)
      comment = build(:comment, post: post, user: user)
      expect(comment).to be_valid
    end

    it 'requires a post' do
      user = create(:user)
      comment = build(:comment, post: nil, user: user)
      expect(comment).not_to be_valid
    end

    it 'requires a user' do
      post = create(:post)
      comment = build(:comment, post: post, user: nil)
      expect(comment).not_to be_valid
    end
  end

  describe 'scopes' do
    it 'returns comments in reverse chronological order' do
      post = create(:post)
      user = create(:user)
      comment1 = create(:comment, post: post, user: user, created_at: 2.days.ago)
      comment2 = create(:comment, post: post, user: user, created_at: 1.day.ago)
      comment3 = create(:comment, post: post, user: user, created_at: 3.days.ago)

      expect(post.comments).to eq([comment2, comment1, comment3])
    end
  end

  describe '#create' do
    it 'creates a comment history entry' do
      post = create(:post)
      user = create(:user)
      comment = create(:comment, post: post, user: user, message: 'Test comment')

      expect(comment.comment_histories.count).to be > 0
    end
  end

  describe '#destroy' do
    it 'destroys associated comment histories' do
      comment = create(:comment)
      create(:comment_history, comment: comment)

      expect { comment.destroy }.to change(CommentHistory, :count).by(-1)
    end

    it 'destroys associated flags' do
      comment = create(:comment)
      create(:flag, flaggable: comment)

      expect { comment.destroy }.to change(Flag, :count).by(-1)
    end
  end

  describe 'message' do
    it 'stores the comment message' do
      post = create(:post)
      user = create(:user)
      message = 'This is a test comment'
      comment = create(:comment, post: post, user: user, message: message)

      expect(comment.message).to eq(message)
    end

    it 'allows editing comment message' do
      comment = create(:comment, message: 'Original message')
      comment.update(message: 'Updated message')

      expect(comment.message).to eq('Updated message')
    end
  end
end
