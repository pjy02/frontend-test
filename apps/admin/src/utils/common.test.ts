import { describe, expect, it } from "vitest";
import { sanitizeRedirectPath } from "./common";

describe("sanitizeRedirectPath", () => {
  it.each([
    ["/dashboard", "/dashboard"],
    ["/dashboard/user?page=2", "/dashboard/user?page=2"],
    ["/dashboard#section", "/dashboard#section"],
  ])("accepts local path %s", (input, expected) => {
    expect(sanitizeRedirectPath(input)).toBe(expected);
  });

  it.each([
    undefined,
    null,
    "",
    "dashboard",
    "//evil.example/path",
    "https://evil.example/path",
    "javascript:alert(1)",
  ])("rejects unsafe redirect %s", (input) => {
    expect(sanitizeRedirectPath(input)).toBeUndefined();
  });
});
