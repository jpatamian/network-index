import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorBox from "../../components/ErrorBox";
import { TestWrapper } from "../setup/test-wrapper";

describe("ErrorBox", () => {
  it("renders child text content", () => {
    render(
      <TestWrapper>
        <ErrorBox>Something went wrong</ErrorBox>
      </TestWrapper>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders React element children", () => {
    render(
      <TestWrapper>
        <ErrorBox>
          <span>Error details here</span>
        </ErrorBox>
      </TestWrapper>,
    );

    expect(screen.getByText("Error details here")).toBeInTheDocument();
  });

  it("renders without crashing when given an empty string", () => {
    expect(() => {
      render(
        <TestWrapper>
          <ErrorBox>{""}</ErrorBox>
        </TestWrapper>,
      );
    }).not.toThrow();
  });

  it("renders multiple children", () => {
    render(
      <TestWrapper>
        <ErrorBox>
          {"First message. "}
          {"Second message."}
        </ErrorBox>
      </TestWrapper>,
    );

    expect(screen.getByText(/First message/)).toBeInTheDocument();
    expect(screen.getByText(/Second message/)).toBeInTheDocument();
  });
});
