class User < ApplicationRecord
  # Associations
  has_many :posts, dependent: :destroy

  # BCrypt password authentication - allow_nil for anonymous users
  has_secure_password validations: false

  # Validations
  validates :zipcode, presence: true
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
