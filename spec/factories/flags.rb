FactoryBot.define do
  factory :flag do
    association :flagger_user, factory: :user
    reviewed_by_user { nil }
    reason { Faker::Lorem.sentence }
    description { Faker::Lorem.paragraph }
    status { 'unreviewed' }

    # Need to set flaggable - will be set in traits
    # This requires the test to specify the flaggable

    # Trait for flags on posts
    trait :for_post do
      association :flaggable, factory: :post, strategy: :create
    end

    # Trait for flags on comments
    trait :for_comment do
      association :flaggable, factory: :comment, strategy: :create
    end

    # Trait for reviewed flags
    trait :reviewed do
      association :reviewed_by_user, factory: :user
      status { 'resolved' }
    end

    # Trait for rejected flags
    trait :rejected do
      association :reviewed_by_user, factory: :user
      status { 'rejected' }
    end

    # Trait for common reasons
    trait :spam do
      reason { 'Spam' }
      description { 'This looks like spam or self-promotion' }
    end

    trait :inappropriate do
      reason { 'Inappropriate content' }
      description { 'This contains inappropriate or offensive content' }
    end

    trait :misleading do
      reason { 'Misleading' }
      description { 'This information is misleading or inaccurate' }
    end
  end
end
