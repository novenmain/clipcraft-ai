import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId } = await req.json();

    if (!videoId || typeof videoId !== "string" || videoId.length > 20) {
      return new Response(JSON.stringify({ error: "Invalid video ID" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Try multiple transcript extraction approaches
    let transcript = "";

    // Approach 1: YouTube's timedtext API (works for videos with captions)
    try {
      const watchPageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (watchPageRes.ok) {
        const html = await watchPageRes.text();

        // Extract captions URL from the page
        const captionMatch = html.match(/"captionTracks":\s*(\[.*?\])/);
        if (captionMatch) {
          const captionTracks = JSON.parse(captionMatch[1]);
          // Prefer English captions
          const englishTrack = captionTracks.find(
            (t: any) => t.languageCode === "en" || t.languageCode?.startsWith("en")
          ) || captionTracks[0];

          if (englishTrack?.baseUrl) {
            const captionUrl = englishTrack.baseUrl.replace(/\\u0026/g, "&");
            const captionRes = await fetch(captionUrl);
            if (captionRes.ok) {
              const captionXml = await captionRes.text();
              // Parse XML captions to plain text with timestamps
              const segments: { start: number; text: string }[] = [];
              const regex = /<text start="([\d.]+)"[^>]*>(.*?)<\/text>/gs;
              let match;
              while ((match = regex.exec(captionXml)) !== null) {
                const start = parseFloat(match[1]);
                let text = match[2]
                  .replace(/&amp;/g, "&")
                  .replace(/&lt;/g, "<")
                  .replace(/&gt;/g, ">")
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'")
                  .replace(/<[^>]+>/g, "")
                  .trim();
                if (text) {
                  segments.push({ start, text });
                }
              }

              if (segments.length > 0) {
                // Build transcript with timestamps every ~30 seconds
                let lastTimestamp = -30;
                transcript = segments.map((s) => {
                  if (s.start - lastTimestamp >= 30) {
                    lastTimestamp = s.start;
                    const mins = Math.floor(s.start / 60);
                    const secs = Math.floor(s.start % 60);
                    return `\n[${mins}:${secs.toString().padStart(2, "0")}] ${s.text}`;
                  }
                  return s.text;
                }).join(" ").trim();

                console.log(`Extracted ${segments.length} caption segments for video ${videoId}`);
              }
            }
          }
        }

        // Also try to extract video duration
        const durationMatch = html.match(/"lengthSeconds":\s*"(\d+)"/);
        const durationSeconds = durationMatch ? parseInt(durationMatch[1]) : null;

        return new Response(JSON.stringify({
          transcript: transcript || null,
          durationSeconds,
          source: transcript ? "captions" : "none",
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (e) {
      console.error("Caption extraction error:", e);
    }

    return new Response(JSON.stringify({
      transcript: null,
      durationSeconds: null,
      source: "none",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-transcript error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
