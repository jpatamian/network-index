import { formatDate } from "../../lib/date";

describe("formatDate", () => {
  it("formats a valid ISO date string", () => {
    const result = formatDate("2026-02-18T10:00:00Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("includes the year in the output", () => {
    const result = formatDate("2026-02-18T00:00:00Z");
    expect(result).toContain("2026");
  });

  it("accepts custom format options", () => {
    const result = formatDate("2026-01-15T00:00:00Z", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    expect(result).toContain("2026");
    expect(result).toContain("15");
  });

  it("handles a date at the start of the year", () => {
    const result = formatDate("2026-01-01T00:00:00Z");
    expect(result).toContain("2026");
  });

  it("handles a date at the end of the year", () => {
    const result = formatDate("2025-12-31T23:59:59Z");
    expect(result).toContain("2025");
  });

  it("returns a different string for different dates", () => {
    const result1 = formatDate("2024-03-01T00:00:00Z");
    const result2 = formatDate("2025-11-20T00:00:00Z");
    expect(result1).not.toBe(result2);
  });
});
