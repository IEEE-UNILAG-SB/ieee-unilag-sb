import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "./Navbar";
import { authClient } from "@/lib/auth-client";

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: vi.fn(),
    signIn: { email: vi.fn(), social: vi.fn() },
    signUp: { email: vi.fn() },
    signOut: vi.fn(),
  },
}));

const push = vi.fn();
const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace, refresh, back: vi.fn(), forward: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

function setSession(data: unknown) {
  vi.mocked(authClient.useSession).mockReturnValue({
    data,
    isPending: false,
    error: null,
    refetch: vi.fn(),
  } as never);
}

function setPending() {
  vi.mocked(authClient.useSession).mockReturnValue({
    data: null,
    isPending: true,
    error: null,
    refetch: vi.fn(),
  } as never);
}

function setFailed() {
  vi.mocked(authClient.useSession).mockReturnValue({
    data: null,
    isPending: false,
    error: new Error("session fetch failed"),
    refetch: vi.fn(),
  } as never);
}

const noop = () => {};

describe("Navbar session state", () => {
  it("shows Member Login when signed out", () => {
    setSession(null);
    render(<Navbar menuOpen={false} setMenuOpen={noop} />);
    const link = screen.getByRole("link", { name: "Member Login" });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/login");
  });

  it("shows a neutral skeleton while the session loads", () => {
    setPending();
    const { container } = render(
      <Navbar menuOpen={false} setMenuOpen={noop} />,
    );
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    expect(screen.queryByRole("link", { name: "Member Login" })).toBeNull();
  });

  it("shows a neutral skeleton instead of login when the session check fails", () => {
    setFailed();
    const { container } = render(
      <Navbar menuOpen={false} setMenuOpen={noop} />,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    expect(screen.queryByRole("link", { name: "Member Login" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Log out" })).toBeNull();
  });

  it("shows no CTA in the open mobile menu when the session check fails", () => {
    setFailed();
    render(<Navbar menuOpen setMenuOpen={noop} />);
    // Desktop (hidden via CSS, still in DOM) + mobile skeletons.
    expect(screen.getAllByRole("status")).toHaveLength(2);
    expect(screen.queryByRole("link", { name: "Member Login" })).toBeNull();
    expect(screen.queryByRole("button", { name: /log out/i })).toBeNull();
  });

  it("shows the account name and Log out when signed in", () => {
    setSession({ user: { name: "Ada Lovelace", email: "ada@example.com" } });
    render(<Navbar menuOpen={false} setMenuOpen={noop} />);
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });

  it("signs out and returns home on Log out", async () => {
    setSession({ user: { name: "Ada Lovelace", email: "ada@example.com" } });
    vi.mocked(authClient.signOut).mockImplementation((async (opts?: {
      fetchOptions?: { onSuccess?: () => void };
    }) => {
      await opts?.fetchOptions?.onSuccess?.();
    }) as never);
    const user = userEvent.setup();
    render(<Navbar menuOpen={false} setMenuOpen={noop} />);
    await user.click(screen.getByRole("button", { name: "Log out" }));
    expect(authClient.signOut).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/");
  });

  it("closes the open mobile menu on successful logout", async () => {
    setSession({ user: { name: "Ada Lovelace", email: "ada@example.com" } });
    vi.mocked(authClient.signOut).mockImplementation((async (opts?: {
      fetchOptions?: { onSuccess?: () => void };
    }) => {
      await opts?.fetchOptions?.onSuccess?.();
    }) as never);
    const setMenuOpen = vi.fn();
    const user = userEvent.setup();
    render(<Navbar menuOpen setMenuOpen={setMenuOpen} />);
    const buttons = screen.getAllByRole("button", { name: /log out/i });
    await user.click(buttons[buttons.length - 1]);
    await waitFor(() => {
      expect(setMenuOpen).toHaveBeenCalledWith(false);
    });
    expect(push).toHaveBeenCalledWith("/");
  });

  it("sends only one sign-out on double click", async () => {
    setSession({ user: { name: "Ada Lovelace", email: "ada@example.com" } });
    vi.mocked(authClient.signOut).mockImplementation(
      ((opts?: { fetchOptions?: { onSuccess?: () => void } }) =>
        new Promise<void>((resolve) => {
          setTimeout(() => {
            void opts?.fetchOptions?.onSuccess?.();
            resolve();
          }, 100);
        })) as never,
    );
    const user = userEvent.setup();
    render(<Navbar menuOpen={false} setMenuOpen={noop} />);
    const button = screen.getByRole("button", { name: "Log out" });
    await user.click(button);
    await user.click(button);
    expect(authClient.signOut).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/");
    });
  });

  it("shows Member Login in the open mobile menu", () => {
    setSession(null);
    render(<Navbar menuOpen setMenuOpen={noop} />);
    // Desktop (hidden via CSS, still in DOM) + mobile entries.
    expect(
      screen.getAllByRole("link", { name: "Member Login" }),
    ).toHaveLength(2);
  });

  it("shows no login CTA in the open mobile menu while loading", () => {
    setPending();
    const { container } = render(<Navbar menuOpen setMenuOpen={noop} />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    expect(screen.queryByRole("link", { name: "Member Login" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Log out" })).toBeNull();
  });

  it("surfaces a logout failure without navigating", async () => {
    setSession({ user: { name: "Ada Lovelace", email: "ada@example.com" } });
    vi.mocked(authClient.signOut).mockRejectedValueOnce(
      new Error("network down"),
    );
    const user = userEvent.setup();
    render(<Navbar menuOpen={false} setMenuOpen={noop} />);
    await user.click(screen.getByRole("button", { name: "Log out" }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "Couldn't log you out. Check your connection and try again.",
    );
    expect(push).not.toHaveBeenCalled();
  });

  it("surfaces a resolved-error logout failure without navigating", async () => {
    setSession({ user: { name: "Ada Lovelace", email: "ada@example.com" } });
    vi.mocked(authClient.signOut).mockResolvedValueOnce({
      data: null,
      error: { message: "unauthorized" },
    } as never);
    const user = userEvent.setup();
    render(<Navbar menuOpen={false} setMenuOpen={noop} />);
    await user.click(screen.getByRole("button", { name: "Log out" }));
    expect(
      await screen.findByRole("alert"),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("keeps the mobile menu open on logout failure", async () => {
    setSession({ user: { name: "Ada Lovelace", email: "ada@example.com" } });
    vi.mocked(authClient.signOut).mockRejectedValueOnce(
      new Error("network down"),
    );
    const setMenuOpen = vi.fn();
    const user = userEvent.setup();
    render(<Navbar menuOpen setMenuOpen={setMenuOpen} />);
    const buttons = screen.getAllByRole("button", { name: /log out/i });
    await user.click(buttons[buttons.length - 1]);
    // Desktop (hidden via CSS, still in DOM) + mobile alerts.
    const alerts = await screen.findAllByRole("alert");
    expect(alerts.length).toBeGreaterThanOrEqual(1);
    expect(setMenuOpen).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("keeps the mobile menu open on resolved-error logout failure", async () => {
    setSession({ user: { name: "Ada Lovelace", email: "ada@example.com" } });
    vi.mocked(authClient.signOut).mockResolvedValueOnce({
      data: null,
      error: { message: "unauthorized" },
    } as never);
    const setMenuOpen = vi.fn();
    const user = userEvent.setup();
    render(<Navbar menuOpen setMenuOpen={setMenuOpen} />);
    const buttons = screen.getAllByRole("button", { name: /log out/i });
    await user.click(buttons[buttons.length - 1]);
    const alerts = await screen.findAllByRole("alert");
    expect(alerts.length).toBeGreaterThanOrEqual(1);
    expect(setMenuOpen).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("reports the mobile menu expanded state", () => {
    const { rerender } = render(<Navbar menuOpen={false} setMenuOpen={noop} />);
    expect(
      screen.getByRole("button", { name: "Toggle menu" }),
    ).toHaveAttribute("aria-expanded", "false");
    rerender(<Navbar menuOpen setMenuOpen={noop} />);
    expect(
      screen.getByRole("button", { name: "Toggle menu" }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});
