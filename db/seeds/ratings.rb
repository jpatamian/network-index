# db/seeds/ratings.rb
# Creates ratings for fulfilled interactions

puts "   ⭐ Creating ratings..."

POSITIVE_REVIEWS = [
  "Amazing help! Very friendly and professional.",
  "Couldn't have done it without them. Highly recommend!",
  "Super helpful and reliable. Will definitely reach out again.",
  "Went above and beyond what I expected. Thank you!",
  "Great communication and showed up right on time.",
  "So grateful for their help. True neighbor!",
  "Made everything so easy. Really appreciate it.",
  "Wonderful person to work with. Five stars!",
  "Quick, efficient, and friendly. Perfect!",
  "This is what community is all about. Thank you!",
]

GOOD_REVIEWS = [
  "Very helpful, thank you!",
  "Got the job done. Appreciate it.",
  "Good experience overall.",
  "Helpful and kind.",
  "Would work with them again.",
  "Reliable and friendly.",
  "Everything went smoothly.",
  "Appreciate their time and help.",
]

OKAY_REVIEWS = [
  "Helped out but was a bit rushed.",
  "Got it done but communication could be better.",
  "Decent help, nothing special.",
  "It was fine.",
  "Task completed.",
]

ratings = []

# Rate users who have ratings
users_to_rate = @verified_helpers + @active_members.select { |u| u.total_ratings_count > 0 }

users_to_rate.each do |rated_user|
  # Create ratings matching their total_ratings_count
  num_ratings = rated_user.total_ratings_count
  next if num_ratings == 0
  
  # Find posts where this user helped (offers) or received help (requests fulfilled)
  # For simplicity, we'll create ratings without strict post linkage
  
  num_ratings.times do |i|
    # Get a rater (different user who could have interacted)
    rater = @all_authenticated_users.reject { |u| u.id == rated_user.id }.sample
    next unless rater
    
    # Find a post context (ideally fulfilled post involving rated_user)
    post_context = @fulfilled_posts.sample || @all_posts.sample
    
    # Rating distribution based on user's average_rating
    avg = rated_user.average_rating
    
    rating_value = if avg >= 4.8
                     [5, 5, 5, 5, 4].sample
                   elsif avg >= 4.5
                     [5, 5, 4, 4].sample
                   elsif avg >= 4.0
                     [5, 4, 4, 3].sample
                   else
                     [4, 3, 3, 2].sample
                   end
    
    # Review text based on rating
    review_text = if rating_value == 5
                    POSITIVE_REVIEWS.sample
                  elsif rating_value == 4
                    GOOD_REVIEWS.sample
                  elsif rating_value == 3
                    OKAY_REVIEWS.sample
                  else
                    nil # Lower ratings often don't have reviews
                  end
    
    rating = Rating.create!(
      rater_user: rater,
      rated_user: rated_user,
      post: post_context,
      rating_value: rating_value,
      review_text: review_text,
      created_at: rand(60).days.ago
    )
    
    ratings << rating
  end
end

puts "      ✓ Created #{ratings.count} ratings"

# Calculate rating distribution
[5, 4, 3, 2, 1].each do |value|
  count = ratings.count { |r| r.rating_value == value }
  puts "         #{value} stars: #{count}"
end

@all_ratings = ratings