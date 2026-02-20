class MakeUserZipcodeNullable < ActiveRecord::Migration[7.1]
  def change
    change_column_null :users, :zipcode, true
  end
end
