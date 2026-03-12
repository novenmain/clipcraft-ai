import { useState } from "react";
import { Clip } from "@/types/clip";
import { formatTime } from "@/lib/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Check, Smartphone, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Platform = "tiktok" | "shorts" | "reels";

const platforms: { id: Platform; label: string; resolution: string; maxDuration: string; aspect: string; color: string }[] = [
  { id: "tiktok", label: "TikTok", resolution: "1080 × 1920", maxDuration: "60s", aspect: "9:16", color: "from-pink-500 to-cyan-400" },
  { id: "shorts", label: "Shorts", resolution: "1080 × 1920", maxDuration: "60s", aspect: "9:16", color: "from-red-500 to-red-600" },
  { id: "reels", label: "Reels", resolution: "1080 × 1920", maxDuration: "90s", aspect: "9:16", color: "from-purple-500 to-orange-400" },
];

export function ExportDialog({ clip, children }: { clip: Clip; children: React.ReactNode }) {
  const [selected, setSelected] = useState<Platform>("tiktok");
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setExporting(false);
    toast.success(`Clip exported for ${platforms.find((p) => p.id === selected)?.label}!`, {
      description: "Video processing integration required for actual file download.",
    });
  };

  const active = platforms.find((p) => p.id === selected)!;
  const clipDuration = clip.endTime - clip.startTime;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">Export Clip</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Clip info */}
          <div className="rounded-xl bg-secondary/40 border border-border/30 p-3 space-y-1">
            <p className="text-sm font-medium text-foreground truncate">{clip.title}</p>
            <p className="text-xs text-muted-foreground font-mono">
              {formatTime(clip.startTime)} – {formatTime(clip.endTime)} ({clipDuration}s)
            </p>
          </div>

          {/* Platform selector */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Platform</p>
            <div className="grid grid-cols-3 gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-200 ${
                    selected === p.id
                      ? "border-primary bg-primary/10 text-foreground shadow-glow"
                      : "border-border/40 bg-secondary/30 text-muted-foreground hover:border-muted-foreground/50 hover:bg-secondary/50"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs font-medium">{p.label}</span>
                  {selected === p.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="w-3 h-3 text-primary" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Format details */}
          <div className="rounded-xl border border-border/30 bg-muted/20 p-3 space-y-2.5">
            {[
              { label: "Resolution", value: active.resolution },
              { label: "Aspect Ratio", value: active.aspect },
              { label: "Max Duration", value: active.maxDuration },
              { label: "Subtitles", value: "Auto-generated" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <Badge variant="outline" className="text-[10px] font-mono border-border/40 bg-secondary/30">{value}</Badge>
              </div>
            ))}
          </div>

          <Button
            onClick={handleExport}
            disabled={exporting}
            className="w-full gap-2 gradient-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Export for {active.label}
              </>
            )}
          </Button>

          <p className="text-[10px] text-muted-foreground/60 text-center">
            Full video processing requires a third-party integration
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
