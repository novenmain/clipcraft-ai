import { useVideoAnalysis } from "@/hooks/useVideoAnalysis";
import { ProgressPipeline } from "@/components/ProgressPipeline";
import { VideoPreview } from "@/components/VideoPreview";
import { ClipCard } from "@/components/ClipCard";
import { Timeline } from "@/components/Timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scissors, ArrowLeft, Zap, Sparkles, Play, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const { url, setUrl, videoId, step, metadata, clips, error, analyze, reset } = useVideoAnalysis();

  const isProcessing = step !== "idle" && step !== "complete";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 border-b border-border/40 glass sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={reset} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow transition-all group-hover:shadow-glow-lg">
              <Scissors className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground text-lg tracking-tight">
              Clip<span className="text-gradient">Forge</span>
            </span>
          </button>
          {step === "complete" && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <Button variant="outline" size="sm" onClick={reset} className="gap-1.5 border-border/60 hover:border-primary/40 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> New Video
              </Button>
            </motion.div>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {/* IDLE STATE */}
          {step === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center min-h-[65vh] gap-10"
            >
              {/* Hero */}
              <div className="text-center space-y-5 max-w-2xl">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto shadow-glow-lg animate-float"
                >
                  <Zap className="w-10 h-10 text-primary-foreground" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground tracking-tight leading-[1.1]"
                >
                  Turn long videos into{" "}
                  <span className="text-gradient">viral clips</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed"
                >
                  Paste a YouTube link. AI analyzes the transcript and finds the best moments for TikTok, Shorts & Reels.
                </motion.p>

                {/* Feature pills */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap justify-center gap-2 pt-2"
                >
                  {["AI-Powered Analysis", "Real Transcripts", "Viral Score Detection"].map((f) => (
                    <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-secondary/50 text-xs font-medium text-secondary-foreground">
                      <Sparkles className="w-3 h-3 text-primary" />
                      {f}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* URL Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-2xl space-y-3"
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 rounded-2xl gradient-primary opacity-0 group-focus-within:opacity-20 blur-sm transition-opacity duration-500" />
                  <div className="relative flex gap-2 p-2 rounded-2xl border border-border/60 bg-card/80 glass">
                    <div className="flex items-center pl-3 text-muted-foreground">
                      <Play className="w-4 h-4" />
                    </div>
                    <Input
                      placeholder="Paste a YouTube URL..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && analyze(url)}
                      className="flex-1 h-12 border-0 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      onClick={() => analyze(url)}
                      disabled={!url.trim()}
                      className="h-12 px-6 rounded-xl gradient-primary font-display font-semibold text-primary-foreground hover:opacity-90 transition-all disabled:opacity-40 shadow-glow"
                    >
                      <span className="hidden sm:inline">Analyze Video</span>
                      <ChevronRight className="w-4 h-4 sm:ml-1.5" />
                    </Button>
                  </div>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive text-sm text-center font-medium"
                  >
                    {error}
                  </motion.p>
                )}
                <p className="text-xs text-muted-foreground text-center">
                  Supports youtube.com/watch, youtu.be, and youtube.com/shorts links
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* PROCESSING STATE */}
          {isProcessing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center min-h-[65vh] gap-8"
            >
              {videoId && <VideoPreview videoId={videoId} metadata={metadata} compact />}
              <ProgressPipeline currentStep={step} />
            </motion.div>
          )}

          {/* RESULTS STATE */}
          {step === "complete" && clips.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Video preview */}
              {videoId && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <VideoPreview videoId={videoId} metadata={metadata} />
                </motion.div>
              )}

              {/* Timeline */}
              {metadata && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Timeline clips={clips} totalDuration={metadata.durationSeconds} />
                </motion.div>
              )}

              {/* Results header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between"
              >
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    <span className="text-gradient">{clips.length}</span> Clips Detected
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Sorted by viral potential</p>
                </div>
              </motion.div>

              {/* Clip grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {clips
                  .sort((a, b) => b.viralScore - a.viralScore)
                  .map((clip, i) => (
                    <motion.div
                      key={clip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                    >
                      <ClipCard clip={clip} />
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
