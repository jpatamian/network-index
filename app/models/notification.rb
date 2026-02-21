class Notification < ApplicationRecord
  TYPES = {
    comment: "comment",
    mention: "mention",
    flag: "flag",
    safety_report: "safety_report"
  }.freeze

  belongs_to :user
  belongs_to :actor_user, class_name: "User", foreign_key: :actor_user_id, optional: true
  belongs_to :post
  belongs_to :comment, optional: true

  enum :notification_type, TYPES, validate: true

  validates :message, presence: true
  validates :notification_type, presence: true

  scope :unread, -> { where(read_at: nil) }
  scope :for_user, ->(user_id) { where(user_id: user_id) }
end
