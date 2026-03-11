import { useState } from "react";
import { Clip } from "@/types/clip";
import { formatTime } from "@/lib/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Check, Smartphone } from "lucide-react";
import { toast } from "sonner";

type Platform = "tiktok" | "shorts" | "reels";

const platforms: { id: Platform; label: string; resolution: string; maxDuration: string; aspect: string }[] = [
  { id: "tiktok", label: "TikTok", resolution: "1080 × 1920", maxDuration: "60s", aspect: "9:16" },
  { id: "shorts", label: "YouTube Shorts", resolution: "1080 × 1920", maxDuration: "60s", aspect: "9:16" },
  { id: "reels", label: "Instagram Reels", resolution: "1080 × 1920", maxDuration: "90s", aspect: "9:16" },
];

export function ExportDialog({ clip, children }: { clip: Clip; children: React.ReactNode }) {
  const [selected, setSelected] = useState<Platform>("tiktok");
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    // Simulate export delay
    await new Promise((r) => setTimeout(r, 1500));
    setExporting(false);
    toast.success(`Clip exported for ${platforms.find((p) => p.id === selected)?.label}! (Backend video processing required for actual file generation)`);
  };

  const active = platforms.find((p) => p.id === selected)!;
  const clipDuration = clip.endTime - clip.startTime;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Export Clip</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Clip info */}
          <div className="rounded-lg bg-secondary p-3 space-y-1">
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
                  className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all ${
                    selected === p.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-secondary/50 text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs font-medium">{p.label}</span>
                  {selected === p.id && <Check className="w-3 h-3 text-primary" />}
                </button>
              ))}
            </div>
          </div>

          {/* Format details */}
          <div className="rounded-lg border border-border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Resolution</span>
              <Badge variant="outline" className="text-xs font-mono">{active.resolution}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Aspect Ratio</span>
              <Badge variant="outline" className="text-xs font-mono">{active.aspect}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Max Duration</span>
              <Badge variant="outline" className="text-xs font-mono">{active.maxDuration}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Subtitles</span>
              <Badge variant="outline" className="text-xs font-mono">Auto-generated</Badge>
            </div>
          </div>

          <Button onClick={handleExport} disabled={exporting} className="w-full gap-2 gradient-primary text-primary-foreground">
            {exporting ? (
              <>Exporting...</>
            ) : (
              <>
                <Download className="w-4 h-4" /> Export for {active.label}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
