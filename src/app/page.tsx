import { Button } from "@/components/ui/button";
import Link from "next/link";

const tools = [
  {
    name: "Sitemap Generator",
    description: "Generate a sitemap for your website",
    href: "/sitemap-generator",
  },
  {
    name: "Dependency Analyzer",
    description: "Check for outdated dependencies in your package.json",
    href: "/package-analyzer",
  },
];

export default function Component() {
  return (
    <main className="container max-w-7xl mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter">
          Powerful Tools for Developers
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Streamline your workflow with our suite of developer tools.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <div
            key={tool.href}
            className="bg-background rounded-lg overflow-hidden shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-muted-foreground mb-4">{tool.description}</p>
              <Button>
                <Link href={tool.href} prefetch={false}>
                  View
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
