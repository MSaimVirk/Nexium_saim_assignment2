import React from "react";

interface HeroSectionProps {
  onGetStarted?: () => void;
  showButton?: boolean;
}

export function HeroSection({ onGetStarted, showButton = true }: HeroSectionProps) {
  return (
    <section className="w-full flex flex-col items-center justify-center py-16 gap-4 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">Summarize Any Blog Instantly</h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Paste a blog URL and get concise summaries in English and Urdu, powered by AI.
      </p>
      {showButton && (
        <button
          className="mt-6 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-lg shadow hover:bg-primary/90 transition"
          onClick={onGetStarted}
        >
          Get Started
        </button>
      )}
    </section>
  );
} 