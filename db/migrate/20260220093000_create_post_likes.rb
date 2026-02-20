class CreatePostLikes < ActiveRecord::Migration[7.1]
  def change
    create_table :post_likes do |t|
      t.bigint :user_id, null: false
      t.bigint :post_id, null: false
      t.timestamps
    end

    add_index :post_likes, [:user_id, :post_id], unique: true
    add_index :post_likes, :post_id
    add_foreign_key :post_likes, :users
    add_foreign_key :post_likes, :posts

    add_column :posts, :likes_count, :integer, null: false, default: 0
  end
end
