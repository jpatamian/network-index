import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FlagButton } from "../../../../features/posts/components/FlagButton";
import { TestWrapper } from "../../../setup/test-wrapper";

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/lib/api", () => ({
  flagsApi: {
    createForPost: jest.fn(),
    createForComment: jest.fn(),
  },
}));

jest.mock("@/components/ui/toaster", () => ({
  toaster: {
    success: jest.fn(),
  },
}));

import { useAuth } from "@/hooks/useAuth";
import { flagsApi } from "@/lib/api";
import { toaster } from "@/components/ui/toaster";

describe("FlagButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      token: "mock-token",
    });
  });

  const postTarget = { target: "post" as const, postId: 1 };

  it("renders the flag icon button", () => {
    render(
      <TestWrapper>
        <FlagButton {...postTarget} />
      </TestWrapper>,
    );

    expect(screen.getByRole("button", { name: /report content/i })).toBeInTheDocument();
  });

  it("uses the provided ariaLabel", () => {
    render(
      <TestWrapper>
        <FlagButton {...postTarget} ariaLabel="Flag this post" />
      </TestWrapper>,
    );

    expect(screen.getByRole("button", { name: /flag this post/i })).toBeInTheDocument();
  });

  it("opens the report panel when the flag button is clicked", () => {
    render(
      <TestWrapper>
        <FlagButton {...postTarget} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByRole("button", { name: /report content/i }));

    expect(screen.getByText("Why are you reporting this?")).toBeInTheDocument();
  });

  it("closes the panel when Cancel is clicked", () => {
    render(
      <TestWrapper>
        <FlagButton {...postTarget} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByRole("button", { name: /report content/i }));
    expect(screen.getByText("Why are you reporting this?")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByText("Why are you reporting this?")).not.toBeInTheDocument();
  });

  it("renders the reason dropdown with options", () => {
    render(
      <TestWrapper>
        <FlagButton {...postTarget} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByRole("button", { name: /report content/i }));

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Spam")).toBeInTheDocument();
    expect(screen.getByText("Harassment")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });

  it("shows a description field when 'Other' is selected", () => {
    render(
      <TestWrapper>
        <FlagButton {...postTarget} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByRole("button", { name: /report content/i }));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "other" } });

    expect(screen.getByPlaceholderText("Share a short reason")).toBeInTheDocument();
  });

  it("hides the description field for non-Other reasons", () => {
    render(
      <TestWrapper>
        <FlagButton {...postTarget} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByRole("button", { name: /report content/i }));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "spam" } });

    expect(screen.queryByPlaceholderText("Share a short reason")).not.toBeInTheDocument();
  });

  it("shows a validation error when 'Other' is submitted without a description", async () => {
    render(
      <TestWrapper>
        <FlagButton {...postTarget} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByRole("button", { name: /report content/i }));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "other" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText("Please share a short explanation for 'Other'."),
    ).toBeInTheDocument();
    expect(flagsApi.createForPost).not.toHaveBeenCalled();
  });

  it("calls createForPost and shows success toast on successful post flag", async () => {
    (flagsApi.createForPost as jest.Mock).mockResolvedValue({});

    render(
      <TestWrapper>
        <FlagButton {...postTarget} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByRole("button", { name: /report content/i }));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(flagsApi.createForPost).toHaveBeenCalledWith(
        1,
        { reason: "spam", description: undefined },
        "mock-token",
      );
      expect(toaster.success).toHaveBeenCalled();
    });
  });

  it("calls createForComment for a comment target", async () => {
    (flagsApi.createForComment as jest.Mock).mockResolvedValue({});
    const commentTarget = { target: "comment" as const, postId: 1, commentId: 7 };

    render(
      <TestWrapper>
        <FlagButton {...commentTarget} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByRole("button", { name: /report content/i }));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(flagsApi.createForComment).toHaveBeenCalledWith(
        1,
        7,
        { reason: "spam", description: undefined },
        "mock-token",
      );
    });
  });

  it("shows an error message when the API call fails", async () => {
    (flagsApi.createForPost as jest.Mock).mockRejectedValue(
      new Error("Already reported"),
    );

    render(
      <TestWrapper>
        <FlagButton {...postTarget} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByRole("button", { name: /report content/i }));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText("Already reported")).toBeInTheDocument();
  });

  it("is disabled when isDisabled prop is true", () => {
    render(
      <TestWrapper>
        <FlagButton {...postTarget} isDisabled />
      </TestWrapper>,
    );

    expect(screen.getByRole("button", { name: /report content/i })).toBeDisabled();
  });

  it("does not submit if there is no token", async () => {
    (useAuth as jest.Mock).mockReturnValue({ token: null });

    render(
      <TestWrapper>
        <FlagButton {...postTarget} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByRole("button", { name: /report content/i }));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(flagsApi.createForPost).not.toHaveBeenCalled();
    });
  });
});
