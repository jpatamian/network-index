class CreateNotifications < ActiveRecord::Migration[7.1]
  def change
    create_table :notifications do |t|
      t.bigint :user_id, null: false
      t.bigint :actor_user_id
      t.references :post, null: false, foreign_key: true
      t.references :comment, null: false, foreign_key: true
      t.string :notification_type, default: 'comment', null: false
      t.text :message, null: false
      t.datetime :read_at
      t.timestamps
    end

    add_foreign_key :notifications, :users
    add_foreign_key :notifications, :users, column: :actor_user_id
    add_index :notifications, :user_id
    add_index :notifications, :actor_user_id
    add_index :notifications, :read_at
  end
end
