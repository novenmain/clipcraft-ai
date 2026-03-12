import { Clip } from "@/types/clip";
import { formatTime, getViralScoreColor } from "@/lib/mockData";
import { motion } from "framer-motion";

interface TimelineProps {
  clips: Clip[];
  totalDuration: number;
}

export function Timeline({ clips, totalDuration }: TimelineProps) {
  return (
    <div className="w-full rounded-2xl border border-border/40 bg-card/60 glass p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-display font-semibold text-foreground">Best Moments Timeline</h3>
        <span className="text-[10px] font-mono text-muted-foreground">{clips.length} clips · {formatTime(totalDuration)} total</span>
      </div>

      {/* Timeline bar */}
      <div className="relative h-12 bg-muted/40 rounded-xl overflow-hidden border border-border/30">
        {clips.map((clip, i) => {
          const left = (clip.startTime / totalDuration) * 100;
          const width = ((clip.endTime - clip.startTime) / totalDuration) * 100;

          return (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
              className="absolute top-1 bottom-1 rounded-lg cursor-pointer transition-all hover:brightness-125 hover:z-10 group"
              style={{
                left: `${left}%`,
                width: `${Math.max(width, 1.5)}%`,
                background:
                  clip.viralScore >= 80
                    ? "hsl(var(--viral-high) / 0.5)"
                    : clip.viralScore >= 60
                    ? "hsl(var(--viral-mid) / 0.5)"
                    : "hsl(var(--viral-low) / 0.5)",
                borderLeft:
                  clip.viralScore >= 80
                    ? "2px solid hsl(var(--viral-high))"
                    : clip.viralScore >= 60
                    ? "2px solid hsl(var(--viral-mid))"
                    : "2px solid hsl(var(--viral-low))",
              }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                <div className="bg-popover/95 backdrop-blur border border-border rounded-xl p-3 shadow-lg whitespace-nowrap">
                  <p className="text-xs font-display font-medium text-foreground mb-1">{clip.title}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {formatTime(clip.startTime)} – {formatTime(clip.endTime)}
                  </p>
                  <p className={`text-xs font-mono font-bold mt-1 ${getViralScoreColor(clip.viralScore)}`}>
                    Score: {clip.viralScore}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Time markers */}
        <div className="absolute inset-0 flex items-end justify-between px-3 pb-1.5 pointer-events-none">
          <span className="text-[9px] font-mono text-muted-foreground/60">0:00</span>
          <span className="text-[9px] font-mono text-muted-foreground/60">{formatTime(totalDuration / 4)}</span>
          <span className="text-[9px] font-mono text-muted-foreground/60">{formatTime(totalDuration / 2)}</span>
          <span className="text-[9px] font-mono text-muted-foreground/60">{formatTime((totalDuration * 3) / 4)}</span>
          <span className="text-[9px] font-mono text-muted-foreground/60">{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-viral-high/60" />
          <span className="text-[10px] text-muted-foreground">80+ viral</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-viral-mid/60" />
          <span className="text-[10px] text-muted-foreground">60-79</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-viral-low/60" />
          <span className="text-[10px] text-muted-foreground">&lt;60</span>
        </div>
      </div>
    </div>
  );
}
