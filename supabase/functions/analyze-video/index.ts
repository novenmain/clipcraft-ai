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
    const { youtubeUrl, videoTitle, transcript } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: If no transcript provided, ask AI to work with what we have
    const systemPrompt = `You are a viral content analyst specializing in short-form video content for TikTok, YouTube Shorts, and Instagram Reels.

Given a YouTube video transcript, analyze it and identify the 5-8 best moments that would make great short-form clips (15-60 seconds each).

For each clip, evaluate based on:
- Strong opening hooks
- Surprising or controversial statements  
- Valuable insights or tips
- Storytelling moments
- Emotional reactions
- Funny moments
- High-energy speaking moments

You MUST respond by calling the "extract_clips" function.`;

    const userPrompt = transcript
      ? `Analyze this transcript from the YouTube video "${videoTitle || "Unknown"}" (URL: ${youtubeUrl}) and find the best clip candidates:\n\n${transcript}`
      : `I have a YouTube video: "${videoTitle || youtubeUrl}". Since I don't have the transcript yet, generate realistic clip suggestions based on common viral content patterns for this type of video. Assume it's a ~30 minute video. Create compelling clip suggestions that would work well as short-form content.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_clips",
              description: "Return the best clip candidates from the video.",
              parameters: {
                type: "object",
                properties: {
                  clips: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "Unique clip ID like clip_1, clip_2 etc" },
                        startTime: { type: "number", description: "Start time in seconds" },
                        endTime: { type: "number", description: "End time in seconds (15-60 seconds after start)" },
                        title: { type: "string", description: "Catchy short-form title (under 60 chars)" },
                        hookText: { type: "string", description: "Opening hook line for the clip" },
                        explanation: { type: "string", description: "Why this moment would go viral" },
                        viralScore: { type: "number", description: "Viral potential score from 1-100" },
                        transcript: { type: "string", description: "The transcript text for this clip segment" },
                        caption: { type: "string", description: "Suggested social media caption with emoji" },
                        hashtags: {
                          type: "array",
                          items: { type: "string" },
                          description: "5 relevant hashtags starting with #",
                        },
                        category: {
                          type: "string",
                          enum: ["hook", "story", "tip", "controversial", "emotional", "funny", "energy"],
                          description: "Category of the clip moment",
                        },
                      },
                      required: ["id", "startTime", "endTime", "title", "hookText", "explanation", "viralScore", "transcript", "caption", "hashtags", "category"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["clips"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_clips" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings → Workspace → Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data).slice(0, 500));

    // Extract clips from tool call
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "AI did not return structured clips" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const clips = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ success: true, ...clips }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-video error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
