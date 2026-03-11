export interface Clip {
  id: string;
  startTime: number;
  endTime: number;
  title: string;
  hookText: string;
  explanation: string;
  viralScore: number;
  transcript: string;
  caption: string;
  hashtags: string[];
  category: "hook" | "story" | "tip" | "controversial" | "emotional" | "funny" | "energy";
}

export type AnalysisStep = "idle" | "fetching" | "transcribing" | "analyzing" | "detecting" | "complete";

export interface VideoMetadata {
  title: string;
  channel: string;
  duration: string;
  durationSeconds: number;
  thumbnail: string;
  views: string;
  publishedAt: string;
}
