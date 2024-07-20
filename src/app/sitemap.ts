import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://wwww.devly.dev",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://wwww.devly.dev/package-analyzer",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://wwww.devly.dev/package-analyzer/api",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://wwww.devly.dev/sitemap-generator",
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
