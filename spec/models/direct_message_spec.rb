require 'rails_helper'

RSpec.describe DirectMessage, type: :model do
  describe 'associations' do
    it { should belong_to(:post) }
    it { should belong_to(:sender).class_name('User') }
    it { should belong_to(:recipient).class_name('User') }
  end

  describe 'validations' do
    it { should validate_presence_of(:message) }

    it 'is valid with valid attributes' do
      sender = create(:user)
      recipient = create(:user)
      dm = build(:direct_message, sender: sender, recipient: recipient)
      expect(dm).to be_valid
    end

    it 'requires a sender' do
      recipient = create(:user)
      dm = build(:direct_message, sender: nil, recipient: recipient)
      expect(dm).not_to be_valid
    end

    it 'requires a recipient' do
      sender = create(:user)
      dm = build(:direct_message, sender: sender, recipient: nil)
      expect(dm).not_to be_valid
    end
  end

  describe 'scopes' do
    it 'returns messages in chronological order' do
      sender = create(:user)
      recipient = create(:user)
      dm1 = create(:direct_message, sender: sender, recipient: recipient, created_at: 2.hours.ago)
      dm2 = create(:direct_message, sender: sender, recipient: recipient, created_at: 1.hour.ago)

      expect(DirectMessage.order(:created_at)).to eq([dm1, dm2])
    end
  end

  describe 'unread scope' do
    it 'returns unread messages' do
      unread = create(:direct_message, :unread)
      create(:direct_message, :read)

      expect(DirectMessage.unread).to include(unread)
    end

    it 'excludes read messages' do
      dm = create(:direct_message)
      dm.update!(read_at: Time.current)

      expect(DirectMessage.unread).not_to include(dm)
    end
  end
end
