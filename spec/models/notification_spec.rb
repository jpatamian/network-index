require 'rails_helper'

RSpec.describe Notification, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:post) }
    it { should belong_to(:actor_user).optional }
    it { should belong_to(:comment).optional }
  end

  describe 'validations' do
    it 'is valid with required attributes' do
      notification = build(:notification)
      expect(notification).to be_valid
    end

    it 'requires a message' do
      notification = build(:notification, message: nil)
      expect(notification).not_to be_valid
      expect(notification.errors[:message]).to include("can't be blank")
    end

    it 'requires a notification_type' do
      notification = build(:notification, notification_type: nil)
      expect(notification).not_to be_valid
      expect(notification.errors[:notification_type]).to include("can't be blank")
    end

    it 'requires a user' do
      notification = build(:notification, user: nil)
      expect(notification).not_to be_valid
    end

    it 'requires a post' do
      notification = build(:notification, post: nil)
      expect(notification).not_to be_valid
    end

    it 'is valid without an actor_user (optional)' do
      notification = build(:notification, actor_user: nil)
      expect(notification).to be_valid
    end

    it 'is valid without a comment (optional)' do
      notification = build(:notification, comment: nil)
      expect(notification).to be_valid
    end
  end

  describe 'notification types' do
    it 'stores a like notification' do
      notification = create(:notification, notification_type: 'like', message: 'Someone liked your post')
      expect(notification.notification_type).to eq('like')
    end

    it 'stores a comment notification' do
      notification = create(:notification, notification_type: 'comment', message: 'Someone commented on your post')
      expect(notification.notification_type).to eq('comment')
    end
  end

  describe 'associations with actor_user and comment' do
    it 'can reference an actor_user' do
      actor = create(:user)
      notification = create(:notification, actor_user: actor)
      expect(notification.actor_user).to eq(actor)
    end

    it 'can reference a comment' do
      comment = create(:comment)
      notification = create(:notification, post: comment.post, comment: comment)
      expect(notification.comment).to eq(comment)
    end
  end
end
