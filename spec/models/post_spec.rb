require 'rails_helper'

RSpec.describe Post, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:comments).dependent(:destroy) }
    it { should have_many(:ratings).dependent(:destroy) }
    it { should have_many(:flags).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:content) }

    it 'is valid with valid attributes' do
      user = create(:user)
      post = build(:post, user: user)
      expect(post).to be_valid
    end

    it 'requires a user' do
      post = build(:post, user: nil)
      expect(post).not_to be_valid
    end

    it 'requires title' do
      user = create(:user)
      post = build(:post, user: user, title: nil)
      expect(post).not_to be_valid
    end

    it 'requires content' do
      user = create(:user)
      post = build(:post, user: user, content: nil)
      expect(post).not_to be_valid
    end
  end

  describe 'scopes' do
    it 'returns posts in reverse chronological order' do
      user = create(:user)
      post1 = create(:post, user: user, created_at: 2.days.ago)
      post2 = create(:post, user: user, created_at: 1.day.ago)
      post3 = create(:post, user: user, created_at: 3.days.ago)

      expect(Post.all).to eq([post2, post1, post3])
    end
  end

  describe '#destroy' do
    it 'destroys associated comments' do
      post = create(:post)
      create(:comment, post: post)

      expect { post.destroy }.to change(Comment, :count).by(-1)
    end

    it 'destroys associated ratings' do
      post = create(:post)
      create(:rating, post: post)

      expect { post.destroy }.to change(Rating, :count).by(-1)
    end

    it 'destroys associated flags' do
      post = create(:post)
      create(:flag, flaggable: post)

      expect { post.destroy }.to change(Flag, :count).by(-1)
    end
  end

  describe 'functionality' do
    describe '#comments_count' do
      it 'returns count of associated comments' do
        post = create(:post)
        create_list(:comment, 3, post: post)

        expect(post.comments.count).to eq(3)
      end
    end

    describe '#ratings_count' do
      it 'returns count of associated ratings' do
        post = create(:post)
        create_list(:rating, 2, post: post)

        expect(post.ratings.count).to eq(2)
      end
    end

    describe '#author_name' do
      it 'returns the author user name' do
        user = create(:user, username: 'testuser')
        post = create(:post, user: user)

        expect(post.user.username).to eq('testuser')
      end
    end
  end

  describe 'content length' do
    it 'allows long content' do
      user = create(:user)
      long_content = 'a' * 5000
      post = build(:post, user: user, content: long_content)

      expect(post).to be_valid
    end

    it 'stores full content without truncation' do
      user = create(:user)
      content = 'This is a detailed post with much content'
      post = create(:post, user: user, content: content)

      expect(post.content).to eq(content)
    end
  end

  describe 'timestamps' do
    it 'has created_at timestamp' do
      post = create(:post)
      expect(post.created_at).to be_present
    end

    it 'has updated_at timestamp' do
      post = create(:post)
      expect(post.updated_at).to be_present
    end

    it 'updates updated_at when post is modified' do
      post = create(:post)
      original_updated_at = post.updated_at
      sleep(0.1)
      post.update(title: 'Updated Title')

      expect(post.updated_at).to be > original_updated_at
    end
  end
end
