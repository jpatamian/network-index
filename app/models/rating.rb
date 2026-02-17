class Rating < ApplicationRecord
  belongs_to :rater_user, class_name: 'User', foreign_key: :rater_user_id
  belongs_to :rated_user, class_name: 'User', foreign_key: :rated_user_id
  belongs_to :post, optional: true

  validates :rating_value, presence: true, inclusion: { in: 1..5 }
end
