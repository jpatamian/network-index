# db/seeds/flags.rb
# Creates flagged content for moderation testing

puts "   🚩 Creating flags..."

FLAG_DESCRIPTIONS = {
  profanity: [
    "Contains inappropriate language",
    "Offensive words used",
    "Not appropriate for community"
  ],
  spam: [
    "This looks like spam to me",
    "Advertising commercial services",
    "Posted multiple times"
  ],
  harassment: [
    "Targeting another user inappropriately",
    "Aggressive tone and language",
    "Making personal attacks"
  ],
  inappropriate: [
    "Doesn't belong on this platform",
    "Seems sketchy",
    "Not appropriate for a mutual aid platform"
  ],
  off_topic: [
    "This isn't mutual aid related",
    "Wrong category",
    "Doesn't fit the community purpose"
  ]
}

flags = []

# Flag some posts
posts_to_flag = @all_posts.sample(5)

posts_to_flag.each_with_index do |post, i|
  reason = FLAG_DESCRIPTIONS.keys.sample
  num_flags = [ 1, 2, 2, 3, 4 ].sample # Some reach threshold

  # Different users flag the same post
  flaggers = @all_authenticated_users.sample(num_flags)

  flaggers.each do |flagger|
    next if flagger.id == post.user_id # Can't flag your own post

    flag = Flag.create!(
      flaggable_type: 'Post',
      flaggable_id: post.id,
      flagger_user: flagger,
      reason: reason,
      description: FLAG_DESCRIPTIONS[reason].sample,
      status: i < 2 ? 'pending' : 'reviewed', # Some reviewed, some pending
      is_auto_flagged: false,
      created_at: rand(14).days.ago,
      reviewed_at: i < 2 ? nil : rand(1..7).days.ago,
      reviewed_by_user_id: i < 2 ? nil : @moderator.id
    )

    flags << flag
  end

  # Update post flag count and hidden status
  post.update!(
    flag_count: flaggers.count,
    is_flagged: true,
    is_hidden: flaggers.count >= 3
  )
end

puts "      ✓ Created #{flags.count} post flags"

# Flag some comments
if @all_comments.any?
  comments_to_flag = @all_comments.sample(3)

  comments_to_flag.each_with_index do |comment, i|
    reason = [ :profanity, :harassment, :spam ].sample
    num_flags = [ 1, 2 ].sample

    flaggers = @all_authenticated_users.sample(num_flags)

    flaggers.each do |flagger|
      next if flagger.id == comment.user_id

      flag = Flag.create!(
        flaggable_type: 'Comment',
        flaggable_id: comment.id,
        flagger_user: flagger,
        reason: reason,
        description: FLAG_DESCRIPTIONS[reason].sample,
        status: 'pending',
        is_auto_flagged: false,
        created_at: comment.created_at + rand(1..48).hours
      )

      flags << flag
    end

    comment.update!(
      flag_count: flaggers.count,
      is_flagged: true,
      is_hidden: flaggers.count >= 3
    )
  end

  puts "      ✓ Created #{flags.count - posts_to_flag.map { |p| Flag.where(flaggable_type: 'Post', flaggable_id: p.id).count }.sum} comment flags"
end

# Create some auto-flagged content (from profanity filter)
auto_flagged_post = @all_posts.sample
flag = Flag.create!(
  flaggable_type: 'Post',
  flaggable_id: auto_flagged_post.id,
  flagger_user: nil, # System flagged
  reason: 'profanity',
  description: 'Auto-flagged by profanity filter: detected inappropriate language',
  status: 'pending',
  is_auto_flagged: true,
  created_at: auto_flagged_post.created_at + 1.hour
)

auto_flagged_post.update!(flag_count: auto_flagged_post.flag_count + 1, is_flagged: true)
flags << flag

puts "      ✓ Created 1 auto-flagged post"

puts "      ✓ Total flags created: #{flags.count}"
puts "         Pending review: #{flags.count { |f| f.status == 'pending' }}"
puts "         Reviewed: #{flags.count { |f| f.status == 'reviewed' }}"
puts "         Posts hidden: #{Post.where(is_hidden: true).count}"

@all_flags = flags
