FactoryBot.define do
  factory :post do
    association :user
    sequence(:title) { |n| "Post Title #{n}" }
    sequence(:content) { |n| "This is the content for post #{n}. #{Faker::Lorem.paragraphs(number: 3).join(' ')}" }
    status { 'open' }
    is_hidden { false }

    # Trait for fulfilled posts
    trait :fulfilled do
      status { 'fulfilled' }
    end

    # Trait for hidden posts
    trait :hidden do
      is_hidden { true }
    end

    # Trait with comments
    trait :with_comments do
      after(:create) do |post|
        create_list(:comment, 3, post: post)
      end
    end

    # Trait with ratings
    trait :with_ratings do
      after(:create) do |post|
        create_list(:rating, 2, post: post)
      end
    end

    # Trait with flags
    trait :with_flags do
      after(:create) do |post|
        create_list(:flag, 1, flaggable: post)
      end
    end

    # Trait with all associations
    trait :with_all_associations do
      after(:create) do |post|
        create_list(:comment, 2, post: post)
        create_list(:rating, 1, post: post)
        create_list(:direct_message, 1, post: post)
      end
    end
  end
end
