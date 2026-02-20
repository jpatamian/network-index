import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../features/home/pages/Home";
import { TestWrapper } from "../setup/test-wrapper";

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "../../hooks/useAuth";

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it("renders page for unauthenticated users", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    );

    expect(document.body).toBeInTheDocument();
    expect(screen.getByText("Create a Post")).toBeInTheDocument();
  });

  it("renders page for authenticated users", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        username: "testuser",
        email: "test@example.com",
        zipcode: "12345",
        anonymous: false,
      },
      isAuthenticated: true,
    });

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    );

    expect(document.body).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    expect(() => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>,
      );
    }).not.toThrow();
  });

  it("renders heading for authenticated users", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        username: "testuser",
        email: "test@example.com",
        zipcode: "12345",
        anonymous: false,
      },
      isAuthenticated: true,
    });

    const { container } = render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    );

    // Check that some heading exists
    const headings = container.querySelectorAll("h1, h2, h3");
    expect(headings.length).toBeGreaterThan(0);
  });

  it("persists dismissing the support banner", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    const { unmount } = render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    );

    expect(
      screen.getByText(/Need help or want to offer support/i),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Dismiss banner/i));

    expect(
      screen.queryByText(/Need help or want to offer support/i),
    ).not.toBeInTheDocument();

    unmount();

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    );

    expect(
      screen.queryByText(/Need help or want to offer support/i),
    ).not.toBeInTheDocument();
  });
});
