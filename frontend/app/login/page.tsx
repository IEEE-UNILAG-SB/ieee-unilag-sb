"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    // Stub — no real auth yet
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("error");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#00629B] mb-2 text-center">Member Login</h1>
        <p className="text-[#64748B] text-center mb-8">
          Sign in to access member-only resources
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
              required
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600">
              Login is not available yet. Please check back soon.
            </p>
          )}

          <Button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full bg-[#00629B] hover:bg-[#00527f]"
          >
            {status === "loading" ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-[#64748B] mt-6">
          Not a member yet?{" "}
          <a href="/#join" className="text-[#00629B] hover:underline">
            Join IEEE UNILAG
          </a>
        </p>
      </div>
    </div>
  );
}
