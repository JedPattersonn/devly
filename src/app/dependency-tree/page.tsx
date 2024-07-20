"use client";
import React, { useState, FormEvent } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Make sure to import PrimeReact CSS
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

interface TreeNode {
  key: string;
  type: "dependency";
  data: {
    name: string;
    version: string;
  };
  expanded: boolean;
  children?: TreeNode[];
}

export default function DependencyTreeVisualizer() {
  const [packageName, setPackageName] = useState<string>("");
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState<string>("");

  const fetchTree = async (): Promise<void> => {
    if (!packageName.trim()) {
      setError("Please enter a package name");
      return;
    }

    setLoading(true);
    setError(null);
    setTree(null);

    try {
      const versionParam = version.trim()
        ? `&version=${encodeURIComponent(version.trim())}`
        : "";
      const response = await fetch(
        `/api/dependency-tree?packageName=${encodeURIComponent(packageName.trim())}${versionParam}`
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setTree(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nodeTemplate = (node: TreeNode) => {
    return (
      <div className="border border-gray-300 rounded p-2 bg-white shadow-sm">
        <div className="text-gray-700 font-bold">{node.data.name}</div>
        <div className="text-gray-500 text-sm">{node.data.version}</div>
      </div>
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchTree();
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2 mb-2">
          <Input
            type="text"
            value={packageName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPackageName(e.target.value)
            }
            placeholder="Enter package name"
            className="flex-grow"
          />
          <Input
            type="text"
            value={version}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setVersion(e.target.value)
            }
            placeholder="Version (optional)"
            className="w-1/4"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Visualize"}
          </Button>
        </div>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {tree && (
        <div
          className="overflow-auto bg-white p-4 rounded-lg shadow-lg border border-gray-200"
          style={{ maxHeight: "70vh", maxWidth: "100%" }}
        >
          <OrganizationChart value={[tree]} nodeTemplate={nodeTemplate} />
        </div>
      )}
      <style jsx global>{`
        .p-organizationchart .p-organizationchart-node-content {
          border: none;
          background: transparent;
        }
        .p-organizationchart .p-organizationchart-line-down {
          background: #ccc;
          height: 20px;
        }
        .p-organizationchart .p-organizationchart-line-down::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #ccc;
        }
        .p-organizationchart .p-organizationchart-line-left {
          border-right: 1px solid #ccc;
        }
        .p-organizationchart .p-organizationchart-line-top {
          border-top: 1px solid #ccc;
        }
        .p-organizationchart .p-node-toggler {
          display: none;
        }
      `}</style>
    </div>
  );
}
