FactoryBot.define do
  factory :user_safety_report do
    association :reporter_user, factory: :user
    association :reported_user, factory: :user
    association :post, factory: :post
    reviewed_by_user { nil }
    incident_type { Faker::Lorem.sentence }
    description { Faker::Lorem.paragraphs(number: 2).join(' ') }
    status { 'pending' }

    # Trait for reviewed reports
    trait :reviewed do
      association :reviewed_by_user, factory: :user
      status { 'resolved' }
    end

    # Trait for rejected reports
    trait :rejected do
      association :reviewed_by_user, factory: :user
      status { 'rejected' }
    end

    # Trait for harassment reports
    trait :harassment do
      incident_type { 'Harassment' }
      description { 'User is harassing me in messages and comments' }
    end

    # Trait for threatening behavior
    trait :threatening do
      incident_type { 'Threatening behavior' }
      description { 'User made threatening comments' }
    end

    # Trait for inappropriate behavior
    trait :inappropriate do
      incident_type { 'Inappropriate behavior' }
      description { 'User is behaving inappropriately' }
    end

    # Trait for scam/fraud reports
    trait :scam do
      incident_type { 'Scam/Fraud' }
      description { 'User is attempting to scam community members' }
    end

    # Trait without post
    trait :without_post do
      post { nil }
    end
  end
end
