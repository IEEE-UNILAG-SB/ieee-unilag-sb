"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { sendContactMessage } from "@/lib/api";
import { CONTACT_EMAIL } from "@/lib/site";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  function updateField(field: keyof typeof form) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setFeedback("");
    try {
      const data = await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || undefined,
        message: form.message.trim(),
      });
      setStatus("success");
      setFeedback(data.message ?? "Message received!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setFeedback(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#00629B] mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-[#475569] mb-12 max-w-2xl">
            Have questions about membership, events, or partnerships? Send us a message
            or reach out through any of the channels below.
          </p>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#E2E8F0] mb-12">
            <h2 className="text-2xl font-bold text-[#1E293B] mb-6">Send a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-[#1E293B] mb-1">
                    Name
                  </label>
                  <Input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={updateField("name")}
                    placeholder="Your full name"
                    required
                    maxLength={100}
                    disabled={status === "loading"}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-[#1E293B] mb-1">
                    Email
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={updateField("email")}
                    placeholder="your@email.com"
                    required
                    disabled={status === "loading"}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-[#1E293B] mb-1">
                  Subject <span className="text-[#64748B] font-normal">(optional)</span>
                </label>
                <Input
                  id="contact-subject"
                  type="text"
                  value={form.subject}
                  onChange={updateField("subject")}
                  placeholder="What is this about?"
                  maxLength={150}
                  disabled={status === "loading"}
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-[#1E293B] mb-1">
                  Message
                </label>
                <Textarea
                  id="contact-message"
                  value={form.message}
                  onChange={updateField("message")}
                  placeholder="Write your message here..."
                  required
                  maxLength={2000}
                  disabled={status === "loading"}
                />
              </div>
              {feedback && (
                <p
                  className={cn(
                    "text-sm",
                    status === "success" ? "text-green-600" : "text-red-600"
                  )}
                >
                  {feedback}
                </p>
              )}
              <Button
                type="submit"
                disabled={status === "loading"}
                className="rounded-full bg-[#00629B] hover:bg-[#00527f] px-8"
              >
                {status === "loading" ? "Sending..." : "Send message"}
              </Button>
            </form>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
              <div className="w-12 h-12 rounded-xl bg-[#00629B]/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-[#00629B]" />
              </div>
              <h3 className="font-semibold text-[#1E293B] mb-2">Email</h3>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[#00629B] hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
              <div className="w-12 h-12 rounded-xl bg-[#00629B]/10 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-[#00629B]" />
              </div>
              <h3 className="font-semibold text-[#1E293B] mb-2">Phone / WhatsApp</h3>
              <a
                href="tel:+2349028847072"
                className="text-[#00629B] hover:underline"
              >
                0902 884 7072
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
              <div className="w-12 h-12 rounded-xl bg-[#00629B]/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#00629B]" />
              </div>
              <h3 className="font-semibold text-[#1E293B] mb-2">Location</h3>
              <p className="text-[#475569]">
                Department of Electrical & Electronics Engineering,<br />
                University of Lagos, Yaba, Lagos
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
              <div className="w-12 h-12 rounded-xl bg-[#00629B]/10 flex items-center justify-center mb-4">
                <Instagram className="w-6 h-6 text-[#00629B]" />
              </div>
              <h3 className="font-semibold text-[#1E293B] mb-2">Social Media</h3>
              <div className="space-y-2">
                <a
                  href="https://www.instagram.com/ieee_unilag"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#00629B] hover:underline"
                >
                  <Instagram className="w-4 h-4" /> @ieee_unilag
                </a>
                <a
                  href="https://x.com/ieee_unilag"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#00629B] hover:underline"
                >
                  <Twitter className="w-4 h-4" /> @ieee_unilag
                </a>
                <a
                  href="https://www.linkedin.com/company/ieee-unilag-sb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#00629B] hover:underline"
                >
                  <Linkedin className="w-4 h-4" /> IEEE UNILAG SB
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F8FF] rounded-2xl p-8 border border-[#E2E8F0] text-center">
            <h2 className="text-2xl font-bold text-[#1E293B] mb-3">Office Hours</h2>
            <p className="text-[#475569]">
              We don&apos;t have fixed office hours — the best way to reach us is via the form above,
              email or Instagram DM. We usually respond within 24 hours.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
