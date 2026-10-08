import { describe, expect, it } from "vitest";
import { EMAIL_PATTERN } from "../models/validators";
import { SEED_WIPE_FLAG, seedAllowed } from "../scripts/seedGuard";

const validEmails = [
  "ada@example.com",
  "user+tag@example.com",
  "user@mail.example.co.uk",
  "user@example.technology",
  `${"a".repeat(240)}@example.com`,
];

const invalidEmails = [
  "not-an-email",
  "missing-at.com",
  "spaces in@example.com",
  "user@nodot",
  "@example.com",
];

describe("EMAIL_PATTERN", () => {
  it.each(validEmails)("accepts %s", (email) => {
    expect(EMAIL_PATTERN.test(email)).toBe(true);
  });

  it.each(invalidEmails)("rejects %s", (email) => {
    expect(EMAIL_PATTERN.test(email)).toBe(false);
  });
});

describe("seedAllowed", () => {
  it("refuses production without the wipe flag", () => {
    expect(
      seedAllowed({ NODE_ENV: "production" } as NodeJS.ProcessEnv, ["node", "seed"]),
    ).toBe(false);
  });

  it("allows production with the wipe flag", () => {
    expect(
      seedAllowed({ NODE_ENV: "production" } as NodeJS.ProcessEnv, [
        "node",
        "seed",
        SEED_WIPE_FLAG,
      ]),
    ).toBe(true);
  });

  it("allows development without the flag", () => {
    expect(
      seedAllowed({ NODE_ENV: "development" } as NodeJS.ProcessEnv, ["node", "seed"]),
    ).toBe(true);
  });

  it("allows test env without the flag", () => {
    expect(
      seedAllowed({ NODE_ENV: "test" } as NodeJS.ProcessEnv, ["node", "seed"]),
    ).toBe(true);
  });
});
