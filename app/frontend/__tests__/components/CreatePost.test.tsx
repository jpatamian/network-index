import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CreatePost } from "../../features/posts/components/CreatePost";
import { TestWrapper } from "../setup/test-wrapper";

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../lib/api", () => ({
  postsApi: {
    create: jest.fn(),
  },
}));

import { useAuth } from "../../hooks/useAuth";
import { postsApi } from "../../lib/api";

const mockPost = {
  id: 1,
  title: "Test Post",
  content: "Test content",
  post_type: "other" as const,
  metadata: {},
  likes_count: 0,
  liked_by_current_user: false,
  author: { id: 99, name: "Anon", username: null, email: null },
  comment_count: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe("CreatePost Component", () => {
  const mockOnPostCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (postsApi.create as jest.Mock).mockResolvedValue(mockPost);
  });

  describe("authenticated users", () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({
        user: { id: 1, username: "testuser", email: "test@example.com" },
        token: "mock-token",
        isAuthenticated: true,
      });
    });

    it("renders without crashing", () => {
      expect(() => {
        render(
          <TestWrapper>
            <CreatePost onPostCreated={mockOnPostCreated} />
          </TestWrapper>,
        );
      }).not.toThrow();
    });

    it("shows expanded form when forceExpanded is true", () => {
      render(
        <TestWrapper>
          <CreatePost onPostCreated={mockOnPostCreated} forceExpanded />
        </TestWrapper>,
      );

      expect(screen.getByPlaceholderText("Post title")).toBeInTheDocument();
    });

    it("defaults post type selector to other", () => {
      render(
        <TestWrapper>
          <CreatePost onPostCreated={mockOnPostCreated} forceExpanded />
        </TestWrapper>,
      );

      expect(screen.getByRole("combobox")).toHaveValue("other");
    });

    it("does not show notification fields", () => {
      render(
        <TestWrapper>
          <CreatePost onPostCreated={mockOnPostCreated} forceExpanded />
        </TestWrapper>,
      );

      expect(
        screen.queryByPlaceholderText("Email for notifications"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByPlaceholderText("Phone for notifications"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/never shown publicly/i),
      ).not.toBeInTheDocument();
    });

    it("does not show zipcode field", () => {
      render(
        <TestWrapper>
          <CreatePost onPostCreated={mockOnPostCreated} forceExpanded />
        </TestWrapper>,
      );

      expect(
        screen.queryByPlaceholderText("Your zipcode *"),
      ).not.toBeInTheDocument();
    });

    it("submits without metadata", async () => {
      render(
        <TestWrapper>
          <CreatePost onPostCreated={mockOnPostCreated} forceExpanded />
        </TestWrapper>,
      );

      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "My Post" },
      });
      fireEvent.change(
        screen.getByPlaceholderText(
          "What's on your mind? Share what you need or offer...",
        ),
        { target: { value: "Some content" } },
      );

      fireEvent.submit(
        screen.getByRole("button", { name: "Share" }).closest("form")!,
      );

      await waitFor(() => {
        expect(postsApi.create).toHaveBeenCalledWith(
          expect.not.objectContaining({ metadata: expect.anything() }),
          "mock-token",
        );
      });
    });
  });

  describe("anonymous users", () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    });

    it("renders without crashing", () => {
      expect(() => {
        render(
          <TestWrapper>
            <CreatePost onPostCreated={mockOnPostCreated} />
          </TestWrapper>,
        );
      }).not.toThrow();
    });

    it("shows notification email and phone fields", () => {
      render(
        <TestWrapper>
          <CreatePost onPostCreated={mockOnPostCreated} forceExpanded />
        </TestWrapper>,
      );

      expect(
        screen.getByPlaceholderText("Email for notifications"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Phone for notifications"),
      ).toBeInTheDocument();
    });

    it("shows privacy label for notification fields", () => {
      render(
        <TestWrapper>
          <CreatePost onPostCreated={mockOnPostCreated} forceExpanded />
        </TestWrapper>,
      );

      expect(screen.getByText(/never shown publicly/i)).toBeInTheDocument();
    });

    it("notification fields are optional (not required)", () => {
      render(
        <TestWrapper>
          <CreatePost onPostCreated={mockOnPostCreated} forceExpanded />
        </TestWrapper>,
      );

      expect(
        screen.getByPlaceholderText("Email for notifications"),
      ).not.toBeRequired();
      expect(
        screen.getByPlaceholderText("Phone for notifications"),
      ).not.toBeRequired();
    });

    it("submits without metadata when notification fields are empty", async () => {
      render(
        <TestWrapper>
          <CreatePost onPostCreated={mockOnPostCreated} forceExpanded />
        </TestWrapper>,
      );

      fireEvent.change(screen.getByPlaceholderText("Your zipcode *"), {
        target: { value: "94110" },
      });
      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "My Post" },
      });
      fireEvent.change(
        screen.getByPlaceholderText(
          "What's on your mind? Share what you need or offer...",
        ),
        { target: { value: "Some content" } },
      );

      fireEvent.submit(
        screen
          .getByRole("button", { name: "Post Anonymously" })
          .closest("form")!,
      );

      await waitFor(() => {
        expect(postsApi.create).toHaveBeenCalledWith(
          expect.not.objectContaining({ metadata: expect.anything() }),
          null,
        );
      });
    });

    it("includes notification_email in metadata when provided", async () => {
      render(
        <TestWrapper>
          <CreatePost onPostCreated={mockOnPostCreated} forceExpanded />
        </TestWrapper>,
      );

      fireEvent.change(screen.getByPlaceholderText("Your zipcode *"), {
        target: { value: "94110" },
      });
      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "My Post" },
      });
      fireEvent.change(
        screen.getByPlaceholderText(
          "What's on your mind? Share what you need or offer...",
        ),
        { target: { value: "Some content" } },
      );
      fireEvent.change(screen.getByPlaceholderText("Email for notifications"), {
        target: { value: "notify@example.com" },
      });

      fireEvent.submit(
        screen
          .getByRole("button", { name: "Post Anonymously" })
          .closest("form")!,
      );

      await waitFor(() => {
        expect(postsApi.create).toHaveBeenCalledWith(
          expect.objectContaining({
            metadata: { notification_email: "notify@example.com" },
          }),
          null,
        );
      });
    });

    it("includes notification_phone in metadata when provided", async () => {
      render(
        <TestWrapper>
          <CreatePost onPostCreated={mockOnPostCreated} forceExpanded />
        </TestWrapper>,
      );

      fireEvent.change(screen.getByPlaceholderText("Your zipcode *"), {
        target: { value: "94110" },
      });
      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "My Post" },
      });
      fireEvent.change(
        screen.getByPlaceholderText(
          "What's on your mind? Share what you need or offer...",
        ),
        { target: { value: "Some content" } },
      );
      fireEvent.change(screen.getByPlaceholderText("Phone for notifications"), {
        target: { value: "555-1234" },
      });

      fireEvent.submit(
        screen
          .getByRole("button", { name: "Post Anonymously" })
          .closest("form")!,
      );

      await waitFor(() => {
        expect(postsApi.create).toHaveBeenCalledWith(
          expect.objectContaining({
            metadata: { notification_phone: "555-1234" },
          }),
          null,
        );
      });
    });

    it("includes both notification_email and notification_phone when both are provided", async () => {
      render(
        <TestWrapper>
          <CreatePost onPostCreated={mockOnPostCreated} forceExpanded />
        </TestWrapper>,
      );

      fireEvent.change(screen.getByPlaceholderText("Your zipcode *"), {
        target: { value: "94110" },
      });
      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "My Post" },
      });
      fireEvent.change(
        screen.getByPlaceholderText(
          "What's on your mind? Share what you need or offer...",
        ),
        { target: { value: "Some content" } },
      );
      fireEvent.change(screen.getByPlaceholderText("Email for notifications"), {
        target: { value: "notify@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Phone for notifications"), {
        target: { value: "555-1234" },
      });

      fireEvent.submit(
        screen
          .getByRole("button", { name: "Post Anonymously" })
          .closest("form")!,
      );

      await waitFor(() => {
        expect(postsApi.create).toHaveBeenCalledWith(
          expect.objectContaining({
            metadata: {
              notification_email: "notify@example.com",
              notification_phone: "555-1234",
            },
          }),
          null,
        );
      });
    });

    it("shows error when zipcode is missing", async () => {
      render(
        <TestWrapper>
          <CreatePost onPostCreated={mockOnPostCreated} forceExpanded />
        </TestWrapper>,
      );

      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "My Post" },
      });
      fireEvent.change(
        screen.getByPlaceholderText(
          "What's on your mind? Share what you need or offer...",
        ),
        { target: { value: "Some content" } },
      );

      fireEvent.submit(
        screen
          .getByRole("button", { name: "Post Anonymously" })
          .closest("form")!,
      );

      await waitFor(() => {
        expect(
          screen.getByText(/zipcode is required for anonymous posts/i),
        ).toBeInTheDocument();
      });
    });

    it("resets notification fields on cancel", () => {
      render(
        <TestWrapper>
          <CreatePost
            onPostCreated={mockOnPostCreated}
            forceExpanded
            onCancel={jest.fn()}
          />
        </TestWrapper>,
      );

      fireEvent.change(screen.getByPlaceholderText("Email for notifications"), {
        target: { value: "notify@example.com" },
      });

      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

      expect(
        screen.getByPlaceholderText("Email for notifications"),
      ).toHaveValue("");
    });
  });
});
