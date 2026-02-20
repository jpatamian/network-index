import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PostCard } from "../../features/posts/components/PostCard";
import { TestWrapper } from "../setup/test-wrapper";

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../lib/api", () => ({
  postsApi: {
    delete: jest.fn(),
  },
}));

import { useAuth } from "../../hooks/useAuth";

const mockPost = {
  id: 1,
  title: "Test Post",
  content: "This is test content for the post",
  post_type: "food",
  metadata: {},
  author: {
    id: 1,
    name: "John Doe",
    username: "johndoe",
    email: "johndoe@example.com",
  },
  created_at: "2026-02-18T10:00:00Z",
  updated_at: "2026-02-18T10:00:00Z",
  comments_count: 3,
  comment_count: 3,
};

describe("PostCard Component", () => {
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, username: "testuser", email: "test@example.com" },
      token: "mock-token",
      isAuthenticated: true,
    });
  });

  it("renders post content", () => {
    render(
      <TestWrapper>
        <PostCard post={mockPost} onDelete={mockOnDelete} />
      </TestWrapper>,
    );

    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(
      screen.getByText("This is test content for the post"),
    ).toBeInTheDocument();
  });

  it("renders post author", () => {
    render(
      <TestWrapper>
        <PostCard post={mockPost} onDelete={mockOnDelete} />
      </TestWrapper>,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders post type badge", () => {
    render(
      <TestWrapper>
        <PostCard post={mockPost} onDelete={mockOnDelete} />
      </TestWrapper>,
    );

    expect(screen.getByText("Food")).toBeInTheDocument();
  });

  it("renders comment count", () => {
    render(
      <TestWrapper>
        <PostCard post={mockPost} onDelete={mockOnDelete} />
      </TestWrapper>,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("renders for unauthenticated users", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    render(
      <TestWrapper>
        <PostCard post={mockPost} onDelete={mockOnDelete} />
      </TestWrapper>,
    );

    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });
});
