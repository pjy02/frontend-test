import { describe, expect, it } from "vitest";
import { statusToneVariants } from "./status-badge.js";

describe("statusToneVariants", () => {
  it("maps semantic tones to badge variants", () => {
    expect(statusToneVariants).toEqual({
      destructive: "destructive",
      info: "info",
      neutral: "secondary",
      success: "success",
      warning: "warning",
    });
  });
});
