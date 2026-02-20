FactoryBot.define do
  factory :post do
    association :user
    sequence(:title) { |n| "Post Title #{n}" }
    sequence(:content) { |n| "This is the content for post #{n}. #{Faker::Lorem.paragraphs(number: 3).join(' ')}" }
    status { 'open' }
    is_hidden { false }
    post_type { 'other' }
    metadata { {} }

    trait :fulfilled do
      status { 'fulfilled' }
    end

    trait :hidden do
      is_hidden { true }
    end

    trait :with_comments do
      after(:create) do |post|
        create_list(:comment, 3, post: post)
      end
    end

    trait :with_ratings do
      after(:create) do |post|
        create_list(:rating, 2, post: post)
      end
    end

    trait :with_flags do
      after(:create) do |post|
        create_list(:flag, 1, flaggable: post)
      end
    end

    trait :with_all_associations do
      after(:create) do |post|
        create_list(:comment, 2, post: post)
        create_list(:rating, 1, post: post)
        create_list(:direct_message, 1, post: post)
      end
    end

    trait :childcare do
      post_type { 'childcare' }
      metadata { { 'needed_by' => 1.day.from_now.iso8601, 'children_count' => 2 } }
    end

    trait :ride_share do
      post_type { 'ride_share' }
      metadata do
        {
          'from' => 'Downtown',
          'to' => 'Airport',
          'departure_time' => 2.hours.from_now.iso8601
        }
      end
    end

    trait :food do
      post_type { 'food' }
      metadata { { 'pickup_window' => '6pm-8pm' } }
    end
  end
end
