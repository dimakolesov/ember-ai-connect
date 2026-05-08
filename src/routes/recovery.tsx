import { createFileRoute, Link } from "@tanstack/react-router";
import { EmberBg } from "@/components/EmberBg";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { BottomNav } from "./app";

export const Route = createFileRoute("/recovery")({
  head: () => ({
    meta: [
      { title: "Recovery Mode — Ember" },
      { name: "description", content: "30-day transformation arc. Become the person they regret losing." },
    ],
  }),
  component: Recovery,
});

const rituals = [
  { time: "Morning", title: "Cold shower · 90 seconds", note: "Dopamine reset", done: true },
  { time: "Midday", title: "One thing I'm proud of", note: "Write it. No editing.", done: true },
  { time: "Afternoon", title: "30 min · move your body", note: "Walk, lift, run — choose one.", done: false },
  { time: "Evening", title: "No-contact check-in", note: "Did you reach out today?", done: false },
  { time: "Night", title: "Read · 10 pages", note: "Tonight: 'Attached' ch. 4", done: false },
];

const phases = [
  { label: "Shock", days: "1–7", active: false },
  { label: "Grief", days: "8–21", active: true },
  { label: "Anger", days: "22–35", active: false },
  { label: "Detachment", days: "36–60", active: false },
  { label: "Rebirth", days: "60+", active: false },
];

function Recovery() {
  const completed = rituals.filter((r) => r.done).length;
  return (
    <PhoneFrame>
      <EmberBg />
      <StatusBar />

      <header className="flex items-center justify-between px-6 pt-6">
        <Link to="/app" className="grid h-10 w-10 place-items-center rounded-full glass">←</Link>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Recovery</div>
        <div className="w-10" />
      </header>

      <div className="px-7 pt-8 animate-fade-up">
        <div className="text-[11px] uppercase tracking-[0.3em] text-primary">Day 12 · Phase: Grief</div>
        <h1 className="mt-2 font-serif text-[40px] leading-[1.05] text-gradient-fade">
          You are not who you were <span className="italic">last week.</span>
        </h1>
      </div>

      {/* Ring */}
      <div className="mt-6 flex justify-center animate-fade-up delay-100">
        <div className="relative grid h-44 w-44 place-items-center">
          <div className="absolute inset-0 rounded-full bg-gradient-ember opacity-15 animate-pulse-glow" />
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" stroke="oklch(1 0 0 / 0.08)" strokeWidth="3" fill="none" />
            <circle
              cx="50" cy="50" r="44"
              stroke="url(#g)" strokeWidth="3" fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(completed / rituals.length) * 276.46} 276.46`}
            />
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.20 35)" />
                <stop offset="100%" stopColor="oklch(0.45 0.20 18)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="text-center">
            <div className="font-serif text-[44px] leading-none text-gradient-ember">{completed}/{rituals.length}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Today's rituals</div>
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="mt-8 px-6 animate-fade-up delay-200">
        <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Your arc</div>
        <div className="mt-3 flex justify-between">
          {phases.map((p) => (
            <div key={p.label} className="flex flex-col items-center gap-2">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  p.active ? "bg-gradient-ember shadow-ember animate-pulse-glow" : "bg-foreground/15"
                }`}
              />
              <div className={`text-[10px] uppercase tracking-[0.15em] ${p.active ? "text-foreground" : "text-muted-foreground"}`}>{p.label}</div>
              <div className="text-[9px] text-muted-foreground/70">{p.days}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rituals */}
      <div className="mt-8 space-y-3 px-6 pb-32">
        {rituals.map((r, i) => (
          <div
            key={r.title}
            className={`glass flex items-center gap-4 rounded-2xl p-4 animate-fade-up ${r.done ? "opacity-60" : ""}`}
            style={{ animationDelay: `${300 + i * 80}ms` }}
          >
            <div className="text-[10px] uppercase tracking-[0.25em] text-primary/80 w-16">{r.time}</div>
            <div className="flex-1">
              <div className={`text-[14px] font-medium ${r.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{r.title}</div>
              <div className="text-[11px] text-muted-foreground">{r.note}</div>
            </div>
            <div
              className={`h-6 w-6 shrink-0 rounded-full border ${
                r.done
                  ? "border-primary bg-gradient-ember shadow-ember"
                  : "border-foreground/25"
              }`}
            />
          </div>
        ))}
      </div>

      <BottomNav pathname="/recovery" />
    </PhoneFrame>
  );
}
