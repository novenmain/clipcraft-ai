import { Clip } from "@/types/clip";

// Mock data for demo purposes
export const mockVideoMetadata = {
  title: "How I Built a $10M Business in 12 Months",
  channel: "Alex Hormozi",
  duration: "42:18",
  durationSeconds: 2538,
  thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  views: "2.4M views",
  publishedAt: "3 weeks ago",
};

export const mockClips: Clip[] = [
  {
    id: "1",
    startTime: 45,
    endTime: 102,
    title: "The $100M Secret Nobody Talks About",
    hookText: "Here's the thing nobody tells you about making your first million...",
    explanation: "Strong opening hook with contrarian insight. High engagement potential due to curiosity gap.",
    viralScore: 92,
    transcript: "Here's the thing nobody tells you about making your first million. It's not about the product. It's not about the marketing. It's about the offer. If your offer is irresistible, everything else becomes easy.",
    caption: "The real secret to making millions isn't what you think 🤯",
    hashtags: ["#business", "#entrepreneur", "#millionaire", "#startup", "#hustle"],
    category: "hook",
  },
  {
    id: "2",
    startTime: 312,
    endTime: 370,
    title: "Why 99% of Businesses Fail in Year One",
    hookText: "I lost everything before I figured this out...",
    explanation: "Emotional storytelling moment with vulnerability. Creates strong connection with audience.",
    viralScore: 87,
    transcript: "I lost everything before I figured this out. My first three businesses failed. I was $100K in debt. But that taught me the one lesson that changed everything.",
    caption: "From $100K in debt to $100M in revenue. Here's the turning point 💪",
    hashtags: ["#failure", "#success", "#motivation", "#grind", "#mindset"],
    category: "story",
  },
  {
    id: "3",
    startTime: 540,
    endTime: 595,
    title: "The 3-Step Framework That Prints Money",
    hookText: "Write this down, this is the framework...",
    explanation: "Actionable tip with clear structure. High save and share potential.",
    viralScore: 85,
    transcript: "Write this down. Step one: find a painful problem. Step two: create an offer so good people feel stupid saying no. Step three: deliver ten times the value they paid for. That's it. That's the whole game.",
    caption: "The 3-step framework that built my empire 📝",
    hashtags: ["#framework", "#businesstips", "#entrepreneur", "#wealth", "#strategy"],
    category: "tip",
  },
  {
    id: "4",
    startTime: 890,
    endTime: 940,
    title: "This Mindset Shift Changed Everything",
    hookText: "Stop thinking like an employee...",
    explanation: "Controversial take that challenges common beliefs. High comment engagement expected.",
    viralScore: 79,
    transcript: "Stop thinking like an employee. Employees trade time for money. Entrepreneurs trade value for money. The moment I stopped counting hours and started counting value delivered, my income 10x'd overnight.",
    caption: "Employee mindset vs Entrepreneur mindset 🧠",
    hashtags: ["#mindset", "#entrepreneur", "#employee", "#wealth", "#freedom"],
    category: "controversial",
  },
  {
    id: "5",
    startTime: 1200,
    endTime: 1248,
    title: "The Hiring Mistake That Cost Me $2M",
    hookText: "I made one hire that nearly destroyed my company...",
    explanation: "High-stakes storytelling with specific numbers. Creates urgency and curiosity.",
    viralScore: 83,
    transcript: "I made one hire that nearly destroyed my company. I brought in a VP of Sales who looked perfect on paper. Six months later, we'd lost $2 million and half our team had quit.",
    caption: "One bad hire cost me $2M. Here's what I learned 😤",
    hashtags: ["#hiring", "#management", "#leadership", "#mistakes", "#business"],
    category: "story",
  },
  {
    id: "6",
    startTime: 1580,
    endTime: 1632,
    title: "Do This Every Morning to 10x Productivity",
    hookText: "My morning routine is weird but it works...",
    explanation: "Practical tip with bold claim. High save rate expected.",
    viralScore: 74,
    transcript: "My morning routine is weird but it works. I wake up at 4:30 AM, no phone for the first two hours. I write down my three most important tasks and I do the hardest one first. Every single day.",
    caption: "The weird morning routine behind my success ☀️",
    hashtags: ["#morningroutine", "#productivity", "#habits", "#discipline", "#success"],
    category: "tip",
  },
];

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getViralScoreColor(score: number): string {
  if (score >= 80) return "text-viral-high";
  if (score >= 60) return "text-viral-mid";
  return "text-viral-low";
}

export function getViralScoreBg(score: number): string {
  if (score >= 80) return "bg-viral-high/20 border-viral-high/30";
  if (score >= 60) return "bg-viral-mid/20 border-viral-mid/30";
  return "bg-viral-low/20 border-viral-low/30";
}
