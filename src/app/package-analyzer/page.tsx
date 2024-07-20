"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface DependencyInfo {
  name: string;
  currentVersion: string;
  latestVersion: string;
  needsUpdate: boolean;
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface ApiResponse {
  outdatedDependencies: DependencyInfo[];
}

export default function DependencyChecker(): React.ReactElement {
  const [packageJson, setPackageJson] = useState<string>("");
  const [outdatedDependencies, setOutdatedDependencies] = useState<
    DependencyInfo[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handlePackageJsonChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setPackageJson(e.target.value);
  };

  const checkDependencies = async (): Promise<void> => {
    setIsLoading(true);
    setError("");
    try {
      const parsedPackageJson: PackageJson = JSON.parse(packageJson);
      const { dependencies, devDependencies } = parsedPackageJson;

      const response = await fetch("/api/package-analyzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dependencies, devDependencies }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dependency information");
      }

      const data: ApiResponse = await response.json();
      setOutdatedDependencies(data.outdatedDependencies || []);
    } catch (error) {
      console.error("Error checking dependencies:", error);
      setError(
        "Error checking dependencies. Please ensure your package.json is valid."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dependency Checker</h1>
          <Link href="/package-analyzer/api">
            <Button variant={"outline"}>Try the API</Button>
          </Link>
        </div>
        <div className="mb-8">
          <Textarea
            placeholder="Paste your package.json here..."
            value={packageJson}
            onChange={handlePackageJsonChange}
            className="w-full h-64 p-4 border border-input rounded-md"
          />
        </div>
        <Button
          onClick={checkDependencies}
          className="mb-8"
          disabled={isLoading}
        >
          {isLoading ? "Checking..." : "Check Dependencies"}
        </Button>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {outdatedDependencies && outdatedDependencies.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Outdated Dependencies</h2>
            <div className="grid gap-4">
              {outdatedDependencies.map((dep, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{dep.name}</h3>
                      <p className="text-muted-foreground">
                        Current Version: {dep.currentVersion}
                      </p>
                    </div>
                    <div className="text-primary font-semibold">
                      Latest Version: {dep.latestVersion}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
