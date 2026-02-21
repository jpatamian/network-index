class UserSafetyReport < ApplicationRecord
  belongs_to :reporter_user, class_name: "User", foreign_key: :reporter_user_id
  belongs_to :reported_user, class_name: "User", foreign_key: :reported_user_id
  belongs_to :post, optional: true
  belongs_to :reviewed_by_user, class_name: "User", foreign_key: :reviewed_by_user_id, optional: true

  validates :incident_type, presence: true
end
