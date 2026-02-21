import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NotificationsCard } from "../../../../features/profile/components/NotificationsCard";
import { TestWrapper } from "../../../setup/test-wrapper";
import { NotificationItem } from "../../../../types/notification";

const mockNotification: NotificationItem = {
  id: 1,
  message: "Alice liked your post",
  notification_type: "like",
  created_at: "2026-02-18T10:00:00Z",
  read_at: null,
  post_id: 42,
  comment_id: 0,
  post_title: "Help with moving",
  actor: { id: 5, name: "Alice" },
};

describe("NotificationsCard", () => {
  it("renders the notifications heading", () => {
    render(
      <TestWrapper>
        <NotificationsCard notifications={[]} isLoading={false} error="" />
      </TestWrapper>,
    );

    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("renders the 'Latest' badge", () => {
    render(
      <TestWrapper>
        <NotificationsCard notifications={[]} isLoading={false} error="" />
      </TestWrapper>,
    );

    expect(screen.getByText("Latest")).toBeInTheDocument();
  });

  it("shows loading text when isLoading is true", () => {
    render(
      <TestWrapper>
        <NotificationsCard notifications={[]} isLoading error="" />
      </TestWrapper>,
    );

    expect(screen.getByText("Loading notifications...")).toBeInTheDocument();
  });

  it("shows error text when error is provided", () => {
    render(
      <TestWrapper>
        <NotificationsCard
          notifications={[]}
          isLoading={false}
          error="Failed to load"
        />
      </TestWrapper>,
    );

    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("shows empty state message when there are no notifications", () => {
    render(
      <TestWrapper>
        <NotificationsCard notifications={[]} isLoading={false} error="" />
      </TestWrapper>,
    );

    expect(screen.getByText("No notifications yet.")).toBeInTheDocument();
  });

  it("does not show empty state when notifications exist", () => {
    render(
      <TestWrapper>
        <NotificationsCard
          notifications={[mockNotification]}
          isLoading={false}
          error=""
        />
      </TestWrapper>,
    );

    expect(screen.queryByText("No notifications yet.")).not.toBeInTheDocument();
  });

  it("renders notification message", () => {
    render(
      <TestWrapper>
        <NotificationsCard
          notifications={[mockNotification]}
          isLoading={false}
          error=""
        />
      </TestWrapper>,
    );

    expect(screen.getByText("Alice liked your post")).toBeInTheDocument();
  });

  it("renders the post title when present", () => {
    render(
      <TestWrapper>
        <NotificationsCard
          notifications={[mockNotification]}
          isLoading={false}
          error=""
        />
      </TestWrapper>,
    );

    expect(screen.getByText("Help with moving")).toBeInTheDocument();
  });

  it("does not render post title when it is null", () => {
    const notificationWithoutTitle: NotificationItem = {
      ...mockNotification,
      id: 2,
      post_title: null,
    };

    render(
      <TestWrapper>
        <NotificationsCard
          notifications={[notificationWithoutTitle]}
          isLoading={false}
          error=""
        />
      </TestWrapper>,
    );

    expect(screen.queryByText("Help with moving")).not.toBeInTheDocument();
  });

  it("renders multiple notifications", () => {
    const second: NotificationItem = {
      ...mockNotification,
      id: 2,
      message: "Bob commented on your post",
      post_title: "Another post",
    };

    render(
      <TestWrapper>
        <NotificationsCard
          notifications={[mockNotification, second]}
          isLoading={false}
          error=""
        />
      </TestWrapper>,
    );

    expect(screen.getByText("Alice liked your post")).toBeInTheDocument();
    expect(screen.getByText("Bob commented on your post")).toBeInTheDocument();
  });
});
