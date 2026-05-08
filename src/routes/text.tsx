import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmberBg } from "@/components/EmberBg";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";

export const Route = createFileRoute("/text")({
  head: () => ({
    meta: [
      { title: "What to text — Ember" },
      { name: "description", content: "Psychologically optimized messages for the moment that matters." },
    ],
  }),
  component: WhatToText,
});

const tones = ["Calm confidence", "Cold detachment", "Playful", "Mature apology", "Seductive", "Curious"];

const messages: Record<string, string[]> = {
  "Calm confidence": [
    "Hey. I've been thinking about something you said weeks ago — about how I never made room for your silence. You were right. I'm not asking for anything. I just wanted you to know I heard you.",
    "I owe you a real reply, not the one I rehearsed. Free this week if you want it.",
  ],
  "Cold detachment": [
    "Saw something today that reminded me of you. Decided not to send it. Hope you're well.",
    "No drama, no follow-up. Just wanted to wish you a good month.",
  ],
  "Playful": [
    "Random — but did you ever finish that show we started? Asking because I refuse to watch the finale alone.",
    "Confession: I still know your coffee order. Concerning or charming?",
  ],
  "Mature apology": [
    "I've spent some time with what happened, and I don't want to defend any of it. I was scared and I made you small for it. I'm sorry.",
  ],
  "Seductive": [
    "I'm not texting to fix anything. I'm texting because it's late and you're the only person I want to be honest with right now.",
  ],
  "Curious": [
    "Strange question — when you think back, what's the first thing you remember about us?",
  ],
};

function WhatToText() {
  const [tone, setTone] = useState("Calm confidence");
  const list = messages[tone] ?? [];

  return (
    <PhoneFrame>
      <EmberBg />
      <StatusBar />

      <header className="flex items-center justify-between px-6 pt-6">
        <Link to="/app" className="grid h-10 w-10 place-items-center rounded-full glass">←</Link>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">What to text</div>
        <div className="w-10" />
      </header>

      <div className="px-7 pt-8 animate-fade-up">
        <h1 className="font-serif text-[38px] leading-[1.05] text-gradient-fade">
          Break the silence.<br />
          <span className="italic text-gradient-ember">Don't break yourself.</span>
        </h1>
        <p className="mt-3 text-[14px] text-muted-foreground">
          Pick the energy you want to lead with. Ember writes the rest — psychologically calibrated for who they are.
        </p>
      </div>

      {/* Tone chips */}
      <div className="mt-7 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tones.map((t) => {
          const active = t === tone;
          return (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-medium transition-all ${
                active
                  ? "bg-gradient-ember text-primary-foreground shadow-ember"
                  : "glass text-muted-foreground"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Messages */}
      <div className="mt-6 space-y-4 px-6 pb-40">
        {list.map((m, i) => (
          <div key={tone + i} className="animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="glass rounded-3xl p-5">
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary/80">Variant {i + 1}</div>
              <p className="mt-3 font-serif text-[18px] leading-snug text-foreground/95">"{m}"</p>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[12px]">
                <span className="text-muted-foreground">
                  Predicted reply: <span className="text-foreground/90">within 6h</span>
                </span>
                <button onClick={() => { navigator.clipboard?.writeText(m); toast.success("Copied"); }} className="font-medium text-primary hover:opacity-80">Copy</button>
              </div>
            </div>
          </div>
        ))}

        <div className="glass-strong rounded-3xl border border-primary/20 p-5 animate-fade-up delay-300">
          <div className="flex items-start gap-3">
            <span className="mt-1 text-primary">⚠</span>
            <div>
              <div className="text-[13px] font-medium">Wait — should you send anything?</div>
              <p className="mt-1 text-[12px] text-muted-foreground">
                Based on your timeline, 7 more days of silence raises your chance of reply by 23%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
