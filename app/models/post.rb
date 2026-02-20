class Post < ApplicationRecord
  POST_TYPES = {
    childcare: 'childcare',
    ride_share: 'ride_share',
    food: 'food',
    other: 'other'
  }.freeze
  TYPE_METADATA_REQUIREMENTS = {
    'childcare' => %w[needed_by children_count],
    'ride_share' => %w[from to departure_time],
    'food' => %w[pickup_window],
    'other' => []
  }.freeze

  belongs_to :user

  has_many :comments, dependent: :destroy
  has_many :direct_messages, dependent: :destroy
  has_many :ratings, dependent: :nullify
  has_many :flags, as: :flaggable, dependent: :destroy

  enum :post_type, POST_TYPES, prefix: true, validate: true

  validates :title, presence: true, length: { maximum: 200 }
  validates :content, presence: true, length: { maximum: 5000 }
  validates :post_type, inclusion: { in: POST_TYPES.values }, allow_blank: true
  validate :metadata_must_be_a_hash
  validate :metadata_requirements_for_post_type

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
  scope :by_post_type, ->(post_type) { where(post_type: post_type) }

  before_validation :normalize_post_type

  def author_name
    user.username || user.email || "Anonymous User"
  end

  private

  def normalize_post_type
    self.post_type = post_type.to_s.downcase.presence || 'other'
  end

  def metadata_must_be_a_hash
    return if metadata.is_a?(Hash)

    errors.add(:metadata, 'must be an object')
  end

  def metadata_requirements_for_post_type
    return unless metadata.is_a?(Hash)

    required_fields = TYPE_METADATA_REQUIREMENTS.fetch(post_type, [])
    missing_fields = required_fields.select { |field| metadata[field].blank? }

    return if missing_fields.empty?

    errors.add(:metadata, "is missing required fields for #{post_type}: #{missing_fields.join(', ')}")
  end
end
