import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { EmberBg } from "@/components/EmberBg";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Ember Inner Circle" },
      { name: "description", content: "The version of Ember that goes deeper." },
    ],
  }),
  component: Premium,
});

const perks = [
  { title: "Unlimited AI conversations", sub: "No silence cap. Talk it through, all of it." },
  { title: "Voice coach", sub: "Ember speaks back — soft, calm, almost human." },
  { title: "Deep relationship analysis", sub: "Up to 200 messages, attachment + power maps." },
  { title: "Comeback probability tracking", sub: "Live odds, updated as your behaviour changes." },
  { title: "Custom 90-day arc", sub: "Personalized recovery built around your timeline." },
];

function Premium() {
  return (
    <PhoneFrame>
      <EmberBg />
      <StatusBar />

      <header className="flex items-center justify-between px-6 pt-6">
        <Link to="/app" className="grid h-10 w-10 place-items-center rounded-full glass">←</Link>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Inner Circle</div>
        <div className="w-10" />
      </header>

      <div className="px-7 pt-10 animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" /> Ember · Inner Circle
        </div>
        <h1 className="mt-5 font-serif text-[44px] leading-[0.98] text-gradient-fade">
          For the nights<br />
          <span className="italic text-gradient-ember">free isn't enough.</span>
        </h1>
        <p className="mt-4 text-[14.5px] text-muted-foreground">
          Deeper analysis. A voice that answers. A version of Ember that knows you.
        </p>
      </div>

      <div className="mt-8 space-y-2.5 px-6">
        {perks.map((p, i) => (
          <div
            key={p.title}
            className="glass flex items-start gap-3 rounded-2xl p-4 animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-ember shadow-ember text-[11px]">✓</div>
            <div>
              <div className="text-[14.5px] font-medium text-foreground">{p.title}</div>
              <div className="text-[12px] text-muted-foreground">{p.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Plans */}
      <div className="mt-8 grid grid-cols-2 gap-3 px-6">
        <div className="glass relative rounded-3xl p-5 animate-fade-up">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Monthly</div>
          <div className="mt-3 font-serif text-[34px] leading-none">$14<span className="text-[16px] text-muted-foreground">/mo</span></div>
          <div className="mt-1 text-[11px] text-muted-foreground">Cancel anytime</div>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-ember p-5 shadow-ember animate-fade-up delay-100">
          <div className="absolute inset-0 noise opacity-30" />
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/80">Annual · save 50%</div>
            <div className="mt-3 font-serif text-[34px] leading-none text-primary-foreground">$84<span className="text-[16px] text-primary-foreground/70">/yr</span></div>
            <div className="mt-1 text-[11px] text-primary-foreground/80">$7 / month</div>
          </div>
        </div>
      </div>

      <div className="mt-8 px-6 pb-12 animate-fade-up delay-300">
        <button className="flex h-14 w-full items-center justify-center rounded-2xl bg-foreground text-background text-[15px] font-medium tracking-wide active:scale-[0.98] transition-transform">
          Start 7 days free
        </button>
        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
          No charge today · Cancel in one tap
        </p>
      </div>
    </PhoneFrame>
  );
}
