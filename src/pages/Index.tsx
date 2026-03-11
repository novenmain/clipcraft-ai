import { useVideoAnalysis } from "@/hooks/useVideoAnalysis";
import { ProgressPipeline } from "@/components/ProgressPipeline";
import { VideoPreview } from "@/components/VideoPreview";
import { ClipCard } from "@/components/ClipCard";
import { Timeline } from "@/components/Timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scissors, ArrowLeft, Zap } from "lucide-react";

const Index = () => {
  const { url, setUrl, videoId, step, metadata, clips, error, analyze, reset } = useVideoAnalysis();

  const isProcessing = step !== "idle" && step !== "complete";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={reset} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Scissors className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-lg tracking-tight">ClipForge</span>
          </button>
          {step === "complete" && (
            <Button variant="outline" size="sm" onClick={reset} className="gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> New Video
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* IDLE STATE - Home */}
        {step === "idle" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto shadow-glow">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                Turn long videos into <span className="text-gradient">viral clips</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Paste a YouTube link. AI finds the best moments. Get short-form clips ready for TikTok, Shorts & Reels.
              </p>
            </div>

            {/* URL Input */}
            <div className="w-full max-w-xl space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Paste YouTube URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && analyze(url)}
                  className="flex-1 h-12 font-mono text-sm bg-secondary border-border focus-visible:ring-primary"
                />
                <Button
                  onClick={() => analyze(url)}
                  disabled={!url.trim()}
                  className="h-12 px-6 gradient-primary font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Analyze Video
                </Button>
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
              <p className="text-xs text-muted-foreground text-center">
                Supports youtube.com/watch, youtu.be, and youtube.com/shorts links
              </p>
            </div>
          </div>
        )}

        {/* PROCESSING STATE */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            {videoId && <VideoPreview videoId={videoId} metadata={metadata} />}
            <ProgressPipeline currentStep={step} />
            <p className="text-sm text-muted-foreground animate-pulse">
              {step === "fetching" && "Fetching video metadata..."}
              {step === "transcribing" && "Extracting transcript from audio..."}
              {step === "analyzing" && "AI is analyzing content for viral moments..."}
              {step === "detecting" && "Identifying the best clip candidates..."}
            </p>
          </div>
        )}

        {/* RESULTS STATE */}
        {step === "complete" && clips.length > 0 && (
          <div className="space-y-8">
            {/* Video preview */}
            {videoId && <VideoPreview videoId={videoId} metadata={metadata} />}

            {/* Timeline */}
            {metadata && <Timeline clips={clips} totalDuration={metadata.durationSeconds} />}

            {/* Results header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {clips.length} Clips Detected
                </h2>
                <p className="text-sm text-muted-foreground">Sorted by viral potential</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">TikTok</Button>
                <Button variant="outline" size="sm">Shorts</Button>
                <Button variant="outline" size="sm">Reels</Button>
              </div>
            </div>

            {/* Clip grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clips
                .sort((a, b) => b.viralScore - a.viralScore)
                .map((clip) => (
                  <ClipCard key={clip.id} clip={clip} />
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
