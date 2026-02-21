FactoryBot.define do
  factory :notification do
    association :user
    association :post
    association :actor_user, factory: :user
    notification_type { 'like' }
    sequence(:message) { |n| "Notification #{n}: Someone interacted with your post" }
  end
end
