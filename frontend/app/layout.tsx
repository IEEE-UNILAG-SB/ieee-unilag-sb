import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "IEEE UNILAG Student Branch",
  description: "IEEE University of Lagos Student Branch — connecting engineering minds through collaborative projects, industry partnerships, and global networking opportunities.",
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
        {children}
      </body>
    </html>
  );
}
