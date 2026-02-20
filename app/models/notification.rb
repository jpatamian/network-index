class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :actor_user, class_name: 'User', foreign_key: :actor_user_id, optional: true
  belongs_to :post
  belongs_to :comment

  validates :message, presence: true
  validates :notification_type, presence: true
end
