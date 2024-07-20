import { type NextRequest, NextResponse } from "next/server";

interface DependencyInfo {
  name: string;
  currentVersion: string;
  latestVersion: string;
  needsUpdate: boolean;
}

const TIMEOUT_MS = 5000;
async function fetchWithTimeout(
  url: string,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function getDependencyInfo(
  name: string,
  version: string
): Promise<DependencyInfo> {
  try {
    const response = await fetchWithTimeout(
      `https://registry.npmjs.org/${name}`,
      TIMEOUT_MS
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${name}`);
    }

    const data = await response.json();
    const latestVersion = data["dist-tags"].latest;

    return {
      name,
      currentVersion: version,
      latestVersion,
      needsUpdate: version !== latestVersion,
    };
  } catch (error) {
    console.error(`Error fetching data for ${name}:`, error);
    return {
      name,
      currentVersion: version,
      latestVersion: "Error",
      needsUpdate: false,
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { dependencies } = await req.json();

    if (!dependencies || !Object.keys(dependencies).length) {
      return NextResponse.json(
        { error: "No dependencies provided" },
        { status: 400 }
      );
    }

    const dependencyPromises = Object.entries(dependencies).map(
      ([name, version]) => getDependencyInfo(name, version as string)
    );

    const results = await Promise.allSettled(dependencyPromises);
    const dependencyInfo: DependencyInfo[] = results.map((result) =>
      result.status === "fulfilled"
        ? result.value
        : {
            name: "Unknown",
            currentVersion: "Unknown",
            latestVersion: "Error",
            needsUpdate: false,
          }
    );

    return NextResponse.json({ outdatedDependencies: dependencyInfo });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
