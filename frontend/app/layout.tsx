import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://ieee-unilag-sb.vercel.app";

const siteTitle = "IEEE UNILAG Student Branch";
const siteDescription =
  "IEEE University of Lagos Student Branch — connecting engineering minds through collaborative projects, industry partnerships, and global networking opportunities.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: siteTitle,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "IEEE UNILAG Student Branch",
  url: baseUrl,
  logo: `${baseUrl}/IEEE-Logo.png`,
  email: "ieeeunilagchapter@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Department of Electrical & Electronics Engineering, University of Lagos",
    addressLocality: "Yaba, Lagos",
    addressCountry: "NG",
  },
  sameAs: [
    "https://www.instagram.com/ieee_unilag",
    "https://www.linkedin.com/company/ieee-unilag-sb",
    "https://ieeeunilag.substack.com",
  ],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "700"],
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "700"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable}  ${spaceGrotesk.variable}  sans-serif antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
