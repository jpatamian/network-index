class Post < ApplicationRecord
  belongs_to :user

  has_many :comments, dependent: :destroy
  has_many :direct_messages, dependent: :destroy
  has_many :ratings, dependent: :nullify
  has_many :flags, as: :flaggable, dependent: :destroy

  validates :title, presence: true, length: { maximum: 200 }
  validates :content, presence: true, length: { maximum: 5000 }

  scope :recent, -> { order(created_at: :desc) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }
  scope :by_zipcode, ->(zipcode) { joins(:user).where(users: { zipcode: zipcode }) }
  scope :search_query, lambda { |query|
    sanitized = ActiveRecord::Base.sanitize_sql_like(query.to_s.downcase)
    where('LOWER(posts.title) LIKE :q OR LOWER(posts.content) LIKE :q', q: "%#{sanitized}%")
  }
  scope :open, -> { where(status: 'open') }
  scope :fulfilled, -> { where(status: 'fulfilled') }
  scope :visible, -> { where(is_hidden: false) }

  def author_name
    user.username || user.email || "Anonymous User"
  end
end
