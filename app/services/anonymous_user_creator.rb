class AnonymousUserCreator
  def self.create(zipcode:)
    return nil if zipcode.blank?

    User.create(anonymous: true)
  end
end
