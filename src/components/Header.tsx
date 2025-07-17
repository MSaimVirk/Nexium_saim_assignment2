import React from "react";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full py-4 px-8 bg-white border-b border-gray-200 flex items-center justify-between">
      <span className="text-xl font-bold tracking-tight text-gray-900">Blog Summarizer</span>
      <nav className="flex gap-3">
        <Link href="/" className="px-3 py-1 rounded-md font-medium text-gray-700 transition-colors bg-white hover:bg-blue-100 focus:bg-blue-200">Home</Link>
        <Link href="/mongodb" className="px-3 py-1 rounded-md font-medium text-gray-700 transition-colors bg-white hover:bg-blue-100 focus:bg-blue-200">MongoDB Data</Link>
        <Link href="/supabase" className="px-3 py-1 rounded-md font-medium text-gray-700 transition-colors bg-white hover:bg-blue-100 focus:bg-blue-200">Supabase Data</Link>
      </nav>
    </header>
  );
}