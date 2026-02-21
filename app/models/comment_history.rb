class CommentHistory < ApplicationRecord
  belongs_to :comment
  belongs_to :edited_by_user, class_name: "User", foreign_key: :edited_by_user_id
end
