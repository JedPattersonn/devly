import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Sitemap Generator",
  description: "Generate a sitemap for your website",
  keywords: ["sitemap", "generator", "xml", "sitemap.xml", "robots.txt"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}
