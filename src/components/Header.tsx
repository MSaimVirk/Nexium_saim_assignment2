import React from "react";

export function Header() {
  return (
    <header className="w-full py-4 px-8 bg-white border-b border-gray-200 flex items-center justify-between">
      <span className="text-xl font-bold tracking-tight text-gray-900">Blog Summarizer</span>
      <nav className="flex gap-6">
        <a href="/" className="hover:underline text-gray-700 font-medium">Home</a>
        <a href="/mongodb" className="hover:underline text-gray-700 font-medium">MongoDB Data</a>
        <a href="/supabase" className="hover:underline text-gray-700 font-medium">Supabase Data</a>
      </nav>
    </header>
  );
}