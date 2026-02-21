import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MissingZipcodeBanner } from "../../../../features/profile/components/MissingZipcodeBanner";
import { TestWrapper } from "../../../setup/test-wrapper";

describe("MissingZipcodeBanner", () => {
  const defaultProps = {
    isEditing: false,
    onUpdate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the missing zipcode message", () => {
    render(
      <TestWrapper>
        <MissingZipcodeBanner {...defaultProps} />
      </TestWrapper>,
    );

    expect(
      screen.getByText(
        "Your zipcode is missing. Add it now to complete your profile.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the update button when not editing", () => {
    render(
      <TestWrapper>
        <MissingZipcodeBanner {...defaultProps} isEditing={false} />
      </TestWrapper>,
    );

    expect(screen.getByRole("button", { name: /update zipcode/i })).toBeInTheDocument();
  });

  it("hides the update button when editing", () => {
    render(
      <TestWrapper>
        <MissingZipcodeBanner {...defaultProps} isEditing />
      </TestWrapper>,
    );

    expect(screen.queryByRole("button", { name: /update zipcode/i })).not.toBeInTheDocument();
  });

  it("calls onUpdate when the update button is clicked", () => {
    const handleUpdate = jest.fn();
    render(
      <TestWrapper>
        <MissingZipcodeBanner isEditing={false} onUpdate={handleUpdate} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByRole("button", { name: /update zipcode/i }));

    expect(handleUpdate).toHaveBeenCalledTimes(1);
  });
});
