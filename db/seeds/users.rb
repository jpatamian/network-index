# db/seeds/users.rb
# Creates authenticated and anonymous users for testing

puts "   Creating users..."

# Arlington, MA and surrounding area zipcodes
ARLINGTON_ZIPCODES = [
  '02474', '02476', '02144', '02145', '02143',
  '02138', '02139', '02140', '02141', '02142',
  '02155', '02156', '02478', '02421', '02420',
  '02452', '02453',
]

NEIGHBORHOODS = [
  'Arlington Center', 'Arlington Heights', 'East Arlington',
  'Davis Square', 'Porter Square', 'Harvard Square',
  'Central Square', 'Inman Square', 'Union Square',
  'Ball Square', 'Medford Square', 'Belmont Center',
  'Lexington Center', 'Waltham Center'
]

# 1. Create Moderator Account
moderator = User.create!(
  username: 'moderator',
  email: 'moderator@networkindex.org',
  password: 'password123',
  password_confirmation: 'password123',
  display_name: 'Network Moderator',
  bio: 'Official moderator account for Mutual Aid Club. Here to help keep our community safe and supportive.',
  is_moderator: true,
  anonymous: false,
  zipcode: ARLINGTON_ZIPCODES.sample
)

puts "      Created moderator account"

# 2. Create High-Reputation Helpers (Verified members)
verified_helpers = []

[
  {
    username: 'alice_helper',
    email: 'alice.helper@example.com',
    display_name: 'Alice Thompson',
    bio: 'Retired teacher who loves helping neighbors. Available most weekdays. Speak English and Spanish.',
    avg_rating: 4.8,
    rating_count: 24
  },
  {
    username: 'bob_gardener',
    email: 'bob.gardener@example.com',
    display_name: 'Bob Martinez',
    bio: 'Landscaper by trade. Happy to help with yard work, moving heavy items, basic home repairs.',
    avg_rating: 4.9,
    rating_count: 31
  },
  {
    username: 'carol_tech',
    email: 'carol.tech@example.com',
    display_name: 'Carol Chen',
    bio: 'Software engineer. Can help with computer issues, tech setup, website questions. Weekends only.',
    avg_rating: 5.0,
    rating_count: 18
  },
  {
    username: 'david_rides',
    email: 'david.rides@example.com',
    display_name: 'David Johnson',
    bio: 'Have a reliable car and happy to give rides to appointments, grocery store, etc. Background checked.',
    avg_rating: 4.7,
    rating_count: 42
  },
  {
    username: 'elena_cook',
    email: 'elena.cook@example.com',
    display_name: 'Elena Rodriguez',
    bio: 'Love cooking and sharing food. Often have extra meals to share. Vegetarian-friendly options available.',
    avg_rating: 4.9,
    rating_count: 27
  }
].each do |helper_data|
  user = User.create!(
    username: helper_data[:username],
    email: helper_data[:email],
    password: 'password123',
    password_confirmation: 'password123',
    display_name: helper_data[:display_name],
    bio: helper_data[:bio],
    anonymous: false,
    average_rating: helper_data[:avg_rating],
    total_ratings_count: helper_data[:rating_count],
    last_rated_at: rand(1..30).days.ago,
    zipcode: ARLINGTON_ZIPCODES.sample
  )
  verified_helpers << user
end

puts "      Created #{verified_helpers.count} verified helpers"

# 3. Create Regular Active Members
active_members = []

15.times do |i|
  first_names = ['Frank', 'Grace', 'Henry', 'Iris', 'Jack', 'Kate', 'Leo', 'Maya', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Rosa', 'Sam', 'Tina']
  last_names = ['Anderson', 'Brown', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris', 'Irving', 'James', 'Kim', 'Lee', 'Miller', 'Nelson', 'Park', 'Reed']

  first = first_names[i]
  last = last_names.sample

  user = User.create!(
    username: "#{first.downcase}_#{rand(100..999)}",
    email: "#{first.downcase}.#{last.downcase}#{i}@example.com",
    password: 'password123',
    password_confirmation: 'password123',
    display_name: "#{first} #{last}",
    bio: [
      'New to the area, looking to connect with neighbors.',
      'Parent of two, always happy to help other parents.',
      'Work from home, flexible schedule.',
      'Lived here for 10+ years, know the area well.',
      'College student, available evenings and weekends.',
      'Retired, lots of free time to help out.',
      nil,
      nil
    ].sample,
    anonymous: false,
    average_rating: [0, 0, 0, rand(3.5..4.5), rand(4.5..5.0)].sample.round(1),
    total_ratings_count: [0, 0, 0, rand(1..5), rand(5..15)].sample,
    last_rated_at: [nil, rand(1..60).days.ago].sample,
    zipcode: ARLINGTON_ZIPCODES.sample
  )
  active_members << user
end

puts "      Created #{active_members.count} active members"

# 4. Create New Members (No ratings yet)
new_members = []

10.times do |i|
  first_names = ['Uma', 'Victor', 'Wendy', 'Xavier', 'Yuki', 'Zara', 'Aaron', 'Bella', 'Chris', 'Diana']
  last_names = ['Smith', 'Wilson', 'Taylor', 'White', 'Green', 'Young', 'King', 'Scott', 'Adams', 'Clark']

  first = first_names[i]
  last = last_names[i]

  user = User.create!(
    username: "#{first.downcase}_#{last.downcase}",
    email: "#{first.downcase}.#{last.downcase}@example.com",
    password: 'password123',
    password_confirmation: 'password123',
    display_name: "#{first} #{last}",
    bio: nil,
    anonymous: false,
    average_rating: 0,
    total_ratings_count: 0,
    zipcode: ARLINGTON_ZIPCODES.sample
  )
  new_members << user
end

puts "      Created #{new_members.count} new members"

# 5. Create Anonymous Users
anonymous_users = []

8.times do
  user = User.create!(
    zipcode: ARLINGTON_ZIPCODES.sample,
    anonymous: true
  )
  anonymous_users << user
end

puts "      Created #{anonymous_users.count} anonymous users"

# Store users in instance variables for other seed files
@moderator = moderator
@verified_helpers = verified_helpers
@active_members = active_members
@new_members = new_members
@anonymous_users = anonymous_users
@all_authenticated_users = verified_helpers + active_members + new_members

puts "      Total users created: #{User.count}"
