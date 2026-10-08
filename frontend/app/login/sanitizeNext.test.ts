import { describe, expect, it } from "vitest";
import { sanitizeNext } from "./page";

const cases: Array<[string | null, string]> = [
  [null, "/"],
  ["", "/"],
  ["dashboard", "/"],
  ["https://evil.com/phish", "/"],
  ["http://evil.com/", "/"],
  ["//evil.com/phish", "/"],
  ["javascript:alert(1)", "/"],
  ["javaScript:alert(1)", "/"],
  ["/\\evil.com", "/"],
  ["/foo\\bar", "/"],
  ["\\", "/"],
  ["/login", "/"],
  ["/login/", "/"],
  ["/login?next=/x", "/"],
  ["/login#x", "/"],
  ["/login/evil?x=1", "/"],
  ["/", "/"],
  ["/dashboard", "/dashboard"],
  ["/events?foo=bar", "/events?foo=bar"],
  ["/login-evil", "/login-evil"],
];

describe("sanitizeNext", () => {
  it.each(cases)("maps %s to %s", (raw, expected) => {
    expect(sanitizeNext(raw)).toBe(expected);
  });
});
