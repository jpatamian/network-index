require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    context 'for all users' do
      it { should validate_presence_of(:zipcode) }

      it 'is valid with just a zipcode for anonymous users' do
        user = build(:anonymous_user)
        expect(user).to be_valid
      end
    end

    context 'for authenticated users' do
      it 'requires email or phone' do
        user = build(:user, email: nil, phone: nil, anonymous: false)
        expect(user).not_to be_valid
        expect(user.errors[:base]).to include("Email or phone number is required")
      end

      it 'is valid with email only' do
        user = build(:user, email: "test@example.com", phone: nil)
        expect(user).to be_valid
      end

      it 'is valid with phone only' do
        user = build(:user_with_phone)
        expect(user).to be_valid
      end

      it 'is valid with both email and phone' do
        user = build(:user_with_both)
        expect(user).to be_valid
      end

      it 'requires a password for new authenticated users' do
        user = build(:user, password: nil, password_confirmation: nil)
        expect(user).not_to be_valid
        expect(user.errors[:password]).to include("can't be blank")
      end

      it 'requires password to be at least 6 characters' do
        user = build(:user, password: "short", password_confirmation: "short")
        expect(user).not_to be_valid
        expect(user.errors[:password]).to include("is too short (minimum is 6 characters)")
      end
    end

    context 'for anonymous users' do
      it 'does not require email or phone' do
        user = build(:anonymous_user, email: nil, phone: nil)
        expect(user).to be_valid
      end

      it 'does not require a password' do
        user = build(:anonymous_user, password: nil, password_confirmation: nil)
        expect(user).to be_valid
      end
    end

    context 'uniqueness constraints' do
      it 'enforces unique usernames' do
        create(:user, :with_username, username: "testuser")
        duplicate = build(:user, :with_username, username: "testuser")
        expect(duplicate).not_to be_valid
        expect(duplicate.errors[:username]).to include("has already been taken")
      end

      it 'enforces unique emails' do
        create(:user, email: "test@example.com")
        duplicate = build(:user, email: "test@example.com")
        expect(duplicate).not_to be_valid
        expect(duplicate.errors[:email]).to include("has already been taken")
      end

      it 'enforces unique phone numbers' do
        create(:user_with_phone, phone: "5551234567")
        duplicate = build(:user_with_phone, phone: "5551234567")
        expect(duplicate).not_to be_valid
        expect(duplicate.errors[:phone]).to include("has already been taken")
      end

      it 'allows multiple nil usernames' do
        create(:user, username: nil)
        user2 = build(:user, username: nil)
        expect(user2).to be_valid
      end

      it 'allows multiple nil emails' do
        create(:user_with_phone, email: nil)
        user2 = build(:user_with_phone, email: nil)
        expect(user2).to be_valid
      end

      it 'allows multiple nil phone numbers' do
        create(:user, phone: nil)
        user2 = build(:user, phone: nil)
        expect(user2).to be_valid
      end
    end
  end

  describe 'scopes' do
    before do
      @anonymous1 = create(:anonymous_user)
      @anonymous2 = create(:anonymous_user)
      @authenticated1 = create(:user)
      @authenticated2 = create(:user_with_phone)
    end

    describe '.anonymous' do
      it 'returns only anonymous users' do
        expect(User.anonymous).to contain_exactly(@anonymous1, @anonymous2)
      end
    end

    describe '.authenticated' do
      it 'returns only authenticated users' do
        expect(User.authenticated).to contain_exactly(@authenticated1, @authenticated2)
      end
    end
  end

  describe 'instance methods' do
    describe '#anonymous?' do
      it 'returns true for anonymous users' do
        user = build(:anonymous_user)
        expect(user.anonymous?).to be true
      end

      it 'returns false for authenticated users' do
        user = build(:user)
        expect(user.anonymous?).to be false
      end
    end

    describe '#authenticated?' do
      it 'returns false for anonymous users' do
        user = build(:anonymous_user)
        expect(user.authenticated?).to be false
      end

      it 'returns true for authenticated users' do
        user = build(:user)
        expect(user.authenticated?).to be true
      end
    end

    describe '#authenticate' do
      it 'returns user on correct password for authenticated users' do
        user = create(:user, password: "secret123")
        expect(user.authenticate("secret123")).to eq(user)
      end

      it 'returns false on incorrect password' do
        user = create(:user, password: "secret123")
        expect(user.authenticate("wrong")).to be false
      end

      it 'returns false for anonymous users without password' do
        user = create(:anonymous_user)
        expect(user.authenticate("anything")).to be false
      end
    end
  end

  describe 'edge cases' do
    it 'cannot create authenticated user with username but no email/phone' do
      user = build(:user, :with_username, email: nil, phone: nil, anonymous: false)
      expect(user).not_to be_valid
      expect(user.errors[:base]).to include("Email or phone number is required")
    end

    it 'can transition from anonymous to authenticated' do
      user = create(:anonymous_user)
      user.update(
        email: "newemail@example.com",
        password: "password123",
        password_confirmation: "password123",
        anonymous: false
      )
      expect(user).to be_valid
      expect(user.authenticated?).to be true
    end

    it 'validates password on update when password is changed' do
      user = create(:user, password: "oldpassword")
      user.password = "new"
      user.password_confirmation = "new"
      expect(user).not_to be_valid
      expect(user.errors[:password]).to include("is too short (minimum is 6 characters)")
    end

    it 'does not require password on update if not changing password' do
      user = create(:user, password: "oldpassword")
      user.zipcode = "90210"
      expect(user).to be_valid
    end

    it 'handles whitespace in email and phone' do
      user = build(:user, email: "  test@example.com  ", phone: nil)
      expect(user).to be_valid
    end
  end
end
