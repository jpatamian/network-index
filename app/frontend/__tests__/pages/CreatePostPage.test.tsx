import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CreatePostPage } from "../../features/posts/pages/CreatePostPage";
import { TestWrapper } from "../setup/test-wrapper";

jest.mock("../../features/posts/components/CreatePost", () => ({
  CreatePost: () => <div data-testid="create-post-component" />,
}));

describe("CreatePostPage", () => {
  it("renders the dedicated create post experience", () => {
    render(
      <TestWrapper>
        <CreatePostPage />
      </TestWrapper>,
    );

    expect(screen.getByText("Share something new")).toBeInTheDocument();
    expect(screen.getByTestId("create-post-component")).toBeInTheDocument();
  });
});
