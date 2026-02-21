# Testing

The project has two independent test suites: RSpec for the Rails backend, and Jest for the React frontend.

---

## Table of Contents

- [Backend — RSpec](#backend--rspec)
  - [Running Tests](#running-backend-tests)
  - [Structure](#backend-test-structure)
  - [Tools](#backend-tools)
  - [Writing Tests](#writing-backend-tests)
- [Frontend — Jest](#frontend--jest)
  - [Running Tests](#running-frontend-tests)
  - [Structure](#frontend-test-structure)
  - [Tools](#frontend-tools)
  - [Writing Tests](#writing-frontend-tests)
- [CI](#ci)

---

## Backend — RSpec

### Running Backend Tests

```bash
# Run all specs
bundle exec rspec

# Run a specific folder
bundle exec rspec spec/models
bundle exec rspec spec/requests

# Run a single file
bundle exec rspec spec/models/user_spec.rb

# Run a specific example by line number
bundle exec rspec spec/models/post_spec.rb:42

# Run with documentation format
bundle exec rspec --format documentation
```

### Backend Test Structure

```
spec/
├── spec_helper.rb          # RSpec core configuration
├── rails_helper.rb         # Rails + helpers loaded for every spec
├── models/                 # Unit tests for ActiveRecord models
│   ├── user_spec.rb
│   ├── post_spec.rb
│   ├── comment_spec.rb
│   ├── flag_spec.rb
│   ├── post_like_spec.rb
│   ├── notification_spec.rb
│   ├── direct_message_spec.rb
│   ├── rating_spec.rb
│   ├── user_safety_report_spec.rb
│   └── comment_history_spec.rb
├── requests/
│   └── api/
│       └── v1/             # Integration tests for API endpoints
├── factories/              # FactoryBot factories
│   ├── users.rb
│   ├── posts.rb
│   ├── comments.rb
│   └── ...
└── support/
    ├── database_cleaner.rb # Cleans DB between examples
    ├── factory_bot.rb      # Makes factory methods globally available
    └── shoulda_matchers.rb # Configures shoulda-matchers for RSpec
```

### Backend Tools

| Tool | Purpose |
|---|---|
| [RSpec Rails](https://github.com/rspec/rspec-rails) | Testing framework |
| [FactoryBot](https://github.com/thoughtbot/factory_bot_rails) | Test data factories |
| [Faker](https://github.com/faker-ruby/faker) | Realistic fake data |
| [Shoulda Matchers](https://github.com/thoughtbot/shoulda-matchers) | One-liner Rails matchers (validations, associations) |
| [Database Cleaner](https://github.com/DatabaseCleaner/database_cleaner) | Resets DB state between tests |

### Writing Backend Tests

**Model spec example:**

```ruby
RSpec.describe Post, type: :model do
  describe "validations" do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:content) }
  end

  describe "associations" do
    it { should belong_to(:user) }
    it { should have_many(:comments) }
  end

  describe "#open?" do
    it "returns true when status is open" do
      post = build(:post, status: :open)
      expect(post.open?).to be true
    end
  end
end
```

**Request spec example:**

```ruby
RSpec.describe "POST /api/v1/posts", type: :request do
  let(:user) { create(:user) }
  let(:token) { JsonWebToken.encode(user_id: user.id) }
  let(:headers) { { "Authorization" => "Bearer #{token}" } }

  it "creates a post" do
    post api_v1_posts_path,
      params: { title: "Need help", content: "...", post_type: "other" },
      headers: headers

    expect(response).to have_http_status(:created)
    expect(json["post"]["title"]).to eq("Need help")
  end
end
```

Use FactoryBot factories for all test data — avoid creating records with raw `Model.create` in specs.

---

## Frontend — Jest

### Running Frontend Tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file save)
npm run test:watch

# With coverage report
npm run test:coverage
```

### Frontend Test Structure

```
app/frontend/
└── __tests__/
    ├── components/   # Tests for shared UI components
    ├── features/     # Tests for feature-specific components
    └── lib/          # Tests for API client and utilities
```

Tests live alongside or near the code they test under `__tests__/`.

### Frontend Tools

| Tool | Purpose |
|---|---|
| [Jest](https://jestjs.io/) | Test runner |
| [React Testing Library](https://testing-library.com/react) | Component rendering and querying |
| [ts-jest](https://kulshekhar.github.io/ts-jest/) | TypeScript support in Jest |
| [jsdom](https://github.com/jsdom/jsdom) | Browser-like DOM environment |

**Jest config:** `jest.config.cjs` at the project root.

Path alias `@/` resolves to `app/frontend/` in tests, matching the Vite config.

### Writing Frontend Tests

**Component test example:**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostCard } from "@/features/posts/PostCard";

const mockPost = {
  id: 1,
  title: "Need a ride",
  content: "...",
  post_type: "ride_share",
  user: { username: "alice" },
};

test("renders post title", () => {
  render(<PostCard post={mockPost} />);
  expect(screen.getByText("Need a ride")).toBeInTheDocument();
});

test("calls onLike when like button clicked", async () => {
  const onLike = jest.fn();
  render(<PostCard post={mockPost} onLike={onLike} />);
  await userEvent.click(screen.getByRole("button", { name: /like/i }));
  expect(onLike).toHaveBeenCalledTimes(1);
});
```

Prefer querying by role or accessible name (`getByRole`, `getByLabelText`) over implementation details like class names or test IDs.

---

## CI

GitHub Actions runs on every push and pull request to `main`.

**File:** `.github/workflows/ci.yml`

**Jobs:**

| Job | What it does |
|---|---|
| `scan_ruby` | Brakeman (Rails security audit) + Bundler Audit (gem CVEs) |
| `scan_js` | Importmap audit (JavaScript dependency CVEs) |
| `lint` | RuboCop style checks |

Tests themselves are not currently run in CI — add an `rspec` and `npm test` step to the workflow to enable it.
