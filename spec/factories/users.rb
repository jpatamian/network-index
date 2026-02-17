FactoryBot.define do
  factory :user do
    # Default: authenticated user with email
    sequence(:email) { |n| "user#{n}@example.com" }
    zipcode { Faker::Address.zip_code }
    password { "password123" }
    password_confirmation { "password123" }
    anonymous { false }

    # Optional username
    trait :with_username do
      sequence(:username) { |n| "user#{n}" }
    end

    # Anonymous user variant
    factory :anonymous_user do
      email { nil }
      password { nil }
      password_confirmation { nil }
      anonymous { true }
    end

    # User with phone instead of email
    factory :user_with_phone do
      email { nil }
      sequence(:phone) { |n| Faker::PhoneNumber.cell_phone.gsub(/\D/, '')[0..9] }
    end

    # User with both email and phone
    factory :user_with_both do
      sequence(:email) { |n| "user#{n}@example.com" }
      sequence(:phone) { |n| Faker::PhoneNumber.cell_phone.gsub(/\D/, '')[0..9] }
    end
  end
end
