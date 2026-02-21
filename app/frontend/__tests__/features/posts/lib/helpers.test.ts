import { toErrorMessage, getInitial } from "../../../../features/posts/lib/helpers";

describe("toErrorMessage", () => {
  it("returns the error message when given an Error instance", () => {
    const error = new Error("Something went wrong");
    expect(toErrorMessage(error, "fallback")).toBe("Something went wrong");
  });

  it("returns the fallback when given a non-Error value", () => {
    expect(toErrorMessage("some string", "fallback message")).toBe(
      "fallback message",
    );
  });

  it("returns the fallback when given null", () => {
    expect(toErrorMessage(null, "fallback")).toBe("fallback");
  });

  it("returns the fallback when given undefined", () => {
    expect(toErrorMessage(undefined, "fallback")).toBe("fallback");
  });

  it("returns the fallback when given a plain object", () => {
    expect(toErrorMessage({ code: 404 }, "not found")).toBe("not found");
  });

  it("returns the fallback when given a number", () => {
    expect(toErrorMessage(500, "server error")).toBe("server error");
  });

  it("returns an empty string message from an Error with empty message", () => {
    const error = new Error("");
    expect(toErrorMessage(error, "fallback")).toBe("");
  });
});

describe("getInitial", () => {
  it("returns the first character uppercased", () => {
    expect(getInitial("alice")).toBe("A");
  });

  it("returns uppercase when already uppercase", () => {
    expect(getInitial("Bob")).toBe("B");
  });

  it("returns the first character of a multi-word string", () => {
    expect(getInitial("john doe")).toBe("J");
  });

  it("handles a single character string", () => {
    expect(getInitial("x")).toBe("X");
  });

  it("handles an uppercase single character", () => {
    expect(getInitial("Z")).toBe("Z");
  });

  it("handles strings starting with a number", () => {
    expect(getInitial("42abc")).toBe("4");
  });
});
