class DirectMessage < ApplicationRecord
  belongs_to :post
  belongs_to :sender, class_name: 'User', foreign_key: :sender_id
  belongs_to :recipient, class_name: 'User', foreign_key: :recipient_id

  validates :message, presence: true

  scope :unread, -> { where(read_at: nil) }
end
