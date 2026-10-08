import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const routerMocks = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
};

// Plain module-level mutable: read at call time by the mock below, so each
// test sets it before rendering.
let searchParamsString = "";

vi.mock("next/navigation", () => ({
  useRouter: () => routerMocks,
  useSearchParams: () => new URLSearchParams(searchParamsString),
  usePathname: () => "/login",
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: vi.fn(),
    signIn: { email: vi.fn(), social: vi.fn() },
    signUp: { email: vi.fn() },
    signOut: vi.fn(),
  },
}));

describe("login page Google flag", () => {
  it("enables Google sign-in with full args when the feature flag is set", async () => {
    process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED = "true";
    try {
      const [{ default: LoginPage }, authMod] = await Promise.all([
        import("./page"),
        import("@/lib/auth-client"),
      ]);
      vi.mocked(authMod.authClient.useSession).mockReturnValue({
        data: null,
        isPending: false,
        error: null,
        refetch: vi.fn(),
      } as never);
      vi.mocked(authMod.authClient.signIn.social).mockResolvedValue({
        data: {},
        error: null,
      } as never);
      render(<LoginPage />);
      const googleButton = screen.getByRole("button", {
        name: "Continue with Google",
      });
      expect(googleButton).not.toBeDisabled();
      expect(
        screen.queryByText(
          "Google sign-in is coming soon. Use email below for now.",
        ),
      ).toBeNull();
      const user = userEvent.setup();
      await user.click(googleButton);
      expect(authMod.authClient.signIn.social).toHaveBeenCalledWith(
        expect.objectContaining({ provider: "google", callbackURL: "/" }),
      );
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Continue with Google" }),
        ).not.toBeDisabled();
      });
    } finally {
      delete process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED;
    }
  });

  it("recovers the button when Google sign-in throws", async () => {
    process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED = "true";
    try {
      const [{ default: LoginPage }, authMod] = await Promise.all([
        import("./page"),
        import("@/lib/auth-client"),
      ]);
      vi.mocked(authMod.authClient.useSession).mockReturnValue({
        data: null,
        isPending: false,
        error: null,
        refetch: vi.fn(),
      } as never);
      vi.mocked(authMod.authClient.signIn.social).mockRejectedValueOnce(
        new Error("popup blocked"),
      );
      render(<LoginPage />);
      const googleButton = screen.getByRole("button", {
        name: "Continue with Google",
      });
      const user = userEvent.setup();
      await user.click(googleButton);
      expect(
        await screen.findByText("Something went wrong. Please try again."),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Continue with Google" }),
      ).not.toBeDisabled();
    } finally {
      delete process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED;
    }
  });

  it("surfaces a resolved-error Google failure with recovery", async () => {
    process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED = "true";
    try {
      const [{ default: LoginPage }, authMod] = await Promise.all([
        import("./page"),
        import("@/lib/auth-client"),
      ]);
      vi.mocked(authMod.authClient.useSession).mockReturnValue({
        data: null,
        isPending: false,
        error: null,
        refetch: vi.fn(),
      } as never);
      vi.mocked(authMod.authClient.signIn.social).mockResolvedValueOnce({
        data: null,
        error: { code: "OAUTH_ACCOUNT_NOT_LINKED", message: "not linked" },
      } as never);
      render(<LoginPage />);
      const user = userEvent.setup();
      await user.click(
        screen.getByRole("button", { name: "Continue with Google" }),
      );
      expect(
        await screen.findByText(
          "This email is already registered with another sign-in method. Sign in with your original method first, then link Google from settings.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Continue with Google" }),
      ).not.toBeDisabled();
    } finally {
      delete process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED;
    }
  });

  it("sends a sanitized callbackURL for Google with a hostile ?next=", async () => {
    process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED = "true";
    searchParamsString = "next=//evil.com/phish";
    try {
      const [{ default: LoginPage }, authMod] = await Promise.all([
        import("./page"),
        import("@/lib/auth-client"),
      ]);
      vi.mocked(authMod.authClient.useSession).mockReturnValue({
        data: null,
        isPending: false,
        error: null,
        refetch: vi.fn(),
      } as never);
      vi.mocked(authMod.authClient.signIn.social).mockResolvedValue({
        data: {},
        error: null,
      } as never);
      render(<LoginPage />);
      const user = userEvent.setup();
      await user.click(
        screen.getByRole("button", { name: "Continue with Google" }),
      );
      expect(authMod.authClient.signIn.social).toHaveBeenCalledWith(
        expect.objectContaining({ provider: "google", callbackURL: "/" }),
      );
    } finally {
      searchParamsString = "";
      delete process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED;
    }
  });
});
