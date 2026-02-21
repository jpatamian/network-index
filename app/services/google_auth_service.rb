class GoogleAuthService
  ValidationError = Class.new(StandardError)
  ConfigurationError = Class.new(StandardError)

  def self.authenticate(credential:, zipcode: nil)
    new(credential: credential, zipcode: zipcode).authenticate
  end

  def initialize(credential:, zipcode: nil)
    @credential = credential
    @zipcode = zipcode
  end

  def authenticate
    payload = verify_credential!
    email = payload["email"]
    email_verified = ActiveModel::Type::Boolean.new.cast(payload["email_verified"])

    raise ValidationError, "Google account email is not verified" unless email.present? && email_verified

    user = find_or_create_user(email, payload)
    user
  end

  private

  def verify_credential!
    client_id =
      ENV["GOOGLE_CLIENT_ID"].presence ||
      ENV["VITE_GOOGLE_CLIENT_ID"].presence ||
      Rails.application.credentials.dig(:google, :client_id).presence

    raise ConfigurationError, "Set GOOGLE_CLIENT_ID (or VITE_GOOGLE_CLIENT_ID) in server environment" if client_id.blank?

    GoogleIDToken::Validator.new.check(@credential, client_id)
  rescue GoogleIDToken::ValidationError => e
    raise ValidationError, e.message
  end

  def find_or_create_user(email, payload)
    user = User.find_by(email: email)
    return user if user

    random_password = SecureRandom.hex(24)
    attributes = {
      email: email,
      display_name: payload["name"],
      username: nil,
      anonymous: false,
      password: random_password,
      password_confirmation: random_password
    }
    attributes[:zipcode] = @zipcode if @zipcode.present?

    user = User.new(attributes)
    raise ActiveRecord::RecordInvalid.new(user) unless user.save

    user
  end
end
