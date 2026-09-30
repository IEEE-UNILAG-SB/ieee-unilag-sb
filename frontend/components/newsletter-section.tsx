"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { subscribeToNewsletter } from "@/lib/api";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const data = await subscribeToNewsletter(email.trim());
      setStatus("success");
      setMessage(data.message ?? "Thanks for subscribing!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section className="w-full bg-slate-50/80 py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-blue-600 md:text-3xl">
          Stay Connected
        </h2>
        <p className="mt-3 text-base text-zinc-600 md:text-lg">
          Get exclusive updates on upcoming events, workshops, project opportunities, and industry
          insights delivered straight to your inbox every week.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Input
              type="email"
              placeholder="Enter your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="h-11 w-full max-w-sm rounded-lg border-slate-200 bg-white px-4 text-base sm:max-w-xs"
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="h-11 rounded-lg bg-blue-600 px-6 text-white hover:bg-blue-700"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </Button>
          </div>
          {message && (
            <p
              className={cn(
                "mt-3 text-sm",
                status === "success" ? "text-green-600" : "text-red-600"
              )}
            >
              {message}
            </p>
          )}
        </form>

        <p className="mt-4 text-xs text-zinc-500">
          We respect your privacy. Unsubscribe anytime. See our{" "}
          <a href="/privacy" className="underline hover:text-zinc-700">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </section>
  );
}
