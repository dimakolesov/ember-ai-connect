import { createFileRoute, Link } from "@tanstack/react-router";
import { EmberBg } from "@/components/EmberBg";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — Ember" },
      { name: "description", content: "The psychology underneath your pain." },
    ],
  }),
  component: Insights,
});

const reads = [
  {
    eyebrow: "Attachment · 4 min",
    title: "Why avoidants come back exactly when you stop wanting them to",
    quote: "Distance feels like safety to them — until your absence becomes louder than your presence.",
  },
  {
    eyebrow: "Attraction · 6 min",
    title: "The death of attraction is rarely about you",
    quote: "Attraction dies in three quiet stages. Most people only notice the third.",
  },
  {
    eyebrow: "Closure · 3 min",
    title: "Closure isn't a conversation. It's a decision.",
    quote: "You will never get the apology you're rehearsing in the shower. Stop waiting.",
  },
  {
    eyebrow: "Phases · 5 min",
    title: "The 5 breakup phases — and the one nobody warns you about",
    quote: "Between grief and detachment, there's a strange phase: indifference that feels like love.",
  },
];

function Insights() {
  return (
    <PhoneFrame>
      <EmberBg />
      <StatusBar />

      <header className="flex items-center justify-between px-6 pt-6">
        <Link to="/app" className="grid h-10 w-10 place-items-center rounded-full glass">←</Link>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Insights</div>
        <div className="w-10" />
      </header>

      <div className="px-7 pt-8 animate-fade-up">
        <h1 className="font-serif text-[40px] leading-[1.05] text-gradient-fade">
          The story under <span className="italic text-gradient-ember">your story.</span>
        </h1>
        <p className="mt-3 text-[14px] text-muted-foreground">
          Short, psychologically deep readings — written for the version of you it's 2:14 AM for.
        </p>
      </div>

      <div className="mt-8 space-y-4 px-6 pb-24">
        {reads.map((r, i) => (
          <article
            key={r.title}
            className="group relative overflow-hidden rounded-3xl glass p-6 transition-all active:scale-[0.99] animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-ember opacity-20 blur-2xl" />
            <div className="relative">
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary/80">{r.eyebrow}</div>
              <h2 className="mt-2 font-serif text-[24px] leading-tight text-foreground">{r.title}</h2>
              <p className="mt-3 font-serif text-[15px] italic leading-snug text-muted-foreground">"{r.quote}"</p>
              <div className="mt-4 flex items-center gap-1.5 text-[12px] font-medium text-foreground/90">
                Read <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PhoneFrame>
  );
}
