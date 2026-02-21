import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProfileField } from "../../../../features/profile/components/ProfileField";
import { TestWrapper } from "../../../setup/test-wrapper";
import { FaUser } from "react-icons/fa";

const baseProps = {
  icon: FaUser,
  label: "Username",
  display: "johndoe",
  isEditing: false,
  value: "johndoe",
  onChange: jest.fn(),
};

describe("ProfileField", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("display mode (isEditing = false)", () => {
    it("renders the label", () => {
      render(
        <TestWrapper>
          <ProfileField {...baseProps} />
        </TestWrapper>,
      );

      expect(screen.getByText("Username")).toBeInTheDocument();
    });

    it("renders the display value", () => {
      render(
        <TestWrapper>
          <ProfileField {...baseProps} />
        </TestWrapper>,
      );

      expect(screen.getByText("johndoe")).toBeInTheDocument();
    });

    it("does not render an input in display mode", () => {
      render(
        <TestWrapper>
          <ProfileField {...baseProps} />
        </TestWrapper>,
      );

      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });
  });

  describe("edit mode (isEditing = true)", () => {
    it("renders an input when isEditing is true and field is set", () => {
      render(
        <TestWrapper>
          <ProfileField {...baseProps} isEditing field="username" />
        </TestWrapper>,
      );

      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("calls onChange with field name and new value when input changes", () => {
      const handleChange = jest.fn();
      render(
        <TestWrapper>
          <ProfileField
            {...baseProps}
            isEditing
            field="username"
            onChange={handleChange}
          />
        </TestWrapper>,
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "newuser" } });

      expect(handleChange).toHaveBeenCalledWith("username", "newuser");
    });

    it("shows the display value (not input) when readOnly is true even in edit mode", () => {
      render(
        <TestWrapper>
          <ProfileField
            {...baseProps}
            isEditing
            field="username"
            readOnly
          />
        </TestWrapper>,
      );

      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      expect(screen.getByText("johndoe")).toBeInTheDocument();
    });

    it("shows the display value (not input) when field is not set", () => {
      render(
        <TestWrapper>
          <ProfileField {...baseProps} isEditing />
        </TestWrapper>,
      );

      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      expect(screen.getByText("johndoe")).toBeInTheDocument();
    });
  });
});
