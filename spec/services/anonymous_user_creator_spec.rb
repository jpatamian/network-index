require 'rails_helper'

RSpec.describe AnonymousUserCreator do
  describe '.create' do
    context 'when zipcode is provided' do
      let(:zipcode) { '02145' }

      it 'creates an anonymous user' do
        expect {
          described_class.create(zipcode: zipcode)
        }.to change(User, :count).by(1)
      end

      it 'sets the user as anonymous' do
        user = described_class.create(zipcode: zipcode)
        expect(user.anonymous).to be true
      end

      it 'sets the zipcode on the created user' do
        user = described_class.create(zipcode: zipcode)
        expect(user.zipcode).to eq(zipcode)
      end

      it 'does not set email' do
        user = described_class.create(zipcode: zipcode)
        expect(user.email).to be_nil
      end

      it 'does not set username' do
        user = described_class.create(zipcode: zipcode)
        expect(user.username).to be_nil
      end

      it 'returns the created user' do
        user = described_class.create(zipcode: zipcode)
        expect(user).to be_a(User)
        expect(user).to be_persisted
      end
    end

    context 'when zipcode is blank' do
      it 'returns nil for nil zipcode' do
        user = described_class.create(zipcode: nil)
        expect(user).to be_nil
      end

      it 'returns nil for empty string zipcode' do
        user = described_class.create(zipcode: '')
        expect(user).to be_nil
      end

      it 'returns nil for whitespace-only zipcode' do
        user = described_class.create(zipcode: '   ')
        expect(user).to be_nil
      end

      it 'does not create a user when zipcode is blank' do
        expect {
          described_class.create(zipcode: nil)
        }.not_to change(User, :count)
      end
    end

    context 'with different zipcode formats' do
      it 'handles 5-digit zipcode' do
        user = described_class.create(zipcode: '12345')
        expect(user.zipcode).to eq('12345')
      end

      it 'handles zipcode with dash' do
        user = described_class.create(zipcode: '12345-6789')
        expect(user.zipcode).to eq('12345-6789')
      end
    end
  end
end
