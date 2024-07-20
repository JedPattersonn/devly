import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap Generator",
  description: "Generate a sitemap for your website",
  keywords: ["sitemap", "generator", "xml", "sitemap.xml", "robots.txt"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}
