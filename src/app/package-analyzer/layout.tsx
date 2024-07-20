import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Package Analyzer",
  description: "Check for outdated dependencies in your package.json",
  keywords: [
    "package",
    "analyzer",
    "npm",
    "yarn",
    "pnpm",
    "package.json",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}
