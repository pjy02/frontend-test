import { describe, expect, it } from "vitest";
import { parseFeatureFlag } from "./features";

describe("parseFeatureFlag", () => {
  it.each(["true", "TRUE", "1"])("enables the flag for %s", (value) => {
    expect(parseFeatureFlag(value)).toBe(true);
  });

  it.each(["false", "0", "unexpected"])("disables the flag for %s", (value) => {
    expect(parseFeatureFlag(value)).toBe(false);
  });

  it("uses the provided default when the value is absent", () => {
    expect(parseFeatureFlag(undefined, true)).toBe(true);
  });
});
