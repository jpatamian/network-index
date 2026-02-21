class AddPostTypeAndMetadataToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :post_type, :string, default: 'other', null: false
    add_column :posts, :metadata, :jsonb, default: {}, null: false
    add_index :posts, :post_type
  end
end
