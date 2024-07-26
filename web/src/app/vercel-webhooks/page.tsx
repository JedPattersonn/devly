"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clipboard, Check, Save, Trash2 } from "lucide-react";

interface ApiResponse {
  error: boolean;
  message: string;
  url?: string;
}

export default function DiscordWebhookGenerator() {
  const [discordWebhookUrlInput, setDiscordWebhookUrlInput] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [lookupResult, setLookupResult] = useState("");
  const [editableLookupResult, setEditableLookupResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    try {
      const response = await fetch("/api/vercel-webhooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: discordWebhookUrlInput }),
      });
      const data: ApiResponse = await response.json();
      if (!data.error && data.url) {
        setGeneratedUrl(data.url);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error generating URL:", error);
      alert("An error occurred while generating the URL");
    }
  };

  const handleLookup = async () => {
    try {
      const id = new URL(urlInput).pathname.split("/").pop();
      const response = await fetch(`/api/vercel-webhooks?id=${id}`, {
        method: "GET",
      });
      const data: ApiResponse = await response.json();
      if (!data.error && data.url) {
        setLookupResult(data.url);
        setEditableLookupResult(data.url);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error looking up URL:", error);
      alert("An error occurred while looking up the URL");
    }
  };

  const handleSave = async () => {
    try {
      const id = new URL(urlInput).pathname.split("/").pop();
      const response = await fetch(`/api/vercel-webhooks?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: editableLookupResult }),
      });
      const data: ApiResponse = await response.json();
      if (!data.error) {
        setLookupResult(editableLookupResult);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error saving URL:", error);
      alert("An error occurred while saving the URL");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this webhook?")) {
      try {
        const id = new URL(urlInput).pathname.split("/").pop();
        const response = await fetch(`/api/vercel-webhooks?id=${id}`, {
          method: "DELETE",
        });
        const data: ApiResponse = await response.json();
        if (!data.error) {
          setLookupResult("");
          setEditableLookupResult("");
          setUrlInput("");
          alert(data.message);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error deleting URL:", error);
        alert("An error occurred while deleting the URL");
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-4xl space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Vercel -&gt; Discord Webhooks
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Forward Vercel webhooks to Discord.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Generate Webhook URL</CardTitle>
              <CardDescription>
                Enter a Discord Webhook URL and get a webhook URL back.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="webhook-url">Discord Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="Enter Discord Webhook URL"
                  value={discordWebhookUrlInput}
                  onChange={(e) => setDiscordWebhookUrlInput(e.target.value)}
                />
                <Button onClick={handleGenerate} className="w-full">
                  Generate URL
                </Button>
              </div>
            </CardContent>
            {generatedUrl && (
              <CardFooter>
                <div className="w-full">
                  <Label htmlFor="generated-url">Your generated URL:</Label>
                  <div className="flex mt-2">
                    <Input
                      id="generated-url"
                      readOnly
                      value={generatedUrl}
                      className="flex-grow"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() => handleCopy(generatedUrl)}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Clipboard className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Look up Webhook URL</CardTitle>
              <CardDescription>
                Enter your generated URL, get the corresponding Discord Webhook
                URL, and edit if needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="Enter a URL"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <Button onClick={handleLookup} className="w-full">
                  Look up Webhook URL
                </Button>
              </div>
            </CardContent>
            {lookupResult && (
              <CardFooter>
                <div className="w-full space-y-4">
                  <Label htmlFor="webhook-url-result">Webhook URL:</Label>
                  <div className="flex">
                    <Input
                      id="webhook-url-result"
                      value={editableLookupResult}
                      onChange={(e) => setEditableLookupResult(e.target.value)}
                      className="flex-grow"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() => handleCopy(editableLookupResult)}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Clipboard className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} className="flex-grow">
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                    <Button onClick={handleDelete} variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
      <footer className="mt-8 text-center text-gray-600">
        <p>
          No Vercel data is stored. Source code can be found on{" "}
          <a
            href="https://github.com/jedPattersonn/devly"
            className="text-blue-500 underline"
          >
            GitHub
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
