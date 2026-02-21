# db/seeds/seeds.rb
# Main seed file for Mutual Aid Club
# Run with: rails db:seed
# Reset and reseed: rails db:reset

puts "Seeding Mutual Aid Club database..."
puts "=" * 50

# Clear existing data (be careful in production!)
if Rails.env.development?
  puts "\nCleaning existing data..."

  # Order matters: destroy dependents before parents
  [ UserSafetyReport, Flag, Rating, DirectMessage, CommentHistory, Comment, Post, User ].each do |model|
    model.destroy_all
    puts "   Cleared #{model.name.pluralize}"
  end
end

# Load seed files in order
puts "\nLoading seed files..."

seed_files = [
  'users',
  'posts',
  'comments',
  'direct_messages',
  'ratings',
  'flags',
  'safety_reports'
]

seed_files.each do |seed_file|
  seed_path = Rails.root.join('db', 'seeds', "#{seed_file}.rb")

  if File.exist?(seed_path)
    puts "\n   Loading #{seed_file}.rb..."
    load seed_path
  else
    puts "\n   Skipping #{seed_file}.rb (file not found)"
  end
end

puts "\n" + "=" * 50
puts "Seeding complete!"
puts "\nDatabase Summary:"
puts "   Users: #{User.count}"
puts "   Posts: #{Post.count}"
puts "   Comments: #{Comment.count}"
puts "   Direct Messages: #{DirectMessage.count}"
puts "   Ratings: #{Rating.count}"
puts "   Flags: #{Flag.count}"
puts "   Safety Reports: #{UserSafetyReport.count}"

puts "\nSample Accounts:"
puts "   Moderator: moderator@networkindex.org / password123"
puts "   Test User: alice.helper@example.com / password123"
puts "   Test User: bob.gardener@example.com / password123"
puts "\nAccess at: http://localhost:5173"
puts "=" * 50
