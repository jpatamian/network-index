import { formatNotificationDate } from "../../../../features/profile/lib/utils";

describe("formatNotificationDate", () => {
  it("returns a non-empty string for a valid ISO date", () => {
    const result = formatNotificationDate("2026-02-18T10:00:00Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("includes the year in the output", () => {
    const result = formatNotificationDate("2026-05-20T12:00:00Z");
    expect(result).toContain("2026");
  });

  it("produces different output for different timestamps", () => {
    const result1 = formatNotificationDate("2024-01-01T00:00:00Z");
    const result2 = formatNotificationDate("2025-06-15T12:30:00Z");
    expect(result1).not.toBe(result2);
  });

  it("handles a date at the Unix epoch boundary", () => {
    const result = formatNotificationDate("1970-01-01T00:00:00Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
