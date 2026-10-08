"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const googleEnabled =
  process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true";

// Allow only same-origin paths. Rejects absolute URLs, protocol-relative
// URLs, backslash tricks (browsers normalize \ to /), and self-referential
// /login in all its forms (exact, trailing slash, query, fragment —
// searchParams.get() returns the decoded value, so encoded variants such as
// /login%2F or /login%3Fx arrive decoded and are caught too). Returns "/"
// for anything else, including null.
export function sanitizeNext(raw: string | null): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  if (raw.includes("\\")) return "/";
  if (
    raw === "/login" ||
    raw.startsWith("/login/") ||
    raw.startsWith("/login?") ||
    raw.startsWith("/login#")
  )
    return "/";
  return raw;
}

export function friendlyError(code?: string): string {
  switch (code) {
    case "INVALID_EMAIL_OR_PASSWORD":
    case "INVALID_CREDENTIALS":
      return "Incorrect email or password. Please try again.";
    case "EMAIL_NOT_VERIFIED":
      return "Please verify your email before signing in. Check your inbox for the verification link.";
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "An account with this email already exists. Try signing in instead.";
    case "ACCOUNT_NOT_LINKED":
    case "OAUTH_ACCOUNT_NOT_LINKED":
      return "This email is already registered with another sign-in method. Sign in with your original method first, then link Google from settings.";
    case "TOO_MANY_REQUESTS":
    case "RATE_LIMITED":
      return "Too many attempts. Please wait a minute and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = sanitizeNext(searchParams.get("next"));

  const {
    data: session,
    isPending: sessionPending,
    error: sessionError,
    refetch: refetchSession,
  } = authClient.useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "google" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sessionPending && session) {
      router.replace(next);
    }
  }, [sessionPending, session, next, router]);

  useEffect(() => {
    if (status === "error" || status === "success") {
      messageRef.current?.focus();
    }
  }, [status]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    if (mode === "signup" && !name.trim()) {
      setStatus("error");
      setMessage("Please enter your name.");
      return;
    }
    setStatus("loading");
    setMessage("");

    try {
      if (mode === "signup") {
        const { error } = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
          callbackURL: next,
        });
        if (error) {
          setStatus("error");
          setMessage(friendlyError(error.code));
          return;
        }
        setStatus("success");
        setMessage("Account created! Redirecting…");
        // NOTE: navigates assuming a session was issued. This holds while
        // requireEmailVerification is off server-side; if verification is ever
        // enabled, show "check your inbox" here instead of navigating.
        router.push(next);
        router.refresh();
        return;
      }

      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: next,
      });
      if (error) {
        setStatus("error");
        setMessage(friendlyError(error.code));
        return;
      }
      setStatus("success");
      setMessage("Signed in! Redirecting…");
      router.push(next);
      router.refresh();
    } catch {
      setStatus("error");
      setMessage(friendlyError());
    }
  }

  async function handleGoogle() {
    if (!googleEnabled) return;
    setStatus("google");
    setMessage("");
    try {
      const res = (await authClient.signIn.social({
        provider: "google",
        callbackURL: next,
      })) as unknown as { error?: { code?: string } | null } | void;
      if (res && typeof res === "object" && "error" in res && res.error) {
        // Resolved-error shape (no throw, no redirect): surface it instead
        // of wedging the button.
        setStatus("error");
        setMessage(friendlyError(res.error.code));
        return;
      }
      // Reached only if no redirect happened (blocked navigation or
      // swallowed failure) — release the button instead of wedging it.
      setStatus("idle");
    } catch {
      setStatus("error");
      setMessage(friendlyError());
    }
  }

  const busy = status === "loading" || status === "google";

  if (sessionPending || session) {
    return (
      <div className="w-full max-w-md text-center">
        <p role="status" className="text-sm text-[#64748B]">Loading…</p>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="w-full max-w-md text-center space-y-4">
        <p className="text-sm text-red-600">
          Could not check your sign-in status. Please try again.
        </p>
        <Button
          type="button"
          variant="outline"
          className="rounded-full px-6"
          onClick={() => {
            refetchSession();
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-bold text-[#00629B] mb-2 text-center">Member Login</h1>
      <p className="text-[#64748B] text-center mb-8">
        Sign in to access member-only resources
      </p>

      <Button
        type="button"
        variant="outline"
        disabled={!googleEnabled || busy}
        onClick={handleGoogle}
        className="w-full rounded-full mb-4"
        title={googleEnabled ? "Continue with Google" : "Google sign-in coming soon"}
      >
        {status === "google" ? "Connecting to Google…" : "Continue with Google"}
      </Button>
      {!googleEnabled && (
        <p className="text-xs text-center text-[#64748B] mb-4">
          Google sign-in is coming soon. Use email below for now.
        </p>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-[#E2E8F0]" />
        <span className="text-xs text-[#64748B]">or with email</span>
        <div className="h-px flex-1 bg-[#E2E8F0]" />
      </div>

      <div className="flex rounded-full bg-[#F5F8FF] border border-[#E2E8F0] p-1 mb-6">
        <button
          type="button"
          aria-pressed={mode === "signin"}
          onClick={() => setMode("signin")}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
            mode === "signin" ? "bg-white shadow-sm text-[#1E293B]" : "text-[#64748B]"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          aria-pressed={mode === "signup"}
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
            mode === "signup" ? "bg-white shadow-sm text-[#1E293B]" : "text-[#64748B]"
          }`}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#1E293B] mb-1">
              Full name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              maxLength={100}
              disabled={busy}
              autoComplete="name"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#1E293B] mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={busy}
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#1E293B] mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "At least 10 characters" : "Enter your password"}
            required
            minLength={mode === "signup" ? 10 : undefined}
            maxLength={128}
            disabled={busy}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </div>

        {message && (
          <p
            ref={messageRef}
            tabIndex={-1}
            role={status === "success" ? "status" : "alert"}
            className={`text-sm ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <Button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-[#00629B] hover:bg-[#00527f]"
        >
          {status === "loading"
            ? mode === "signup"
              ? "Creating account…"
              : "Signing in…"
            : mode === "signup"
              ? "Create account"
              : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-[#64748B] mt-6">
        Not a member yet?{" "}
        <a href="/#join" className="text-[#00629B] hover:underline">
          Join IEEE UNILAG
        </a>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Suspense fallback={<p className="text-sm text-[#64748B]">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
