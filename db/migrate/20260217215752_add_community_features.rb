class AddCommunityFeatures < ActiveRecord::Migration[7.1]
  def change
    # Add columns to users
    add_column :users, :display_name, :string
    add_column :users, :bio, :text
    add_column :users, :is_moderator, :boolean, default: false, null: false
    add_column :users, :average_rating, :decimal, default: 0
    add_column :users, :total_ratings_count, :integer, default: 0
    add_column :users, :last_rated_at, :datetime

    # Add columns to posts
    add_column :posts, :status, :string, default: 'open'
    add_column :posts, :flag_count, :integer, default: 0
    add_column :posts, :is_flagged, :boolean, default: false
    add_column :posts, :is_hidden, :boolean, default: false

    # Comments
    create_table :comments do |t|
      t.references :post, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :message
      t.integer :flag_count, default: 0
      t.boolean :is_flagged, default: false
      t.boolean :is_hidden, default: false
      t.timestamps
    end

    # Comment edit history
    create_table :comment_histories do |t|
      t.references :comment, null: false, foreign_key: true
      t.bigint :edited_by_user_id, null: false
      t.text :old_message
      t.text :new_message
      t.datetime :edited_at
      t.timestamps
    end
    add_foreign_key :comment_histories, :users, column: :edited_by_user_id
    add_index :comment_histories, :edited_by_user_id

    # Direct messages
    create_table :direct_messages do |t|
      t.references :post, null: false, foreign_key: true
      t.bigint :sender_id, null: false
      t.bigint :recipient_id, null: false
      t.text :message
      t.datetime :read_at
      t.timestamps
    end
    add_foreign_key :direct_messages, :users, column: :sender_id
    add_foreign_key :direct_messages, :users, column: :recipient_id
    add_index :direct_messages, :sender_id
    add_index :direct_messages, :recipient_id

    # Ratings
    create_table :ratings do |t|
      t.bigint :rater_user_id, null: false
      t.bigint :rated_user_id, null: false
      t.references :post, null: true, foreign_key: true
      t.integer :rating_value, null: false
      t.text :review_text
      t.timestamps
    end
    add_foreign_key :ratings, :users, column: :rater_user_id
    add_foreign_key :ratings, :users, column: :rated_user_id
    add_index :ratings, :rater_user_id
    add_index :ratings, :rated_user_id

    # Flags (polymorphic - for posts and comments)
    create_table :flags do |t|
      t.string :flaggable_type, null: false
      t.bigint :flaggable_id, null: false
      t.bigint :flagger_user_id
      t.string :reason, null: false
      t.text :description
      t.string :status, default: 'pending'
      t.boolean :is_auto_flagged, default: false
      t.datetime :reviewed_at
      t.bigint :reviewed_by_user_id
      t.timestamps
    end
    add_foreign_key :flags, :users, column: :flagger_user_id
    add_foreign_key :flags, :users, column: :reviewed_by_user_id
    add_index :flags, [:flaggable_type, :flaggable_id]
    add_index :flags, :flagger_user_id
    add_index :flags, :reviewed_by_user_id

    # User safety reports
    create_table :user_safety_reports do |t|
      t.bigint :reporter_user_id, null: false
      t.bigint :reported_user_id, null: false
      t.references :post, null: true, foreign_key: true
      t.string :incident_type, null: false
      t.text :description
      t.string :status, default: 'pending'
      t.datetime :reviewed_at
      t.bigint :reviewed_by_user_id
      t.timestamps
    end
    add_foreign_key :user_safety_reports, :users, column: :reporter_user_id
    add_foreign_key :user_safety_reports, :users, column: :reported_user_id
    add_foreign_key :user_safety_reports, :users, column: :reviewed_by_user_id
    add_index :user_safety_reports, :reporter_user_id
    add_index :user_safety_reports, :reported_user_id
    add_index :user_safety_reports, :reviewed_by_user_id
  end
end
