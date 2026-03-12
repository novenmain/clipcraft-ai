import { Clip } from "@/types/clip";
import { formatTime, getViralScoreColor, getViralScoreBg } from "@/lib/mockData";
import { Play, Download, RefreshCw, Clock, Sparkles, Hash, MessageSquare, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExportDialog } from "@/components/ExportDialog";
import { toast } from "sonner";
import { useState } from "react";

const categoryLabels: Record<string, { emoji: string; label: string }> = {
  hook: { emoji: "🎣", label: "Hook" },
  story: { emoji: "📖", label: "Story" },
  tip: { emoji: "💡", label: "Tip" },
  controversial: { emoji: "🔥", label: "Hot Take" },
  emotional: { emoji: "😢", label: "Emotional" },
  funny: { emoji: "😂", label: "Funny" },
  energy: { emoji: "⚡", label: "Energy" },
};

export function ClipCard({ clip }: { clip: Clip }) {
  const [copied, setCopied] = useState(false);
  const cat = categoryLabels[clip.category] || { emoji: "📎", label: clip.category };

  const copyCaption = () => {
    const text = `${clip.caption}\n\n${clip.hashtags.join(" ")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Caption & hashtags copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group rounded-2xl border border-border/50 bg-card/60 glass shadow-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-card-hover">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex-1 min-w-0 space-y-1.5">
          <h3 className="font-display font-semibold text-foreground text-[15px] leading-snug line-clamp-2">{clip.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-medium border-border/60 bg-secondary/30 px-2 py-0.5">
              {cat.emoji} {cat.label}
            </Badge>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" />
              {formatTime(clip.startTime)} – {formatTime(clip.endTime)}
            </span>
          </div>
        </div>

        {/* Viral Score */}
        <div className={`flex flex-col items-center border rounded-xl px-3 py-2 ml-3 ${getViralScoreBg(clip.viralScore)}`}>
          <span className={`text-xl font-bold font-mono leading-none ${getViralScoreColor(clip.viralScore)}`}>
            {clip.viralScore}
          </span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">viral</span>
        </div>
      </div>

      {/* Hook */}
      <div className="px-4 py-1.5">
        <div className="flex items-start gap-2.5 rounded-xl bg-primary/5 border border-primary/10 p-3">
          <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/90 italic leading-relaxed">"{clip.hookText}"</p>
        </div>
      </div>

      {/* Transcript snippet */}
      <div className="px-4 py-2">
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{clip.transcript}</p>
      </div>

      {/* Why it's good */}
      <div className="px-4 py-1.5">
        <p className="text-xs text-secondary-foreground/80 leading-relaxed">{clip.explanation}</p>
      </div>

      {/* Caption & Hashtags */}
      <div className="px-4 py-2 space-y-2">
        <div className="flex items-start gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed flex-1">{clip.caption}</p>
          <button onClick={copyCaption} className="flex-shrink-0 p-1 rounded-md hover:bg-secondary/50 transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
        </div>
        <div className="flex items-start gap-2">
          <Hash className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex flex-wrap gap-1">
            {clip.hashtags.map((tag) => (
              <span key={tag} className="text-[11px] text-primary/70 hover:text-primary transition-colors cursor-pointer">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 p-4 pt-3 border-t border-border/30">
        <Button size="sm" variant="outline" className="flex-1 gap-1.5 border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all" onClick={() => toast.info("Video preview coming soon")}>
          <Play className="w-3.5 h-3.5" /> Preview
        </Button>
        <ExportDialog clip={clip}>
          <Button size="sm" className="flex-1 gap-1.5 gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </ExportDialog>
        <Button size="sm" variant="ghost" className="px-2 text-muted-foreground hover:text-foreground" onClick={() => toast.info("Regeneration coming soon")}>
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
