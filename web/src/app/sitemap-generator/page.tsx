"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SitemapGenerator() {
  const { toast } = useToast();

  const [urls, setUrls] = useState([
    { url: "https://devly.com/", priority: 1, lastEdited: "2023-06-01" },
    { url: "https://devly.com/about", priority: 2, lastEdited: "2023-05-15" },
    { url: "https://devly.com/blog", priority: 3, lastEdited: "2023-04-30" },
  ]);
  const [newUrl, setNewUrl] = useState("");
  const [newPriority, setNewPriority] = useState(1);
  const [newLastEdited, setNewLastEdited] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const addUrl = () => {
    if (newUrl.trim() !== "") {
      setUrls([
        ...urls,
        { url: newUrl, priority: newPriority, lastEdited: newLastEdited },
      ]);
      setNewUrl("");
      setNewPriority(1);
      setNewLastEdited(new Date().toISOString().slice(0, 10));
    }
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const generateSitemapXml = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastEdited}</lastmod>
    <priority>${url.priority === 1 ? "1.0" : url.priority === 2 ? "0.8" : "0.5"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Add URL</h2>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700"
            >
              URL
            </Label>
            <Input
              id="url"
              type="text"
              placeholder="Enter a URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700"
              >
                Priority
              </Label>
              <Select
                value={String(newPriority)}
                onValueChange={(value) => setNewPriority(Number(value))}
              >
                <SelectTrigger id="priority" className="mt-1  w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">High</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="last-edited"
                className="block text-sm font-medium text-gray-700"
              >
                Last Edited
              </Label>
              <Input
                id="last-edited"
                type="date"
                value={newLastEdited}
                onChange={(e) => setNewLastEdited(e.target.value)}
                className="mt-1 block w-full"
              />
            </div>
          </div>
        </div>
        <Button onClick={addUrl} className="w-full">
          Add URL
        </Button>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Added URLs</h3>
          <ul className="space-y-2">
            {urls.map((url, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span>{url.url}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUrl(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Sitemap XML</h2>
        <pre className="bg-white p-4 rounded-md overflow-x-auto text-sm">
          <code>{generateSitemapXml()}</code>
        </pre>
        <Button
          className="mt-4"
          onClick={() => {
            navigator.clipboard.writeText(generateSitemapXml());
            toast({
              title: "Sitemap XML copied to clipboard",
            });
          }}
        >
          Copy Sitemap XML
        </Button>
      </div>
    </div>
  );
}
