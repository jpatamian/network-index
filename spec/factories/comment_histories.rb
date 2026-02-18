FactoryBot.define do
  factory :comment_history do
    association :comment
    association :edited_by_user, factory: :user
    old_message { Faker::Lorem.paragraph }
    new_message { Faker::Lorem.paragraph }

    # Trait for recent edits
    trait :recent do
      created_at { 5.minutes.ago }
    end

    # Trait for old edits
    trait :old do
      created_at { 1.month.ago }
    end

    # Trait for minimal changes
    trait :minor_edit do
      new_message { "Original message with minor typo fix" }
    end

    # Trait for significant changes
    trait :major_edit do
      old_message { "Original long message" }
      sequence(:new_message) { |n| "Completely rewritten message #{n} with different content" }
    end
  end
end
