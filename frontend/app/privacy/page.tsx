export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-[#00629B] mb-6">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#64748B] mb-8">Last updated: September 2026</p>

        <div className="space-y-8 text-[#475569] leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-3">What we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Newsletter signup:</strong> your email address, so we can send
                updates on events, workshops and opportunities.
              </li>
              <li>
                <strong>Contact form:</strong> your name, email address and message, so
                we can respond to your enquiry.
              </li>
            </ul>
            <p className="mt-3">
              We do not collect any other personal information through this website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-3">How we use it</h2>
            <p>
              Your details are used only to send the newsletter you subscribed to and
              to reply to messages you send us. We do not sell, rent or share your
              information with third parties for marketing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-3">Unsubscribe and deletion</h2>
            <p>
              You can stop receiving the newsletter at any time by emailing{" "}
              <a
                href="mailto:ieeeunilagchapter@gmail.com"
                className="text-[#00629B] underline"
              >
                ieeeunilagchapter@gmail.com
              </a>{" "}
              with the subject &quot;Unsubscribe&quot;. You may also request a copy or
              deletion of the data we hold about you through the same address.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-3">Data storage</h2>
            <p>
              Form submissions are stored in our database (MongoDB Atlas) and are
              accessible only to the IEEE UNILAG Student Branch web team.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-3">Contact</h2>
            <p>
              Questions about this policy:{" "}
              <a
                href="mailto:ieeeunilagchapter@gmail.com"
                className="text-[#00629B] underline"
              >
                ieeeunilagchapter@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
