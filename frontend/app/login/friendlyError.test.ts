import { describe, expect, it } from "vitest";
import { friendlyError } from "./page";

const cases: Array<[string | undefined, string]> = [
  ["INVALID_EMAIL_OR_PASSWORD", "Incorrect email or password. Please try again."],
  ["INVALID_CREDENTIALS", "Incorrect email or password. Please try again."],
  [
    "EMAIL_NOT_VERIFIED",
    "Please verify your email before signing in. Check your inbox for the verification link.",
  ],
  [
    "USER_ALREADY_EXISTS",
    "An account with this email already exists. Try signing in instead.",
  ],
  [
    "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
    "An account with this email already exists. Try signing in instead.",
  ],
  [
    "ACCOUNT_NOT_LINKED",
    "This email is already registered with another sign-in method. Sign in with your original method first, then link Google from settings.",
  ],
  [
    "OAUTH_ACCOUNT_NOT_LINKED",
    "This email is already registered with another sign-in method. Sign in with your original method first, then link Google from settings.",
  ],
  ["TOO_MANY_REQUESTS", "Too many attempts. Please wait a minute and try again."],
  ["RATE_LIMITED", "Too many attempts. Please wait a minute and try again."],
  ["SOME_UNKNOWN_CODE", "Something went wrong. Please try again."],
  [undefined, "Something went wrong. Please try again."],
];

describe("friendlyError", () => {
  it.each(cases)("maps %s to a user-facing message", (code, expected) => {
    expect(friendlyError(code)).toBe(expected);
  });
});
