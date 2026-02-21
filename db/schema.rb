# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_02_21_041854) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "comment_histories", force: :cascade do |t|
    t.bigint "comment_id", null: false
    t.bigint "edited_by_user_id", null: false
    t.text "old_message"
    t.text "new_message"
    t.datetime "edited_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["comment_id"], name: "index_comment_histories_on_comment_id"
    t.index ["edited_by_user_id"], name: "index_comment_histories_on_edited_by_user_id"
  end

  create_table "comments", force: :cascade do |t|
    t.bigint "post_id", null: false
    t.bigint "user_id", null: false
    t.text "message"
    t.integer "flag_count", default: 0
    t.boolean "is_flagged", default: false
    t.boolean "is_hidden", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_comments_on_post_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "direct_messages", force: :cascade do |t|
    t.bigint "post_id", null: false
    t.bigint "sender_id", null: false
    t.bigint "recipient_id", null: false
    t.text "message"
    t.datetime "read_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_direct_messages_on_post_id"
    t.index ["recipient_id"], name: "index_direct_messages_on_recipient_id"
    t.index ["sender_id"], name: "index_direct_messages_on_sender_id"
  end

  create_table "flags", force: :cascade do |t|
    t.string "flaggable_type", null: false
    t.bigint "flaggable_id", null: false
    t.bigint "flagger_user_id"
    t.string "reason", null: false
    t.text "description"
    t.string "status", default: "pending"
    t.boolean "is_auto_flagged", default: false
    t.datetime "reviewed_at"
    t.bigint "reviewed_by_user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["flaggable_type", "flaggable_id"], name: "index_flags_on_flaggable_type_and_flaggable_id"
    t.index ["flagger_user_id"], name: "index_flags_on_flagger_user_id"
    t.index ["reviewed_by_user_id"], name: "index_flags_on_reviewed_by_user_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "actor_user_id"
    t.bigint "post_id", null: false
    t.bigint "comment_id"
    t.string "notification_type", default: "comment", null: false
    t.text "message", null: false
    t.datetime "read_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["actor_user_id"], name: "index_notifications_on_actor_user_id"
    t.index ["comment_id"], name: "index_notifications_on_comment_id"
    t.index ["post_id"], name: "index_notifications_on_post_id"
    t.index ["read_at"], name: "index_notifications_on_read_at"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "post_likes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "post_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_post_likes_on_post_id"
    t.index ["user_id", "post_id"], name: "index_post_likes_on_user_id_and_post_id", unique: true
  end

  create_table "posts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "title"
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "status", default: "open"
    t.integer "flag_count", default: 0
    t.boolean "is_flagged", default: false
    t.boolean "is_hidden", default: false
    t.string "post_type", default: "other", null: false
    t.jsonb "metadata", default: {}, null: false
    t.integer "likes_count", default: 0, null: false
    t.index ["post_type"], name: "index_posts_on_post_type"
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "ratings", force: :cascade do |t|
    t.bigint "rater_user_id", null: false
    t.bigint "rated_user_id", null: false
    t.bigint "post_id"
    t.integer "rating_value", null: false
    t.text "review_text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_ratings_on_post_id"
    t.index ["rated_user_id"], name: "index_ratings_on_rated_user_id"
    t.index ["rater_user_id"], name: "index_ratings_on_rater_user_id"
  end

  create_table "user_safety_reports", force: :cascade do |t|
    t.bigint "reporter_user_id", null: false
    t.bigint "reported_user_id", null: false
    t.bigint "post_id"
    t.string "incident_type", null: false
    t.text "description"
    t.string "status", default: "pending"
    t.datetime "reviewed_at"
    t.bigint "reviewed_by_user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_user_safety_reports_on_post_id"
    t.index ["reported_user_id"], name: "index_user_safety_reports_on_reported_user_id"
    t.index ["reporter_user_id"], name: "index_user_safety_reports_on_reporter_user_id"
    t.index ["reviewed_by_user_id"], name: "index_user_safety_reports_on_reviewed_by_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "email"
    t.string "phone"
    t.string "password_digest"
    t.string "zipcode"
    t.boolean "anonymous", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "display_name"
    t.text "bio"
    t.boolean "is_moderator", default: false, null: false
    t.decimal "average_rating", default: "0.0"
    t.integer "total_ratings_count", default: 0
    t.datetime "last_rated_at"
    t.index ["email"], name: "index_users_on_email", unique: true, where: "(email IS NOT NULL)"
    t.index ["phone"], name: "index_users_on_phone", unique: true, where: "(phone IS NOT NULL)"
    t.index ["username"], name: "index_users_on_username", unique: true, where: "(username IS NOT NULL)"
    t.index ["zipcode"], name: "index_users_on_zipcode"
  end

  add_foreign_key "comment_histories", "comments"
  add_foreign_key "comment_histories", "users", column: "edited_by_user_id"
  add_foreign_key "comments", "posts"
  add_foreign_key "comments", "users"
  add_foreign_key "direct_messages", "posts"
  add_foreign_key "direct_messages", "users", column: "recipient_id"
  add_foreign_key "direct_messages", "users", column: "sender_id"
  add_foreign_key "flags", "users", column: "flagger_user_id"
  add_foreign_key "flags", "users", column: "reviewed_by_user_id"
  add_foreign_key "notifications", "comments"
  add_foreign_key "notifications", "posts"
  add_foreign_key "notifications", "users"
  add_foreign_key "notifications", "users", column: "actor_user_id"
  add_foreign_key "post_likes", "posts"
  add_foreign_key "post_likes", "users"
  add_foreign_key "posts", "users"
  add_foreign_key "ratings", "posts"
  add_foreign_key "ratings", "users", column: "rated_user_id"
  add_foreign_key "ratings", "users", column: "rater_user_id"
  add_foreign_key "user_safety_reports", "posts"
  add_foreign_key "user_safety_reports", "users", column: "reported_user_id"
  add_foreign_key "user_safety_reports", "users", column: "reporter_user_id"
  add_foreign_key "user_safety_reports", "users", column: "reviewed_by_user_id"
end
