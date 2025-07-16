import React from "react";

export function Footer() {
  return (
    <footer className="w-full py-4 px-8 border-t bg-white text-center text-sm text-gray-500 mt-12">
      <span>
        © {new Date().getFullYear()} Blog Summarizer. Powered by Next.js & shadcn/ui.
      </span>
    </footer>
  );
}