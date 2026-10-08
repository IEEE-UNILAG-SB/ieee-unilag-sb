import { describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";
import { authClient } from "@/lib/auth-client";

// Plain module-level mutable: safe because this file never re-imports
// modules mid-test, so the factory below always reads the current value.
let searchParamsString = "";

const routerMocks = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
};

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

function renderLoginPage(options?: {
  search?: string;
  session?: unknown;
  pending?: boolean;
  sessionError?: unknown;
}) {
  searchParamsString = options?.search ?? "";
  const refetch = vi.fn();
  vi.mocked(authClient.useSession).mockReturnValue({
    data: options?.pending ? null : (options?.session ?? null),
    isPending: options?.pending ?? false,
    error: options?.sessionError ?? null,
    refetch,
  } as never);
  const utils = render(<LoginPage />);
  return { ...utils, refetch };
}

async function fillSignup(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getAllByRole("button", { name: "Create account" })[0],
  );
  await user.type(screen.getByLabelText("Full name"), "Ada Lovelace");
  await user.type(screen.getByLabelText("Email"), "ada@example.com");
  await user.type(screen.getByLabelText("Password"), "CorrectHorse123!");
}

function signupSubmit(): HTMLElement {
  const submit = screen
    .getAllByRole("button", { name: "Create account" })
    .find((b) => b.getAttribute("type") === "submit");
  expect(submit).toBeDefined();
  return submit as HTMLElement;
}

describe("login page", () => {
  it("renders the email form with dormant Google button when signed out", () => {
    renderLoginPage();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign In" }),
    ).toBeInTheDocument();
    const googleButton = screen.getByRole("button", {
      name: "Continue with Google",
    });
    expect(googleButton).toBeDisabled();
    expect(
      screen.getByText("Google sign-in is coming soon. Use email below for now."),
    ).toBeInTheDocument();
  });

  it("shows the loading gate while the session is pending", () => {
    renderLoginPage({ pending: true });
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).toBeNull();
  });

  it("shows a retry state when the session check fails", async () => {
    const { refetch } = renderLoginPage({ sessionError: new Error("boom") });
    expect(screen.queryByLabelText("Email")).toBeNull();
    expect(
      screen.getByText("Could not check your sign-in status. Please try again."),
    ).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("redirects a signed-in user to / by default", async () => {
    renderLoginPage({
      session: { user: { name: "Ada", email: "ada@example.com" } },
    });
    await waitFor(() => {
      expect(routerMocks.replace).toHaveBeenCalledWith("/");
    });
    expect(screen.queryByLabelText("Email")).toBeNull();
  });

  it("redirects a signed-in user to the ?next= destination", async () => {
    renderLoginPage({
      search: "next=/dashboard",
      session: { user: { name: "Ada", email: "ada@example.com" } },
    });
    await waitFor(() => {
      expect(routerMocks.replace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it.each([
    "next=https://evil.com/phish",
    "next=//evil.com/phish",
    "next=javascript:alert(1)",
    "next=/login",
    "next=/login/",
    "next=/login?x=1",
    "next=/login#x",
    "next=/login%3Fx=1",
    "next=/login%2Fevil",
    "next=%5Cevil.com%2Fphish",
  ])("sanitizes hostile redirect %s to /", async (search) => {
    renderLoginPage({
      search,
      session: { user: { name: "Ada", email: "ada@example.com" } },
    });
    await waitFor(() => {
      expect(routerMocks.replace).toHaveBeenCalledWith("/");
    });
    cleanup();
    routerMocks.replace.mockClear();
  });

  it("creates an account from the signup tab and navigates home", async () => {
    renderLoginPage();
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      data: { user: { name: "Ada", email: "ada@example.com" } },
      error: null,
    } as never);
    const user = userEvent.setup();
    await fillSignup(user);
    await user.click(signupSubmit());
    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Ada Lovelace",
          email: "ada@example.com",
          password: "CorrectHorse123!",
          callbackURL: "/",
        }),
      );
    });
    expect(routerMocks.push).toHaveBeenCalledWith("/");
    expect(await screen.findByText("Account created! Redirecting…")).toBeInTheDocument();
  });

  it("sends a sanitized callbackURL on signup with a hostile ?next=", async () => {
    renderLoginPage({ search: "next=//evil.com/phish" });
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      data: { user: { name: "Ada", email: "ada@example.com" } },
      error: null,
    } as never);
    const user = userEvent.setup();
    await fillSignup(user);
    await user.click(signupSubmit());
    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith(
        expect.objectContaining({ callbackURL: "/" }),
      );
    });
    expect(routerMocks.push).toHaveBeenCalledWith("/");
  });

  it("sends a sanitized callbackURL on signin with a hostile ?next=", async () => {
    renderLoginPage({ search: "next=https://evil.com/phish" });
    vi.mocked(authClient.signIn.email).mockResolvedValue({
      data: { user: { name: "Ada", email: "ada@example.com" } },
      error: null,
    } as never);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "CorrectHorse123!");
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() => {
      expect(authClient.signIn.email).toHaveBeenCalledWith(
        expect.objectContaining({ callbackURL: "/" }),
      );
    });
    expect(routerMocks.push).toHaveBeenCalledWith("/");
  });

  it("sends a sanitized callbackURL on signup with a backslash ?next=", async () => {
    renderLoginPage({ search: "next=/foo%5Cbar" });
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      data: { user: { name: "Ada", email: "ada@example.com" } },
      error: null,
    } as never);
    const user = userEvent.setup();
    await fillSignup(user);
    await user.click(signupSubmit());
    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith(
        expect.objectContaining({ callbackURL: "/" }),
      );
    });
    expect(routerMocks.push).toHaveBeenCalledWith("/");
  });

  it("shows the account-exists message and stays put on signup conflict", async () => {
    renderLoginPage();
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      data: null,
      error: {
        code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
        message: "exists",
      },
    } as never);
    const user = userEvent.setup();
    await fillSignup(user);
    await user.click(signupSubmit());
    expect(
      await screen.findByText(
        "An account with this email already exists. Try signing in instead.",
      ),
    ).toBeInTheDocument();
    expect(routerMocks.push).not.toHaveBeenCalled();
  });

  it("moves focus to the success message on signup", async () => {
    renderLoginPage();
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      data: { user: { name: "Ada", email: "ada@example.com" } },
      error: null,
    } as never);
    const user = userEvent.setup();
    await fillSignup(user);
    await user.click(signupSubmit());
    const status = await screen.findByRole("status");
    await waitFor(() => {
      expect(status).toHaveFocus();
    });
  });

  it("rejects a whitespace-only name before submitting", async () => {
    renderLoginPage();
    const user = userEvent.setup();
    await user.click(
      screen.getAllByRole("button", { name: "Create account" })[0],
    );
    await user.type(screen.getByLabelText("Full name"), "   ");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "CorrectHorse123!");
    await user.click(signupSubmit());
    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(authClient.signUp.email).not.toHaveBeenCalled();
  });

  it("shows a friendly message and stays put on invalid credentials", async () => {
    renderLoginPage();
    vi.mocked(authClient.signIn.email).mockResolvedValue({
      data: null,
      error: { code: "INVALID_EMAIL_OR_PASSWORD", message: "x" },
    } as never);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(
      await screen.findByText("Incorrect email or password. Please try again."),
    ).toBeInTheDocument();
    expect(routerMocks.push).not.toHaveBeenCalled();
  });

  it("moves focus to the error message on failed signin", async () => {
    renderLoginPage();
    vi.mocked(authClient.signIn.email).mockResolvedValue({
      data: null,
      error: { code: "INVALID_EMAIL_OR_PASSWORD", message: "x" },
    } as never);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    const alert = await screen.findByRole("alert");
    await waitFor(() => {
      expect(alert).toHaveFocus();
    });
  });

  it("shows a generic message when signin throws", async () => {
    renderLoginPage();
    vi.mocked(authClient.signIn.email).mockRejectedValueOnce(
      new Error("network down"),
    );
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "CorrectHorse123!");
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(
      await screen.findByText("Something went wrong. Please try again."),
    ).toBeInTheDocument();
    expect(routerMocks.push).not.toHaveBeenCalled();
  });

  it("sends only one request on double submit", async () => {
    renderLoginPage();
    let resolveSignIn!: (v: unknown) => void;
    vi.mocked(authClient.signIn.email).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSignIn = resolve;
        }) as never,
    );
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "CorrectHorse123!");
    const submit = screen.getByRole("button", { name: "Sign In" });
    await user.click(submit);
    await user.click(submit);
    expect(authClient.signIn.email).toHaveBeenCalledTimes(1);
    resolveSignIn({ data: { user: { email: "ada@example.com" } }, error: null });
    await waitFor(() => {
      expect(routerMocks.push).toHaveBeenCalledWith("/");
    });
  });

  it("reports the signin/signup mode via aria-pressed", async () => {
    renderLoginPage();
    const tabs = screen.getAllByRole("button", { name: /sign in|create account/i });
    const signinTab = tabs.find((b) => b.textContent === "Sign in") as HTMLElement;
    const signupTab = tabs.find(
      (b) => b.textContent === "Create account" && b.getAttribute("type") !== "submit",
    ) as HTMLElement;
    expect(signinTab).toHaveAttribute("aria-pressed", "true");
    expect(signupTab).toHaveAttribute("aria-pressed", "false");
    const user = userEvent.setup();
    await user.click(signupTab);
    expect(signinTab).toHaveAttribute("aria-pressed", "false");
    expect(signupTab).toHaveAttribute("aria-pressed", "true");
  });
});
