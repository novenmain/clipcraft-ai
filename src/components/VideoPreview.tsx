import { VideoMetadata } from "@/types/clip";

export function VideoPreview({ videoId, metadata }: { videoId: string; metadata: VideoMetadata | null }) {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-border bg-card shadow-card overflow-hidden">
      {/* Embed */}
      <div className="aspect-video bg-muted">
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
        <div className="p-4 space-y-1">
          <h2 className="font-semibold text-foreground text-lg leading-tight">{metadata.title}</h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{metadata.channel}</span>
            <span>•</span>
            <span>{metadata.views}</span>
            <span>•</span>
            <span>{metadata.duration}</span>
          </div>
        </div>
      )}
    </div>
  );
}
