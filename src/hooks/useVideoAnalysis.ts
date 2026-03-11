import { useState, useCallback } from "react";
import { AnalysisStep, Clip, VideoMetadata } from "@/types/clip";
import { mockClips, mockVideoMetadata, extractYouTubeId } from "@/lib/mockData";

export function useVideoAnalysis() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [step, setStep] = useState<AnalysisStep>("idle");
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (inputUrl: string) => {
    const id = extractYouTubeId(inputUrl);
    if (!id) {
      setError("Invalid YouTube URL. Please paste a valid link.");
      return;
    }

    setError(null);
    setVideoId(id);
    setClips([]);

    // Simulate processing pipeline
    setStep("fetching");
    await new Promise((r) => setTimeout(r, 1500));

    setMetadata({ ...mockVideoMetadata, thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg` });

    setStep("transcribing");
    await new Promise((r) => setTimeout(r, 2500));

    setStep("analyzing");
    await new Promise((r) => setTimeout(r, 2000));

    setStep("detecting");
    await new Promise((r) => setTimeout(r, 1800));

    setClips(mockClips);
    setStep("complete");
  }, []);

  const reset = useCallback(() => {
    setUrl("");
    setVideoId(null);
    setStep("idle");
    setMetadata(null);
    setClips([]);
    setError(null);
  }, []);

  return { url, setUrl, videoId, step, metadata, clips, error, analyze, reset };
}
