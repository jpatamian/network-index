FactoryBot.define do
  factory :direct_message do
    association :post
    association :sender, factory: :user
    association :recipient, factory: :user
    sequence(:message) { |n| "Direct message #{n}: #{Faker::Lorem.paragraphs(number: 2).join(' ')}" }
    read_at { nil }

    # Trait for read messages
    trait :read do
      read_at { Time.current }
    end

    # Trait for unread messages
    trait :unread do
      read_at { nil }
    end

    # Trait with short message
    trait :short do
      message { "Short DM" }
    end

    # Trait for old messages
    trait :old do
      created_at { 1.month.ago }
      read_at { 1.month.ago }
    end
  end
end
