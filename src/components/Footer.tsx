import React from "react";

export function Footer() {
  return (
    <footer className="w-full py-4 px-6 border-t bg-background text-center text-sm text-muted-foreground mt-8">
      © {new Date().getFullYear()} Blog Summarizer. Powered by Next.js & shadcn/ui.
    </footer>
  );
} 