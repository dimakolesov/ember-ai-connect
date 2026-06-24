import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { EmberBg } from "@/components/EmberBg";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Tell me what happened — Ember" },
      { name: "description", content: "A short, honest conversation. No sign-up. No judgment." },
    ],
  }),
  component: Onboarding,
});

type Step = {
  prompt: string;
  sub?: string;
  options: { label: string; sub?: string }[];
};

const steps: Step[] = [
  {
    prompt: "First — who left whom?",
    sub: "There's no wrong answer here.",
    options: [
      { label: "They left me", sub: "Out of nowhere or slowly" },
      { label: "I left them", sub: "And I'm not sure why" },
      { label: "It was mutual", sub: "But it still hurts" },
      { label: "It's complicated", sub: "Tell me later" },
    ],
  },
  {
    prompt: "How long ago?",
    options: [
      { label: "Days ago", sub: "It's still raw" },
      { label: "Weeks ago" },
      { label: "Months ago" },
      { label: "Over a year — and I still think about them" },
    ],
  },
  {
    prompt: "Are you still in contact?",
    options: [
      { label: "Yes — we still talk" },
      { label: "Sometimes" },
      { label: "No — they went silent" },
      { label: "I'm blocked" },
    ],
  },
  {
    prompt: "What do you want, honestly?",
    sub: "You can change this anytime.",
    options: [
      { label: "Get them back", sub: "Strategically. Without losing myself." },
      { label: "Understand what happened", sub: "Closure" },
      { label: "Move on for good", sub: "Become someone new" },
      { label: "Become magnetic again", sub: "Confidence reset" },
    ],
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const step = steps[i];
  const progress = ((i + (picked !== null ? 1 : 0)) / steps.length) * 100;

  const next = () => {
    if (picked === null) return;
    setPicked(null);
    if (i < steps.length - 1) setI(i + 1);
    else navigate({ to: "/app" });
  };

  const disabled = picked === null;

  return (
    <PhoneFrame>
      <EmberBg />
      <div className="relative flex h-svh min-h-svh flex-col">
        <StatusBar />

        <div className="px-6 pt-6">
          {/* Progress */}
          <div className="flex items-center gap-2">
            {steps.map((_, idx) => (
              <div key={idx} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-foreground/8">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-ember transition-all duration-700"
                  style={{ width: idx < i ? "100%" : idx === i ? `${picked !== null ? 100 : 0}%` : "0%" }}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Chapter {i + 1} of {steps.length}
          </div>
        </div>

        {/* Scrollable region: heading + options */}
        <div
          key={i}
          className="flex-1 min-h-0 overflow-y-auto px-7 pt-8 animate-fade-up"
          style={{ paddingBottom: "calc(140px + env(safe-area-inset-bottom))" }}
        >
          <h2 className="font-serif text-[40px] leading-[1.05] text-gradient-fade">
            {step.prompt}
          </h2>
          {step.sub && (
            <p className="mt-3 text-[14px] text-muted-foreground">{step.sub}</p>
          )}

          <div className="mt-8 space-y-3">
            {step.options.map((opt, idx) => {
              const active = picked === idx;
              return (
                <button
                  key={opt.label}
                  onClick={() => setPicked(idx)}
                  className={`group relative w-full overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all duration-500 active:scale-[0.99] animate-fade-up ${
                    active
                      ? "border-primary/60 bg-primary/10 shadow-ember"
                      : "border-border/60 glass hover:border-primary/30"
                  }`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[15px] font-medium text-foreground">{opt.label}</div>
                      {opt.sub && (
                        <div className="mt-0.5 truncate text-[12px] text-muted-foreground">{opt.sub}</div>
                      )}
                    </div>
                    <div
                      className={`h-5 w-5 shrink-0 rounded-full border transition-all ${
                        active
                          ? "border-primary bg-gradient-ember shadow-ember"
                          : "border-foreground/20 bg-transparent"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer CTA — solid, sticky, safe-area aware */}
        <div
          className="sticky bottom-0 left-0 right-0 border-t border-border/40 bg-background px-6 pt-4 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.6)]"
          style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <button
            onClick={next}
            disabled={disabled}
            className={`flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-ember text-[15px] font-medium tracking-wide text-primary-foreground shadow-ember transition-all duration-500 disabled:opacity-30 disabled:shadow-none active:scale-[0.98] ${
              disabled ? "pointer-events-none" : ""
            }`}
          >
            {i === steps.length - 1 ? "Open Ember" : "Continue"}
            <span className="ml-2">→</span>
          </button>
          <div className="mt-2 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
            Your answers shape how Ember speaks to you
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
