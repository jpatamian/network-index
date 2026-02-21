class Flag < ApplicationRecord
  AUTO_HIDE_THRESHOLD = 3

  STATUSES = {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected',
    archived: 'archived'
  }.freeze

  belongs_to :flaggable, polymorphic: true
  belongs_to :flagger_user, class_name: 'User', foreign_key: :flagger_user_id, optional: true
  belongs_to :reviewed_by_user, class_name: 'User', foreign_key: :reviewed_by_user_id, optional: true

  enum :status, STATUSES, validate: true

  validates :reason, presence: true

  scope :by_status, ->(status) { where(status: status) }
  scope :pending, -> { where(status: STATUSES[:pending]) }

  def self.update_flaggable_state!(flaggable)
    flag_count = flaggable.flags.count
    flaggable.update!(
      flag_count: flag_count,
      is_flagged: flag_count.positive?,
      is_hidden: flag_count >= AUTO_HIDE_THRESHOLD
    )
  end
end
