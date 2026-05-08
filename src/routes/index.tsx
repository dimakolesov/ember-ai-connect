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
      <div className="relative mt-2 h-[60svh] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="A single emerald suspended in darkness"
          width={1080}
          height={1920}
          className="h-full w-full scale-110 object-cover opacity-95 animate-fade-in-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background" />
        <div className="absolute inset-x-0 top-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-[10px] uppercase tracking-[0.32em] text-foreground/75 animate-fade-up">
            <span className="h-1 w-1 rounded-full bg-primary animate-pulse-glow" />
            Ember
            <span className="text-foreground/30">·</span>
            <span className="font-serif italic text-[11px] tracking-normal lowercase text-foreground/60">est. 2026</span>
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="relative -mt-28 px-7 pb-10">
        <div className="mb-4 flex items-center gap-3 animate-fade-up">
          <span className="h-px w-8 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary/90">A private practice</span>
        </div>
        <h1 className="font-serif text-[62px] leading-[0.92] tracking-tight text-gradient-fade animate-fade-up">
          Some loves<br />
          <span className="italic text-gradient-ember">never tarnish.</span>
        </h1>
        <p className="mt-6 max-w-[30ch] text-[15px] leading-relaxed text-muted-foreground animate-fade-up delay-200">
          Ember is the quiet, intelligent companion for the love that left a mark —
          your silence, your spiral, the unread message you keep rewriting.
        </p>

        <div className="mt-10 space-y-3 animate-fade-up delay-300">
          <Link
            to="/onboarding"
            className="group relative flex h-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-ember text-[14px] font-medium uppercase tracking-[0.22em] text-primary-foreground shadow-ember transition-transform active:scale-[0.98]"
          >
            <span className="relative z-10">Begin</span>
            <span className="ml-3 transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            to="/app"
            className="flex h-12 items-center justify-center text-[12px] font-medium uppercase tracking-[0.32em] text-muted-foreground hover:text-foreground transition-colors"
          >
            I have an account
          </Link>
        </div>

        {/* Quote */}
        <div className="mt-12 glass rounded-3xl p-7 animate-fade-up delay-500">
          <div className="font-serif text-[24px] leading-none text-primary/80">"</div>
          <p className="mt-1 font-serif text-[19px] italic leading-snug text-foreground/95">
            It read three of my messages and told me things my therapist couldn't in six months.
          </p>
          <div className="mt-4 flex items-center gap-2.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-6 bg-primary/60" />
            Maya, 27 · three weeks in
          </div>
        </div>

        <p className="mt-12 text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60 animate-fade-up delay-700">
          Private · Encrypted · Without judgment
        </p>
      </div>
    </PhoneFrame>
  );
}
