FactoryBot.define do
  factory :comment do
    association :post
    association :user
    sequence(:message) { |n| "Comment #{n}: #{Faker::Lorem.paragraphs(number: 2).join(' ')}" }

    # Trait with flags
    trait :with_flags do
      after(:create) do |comment|
        create_list(:flag, 1, flaggable: comment)
      end
    end

    # Trait with comment histories (edits)
    trait :with_history do
      after(:create) do |comment|
        create_list(:comment_history, 2, comment: comment)
      end
    end

    # Trait for short comment
    trait :short do
      message { "Short comment" }
    end

    # Trait for long comment
    trait :long do
      sequence(:message) { |n| "Long comment #{n}: #{Faker::Lorem.paragraphs(number: 5).join(' ')}" }
    end
  end
end
