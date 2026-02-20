class User < ApplicationRecord
  # Associations
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :sent_direct_messages, class_name: 'DirectMessage', foreign_key: :sender_id, dependent: :destroy
  has_many :received_direct_messages, class_name: 'DirectMessage', foreign_key: :recipient_id, dependent: :destroy
  has_many :given_ratings, class_name: 'Rating', foreign_key: :rater_user_id, dependent: :destroy
  has_many :received_ratings, class_name: 'Rating', foreign_key: :rated_user_id, dependent: :destroy
  has_many :flags_created, class_name: 'Flag', foreign_key: :flagger_user_id, dependent: :nullify
  has_many :reported_safety_reports, class_name: 'UserSafetyReport', foreign_key: :reporter_user_id, dependent: :destroy
  has_many :received_safety_reports, class_name: 'UserSafetyReport', foreign_key: :reported_user_id, dependent: :destroy
  has_many :comment_histories, foreign_key: :edited_by_user_id, dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_many :sent_notifications, class_name: 'Notification', foreign_key: :actor_user_id, dependent: :nullify
  has_many :post_likes, dependent: :destroy
  has_many :liked_posts, through: :post_likes, source: :post

  # BCrypt password authentication - allow_nil for anonymous users
  has_secure_password validations: false

  # Validations
  validates :username, uniqueness: true, allow_nil: true
  validates :email, uniqueness: true, allow_nil: true
  validates :phone, uniqueness: true, allow_nil: true

  # Custom validation: authenticated users need email OR phone
  validate :email_or_phone_required, unless: :anonymous?

  # Password validation for authenticated users
  validates :password, presence: true, length: { minimum: 6 }, if: :password_required?

  # Scopes
  scope :anonymous, -> { where(anonymous: true) }
  scope :authenticated, -> { where(anonymous: false) }

  # Instance methods
  def authenticated?
    !anonymous
  end

  private

  def email_or_phone_required
    if email.blank? && phone.blank?
      errors.add(:base, "Email or phone number is required")
    end
  end

  def password_required?
    # Require password for new authenticated users or when changing password
    !anonymous? && (new_record? || password.present?)
  end
end
