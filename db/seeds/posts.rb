# db/seeds/posts.rb
# Creates realistic mutual aid posts (requests and offers)

puts "   Creating posts..."

# Childcare posts
CHILDCARE_POSTS = [
  { title: 'Emergency childcare needed tomorrow', content: "Emergency work meeting came up tomorrow 2-5pm. Need someone to watch my 7-year-old daughter. She's very well-behaved. Can pay $20/hour.", metadata: { needed_by: (Date.current + 1.day).to_s, children_count: 1 } },
  { title: 'After-school care for two kids', content: "Looking for reliable after-school care for my 8 and 10-year-old. Monday-Friday, 3-6pm. Kids are independent but need supervision.", metadata: { needed_by: (Date.current + 3.days).to_s, children_count: 2 } },
  { title: 'Babysitting available weekdays', content: 'Stay-at-home parent with teaching background. Can watch kids alongside mine. Ages 3-10. Weekdays 9am-3pm.', metadata: { needed_by: Date.current.to_s, children_count: 2 } },
  { title: 'Weekend childcare available', content: "Former teacher offering weekend babysitting. Great with kids of all ages. CPR certified. Available Saturdays and Sundays.", metadata: { needed_by: (Date.current + 2.days).to_s, children_count: 3 } }
]

# Ride share posts
RIDE_SHARE_POSTS = [
  { title: 'Need ride to doctor appointment', content: 'I have a medical appointment at Cambridge Hospital on Thursday at 2pm. Would really appreciate a ride from Arlington Center. Can offer gas money.', metadata: { from: 'Arlington Center', to: 'Cambridge Hospital', departure_time: '2:00 PM' } },
  { title: 'Ride to grocery store', content: "Don't have a car and the bus doesn't run on Sundays. Need ride to Trader Joe's and back. Usually takes about an hour total.", metadata: { from: 'Home', to: "Trader Joe's", departure_time: '10:00 AM' } },
  { title: 'Offering rides to medical appointments', content: 'Retired with a reliable car. Happy to drive folks to medical appointments in the area. Just need 24hr notice.', metadata: { from: 'Somerville', to: 'Medical facilities', departure_time: 'Flexible' } },
  { title: 'Daily commute carpool', content: 'Driving to Boston downtown every weekday morning. Can pick up 1-2 people along Route 2. Leave at 7:30am sharp.', metadata: { from: 'Arlington', to: 'Boston Downtown', departure_time: '7:30 AM' } },
  { title: 'Airport ride needed', content: 'Flying out Friday morning at 6am. Need ride to Logan Airport from Somerville. Will pay gas + extra for early morning.', metadata: { from: 'Somerville', to: 'Logan Airport', departure_time: '4:30 AM' } }
]

# Food posts
FOOD_POSTS = [
  { title: 'Extra meal portions available', content: 'I meal prep on Sundays and always make too much. Happy to share healthy home-cooked meals. Vegetarian options available.', metadata: { pickup_window: 'Sunday 6-8pm' } },
  { title: 'Have extra garden vegetables', content: 'My garden produced way too many tomatoes and zucchini this year. Free to anyone who wants them. Come pick them up!', metadata: { pickup_window: 'Daily 9am-6pm' } },
  { title: 'Need groceries this week', content: "Recovering from surgery and can't drive. Would be so grateful if someone could pick up groceries for me. I can Venmo for the items. Small order.", metadata: { pickup_window: 'Anytime this week' } },
  { title: 'Homemade soup to share', content: 'Made a huge pot of chicken soup. Way too much for my family. Free to anyone who needs a warm meal. Bring your own container!', metadata: { pickup_window: 'Today 12-7pm' } },
  { title: 'Fresh baked bread', content: 'I bake bread as a hobby and always have extra loaves. Free sourdough and whole wheat. Pick up on weekends.', metadata: { pickup_window: 'Saturday-Sunday 10am-2pm' } }
]

# Other posts
OTHER_POSTS = [
  { title: 'Looking for help moving a couch', content: 'Moving this weekend and need help carrying a couch down from 2nd floor apartment. Should only take 30 minutes. Pizza and drinks provided!', metadata: {} },
  { title: 'Help with computer setup', content: "Just got a new laptop and I'm completely lost. Need help setting it up and transferring my files from my old one. Can offer homemade cookies!", metadata: {} },
  { title: 'Tech support for seniors', content: 'Software engineer with patience. Free tech help for seniors - phones, computers, tablets, smart TVs. I make house calls.', metadata: {} },
  { title: 'Free tax prep assistance', content: 'Certified tax preparer. Offering free help with simple tax returns (W2s, basic deductions). Available evenings this month.', metadata: {} },
  { title: 'Handyman services', content: 'Contractor offering free help with small home repairs for elderly or disabled neighbors. Painting, fixing doors, basic electrical, etc.', metadata: {} },
  { title: 'Help setting up router', content: "Internet company installed new router but WiFi isn't working right. Completely confused by all the settings. Tech-savvy help needed!", metadata: {} },
  { title: 'Free sewing and mending', content: 'Love to sew! Will hem pants, fix tears, replace buttons, etc. Bring me your mending pile.', metadata: {} }
]

posts_created = 0

# Create childcare posts
all_users = (@anonymous_users + @active_members + @verified_helpers).shuffle
CHILDCARE_POSTS.each_with_index do |post_data, i|
  user = all_users[i % all_users.length]
  status = ['open', 'open', 'fulfilled'].sample
  Post.create!(
    user: user,
    title: post_data[:title],
    content: post_data[:content],
    post_type: 'childcare',
    metadata: post_data[:metadata],
    status: status,
    created_at: rand(1..60).days.ago
  )
  posts_created += 1
end
puts "      Created #{CHILDCARE_POSTS.length} childcare posts"

# Create ride share posts
RIDE_SHARE_POSTS.each_with_index do |post_data, i|
  user = all_users[(i + CHILDCARE_POSTS.length) % all_users.length]
  status = ['open', 'open', 'fulfilled'].sample
  Post.create!(
    user: user,
    title: post_data[:title],
    content: post_data[:content],
    post_type: 'ride_share',
    metadata: post_data[:metadata],
    status: status,
    created_at: rand(1..60).days.ago
  )
  posts_created += 1
end
puts "      Created #{RIDE_SHARE_POSTS.length} ride_share posts"

# Create food posts
FOOD_POSTS.each_with_index do |post_data, i|
  user = all_users[(i + CHILDCARE_POSTS.length + RIDE_SHARE_POSTS.length) % all_users.length]
  status = ['open', 'open', 'fulfilled'].sample
  Post.create!(
    user: user,
    title: post_data[:title],
    content: post_data[:content],
    post_type: 'food',
    metadata: post_data[:metadata],
    status: status,
    created_at: rand(1..60).days.ago
  )
  posts_created += 1
end
puts "      Created #{FOOD_POSTS.length} food posts"

# Create other posts
OTHER_POSTS.each_with_index do |post_data, i|
  user = all_users[(i + CHILDCARE_POSTS.length + RIDE_SHARE_POSTS.length + FOOD_POSTS.length) % all_users.length]
  status = ['open', 'open', 'fulfilled'].sample
  Post.create!(
    user: user,
    title: post_data[:title],
    content: post_data[:content],
    post_type: 'other',
    metadata: post_data[:metadata],
    status: status,
    created_at: rand(1..60).days.ago
  )
  posts_created += 1
end
puts "      Created #{OTHER_POSTS.length} other posts"

# Add a flagged post for moderation testing
flagged_post = Post.create!(
  user: @active_members.last,
  title: 'This post contains inappropriate content',
  content: 'This is a test post that should be flagged. Contains some problematic language for testing moderation.',
  post_type: 'other',
  status: 'open',
  created_at: rand(1..14).days.ago
)
flagged_post.update!(is_flagged: true, flag_count: 2)

puts "      Created 1 flagged post for testing"

# Store posts for other seed files
@all_posts = Post.all.to_a
@open_requests = Post.where(status: 'open').to_a
@fulfilled_posts = Post.where(status: 'fulfilled').to_a

puts "      Total posts created: #{Post.count}"
puts "         Childcare: #{Post.where(post_type: 'childcare').count}"
puts "         Ride Share: #{Post.where(post_type: 'ride_share').count}"
puts "         Food: #{Post.where(post_type: 'food').count}"
puts "         Other: #{Post.where(post_type: 'other').count}"
puts "         Open: #{Post.where(status: 'open').count}"
puts "         Fulfilled: #{Post.where(status: 'fulfilled').count}"
