class AnonymousUserCreator
  def self.create(zipcode:)
    return nil if zipcode.blank?

    User.create!(zipcode: zipcode, anonymous: true)
  end
end
