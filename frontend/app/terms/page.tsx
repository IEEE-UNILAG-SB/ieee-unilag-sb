import { CONTACT_EMAIL } from "@/lib/site";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-[#00629B] mb-6">
          Terms of Use
        </h1>
        <p className="text-sm text-[#64748B] mb-8">Last updated: September 2026</p>

        <div className="space-y-8 text-[#475569] leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-3">About this website</h2>
            <p>
              This website is maintained by the IEEE University of Lagos Student
              Branch (STB92061) to share information about our activities, events and
              membership. By using it, you agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-3">Acceptable use</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate information when using our forms.</li>
              <li>Do not submit spam, abusive content or other people&apos;s personal data.</li>
              <li>Do not attempt to disrupt the website or its backend services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-3">Content and intellectual property</h2>
            <p>
              Text, images and branding on this site belong to the IEEE UNILAG Student
              Branch or their respective owners (including IEEE). You may share links
              to our pages; reproducing substantial content requires permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-3">External links</h2>
            <p>
              We link to external sites (IEEE, social platforms, registration forms).
              We are not responsible for their content, availability or privacy
              practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-3">No warranties</h2>
            <p>
              Event dates, venues and other details are provided in good faith and may
              change. Check our official social channels for the latest updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-3">Contact</h2>
            <p>
              Questions about these terms:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[#00629B] underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
