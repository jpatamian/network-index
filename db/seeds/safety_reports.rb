# db/seeds/safety_reports.rb
# Creates user safety reports for moderation testing

puts "   🛡️  Creating safety reports..."

SAFETY_INCIDENTS = {
  no_show: [
    {
      description: "User agreed to help me move furniture but never showed up and stopped responding to messages.",
      severity: 'medium'
    },
    {
      description: "Scheduled to help with yard work. Confirmed the day before but didn't show up or send any message.",
      severity: 'medium'
    }
  ],
  inappropriate_behavior: [
    {
      description: "Made me uncomfortable with personal questions that weren't relevant to the task. Nothing illegal but felt inappropriate.",
      severity: 'medium'
    },
    {
      description: "Became aggressive when I asked them to wear a mask in my home. Ended up asking them to leave.",
      severity: 'high'
    }
  ],
  safety_concern: [
    {
      description: "Showed up to my house with someone else who wasn't mentioned. Made me feel unsafe. Had to cancel.",
      severity: 'high'
    },
    {
      description: "Kept asking about my schedule, when I'm home alone, security system. Very concerning questions.",
      severity: 'high'
    }
  ],
  harassment: [
    {
      description: "Continued messaging me after I said I found someone else. Messages became increasingly inappropriate.",
      severity: 'high'
    },
    {
      description: "Left hostile comments on multiple posts after I declined their offer. Felt targeted.",
      severity: 'high'
    }
  ],
  scam: [
    {
      description: "Asked for upfront payment via Venmo for services. Never provided service and account is now deleted.",
      severity: 'high'
    },
    {
      description: "Offered help moving, then demanded $200 cash halfway through saying prices had 'changed'. Felt extorted.",
      severity: 'high'
    }
  ],
  other: [
    {
      description: "Seemed intoxicated when they arrived. I had to ask them to leave for safety reasons.",
      severity: 'medium'
    },
    {
      description: "Took items from my home without asking. When confronted, said they thought they were donations.",
      severity: 'high'
    }
  ]
}

safety_reports = []

# Create 5-7 safety reports
num_reports = rand(5..7)

num_reports.times do |i|
  # Pick random incident type
  incident_type = SAFETY_INCIDENTS.keys.sample
  incident_data = SAFETY_INCIDENTS[incident_type].sample

  # Reporter is a random authenticated user
  reporter = @all_authenticated_users.sample

  # Reported user is different authenticated user
  # Some users might be repeat offenders
  if i < 2 && @active_members.any?
    # First 2 reports about the same problematic user
    reported = @active_members.last
  else
    reported = (@all_authenticated_users - [ reporter ]).sample
  end

  # Find a post context (ideally one involving both users)
  post_context = @all_posts.sample

  # Status based on when it was created
  days_ago = rand(1..30)
  status = if days_ago <= 7
             'pending'
  elsif days_ago <= 14
             'reviewed'
  else
             'resolved'
  end

  report = UserSafetyReport.create!(
    reporter_user: reporter,
    reported_user: reported,
    post: post_context,
    incident_type: incident_type,
    description: incident_data[:description],
    status: status,
    created_at: days_ago.days.ago,
    reviewed_at: status == 'pending' ? nil : (days_ago - rand(1..5)).days.ago,
    reviewed_by_user_id: status == 'pending' ? nil : @moderator.id
  )

  safety_reports << report
end

puts "      ✓ Created #{safety_reports.count} safety reports"

# Show breakdown by incident type
SAFETY_INCIDENTS.keys.each do |type|
  count = safety_reports.count { |r| r.incident_type == type.to_s }
  puts "         #{type}: #{count}" if count > 0
end

puts "         Pending: #{safety_reports.count { |r| r.status == 'pending' }}"
puts "         Reviewed: #{safety_reports.count { |r| r.status == 'reviewed' }}"
puts "         Resolved: #{safety_reports.count { |r| r.status == 'resolved' }}"

# Mark one user as having multiple reports (potential problem user)
problem_user = safety_reports.first.reported_user
problem_reports = safety_reports.select { |r| r.reported_user_id == problem_user.id }
if problem_reports.count > 1
  puts "      ⚠️  User ##{problem_user.id} (#{problem_user.display_name}) has #{problem_reports.count} reports - flagged account"
end

@all_safety_reports = safety_reports
