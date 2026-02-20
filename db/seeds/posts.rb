# db/seeds/posts.rb
# Creates realistic mutual aid posts (requests and offers)

puts "   Creating posts..."

REQUESTS = [
  { title: 'Need ride to doctor appointment', content: 'I have a medical appointment at Cambridge Hospital on Thursday at 2pm. Would really appreciate a ride from Arlington Center. Can offer gas money.' },
  { title: 'Looking for help moving a couch', content: 'Moving this weekend and need help carrying a couch down from 2nd floor apartment. Should only take 30 minutes. Pizza and drinks provided!' },
  { title: 'In need of groceries this week', content: "Recovering from surgery and can't drive. Would be so grateful if someone could pick up groceries for me. I can Venmo for the items. Small order." },
  { title: 'Help with computer setup', content: "Just got a new laptop and I'm completely lost. Need help setting it up and transferring my files from my old one. Can offer homemade cookies!" },
  { title: 'Childcare for tomorrow afternoon', content: "Emergency work meeting came up tomorrow 2-5pm. Need someone to watch my 7-year-old daughter. She's very well-behaved. Can pay $20/hour." },
  { title: "Dog walking while I'm sick", content: "Came down with the flu and can barely get out of bed. My dog needs walks twice a day. He's friendly and well-trained. Just for this week." },
  { title: 'Leaky faucet driving me crazy', content: "Kitchen faucet has been dripping for weeks. Landlord won't fix it. Anyone handy with plumbing? I can pay for parts and your time." },
  { title: 'Need someone to talk to', content: "Going through a tough time and feeling isolated. Would love to grab coffee with a kind soul who's willing to listen." },
  { title: 'Help raking leaves', content: "Elderly homeowner here. My yard is covered in leaves and I can't do it myself anymore. Would really appreciate help. Can provide rakes and bags." },
  { title: 'Need furniture assembly help', content: "Bought IKEA furniture and I'm drowning in pieces and instructions. Need someone patient to help me assemble a bookshelf and desk." },
  { title: 'Meal prep assistance needed', content: 'New parent, completely overwhelmed. Would love help with meal prep for the week. I have groceries, just need cooking help.' },
  { title: 'Ride to grocery store', content: "Don't have a car and the bus doesn't run on Sundays. Need ride to Trader Joe's and back. Usually takes about an hour total." },
  { title: 'Help setting up router', content: "Internet company installed new router but WiFi isn't working right. Completely confused by all the settings. Tech-savvy help needed!" },
  { title: 'Temporary housing for friend', content: "Friend's apartment flooded. Need temporary place to stay for 3-4 days while repairs happen. Very respectful, quiet, will help with any chores." },
  { title: 'Spanish tutoring for my kid', content: "My 10-year-old is struggling with Spanish class. Looking for patient tutor for 1 hour/week. Can pay or trade services." },
]

OFFERS = [
  { title: 'Offering free music lessons', content: 'Professional musician offering free beginner piano or guitar lessons to kids or adults. One hour sessions on weekends.' },
  { title: 'Have extra garden vegetables', content: 'My garden produced way too many tomatoes and zucchini this year. Free to anyone who wants them. Come pick them up!' },
  { title: 'Can help with yard work', content: 'I love being outside and have landscaping experience. Happy to help with mowing, weeding, planting, etc. Weekends work best.' },
  { title: 'Free tax prep assistance', content: 'Certified tax preparer. Offering free help with simple tax returns (W2s, basic deductions). Available evenings this month.' },
  { title: 'Offering rides to medical appointments', content: 'Retired with a reliable car. Happy to drive folks to medical appointments in the area. Just need 24hr notice.' },
  { title: 'Tech support for seniors', content: 'Software engineer with patience. Free tech help for seniors - phones, computers, tablets, smart TVs. I make house calls.' },
  { title: 'Free dog walking', content: 'Work from home and love dogs. Happy to walk your dog during lunch breaks. Great for people who work long hours.' },
  { title: 'Extra meal portions available', content: 'I meal prep on Sundays and always make too much. Happy to share healthy home-cooked meals. Vegetarian options available.' },
  { title: 'Handyman services', content: 'Contractor offering free help with small home repairs for elderly or disabled neighbors. Painting, fixing doors, basic electrical, etc.' },
  { title: 'Babysitting available', content: 'Stay-at-home parent with teaching background. Can watch kids alongside mine. Ages 3-10. Weekdays 9am-3pm.' },
  { title: 'Free sewing and mending', content: 'Love to sew! Will hem pants, fix tears, replace buttons, etc. Bring me your mending pile.' },
  { title: 'Spare bedroom available', content: 'Have extra bedroom that sits empty. Can host someone in need for short-term stay (1-2 weeks). Clean, quiet home.' },
  { title: 'Resume review and job search help', content: "HR professional offering free resume reviews and interview prep. Helped many friends land jobs. Video calls work best." },
  { title: 'Photography services', content: "Amateur photographer building portfolio. Will do free headshots, family photos, or event coverage. You get the photos, I get practice!" },
  { title: 'Moving truck available', content: "Have pickup truck and can help with moves or large item pickup. Just cover gas and I'm happy to help. Weekends only." },
]

posts_created = 0

# Anonymous users post requests (recent, mostly open)
@anonymous_users.each_with_index do |user, i|
  next if i >= REQUESTS.length
  Post.create!(
    user: user,
    title: REQUESTS[i][:title],
    content: REQUESTS[i][:content],
    post_type: 'request',
    status: 'open',
    created_at: rand(1..60).days.ago
  )
  posts_created += 1
end

# Active members post remaining requests
remaining_requests = REQUESTS[@anonymous_users.length..-1] || []
@active_members.take(remaining_requests.length).each_with_index do |user, i|
  status = ['open', 'open', 'open', 'in_progress', 'fulfilled'].sample
  Post.create!(
    user: user,
    title: remaining_requests[i][:title],
    content: remaining_requests[i][:content],
    post_type: 'request',
    status: status,
    created_at: rand(1..60).days.ago
  )
  posts_created += 1
end

puts "      Created #{posts_created} requests"

# Create offers from verified helpers and active members
offers_created = 0

@verified_helpers.each_with_index do |user, i|
  next if i >= OFFERS.length
  status = ['open', 'open', 'open', 'in_progress'].sample
  Post.create!(
    user: user,
    title: OFFERS[i][:title],
    content: OFFERS[i][:content],
    post_type: 'offer',
    status: status,
    created_at: rand(1..60).days.ago
  )
  offers_created += 1
end

remaining_offers = OFFERS[@verified_helpers.length..-1] || []
@active_members.drop(6).take(remaining_offers.length).each_with_index do |user, i|
  status = ['open', 'open', 'fulfilled'].sample
  Post.create!(
    user: user,
    title: remaining_offers[i][:title],
    content: remaining_offers[i][:content],
    post_type: 'offer',
    status: status,
    created_at: rand(1..60).days.ago
  )
  offers_created += 1
end

puts "      Created #{offers_created} offers"

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
puts "         Open: #{Post.where(status: 'open').count}"
puts "         In Progress: #{Post.where(status: 'in_progress').count}"
puts "         Fulfilled: #{Post.where(status: 'fulfilled').count}"
