# db/seeds/comments.rb
# Creates realistic comments on posts

puts "   💬 Creating comments..."

HELPFUL_COMMENTS = [
  "I can help with this! What time works best for you?",
  "I'm nearby and available. Send me a message!",
  "This is exactly what I was looking for. Thanks for posting!",
  "I've done this before and happy to help. DM me.",
  "Perfect timing - I was just about to offer this.",
  "Still available? I'm interested!",
  "I'd love to help out. Free this weekend.",
  "Count me in! What day were you thinking?",
  "I have experience with this. Would be happy to assist.",
  "Great offer! Sent you a message.",
]

QUESTION_COMMENTS = [
  "What area are you located in?",
  "Is this still available?",
  "How long do you think this will take?",
  "Do you need any special equipment?",
  "What dates work for you?",
  "Any specific requirements?",
  "Is morning or afternoon better?",
  "How many people do you need?",
  "Should I bring anything?",
  "What's your availability like?",
]

SUPPORTIVE_COMMENTS = [
  "Hope you find someone! This community is great.",
  "Bumping this up - someone please help!",
  "What a kind offer. Thank you for doing this!",
  "This is what I love about our neighborhood.",
  "Wish I could help but I'm out of town. Good luck!",
  "Amazing that you're offering this. Real community spirit.",
  "Thank you for being so generous!",
  "I hope someone can help you soon.",
  "This is such a thoughtful offer.",
  "Wishing you the best with this!",
]

FOLLOWUP_COMMENTS = [
  "Update: Found someone! Thanks everyone.",
  "Still looking for help if anyone is available.",
  "This worked out great, thanks to this community!",
  "Rescheduled to next week, still need help.",
  "All set now, appreciate all the responses!",
]

comments = []

# Add comments to posts
@all_posts.each do |post|
  # Number of comments varies
  num_comments = [0, 0, 1, 1, 2, 2, 3, 3, 4, 5].sample
  
  next if num_comments == 0
  
  # Get potential commenters (can't comment on own post, must be authenticated)
  potential_commenters = @all_authenticated_users.reject { |u| u.id == post.user_id }
  
  num_comments.times do |i|
    commenter = potential_commenters.sample
    next unless commenter
    
    # Choose comment type based on post status and comment order
    message = if i == 0 && post.status == 'open'
                HELPFUL_COMMENTS.sample
              elsif i == 0
                QUESTION_COMMENTS.sample
              elsif i < num_comments - 1
                [HELPFUL_COMMENTS, QUESTION_COMMENTS, SUPPORTIVE_COMMENTS].sample.sample
              else
                post.status == 'fulfilled' ? FOLLOWUP_COMMENTS.sample : SUPPORTIVE_COMMENTS.sample
              end
    
    comment = Comment.create!(
      post: post,
      user: commenter,
      message: message,
      created_at: post.created_at + rand(1..48).hours,
      updated_at: post.created_at + rand(1..48).hours
    )
    
    comments << comment
  end
end

puts "      ✓ Created #{comments.count} comments"
puts "         Average per post: #{(comments.count.to_f / @all_posts.count).round(1)}"

# Add a few edited comments with history
if defined?(CommentHistory)
  edited_comments = comments.sample(3)
  edited_comments.each do |comment|
    original_message = comment.message
    comment.update!(
      message: "#{original_message} [EDITED: Added more details]",
      updated_at: comment.created_at + 2.hours
    )
    
    CommentHistory.create!(
      comment: comment,
      edited_by_user_id: comment.user_id,
      old_message: original_message,
      new_message: comment.message,
      edited_at: comment.updated_at
    )
  end
  
  puts "      ✓ Created #{edited_comments.count} edited comments with history"
end

# Store for other seed files
@all_comments = comments