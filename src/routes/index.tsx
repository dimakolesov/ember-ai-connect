import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/ember-hero.jpg";
import { EmberBg } from "@/components/EmberBg";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ember — Heal. Understand. Reconnect." },
      { name: "description", content: "An emotionally intelligent AI for breakup recovery, relationship psychology, and reconnecting with your ex." },
      { property: "og:title", content: "Ember — Heal. Understand. Reconnect." },
      { property: "og:description", content: "Cinematic AI companion for the heart." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <PhoneFrame>
      <EmberBg />
      <StatusBar />

      {/* Hero image with deep gradient mask */}
      <div className="relative mt-2 h-[58svh] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="A single ember glowing in darkness"
          width={1080}
          height={1920}
          className="h-full w-full scale-105 object-cover opacity-90 animate-fade-in-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        <div className="absolute inset-x-0 top-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-foreground/70 animate-fade-up">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            Ember · v1
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="relative -mt-24 px-7 pb-10">
        <h1 className="font-serif text-[58px] leading-[0.95] tracking-tight text-gradient-fade animate-fade-up">
          Some fires<br />
          <span className="italic text-gradient-ember">don't go out.</span>
        </h1>
        <p className="mt-5 max-w-[28ch] text-[15px] leading-relaxed text-muted-foreground animate-fade-up delay-200">
          Ember is the AI that finally understands what you're going through —
          your silence, your spiral, the unread message you keep rewriting.
        </p>

        <div className="mt-9 space-y-3 animate-fade-up delay-300">
          <Link
            to="/onboarding"
            className="group relative flex h-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-ember text-[15px] font-medium tracking-wide text-primary-foreground shadow-ember transition-transform active:scale-[0.98]"
          >
            <span className="relative z-10">Begin healing</span>
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            to="/app"
            className="flex h-12 items-center justify-center text-[13px] font-medium uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            I already have an account
          </Link>
        </div>

        {/* Quote */}
        <div className="mt-12 glass rounded-3xl p-6 animate-fade-up delay-500">
          <p className="font-serif text-[19px] italic leading-snug text-foreground/90">
            "It read three of my messages and told me things my therapist couldn't in 6 months."
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px w-6 bg-primary/60" />
            Maya, 27 · 3 weeks in
          </div>
        </div>

        <p className="mt-10 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 animate-fade-up delay-700">
          Private · End-to-end · No judgment
        </p>
      </div>
    </PhoneFrame>
  );
}
