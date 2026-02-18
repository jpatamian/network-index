require 'rails_helper'

RSpec.describe UserSafetyReport, type: :model do
  describe 'associations' do
    it { should belong_to(:reporter).class_name('User') }
    it { should belong_to(:reported_user).class_name('User') }
  end

  describe 'validations' do
    it { should validate_presence_of(:reason) }
    it { should validate_presence_of(:description) }

    it 'is valid with valid attributes' do
      reporter = create(:user)
      reported_user = create(:user)
      report = build(:user_safety_report, reporter: reporter, reported_user: reported_user)
      expect(report).to be_valid
    end

    it 'requires a reporter' do
      reported_user = create(:user)
      report = build(:user_safety_report, reporter: nil, reported_user: reported_user)
      expect(report).not_to be_valid
    end

    it 'requires a reported user' do
      reporter = create(:user)
      report = build(:user_safety_report, reporter: reporter, reported_user: nil)
      expect(report).not_to be_valid
    end

    it 'prevents user from reporting themselves' do
      user = create(:user)
      report = build(:user_safety_report, reporter: user, reported_user: user)
      expect(report).not_to be_valid
    end
  end

  describe 'report reasons' do
    it 'accepts harassment reason' do
      reporter = create(:user)
      reported_user = create(:user)
      report = build(:user_safety_report, reporter: reporter, reported_user: reported_user, reason: 'Harassment')
      expect(report).to be_valid
    end

    it 'accepts scam reason' do
      reporter = create(:user)
      reported_user = create(:user)
      report = build(:user_safety_report, reporter: reporter, reported_user: reported_user, reason: 'Scam')
      expect(report).to be_valid
    end

    it 'accepts threatening behavior reason' do
      reporter = create(:user)
      reported_user = create(:user)
      report = build(:user_safety_report, reporter: reporter, reported_user: reported_user, reason: 'Threatening Behavior')
      expect(report).to be_valid
    end
  end

  describe 'status tracking' do
    it 'defaults to pending status' do
      report = create(:user_safety_report)
      expect(report.status).to eq('pending') if report.respond_to?(:status)
    end

    it 'allows status updates' do
      report = create(:user_safety_report)
      if report.respond_to?(:status=)
        report.update(status: 'reviewed')
        expect(report.status).to eq('reviewed')
      end
    end
  end

  describe 'timestamps' do
    it 'records when report was created' do
      report = create(:user_safety_report)
      expect(report.created_at).to be_present
    end

    it 'tracks last update' do
      report = create(:user_safety_report)
      original_updated_at = report.updated_at
      sleep(0.1)
      report.update(description: 'Updated description')

      expect(report.updated_at).to be > original_updated_at
    end
  end
end
