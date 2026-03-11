import { Clip } from "@/types/clip";
import { formatTime, getViralScoreColor, getViralScoreBg } from "@/lib/mockData";
import { Play, Download, RefreshCw, Clock, Sparkles, Hash, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExportDialog } from "@/components/ExportDialog";
import { toast } from "sonner";

const categoryLabels: Record<string, string> = {
  hook: "🎣 Hook",
  story: "📖 Story",
  tip: "💡 Tip",
  controversial: "🔥 Hot Take",
  emotional: "😢 Emotional",
  funny: "😂 Funny",
  energy: "⚡ High Energy",
};

export function ClipCard({ clip }: { clip: Clip }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-glow">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{clip.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs font-mono">
              {categoryLabels[clip.category] || clip.category}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(clip.startTime)} – {formatTime(clip.endTime)}
            </span>
          </div>
        </div>

        {/* Viral Score */}
        <div className={`flex flex-col items-center border rounded-lg px-3 py-1.5 ${getViralScoreBg(clip.viralScore)}`}>
          <span className={`text-lg font-bold font-mono ${getViralScoreColor(clip.viralScore)}`}>
            {clip.viralScore}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">viral</span>
        </div>
      </div>

      {/* Hook */}
      <div className="px-4 py-2">
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
          <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground italic">"{clip.hookText}"</p>
        </div>
      </div>

      {/* Transcript snippet */}
      <div className="px-4 py-2">
        <p className="text-xs text-muted-foreground line-clamp-2">{clip.transcript}</p>
      </div>

      {/* Why it's good */}
      <div className="px-4 py-2">
        <p className="text-xs text-secondary-foreground">{clip.explanation}</p>
      </div>

      {/* Caption & Hashtags */}
      <div className="px-4 py-2 space-y-2">
        <div className="flex items-start gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">{clip.caption}</p>
        </div>
        <div className="flex items-start gap-2">
          <Hash className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex flex-wrap gap-1">
            {clip.hashtags.map((tag) => (
              <span key={tag} className="text-xs text-primary/80">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 p-4 pt-2 border-t border-border/50">
        <Button size="sm" className="flex-1 gap-1.5" onClick={() => toast.info("Video preview coming soon with backend integration")}>
          <Play className="w-3.5 h-3.5" /> Preview
        </Button>
        <ExportDialog clip={clip}>
          <Button size="sm" variant="secondary" className="flex-1 gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </ExportDialog>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.info("Regeneration coming soon with AI backend")}>
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
