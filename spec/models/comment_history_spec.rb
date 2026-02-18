require 'rails_helper'

RSpec.describe CommentHistory, type: :model do
  describe 'associations' do
    it { should belong_to(:comment) }
  end

  describe 'validations' do
    it 'is valid with valid attributes' do
      comment = create(:comment)
      history = build(:comment_history, comment: comment)
      expect(history).to be_valid
    end

    it 'requires a comment' do
      history = build(:comment_history, comment: nil)
      expect(history).not_to be_valid
    end
  end

  describe 'tracking edits' do
    it 'records previous message' do
      comment = create(:comment, message: 'Original message')
      history = create(:comment_history, comment: comment, old_message: 'Original message')

      expect(history.old_message).to eq('Original message')
      expect(comment.comment_histories.count).to be > 0
    end

    it 'stores timestamp of edit' do
      comment = create(:comment)
      history = create(:comment_history, comment: comment)

      expect(history.created_at).to be_present
    end
  end
end
