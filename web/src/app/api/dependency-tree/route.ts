import { NextResponse, type NextRequest } from "next/server";

interface PackageInfo {
  name: string;
  version: string;
  dependencies?: { [key: string]: string };
}

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

class PackageNotFoundError extends Error {
  constructor(packageName: string, version: string) {
    super(`Package not found: ${packageName}@${version}`);
    this.name = "PackageNotFoundError";
  }
}

async function fetchPackageInfo(
  packageName: string,
  version = "latest"
): Promise<PackageInfo> {
  const encodedPackageName = encodeURIComponent(packageName).replace(
    "%40",
    "@"
  );
  let url = `https://registry.npmjs.org/${encodedPackageName}`;

  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      throw new PackageNotFoundError(packageName, version);
    }
    throw new Error(
      `Failed to fetch package info for ${packageName}@${version}`
    );
  }

  const data = await response.json();

  if (version === "latest") {
    version = data["dist-tags"].latest;
  }

  // Find the best matching version
  const versions = Object.keys(data.versions);
  const bestMatch =
    versions.find((v) => v === version) || versions[versions.length - 1];

  if (!bestMatch) {
    throw new PackageNotFoundError(packageName, version);
  }

  return {
    name: data.name,
    version: bestMatch,
    dependencies: data.versions[bestMatch].dependencies,
  };
}

async function buildDependencyTree(
  packageName: string,
  version = "latest",
  depth = 2
): Promise<TreeNode> {
  try {
    const info = await fetchPackageInfo(packageName, version);
    const node: TreeNode = {
      key: `${packageName}@${info.version}`,
      type: "dependency",
      data: { name: packageName, version: info.version },
      expanded: true,
    };

    if (depth > 0 && info.dependencies) {
      node.children = await Promise.all(
        Object.entries(info.dependencies).map(async ([depName, depVersion]) => {
          try {
            return await buildDependencyTree(depName, depVersion, depth - 1);
          } catch (error) {
            if (error instanceof PackageNotFoundError) {
              return {
                key: `${depName}@${depVersion}`,
                type: "dependency",
                data: { name: depName, version: "Not Found" },
                expanded: true,
              };
            }
            throw error;
          }
        })
      );
    }

    return node;
  } catch (error) {
    if (error instanceof PackageNotFoundError) {
      throw error;
    }
    console.error(
      `Error building dependency tree for ${packageName}@${version}:`,
      error
    );
    throw new Error(
      `Failed to build dependency tree for ${packageName}@${version}`
    );
  }
}

export async function GET(req: NextRequest) {
  const packageName = req.nextUrl.searchParams.get("packageName");
  const version = req.nextUrl.searchParams.get("version") || "latest";
  const depth = parseInt(req.nextUrl.searchParams.get("depth") || "2", 10);

  if (!packageName) {
    return NextResponse.json(
      { error: "Package name is required" },
      { status: 400 }
    );
  }

  try {
    const tree = await buildDependencyTree(packageName, version, depth);
    return NextResponse.json(tree);
  } catch (error) {
    if (error instanceof PackageNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("Error fetching package dependencies:", error);
    return NextResponse.json(
      { error: "Failed to fetch package dependencies" },
      { status: 500 }
    );
  }
}
