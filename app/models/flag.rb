class Flag < ApplicationRecord
  belongs_to :flaggable, polymorphic: true
  belongs_to :flagger_user, class_name: 'User', foreign_key: :flagger_user_id, optional: true
  belongs_to :reviewed_by_user, class_name: 'User', foreign_key: :reviewed_by_user_id, optional: true

  validates :reason, presence: true
end
