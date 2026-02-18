require 'rails_helper'

RSpec.describe Flag, type: :model do
  describe 'associations' do
    it { should belong_to(:flaggable, polymorphic: true) }
    it { should belong_to(:flagger_user).class_name('User').with_foreign_key('flagger_user_id').optional }
    it { should belong_to(:reviewed_by_user).class_name('User').with_foreign_key('reviewed_by_user_id').optional }
  end

  describe 'validations' do
    it { should validate_presence_of(:reason) }

    it 'is valid with valid attributes' do
      user = create(:user)
      post = create(:post)
      flag = build(:flag, flagger_user: user, flaggable: post)
      expect(flag).to be_valid
    end

    it 'requires a flaggable resource' do
      user = create(:user)
      flag = build(:flag, flagger_user: user, flaggable: nil)
      expect(flag).not_to be_valid
    end
  end

  describe 'polymorphism' do
    it 'can flag posts' do
      user = create(:user)
      post = create(:post)
      flag = create(:flag, flagger_user: user, flaggable: post)

      expect(flag.flaggable).to eq(post)
    end

    it 'can flag comments' do
      user = create(:user)
      comment = create(:comment)
      flag = create(:flag, flagger_user: user, flaggable: comment)

      expect(flag.flaggable).to eq(comment)
    end
  end

  describe 'reason' do
    it 'stores the flag reason' do
      flag = create(:flag, reason: 'Spam')
      expect(flag.reason).to eq('Spam')
    end

    it 'allows common flag reasons' do
      reasons = ['Spam', 'Harassment', 'Inappropriate Content', 'Other']
      reasons.each do |reason|
        flag = build(:flag, :for_post, reason: reason)
        expect(flag).to be_valid
      end
    end
  end
end
