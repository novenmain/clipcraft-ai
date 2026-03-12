import { useState, useCallback } from "react";
import { AnalysisStep, Clip, VideoMetadata } from "@/types/clip";
import { extractYouTubeId } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

    // Step 1 — Fetch metadata via noembed
    setStep("fetching");
    let videoTitle = "";
    try {
      const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`);
      const data = await res.json();
      const meta: VideoMetadata = {
        title: data.title || "Unknown Video",
        channel: data.author_name || "Unknown Channel",
        duration: "~30:00",
        durationSeconds: 1800,
        thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        views: "",
        publishedAt: "",
      };
      videoTitle = meta.title;
      setMetadata(meta);
    } catch {
      setMetadata({
        title: "YouTube Video",
        channel: "Unknown",
        duration: "~30:00",
        durationSeconds: 1800,
        thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        views: "",
        publishedAt: "",
      });
    }

    // Step 2 — Fetch real transcript
    setStep("transcribing");
    let transcript: string | null = null;

    try {
      const { data: transcriptData, error: transcriptError } = await supabase.functions.invoke("fetch-transcript", {
        body: { videoId: id },
      });

      if (!transcriptError && transcriptData) {
        transcript = transcriptData.transcript || null;

        // Update duration if we got it from YouTube page
        if (transcriptData.durationSeconds) {
          setMetadata((prev) => {
            if (!prev) return prev;
            const totalSecs = transcriptData.durationSeconds;
            const mins = Math.floor(totalSecs / 60);
            const secs = totalSecs % 60;
            return {
              ...prev,
              durationSeconds: totalSecs,
              duration: `${mins}:${secs.toString().padStart(2, "0")}`,
            };
          });
        }

        if (transcript) {
          toast.info("Transcript extracted successfully", { description: `Source: ${transcriptData.source}` });
        } else {
          toast.info("No captions found — AI will analyze based on video context");
        }
      }
    } catch (e) {
      console.warn("Transcript extraction failed, continuing without:", e);
      toast.info("Transcript unavailable — AI will generate based on title");
    }

    // Step 3 — AI Analysis
    setStep("analyzing");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-video", {
        body: {
          youtubeUrl: inputUrl,
          videoTitle,
          transcript,
        },
      });

      if (fnError) {
        throw new Error(fnError.message || "Analysis failed");
      }

      if (data?.error) {
        if (data.error.includes("Rate limited")) {
          toast.error("Rate limited — please wait a moment and try again.");
        } else if (data.error.includes("credits")) {
          toast.error("AI credits exhausted. Add credits in Settings → Workspace → Usage.");
        } else {
          toast.error(data.error);
        }
        setStep("idle");
        setError(data.error);
        return;
      }

      setStep("detecting");
      await new Promise((r) => setTimeout(r, 600));

      if (data?.clips && Array.isArray(data.clips)) {
        setClips(data.clips);
        setStep("complete");
        toast.success(`Found ${data.clips.length} clip candidates!`);
      } else {
        throw new Error("No clips returned from analysis");
      }
    } catch (e: any) {
      console.error("Analysis error:", e);
      setError(e.message || "Analysis failed. Please try again.");
      setStep("idle");
      toast.error("Analysis failed. Please try again.");
    }
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
