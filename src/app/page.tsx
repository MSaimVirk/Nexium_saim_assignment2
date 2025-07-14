"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<{ en: string; ur: string } | null>(null);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    setLoading(true);
    setError("");
    setSummary(null);
    try {
      // 1. Check for existing summary
      const checkRes = await fetch("/api/check-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const checkData = await checkRes.json();
      if (checkData.found) {
        setSummary({ en: checkData.summary_en, ur: checkData.summary_ur });
        setLoading(false);
        return;
      }
      // 2. If not found, proceed to summarize
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to summarize");
      const data = await res.json();
      setSummary({ en: data.summary_en, ur: data.summary_ur });
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {!started ? (
          <HeroSection onGetStarted={() => setStarted(true)} />
        ) : (
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-xl font-bold">Summarize a Blog</h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Label htmlFor="blog-url">Blog URL</Label>
              <Input
                id="blog-url"
                type="url"
                placeholder="Enter blog URL..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                disabled={loading}
              />
              <Button onClick={handleSummarize} disabled={!url || loading}>
                {loading ? "Summarizing..." : "Summarize"}
              </Button>
              {loading && <Skeleton className="h-20 w-full" />}
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {summary && (
                <div className="space-y-2 mt-4">
                  <div>
                    <h3 className="font-semibold">Summary (English):</h3>
                    <p>{summary.en}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">خلاصہ (Urdu):</h3>
                    <p>{summary.ur}</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setStarted(false)} disabled={loading}>
                Back
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}