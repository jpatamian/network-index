class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      # Authentication fields
      t.string :username, null: true
      t.string :email, null: true
      t.string :phone, null: true
      t.string :password_digest, null: true

      # Required location field
      t.string :zipcode, null: false

      # User type tracking
      t.boolean :anonymous, default: true, null: false

      t.timestamps
    end

    # Indexes for uniqueness and lookups
    add_index :users, :username, unique: true, where: "username IS NOT NULL"
    add_index :users, :email, unique: true, where: "email IS NOT NULL"
    add_index :users, :phone, unique: true, where: "phone IS NOT NULL"
    add_index :users, :zipcode
  end
end
