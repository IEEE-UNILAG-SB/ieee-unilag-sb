"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";


const navLinks = [
  { name: "About", href: "/#about" },
  { name: "Events", href: "/#events" },
  { name: "Spotlight", href: "/#spotlight" },
  { name: "Resources", href: "/#resources" },
  { name: "Join us", href: "/#join" },
];

const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
    },
  }),
};

const logoVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.5,
      duration: 0.4,
    },
  },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export function Navbar({menuOpen, setMenuOpen}: {
  menuOpen: boolean,
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const router = useRouter();
  const {
    data: session,
    isPending: sessionPending,
    error: sessionError,
  } = authClient.useSession();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);
  const [logoutError, setLogoutError] = React.useState<string | null>(null);

  const sessionFailed = !sessionPending && !session && !!sessionError;

  async function handleLogout() {
    if (signingOut) return;
    setSigningOut(true);
    setLogoutError(null);
    try {
      const res = (await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setMenuOpen(false);
            router.push("/");
            router.refresh();
          },
        },
      })) as unknown as { error?: unknown } | void;
      if (res && typeof res === "object" && "error" in res && res.error) {
        // Resolved-error shape (no throw, onSuccess not called): the session
        // persists, so report the failure instead of silently resetting.
        setLogoutError("Couldn't log you out. Check your connection and try again.");
      }
    } catch {
      setLogoutError("Couldn't log you out. Check your connection and try again.");
    } finally {
      setSigningOut(false);
    }
  }
  const handleScroll = (href: string) => {
    setMenuOpen(false);
    const id = href.replace(/^\/?#/, "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.location.href = href.startsWith("/") ? href : `/${href}`;
    }
  }
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [menuOpen]);


  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      )}
    >
      <nav 
      className={`container mx-auto px-4 lg:px-8 bg-card/95 ${isScrolled ? 'shadow-sm backdrop-blur-md' : ''}`}>
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate="visible"
          >
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/ieee-logo.svg"
                alt="IEEE UNILAG SB"
                width={120}
                height={40}
                className="h-10 w-auto"
                fetchPriority="high"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                custom={index}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:block"
          >
            {sessionPending || sessionFailed ? (
              <div
                role="status"
                className="h-10 w-32 rounded-full bg-muted animate-pulse"
              >
                <span className="sr-only">Loading account…</span>
              </div>
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                  aria-hidden
                >
                  {(session.user.name ?? session.user.email ?? "?").charAt(0).toUpperCase()}
                </span>
                <span className="max-w-32 truncate text-sm font-medium text-foreground/80">
                  {session.user.name ?? session.user.email}
                </span>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="outline"
                    className="rounded-full px-6"
                    onClick={handleLogout}
                    disabled={signingOut}
                  >
                    {signingOut ? "Logging out…" : "Log out"}
                  </Button>
                  {logoutError && (
                    <p role="alert" className="text-xs text-red-600">
                      {logoutError}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <Button asChild variant="default" className="rounded-full px-6">
                <Link href="/login">Member Login</Link>
              </Button>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-foreground hover:cursor-pointer"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            id="mobile-menu"
            className="lg:hidden overflow-hidden bg-card/95"
          >
            <div className="flex flex-col gap-4 py-4 border-t border-border">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => handleScroll(link.href)}
                    className="block text-base font-medium text-foreground/80 transition-colors hover:text-primary py-2"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-2"
              >
                {sessionPending || sessionFailed ? (
                  <div
                    role="status"
                    className="h-10 w-full rounded-full bg-muted animate-pulse"
                  >
                    <span className="sr-only">Loading account…</span>
                  </div>
                ) : session?.user ? (
                  <>
                    <Button
                      variant="default"
                      className="w-full rounded-full"
                      onClick={handleLogout}
                      disabled={signingOut}
                    >
                      {signingOut
                        ? "Logging out…"
                        : `Log out (${session.user.name ?? session.user.email})`}
                    </Button>
                    {logoutError && (
                      <p role="alert" className="mt-2 text-center text-xs text-red-600">
                        {logoutError}
                      </p>
                    )}
                  </>
                ) : (
                  <Button
                    asChild
                    variant="default"
                    className="w-full rounded-full"
                  >
                    <Link href="/login">Member Login</Link>
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
