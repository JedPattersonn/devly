import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Dependency Tree Visualizer",
  description:
    "Visualize npm package dependency trees using an interactive organizational chart.",
  keywords: [
    "react",
    "nextjs",
    "npm",
    "package",
    "dependency",
    "tree",
    "visualizer",
    "chart",
    "typescript",
    "registry",
    "version",
    "interactive",
    "hierarchy",
    "development-tools",
    "web-application",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
