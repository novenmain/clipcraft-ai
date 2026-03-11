import { Clip } from "@/types/clip";
import { formatTime, getViralScoreColor } from "@/lib/mockData";

interface TimelineProps {
  clips: Clip[];
  totalDuration: number;
}

export function Timeline({ clips, totalDuration }: TimelineProps) {
  return (
    <div className="w-full rounded-xl border border-border bg-card p-4 shadow-card">
      <h3 className="text-sm font-semibold text-foreground mb-3">📍 Best Moments Timeline</h3>

      {/* Timeline bar */}
      <div className="relative h-10 bg-muted rounded-lg overflow-hidden">
        {clips.map((clip) => {
          const left = (clip.startTime / totalDuration) * 100;
          const width = ((clip.endTime - clip.startTime) / totalDuration) * 100;

          return (
            <div
              key={clip.id}
              className="absolute top-0 h-full rounded cursor-pointer transition-opacity hover:opacity-100 opacity-80 group"
              style={{
                left: `${left}%`,
                width: `${Math.max(width, 1)}%`,
                background:
                  clip.viralScore >= 80
                    ? "hsl(var(--viral-high) / 0.6)"
                    : clip.viralScore >= 60
                    ? "hsl(var(--viral-mid) / 0.6)"
                    : "hsl(var(--viral-low) / 0.6)",
              }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-popover border border-border rounded-lg p-2 shadow-lg whitespace-nowrap">
                  <p className="text-xs font-medium text-foreground">{clip.title}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatTime(clip.startTime)} – {formatTime(clip.endTime)}
                  </p>
                  <p className={`text-xs font-mono font-bold ${getViralScoreColor(clip.viralScore)}`}>
                    Score: {clip.viralScore}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Time markers */}
        <div className="absolute inset-0 flex items-end justify-between px-2 pb-1 pointer-events-none">
          <span className="text-[10px] font-mono text-muted-foreground">0:00</span>
          <span className="text-[10px] font-mono text-muted-foreground">{formatTime(totalDuration / 2)}</span>
          <span className="text-[10px] font-mono text-muted-foreground">{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-viral-high/60" />
          <span className="text-[10px] text-muted-foreground">High (80+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-viral-mid/60" />
          <span className="text-[10px] text-muted-foreground">Medium (60-79)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-viral-low/60" />
          <span className="text-[10px] text-muted-foreground">Low (&lt;60)</span>
        </div>
      </div>
    </div>
  );
}
