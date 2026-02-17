class Comment < ApplicationRecord
  belongs_to :post
  belongs_to :user

  has_many :comment_histories, dependent: :destroy
  has_many :flags, as: :flaggable, dependent: :destroy

  validates :message, presence: true
end
