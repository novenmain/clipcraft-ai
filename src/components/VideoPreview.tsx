import { VideoMetadata } from "@/types/clip";
import { motion } from "framer-motion";
import { Clock, Eye, User } from "lucide-react";

interface VideoPreviewProps {
  videoId: string;
  metadata: VideoMetadata | null;
  compact?: boolean;
}

export function VideoPreview({ videoId, metadata, compact }: VideoPreviewProps) {
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto rounded-xl border border-border/50 bg-card/60 glass overflow-hidden shadow-card"
      >
        <div className="flex items-center gap-3 p-3">
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt="Video thumbnail"
            className="w-20 h-14 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{metadata?.title || "Loading..."}</p>
            <p className="text-xs text-muted-foreground">{metadata?.channel || "..."}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-border/40 bg-card/60 glass shadow-card overflow-hidden">
      {/* Embed */}
      <div className="aspect-video bg-muted/30">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Video preview"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Metadata */}
      {metadata && (
        <div className="p-4 sm:p-5 space-y-2">
          <h2 className="font-display font-semibold text-foreground text-lg leading-tight">{metadata.title}</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> {metadata.channel}
            </span>
            {metadata.views && (
              <span className="inline-flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> {metadata.views}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {metadata.duration}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
