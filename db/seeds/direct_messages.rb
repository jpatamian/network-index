# db/seeds/direct_messages.rb
# Creates realistic direct message conversations between users

puts "   📨 Creating direct messages..."

DM_STARTERS = [
  "Hi! I saw your post and I'd love to help.",
  "Hey, is this still available?",
  "I'm interested in your offer. Can we discuss details?",
  "Hi there! I think I can help with this.",
  "Saw your post - I'm available and nearby.",
  "Hello! I'd like to learn more about this.",
]

DM_RESPONSES = [
  "Yes, still available! When works for you?",
  "That would be great! Are you free this week?",
  "Thank you so much! What time is good?",
  "Perfect! Let me know what you need.",
  "Awesome, really appreciate it. How about Saturday?",
  "Yes please! Does tomorrow work?",
]

DM_DETAILS = [
  "I'm usually free after 5pm on weekdays.",
  "My address is 123 Main St. Does that work?",
  "I can meet you wherever is convenient.",
  "Should take about an hour. I have all the tools.",
  "Let me know if you need anything specific.",
  "I'm at [phone number]. Text me!",
]

DM_THANKS = [
  "Thank you so much for helping!",
  "Really appreciate this, you're amazing!",
  "You're a lifesaver, thank you!",
  "This community is the best. Thanks again!",
  "So grateful for your help!",
]

direct_messages = []

# Create DM threads for some posts
posts_with_dms = @all_posts.sample(@all_posts.count / 2)

posts_with_dms.each do |post|
  # Skip if post is from anonymous user (they can receive DMs but makes testing easier to skip)
  next if post.user.anonymous?
  
  # 1-3 DM threads per post
  num_threads = [1, 1, 2, 2, 3].sample
  
  # Get potential DM senders (must be authenticated, not post owner)
  potential_senders = @all_authenticated_users.reject { |u| u.id == post.user_id }
  
  num_threads.times do
    sender = potential_senders.sample
    next unless sender
    
    # Create conversation thread (2-4 messages back and forth)
    conversation_length = [2, 3, 4].sample
    
    conversation_length.times do |i|
      is_sender_turn = i.even?
      
      from_user = is_sender_turn ? sender : post.user
      to_user = is_sender_turn ? post.user : sender
      
      message = case i
                when 0
                  DM_STARTERS.sample
                when 1
                  DM_RESPONSES.sample
                when 2
                  DM_DETAILS.sample
                else
                  DM_THANKS.sample
                end
      
      dm = DirectMessage.create!(
        post: post,
        sender: from_user,
        recipient: to_user,
        message: message,
        created_at: post.created_at + (i * 2).hours,
        read_at: post.created_at + (i * 2 + 1).hours
      )
      
      direct_messages << dm
    end
  end
end

puts "      ✓ Created #{direct_messages.count} direct messages"
puts "         Threads: ~#{(direct_messages.count / 3.0).round}"

# Create some unread messages
unread_messages = direct_messages.sample(direct_messages.count / 5)
unread_messages.each do |dm|
  dm.update!(read_at: nil)
end

puts "      ✓ Marked #{unread_messages.count} messages as unread"

@all_direct_messages = direct_messages