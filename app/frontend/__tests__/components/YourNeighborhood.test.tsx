import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import YourNeighborhood from "../../features/neighborhood/components/YourNeighborhood";
import { TestWrapper } from "../setup/test-wrapper";

describe("YourNeighborhood Component", () => {
  const userWithZipcode = {
    zipcode: "90210",
    username: "testuser",
    email: "test@example.com",
  };

  const userWithoutZipcode = {
    zipcode: undefined,
    username: "testuser",
    email: "test@example.com",
  };

  it("renders your neighborhood heading", () => {
    const { container } = render(
      <TestWrapper>
        <YourNeighborhood user={userWithZipcode} />
      </TestWrapper>,
    );

    const heading = container.querySelector("h2");
    expect(heading?.textContent).toContain("Your Neighborhood");
  });

  it("renders zipcode badge when user has zipcode", () => {
    render(
      <TestWrapper>
        <YourNeighborhood user={userWithZipcode} />
      </TestWrapper>,
    );

    expect(screen.getByText("90210")).toBeInTheDocument();
  });

  it("renders update profile button when user lacks zipcode", () => {
    render(
      <TestWrapper>
        <YourNeighborhood user={userWithoutZipcode} />
      </TestWrapper>,
    );

    const button = screen.getByText(/Update Profile/i);
    expect(button).toBeInTheDocument();
  });

  it("renders neighborhood prompt text when user lacks zipcode", () => {
    render(
      <TestWrapper>
        <YourNeighborhood user={userWithoutZipcode} />
      </TestWrapper>,
    );

    expect(
      screen.getByText(/Add your zipcode to discover resources/i),
    ).toBeInTheDocument();
  });

  it("renders map pin icon", () => {
    const { container } = render(
      <TestWrapper>
        <YourNeighborhood user={userWithZipcode} />
      </TestWrapper>,
    );

    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("renders without crashing with zipcode", () => {
    expect(() => {
      render(
        <TestWrapper>
          <YourNeighborhood user={userWithZipcode} />
        </TestWrapper>,
      );
    }).not.toThrow();
  });

  it("renders without crashing without zipcode", () => {
    expect(() => {
      render(
        <TestWrapper>
          <YourNeighborhood user={userWithoutZipcode} />
        </TestWrapper>,
      );
    }).not.toThrow();
  });
});
