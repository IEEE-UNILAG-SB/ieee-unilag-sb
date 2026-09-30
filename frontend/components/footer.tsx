import Link from "next/link";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col">
        <span className="text-lg font-semibold leading-tight text-white">IEEE</span>
        <span className="text-lg font-semibold leading-tight text-white">Unilag SB</span>
      </div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 text-white"
        aria-hidden
      >
        <path
          d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M12 8V14M9 11H15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Events", href: "/#events" },
  { label: "Membership", href: "/#join" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

const resources = [
  { label: "IEEE Xplore", href: "https://ieeexplore.ieee.org" },
  { label: "IEEE Potentials", href: "https://potentials.ieee.org" },
  { label: "IEEEXtreme", href: "https://ieeextreme.org" },
  { label: "TryEngineering", href: "https://tryengineering.org" },
];

const connect = [
  { label: "Instagram", href: "https://www.instagram.com/ieee_unilag" },
  { label: "X (Twitter)", href: "https://x.com/ieee_unilag" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/ieee-unilag-sb" },
  { label: "Substack", href: "https://ieeeunilag.substack.com" },
  { label: "WhatsApp Community", href: "https://chat.whatsapp.com/LocjYkjFamc9sqGdFYpGlC" },
];

function FooterColumn({
  title,
  links,
  className,
  id,
}: {
  title: string;
  links: { label: string; href: string }[];
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cn("flex flex-col gap-4 scroll-mt-24", className)}>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="flex flex-col gap-2">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-white/80 transition-colors hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-slate-800 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
              Empowering the next generation of Nigerian engineers and technologists through
              innovation, collaboration, and global connections.
            </p>
          </div>
          <FooterColumn title="Quick Links" links={quickLinks} />
          <FooterColumn title="Resources" links={resources} id="resources" />
          <FooterColumn title="Connect" links={connect} />
        </div>
      </div>
    </footer>
  );
}
