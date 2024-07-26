import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";

export function Navbar() {
  return (
    <nav className="py-2 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <Home size={20} />
          <span className="text-sm font-medium">Home</span>
        </Link>
      </div>
    </nav>
  );
}
