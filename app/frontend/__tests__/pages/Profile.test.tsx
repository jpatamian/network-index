import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock useToast before importing components
jest.mock("@chakra-ui/react", () => {
  const actual = jest.requireActual("@chakra-ui/react");
  return {
    ...actual,
    useToast: () => jest.fn(),
  };
});

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

import Profile from "../../features/profile/pages/Profile";
import { TestWrapper } from "../setup/test-wrapper";
import { useAuth } from "../../hooks/useAuth";

describe("Profile Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    zipcode: "90210",
    anonymous: false,
  };

  it("renders profile page for authenticated users", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    const { container } = render(
      <TestWrapper>
        <Profile />
      </TestWrapper>,
    );

    expect(container).toBeInTheDocument();
  });

  it("renders profile heading", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    const { container } = render(
      <TestWrapper>
        <Profile />
      </TestWrapper>,
    );

    const heading = container.querySelector("h2");
    expect(heading?.textContent).toContain("Profile dashboard");
  });

  it("displays user email", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <TestWrapper>
        <Profile />
      </TestWrapper>,
    );

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it("displays user username", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <TestWrapper>
        <Profile />
      </TestWrapper>,
    );

    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
  });

  it("displays user zipcode", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <TestWrapper>
        <Profile />
      </TestWrapper>,
    );

    expect(screen.getByText("Zipcode")).toBeInTheDocument();
    expect(screen.getByText(mockUser.zipcode)).toBeInTheDocument();
  });

  it("displays anonymous badge for anonymous users", () => {
    const anonymousUser = { ...mockUser, anonymous: true };
    (useAuth as jest.Mock).mockReturnValue({
      user: anonymousUser,
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <TestWrapper>
        <Profile />
      </TestWrapper>,
    );

    const badges = screen.getAllByText("Anonymous");
    expect(badges.length).toBeGreaterThan(0);
  });

  it("renders back to home button", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <TestWrapper>
        <Profile />
      </TestWrapper>,
    );

    expect(screen.getByText("Back to Home")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    expect(() => {
      render(
        <TestWrapper>
          <Profile />
        </TestWrapper>,
      );
    }).not.toThrow();
  });
});
