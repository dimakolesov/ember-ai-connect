import { createFileRoute, Link } from "@tanstack/react-router";
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

      {/* Wordmark */}
      <div className="flex items-center justify-between px-7 pt-10 animate-fade-up">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full border border-primary/40">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-ember shadow-ember" />
          </span>
          <span className="text-[12px] font-medium uppercase tracking-[0.4em] text-foreground/80">Ember</span>
        </div>
        <span className="font-serif italic text-[13px] lowercase text-muted-foreground">est. 2026</span>
      </div>

      {/* Hero — pure typography */}
      <div className="mt-[18svh] px-7">
        <div className="mb-5 flex items-center gap-3 animate-fade-up">
          <span className="h-px w-6 bg-primary/60" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary/90">A private practice</span>
        </div>

        <h1 className="font-serif text-[68px] leading-[0.92] tracking-[-0.02em] text-gradient-fade animate-fade-up">
          Some loves<br />
          <span className="italic text-gradient-ember">never tarnish.</span>
        </h1>

        <p className="mt-7 max-w-[30ch] text-[15px] leading-relaxed text-muted-foreground animate-fade-up delay-200">
          The quiet, intelligent companion for the love that left a mark —
          your silence, your spiral, the unread message you keep rewriting.
        </p>
      </div>

      {/* Footer CTA */}
      <div className="mt-[14svh] px-7 pb-10">
        <div className="space-y-3 animate-fade-up delay-300">
          <Link
            to="/onboarding"
            className="group relative flex h-[54px] items-center justify-center overflow-hidden rounded-full bg-foreground text-[14px] font-medium tracking-[0.02em] text-background transition-transform active:scale-[0.98]"
          >
            <span>Begin</span>
            <span className="ml-2 transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <Link
            to="/app"
            className="flex h-12 items-center justify-center text-[12px] font-medium uppercase tracking-[0.32em] text-muted-foreground hover:text-foreground transition-colors"
          >
            I have an account
          </Link>
        </div>

        <p className="mt-10 text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60 animate-fade-up delay-500">
          Private · Encrypted · Without judgment
        </p>
      </div>
    </PhoneFrame>
  );
}
