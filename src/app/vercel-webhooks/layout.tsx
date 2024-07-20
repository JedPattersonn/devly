import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vercel -> Discord webhooks",
  description: "Get Vercel webhooks and send them to Discord",
  keywords: ["vercel", "discord", "webhooks", "devly", "dev", "devly.dev"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
