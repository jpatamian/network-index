import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormInput from "../../components/FormInput";
import { TestWrapper } from "../setup/test-wrapper";

describe("FormInput", () => {
  const defaultProps = {
    name: "email",
    placeholder: "Enter your email",
    value: "",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders an input element", () => {
    render(
      <TestWrapper>
        <FormInput {...defaultProps} />
      </TestWrapper>,
    );

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
  });

  it("renders with the provided value", () => {
    render(
      <TestWrapper>
        <FormInput {...defaultProps} value="test@example.com" />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toHaveValue("test@example.com");
  });

  it("calls onChange when the user types", () => {
    const handleChange = jest.fn();
    render(
      <TestWrapper>
        <FormInput {...defaultProps} onChange={handleChange} />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(input, { target: { value: "hello" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("defaults type to text", () => {
    render(
      <TestWrapper>
        <FormInput {...defaultProps} />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toHaveAttribute("type", "text");
  });

  it("applies the given type attribute", () => {
    render(
      <TestWrapper>
        <FormInput {...defaultProps} type="password" />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toHaveAttribute("type", "password");
  });

  it("applies the name attribute", () => {
    render(
      <TestWrapper>
        <FormInput {...defaultProps} name="username" />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toHaveAttribute("name", "username");
  });

  it("marks the input as required when required prop is true", () => {
    render(
      <TestWrapper>
        <FormInput {...defaultProps} required />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toBeRequired();
  });

  it("is not required by default", () => {
    render(
      <TestWrapper>
        <FormInput {...defaultProps} />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).not.toBeRequired();
  });
});
