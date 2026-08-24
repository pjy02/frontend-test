import { describe, expect, it } from "vitest";
import { DENSITIES, parseDensity } from "./density.js";

describe("parseDensity", () => {
  it.each(DENSITIES)("accepts %s", (density) => {
    expect(parseDensity(density)).toBe(density);
  });

  it.each([
    undefined,
    null,
    "",
    "dense",
    1,
  ])("rejects unsupported value %s", (value) => {
    expect(parseDensity(value)).toBeUndefined();
  });
});
