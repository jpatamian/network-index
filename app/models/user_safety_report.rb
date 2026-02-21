class UserSafetyReport < ApplicationRecord
  STATUSES = {
    pending: 'pending',
    reviewed: 'reviewed',
    resolved: 'resolved',
    dismissed: 'dismissed'
  }.freeze

  INCIDENT_TYPES = %w[
    harassment
    spam
    hate_speech
    misinformation
    inappropriate_content
    scam
    other
  ].freeze

  belongs_to :reporter_user, class_name: 'User', foreign_key: :reporter_user_id
  belongs_to :reported_user, class_name: 'User', foreign_key: :reported_user_id
  belongs_to :post, optional: true
  belongs_to :reviewed_by_user, class_name: 'User', foreign_key: :reviewed_by_user_id, optional: true

  enum :status, STATUSES, validate: true

  validates :incident_type, presence: true, inclusion: { in: INCIDENT_TYPES }

  scope :pending, -> { where(status: STATUSES[:pending]) }
  scope :by_status, ->(status) { where(status: status) }
end
