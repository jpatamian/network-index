FactoryBot.define do
  factory :rating do
    association :rater_user, factory: :user
    association :rated_user, factory: :user
    association :post, factory: :post
    rating_value { Faker::Number.between(from: 1, to: 5) }

    # Trait for 5-star ratings
    trait :five_stars do
      rating_value { 5 }
    end

    # Trait for 4-star ratings
    trait :four_stars do
      rating_value { 4 }
    end

    # Trait for 3-star ratings
    trait :three_stars do
      rating_value { 3 }
    end

    # Trait for 2-star ratings
    trait :two_stars do
      rating_value { 2 }
    end

    # Trait for 1-star ratings
    trait :one_star do
      rating_value { 1 }
    end

    # Trait without post
    trait :without_post do
      post { nil }
    end
  end
end
