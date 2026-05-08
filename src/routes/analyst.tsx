import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmberBg } from "@/components/EmberBg";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { BottomNav } from "./app";

export const Route = createFileRoute("/analyst")({
  head: () => ({
    meta: [
      { title: "AI Analyst — Ember" },
      { name: "description", content: "Decode the conversation that's been on your mind." },
    ],
  }),
  component: Analyst,
});

const insights = [
  { label: "Attachment style", value: "Anxious-avoidant", glow: 0.9 },
  { label: "Emotional distance", value: "Increasing", glow: 0.7 },
  { label: "Hidden interest", value: "Still present", glow: 0.85 },
  { label: "Reconnection probability", value: "62%", glow: 0.95 },
];

function Analyst() {
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 2200);
  };

  return (
    <PhoneFrame>
      <EmberBg />
      <StatusBar />

      <header className="flex items-center justify-between px-6 pt-6">
        <Link to="/app" className="grid h-10 w-10 place-items-center rounded-full glass">←</Link>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Analyst</div>
        <div className="w-10" />
      </header>

      <div className="px-7 pt-8 animate-fade-up">
        <h1 className="font-serif text-[40px] leading-[1.05] text-gradient-fade">
          Show me the <span className="italic text-gradient-ember">last thing they said.</span>
        </h1>
        <p className="mt-3 text-[14px] text-muted-foreground">
          Screenshot, paste, or forward a voice note. I read tone, timing, attachment patterns, and what's underneath the words.
        </p>
      </div>

      {!analyzed && (
        <div className="mt-8 px-6 animate-fade-up delay-200">
          <button
            onClick={run}
            disabled={loading}
            className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-3xl glass border-dashed border-2 border-primary/30 py-10 transition-all hover:border-primary/60"
          >
            {loading ? (
              <>
                <div className="grid h-16 w-16 place-items-center">
                  <div className="absolute h-16 w-16 rounded-full bg-gradient-ember opacity-30 animate-pulse-glow" />
                  <div className="relative h-3 w-3 rounded-full bg-primary animate-breathe" />
                </div>
                <div className="mt-4 font-serif text-[18px] italic text-foreground/90">Reading between the lines…</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Pattern matching · Tone · Subtext</div>
              </>
            ) : (
              <>
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-ember shadow-ember">
                  <span className="text-[20px]">⌃</span>
                </div>
                <div className="mt-4 font-serif text-[20px]">Drop a screenshot</div>
                <div className="mt-1 text-[12px] text-muted-foreground">PNG, JPG, or paste text · Up to 20 messages</div>
              </>
            )}
          </button>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button onClick={() => toast("Paste your chat", { description: "Long-press to paste from clipboard." })} className="glass rounded-2xl py-3 text-[12px] font-medium transition-colors hover:border-primary/40">Paste chat</button>
            <button onClick={() => toast("Voice note", { description: "Recording is coming soon." })} className="glass rounded-2xl py-3 text-[12px] font-medium transition-colors hover:border-primary/40">Voice note</button>
          </div>
        </div>
      )}

      {analyzed && (
        <div className="mt-8 px-6 pb-32 animate-fade-up">
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" /> Reading complete
            </div>
            <p className="mt-3 font-serif text-[20px] italic leading-snug text-foreground/95">
              "They're not cold. They're protecting themselves from how much they still feel.
              The 4-hour gap before <em>'okay'</em> wasn't disinterest — it was rehearsal."
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {insights.map((it, idx) => (
              <div
                key={it.label}
                className="glass rounded-2xl p-4 animate-fade-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{it.label}</div>
                  <div className="font-serif text-[18px] text-gradient-ember">{it.value}</div>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-foreground/8">
                  <div
                    className="h-full bg-gradient-ember transition-all duration-1000"
                    style={{ width: `${it.glow * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/text"
            className="mt-6 flex h-14 items-center justify-center rounded-2xl bg-gradient-ember font-medium text-primary-foreground shadow-ember"
          >
            Craft what to send next →
          </Link>
        </div>
      )}

      <BottomNav pathname="/analyst" />
    </PhoneFrame>
  );
}
