class Post < ApplicationRecord
  belongs_to :user

  validates :title, presence: true, length: { maximum: 200 }
  validates :content, presence: true, length: { maximum: 5000 }

  scope :recent, -> { order(created_at: :desc) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }

  def author_name
    user.username || user.email || "Anonymous User"
  end
end
