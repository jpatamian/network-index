require 'rails_helper'

RSpec.describe UserSafetyReport, type: :model do
  describe 'associations' do
    it { should belong_to(:reporter_user).class_name('User').with_foreign_key('reporter_user_id') }
    it { should belong_to(:reported_user).class_name('User') }
    it { should belong_to(:post).optional }
    it { should belong_to(:reviewed_by_user).class_name('User').with_foreign_key('reviewed_by_user_id').optional }
  end

  describe 'validations' do
    it { should validate_presence_of(:incident_type) }

    it 'is valid with valid attributes' do
      reporter = create(:user)
      reported_user = create(:user)
      report = build(:user_safety_report, reporter_user: reporter, reported_user: reported_user)
      expect(report).to be_valid
    end

    it 'requires a reporter' do
      reported_user = create(:user)
      report = build(:user_safety_report, reporter_user: nil, reported_user: reported_user)
      expect(report).not_to be_valid
    end

    it 'requires a reported user' do
      reporter = create(:user)
      report = build(:user_safety_report, reporter_user: reporter, reported_user: nil)
      expect(report).not_to be_valid
    end
  end

  describe 'incident types' do
    it 'accepts harassment reason' do
      reporter = create(:user)
      reported_user = create(:user)
      report = build(:user_safety_report, reporter_user: reporter, reported_user: reported_user, incident_type: 'Harassment')
      expect(report).to be_valid
    end

    it 'accepts scam reason' do
      reporter = create(:user)
      reported_user = create(:user)
      report = build(:user_safety_report, reporter_user: reporter, reported_user: reported_user, incident_type: 'Scam')
      expect(report).to be_valid
    end

    it 'accepts threatening behavior reason' do
      reporter = create(:user)
      reported_user = create(:user)
      report = build(:user_safety_report, reporter_user: reporter, reported_user: reported_user, incident_type: 'Threatening Behavior')
      expect(report).to be_valid
    end
  end

  describe 'status tracking' do
    it 'defaults to pending status' do
      report = create(:user_safety_report)
      expect(report.status).to eq('pending')
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
