"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type BlogSummary = {
  id?: string;
  url: string;
  summary_en: string;
  summary_ur: string;
  created_at?: string;
};

export default function SupabasePage() {
  const [data, setData] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [expandedEnChunks, setExpandedEnChunks] = useState<number>(1);
  const [expandedUrChunks, setExpandedUrChunks] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/supabase-list");
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setData(json.data || []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-extrabold mb-6">Supabase Blog Summaries</h1>
        {loading && <Skeleton className="h-20 w-full max-w-md mb-4" />}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="w-full max-w-2xl space-y-2 mb-6">
          {data.map((row, idx) => (
            <div key={row.id || idx}>
              <button
                className={`w-full text-left px-4 py-2 rounded font-medium transition-colors
                  ${selectedIdx === idx ? 'bg-blue-50 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}
                  ${selectedIdx === idx ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}
                onClick={() => setSelectedIdx(selectedIdx === idx ? null : idx)}
              >
                <span className="text-base font-semibold">{row.url}</span>
              </button>
            </div>
          ))}
          {!loading && data.length === 0 && <div className="text-muted-foreground">No data found.</div>}
        </div>
        {selectedIdx !== null && data[selectedIdx] && (() => {
          const summaryEn = data[selectedIdx].summary_en || "";
          const summaryUr = data[selectedIdx].summary_ur || "";
          const chunkSize = 500;
          const wordsEn = summaryEn.split(/\s+/);
          const wordsUr = summaryUr.split(/\s+/);
          const shownWordsEn = wordsEn.slice(0, expandedEnChunks * chunkSize).join(" ");
          const shownWordsUr = wordsUr.slice(0, expandedUrChunks * chunkSize).join(" ");
          const hasMoreEn = wordsEn.length > expandedEnChunks * chunkSize;
          const hasMoreUr = wordsUr.length > expandedUrChunks * chunkSize;
          return (
            <Card className="w-full max-w-2xl mb-6 bg-white dark:bg-zinc-900 dark:text-zinc-100">
              <CardHeader>
                <div className="font-semibold">URL: <a href={data[selectedIdx].url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{data[selectedIdx].url}</a></div>
                <div className="text-xs text-muted-foreground">Created: {data[selectedIdx].created_at ? new Date(data[selectedIdx].created_at).toLocaleString() : "N/A"}</div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <span className="font-semibold">Summary (English):</span>
                  <div className="text-sm whitespace-pre-line">{shownWordsEn}{hasMoreEn && <button className="ml-2 text-blue-600 underline cursor-pointer" onClick={() => setExpandedEnChunks(expandedEnChunks + 1)}>more...</button>}</div>
                </div>
                <div>
                  <span className="font-semibold">خلاصہ (Urdu):</span>
                  <div className="text-sm whitespace-pre-line">{shownWordsUr}{hasMoreUr && <button className="ml-2 text-blue-600 underline cursor-pointer" onClick={() => setExpandedUrChunks(expandedUrChunks + 1)}>more...</button>}</div>
                </div>
              </CardContent>
            </Card>
          );
        })()}
        <Button className="mt-6" variant="outline" onClick={() => window.history.back()}>Back</Button>
      </main>
      <Footer />
    </div>
  );
} 