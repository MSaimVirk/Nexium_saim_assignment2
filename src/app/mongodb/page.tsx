"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function MongoDBPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [expandedChunks, setExpandedChunks] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/mongodb-list");
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setData(json.data || []);
      } catch (e: any) {
        setError(e.message || "Failed to fetch data");
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
        <h1 className="text-2xl font-bold mb-4">MongoDB Blog Raw Data</h1>
        {loading && <Skeleton className="h-20 w-full max-w-md mb-4" />}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="w-full max-w-2xl space-y-2 mb-6">
          {data.map((doc, idx) => (
            <div key={doc._id || idx}>
              <button
                className={`w-full text-left px-4 py-2 rounded hover:bg-accent focus:bg-accent transition font-medium ${selectedIdx === idx ? 'bg-accent' : ''}`}
                onClick={() => setSelectedIdx(selectedIdx === idx ? null : idx)}
              >
                <span className="text-blue-600 underline cursor-pointer">{doc.url}</span>
              </button>
            </div>
          ))}
          {!loading && data.length === 0 && <div className="text-muted-foreground">No data found.</div>}
        </div>
        {selectedIdx !== null && data[selectedIdx] && (() => {
          const text = data[selectedIdx].text || "";
          const words = text.split(/\s+/);
          const chunkSize = 500;
          const shownWords = words.slice(0, expandedChunks * chunkSize).join(" ");
          const hasMore = words.length > expandedChunks * chunkSize;
          return (
            <Card className="w-full max-w-2xl mb-6">
              <CardHeader>
                <div className="font-semibold">URL: <a href={data[selectedIdx].url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{data[selectedIdx].url}</a></div>
                <div className="text-xs text-muted-foreground">Created: {data[selectedIdx].createdAt ? new Date(data[selectedIdx].createdAt).toLocaleString() : "N/A"}</div>
              </CardHeader>
              <CardContent>
                <div className="text-sm whitespace-pre-line">{shownWords}{hasMore && <button className="ml-2 text-blue-600 underline cursor-pointer" onClick={() => setExpandedChunks(expandedChunks + 1)}>more...</button>}</div>
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