import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { Home, Sparkles, MessageCircleHeart, Compass, Crown, ArrowUpRight } from "lucide-react";
import { EmberBg } from "@/components/EmberBg";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Ember — Home" },
      { name: "description", content: "Your daily emotional intelligence." },
    ],
  }),
  component: HomePage,
});

const features = [
  { to: "/circles" as const, eyebrow: "Circles", title: "Hard talks, mediated", sub: "AI facilitator + whisper channel." },
  { to: "/analyst" as const, eyebrow: "Analyst", title: "Decode your last conversation", sub: "Read between the lines." },
  { to: "/text" as const, eyebrow: "Compose", title: "Break the silence — perfectly", sub: "Calibrated opening lines." },
  { to: "/simulator-setup" as const, eyebrow: "Rehearse", title: "Talk to a model of them", sub: "Tune the partner. Run the rep." },
  { to: "/recovery" as const, eyebrow: "Recovery", title: "Become someone they regret losing", sub: "30-day transformation arc." },
  { to: "/insights" as const, eyebrow: "Insight", title: "Why attraction really fades", sub: "Attachment theory, in plain language." },
];

function HomePage() {
  const { pathname } = useLocation();
  return (
    <PhoneFrame>
      <EmberBg />
      <StatusBar />

      {/* Header */}
      <header className="px-7 pt-8 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Tuesday · evening</div>
            <h1 className="mt-2 font-serif text-[36px] leading-[1.05] text-gradient-fade">
              Hello, <span className="italic">soft heart</span>.
            </h1>
          </div>
          <Link to="/premium" className="grid h-10 w-10 place-items-center rounded-full border border-border/60 text-foreground/80 transition-colors hover:border-primary/50 hover:text-primary">
            <Crown className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Tonight's reading — no image, pure type */}
      <section className="mt-7 px-7 animate-fade-up delay-100">
        <Link to="/insights" className="block">
          <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/40 p-6 backdrop-blur-xl transition-colors hover:border-primary/30">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/12 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary/90">
                <Sparkles className="h-3 w-3" /> Tonight's reading · 4 min
              </div>
              <h2 className="mt-3 font-serif text-[26px] leading-[1.1] text-foreground">
                The science of why they're <span className="italic text-gradient-ember">thinking about you</span> right now
              </h2>
              <div className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground/85">
                Read <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Recovery — minimal */}
      <section className="mt-4 px-7 animate-fade-up delay-200">
        <div className="rounded-[28px] border border-border/60 bg-card/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Recovery</div>
              <div className="mt-2 font-serif text-[30px] leading-none">
                Day 12 <span className="text-muted-foreground/60">/ 30</span>
              </div>
            </div>
            <span className="font-serif text-[26px] text-gradient-ember">40%</span>
          </div>
          <div className="mt-5 h-[3px] w-full overflow-hidden rounded-full bg-foreground/8">
            <div className="h-full bg-gradient-ember" style={{ width: "40%" }} />
          </div>
          <Link to="/recovery" className="mt-5 flex items-center justify-between text-[13px] text-foreground/85">
            <span>Today's ritual: write one thing you're proud of</span>
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </Link>
        </div>
      </section>

      {/* Features list */}
      <section className="mt-8 px-7 pb-36">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="font-serif text-[20px] text-foreground/90">Tools for the in-between</h3>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">6</span>
        </div>
        <div className="divide-y divide-border/50 overflow-hidden rounded-[28px] border border-border/60 bg-card/30 backdrop-blur-xl">
          {features.map((f, idx) => (
            <Link
              key={f.to}
              to={f.to}
              className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-foreground/5 animate-fade-up"
              style={{ animationDelay: `${260 + idx * 60}ms` }}
            >
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.35em] text-primary/90">{f.eyebrow}</div>
                <h4 className="mt-1 font-serif text-[19px] leading-tight text-foreground">{f.title}</h4>
                <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{f.sub}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      <BottomNav pathname={pathname} />
    </PhoneFrame>
  );
}

export function BottomNav({ pathname }: { pathname: string }) {
  const items = [
    { to: "/app" as const, label: "Home", Icon: Home },
    { to: "/analyst" as const, label: "Analyze", Icon: Sparkles },
    { to: "/simulator" as const, label: "Talk", Icon: MessageCircleHeart },
    { to: "/recovery" as const, label: "Heal", Icon: Compass },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[440px] px-5 pb-6">
      <div className="rounded-full border border-border/70 bg-background/70 p-1.5 shadow-deep backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          {items.map(({ to, label, Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                aria-label={label}
                className={`group relative flex flex-1 flex-col items-center gap-1 rounded-full py-2.5 transition-all ${
                  active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 -z-0 rounded-full bg-gradient-ember shadow-ember" />
                )}
                <Icon className={`relative h-[18px] w-[18px] ${active ? "" : ""}`} strokeWidth={1.6} />
                <span className="relative text-[9px] uppercase tracking-[0.25em]">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
