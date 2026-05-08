import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import silhouette from "@/assets/ember-silhouette.jpg";
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
  component: Home,
});

const features = [
  {
    to: "/analyst" as const,
    eyebrow: "AI Analyst",
    title: "Decode your last conversation",
    sub: "Upload screenshots. I'll read between the lines.",
    accent: "from-[oklch(0.55_0.22_25)] to-[oklch(0.35_0.18_18)]",
  },
  {
    to: "/text" as const,
    eyebrow: "What to text",
    title: "Break the silence — perfectly",
    sub: "Psychologically optimized opening lines.",
    accent: "from-[oklch(0.45_0.18_30)] to-[oklch(0.25_0.10_25)]",
  },
  {
    to: "/simulator" as const,
    eyebrow: "Ex Simulator",
    title: "Rehearse the conversation",
    sub: "Talk to a model of them before the real thing.",
    accent: "from-[oklch(0.40_0.15_15)] to-[oklch(0.20_0.08_20)]",
  },
  {
    to: "/recovery" as const,
    eyebrow: "Recovery Mode",
    title: "Become the person they regret losing",
    sub: "30-day transformation arc.",
    accent: "from-[oklch(0.50_0.20_30)] to-[oklch(0.30_0.15_25)]",
  },
  {
    to: "/insights" as const,
    eyebrow: "Insights",
    title: "Why attraction really fades",
    sub: "Attachment theory in plain language.",
    accent: "from-[oklch(0.42_0.16_20)] to-[oklch(0.22_0.08_18)]",
  },
];

function Home() {
  const { pathname } = useLocation();
  return (
    <PhoneFrame>
      <EmberBg />
      <StatusBar />

      {/* Header */}
      <header className="px-6 pt-6 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Tuesday, evening</div>
            <h1 className="mt-1 font-serif text-[34px] leading-tight text-gradient-fade">Hello, soft heart.</h1>
          </div>
          <Link to="/premium" className="grid h-10 w-10 place-items-center rounded-full glass">
            <span className="text-[14px]">✦</span>
          </Link>
        </div>
      </header>

      {/* Today's reading */}
      <section className="mt-6 px-6 animate-fade-up delay-100">
        <Link to="/insights" className="block">
          <div className="relative overflow-hidden rounded-3xl shadow-deep">
            <img
              src={silhouette}
              alt="A figure rim-lit in red"
              width={1024}
              height={1024}
              loading="lazy"
              className="h-[260px] w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary/90">Tonight's reading · 4 min</div>
              <h2 className="mt-2 font-serif text-[26px] leading-tight text-foreground">
                The science of why they're <span className="italic">thinking about you</span> right now
              </h2>
            </div>
          </div>
        </Link>
      </section>

      {/* Recovery streak */}
      <section className="mt-6 px-6 animate-fade-up delay-200">
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Recovery</div>
              <div className="mt-1 font-serif text-[28px] leading-none">Day 12</div>
            </div>
            <div className="relative grid h-14 w-14 place-items-center">
              <div className="absolute inset-0 rounded-full bg-gradient-ember opacity-20 animate-pulse-glow" />
              <span className="relative font-serif text-[22px] text-gradient-ember">40%</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full ${i < 12 ? "bg-gradient-ember" : "bg-foreground/8"}`}
              />
            ))}
          </div>
          <Link
            to="/recovery"
            className="mt-4 flex items-center justify-between text-[13px] font-medium text-foreground/90"
          >
            <span>Today's ritual: write one thing you're proud of</span>
            <span className="text-primary">→</span>
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section className="mt-8 px-6 pb-32">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="font-serif text-[22px]">Tools for the in-between</h3>
          <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">5 paths</span>
        </div>
        <div className="space-y-3">
          {features.map((f, idx) => (
            <Link
              key={f.to}
              to={f.to}
              className="group relative block overflow-hidden rounded-3xl glass p-5 transition-all duration-500 active:scale-[0.99] animate-fade-up"
              style={{ animationDelay: `${300 + idx * 80}ms` }}
            >
              <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${f.accent} opacity-50 blur-2xl transition-opacity group-hover:opacity-80`} />
              <div className="relative">
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary/80">{f.eyebrow}</div>
                <h4 className="mt-2 font-serif text-[22px] leading-tight text-foreground">{f.title}</h4>
                <p className="mt-1.5 text-[13px] text-muted-foreground">{f.sub}</p>
                <div className="mt-4 flex items-center gap-1.5 text-[12px] font-medium text-foreground/90">
                  Open <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom nav */}
      <BottomNav pathname={pathname} />
    </PhoneFrame>
  );
}

export function BottomNav({ pathname }: { pathname: string }) {
  const items = [
    { to: "/app" as const, label: "Home", icon: "◉" },
    { to: "/analyst" as const, label: "Analyze", icon: "◈" },
    { to: "/simulator" as const, label: "Talk", icon: "✦" },
    { to: "/recovery" as const, label: "Heal", icon: "◯" },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[440px] px-4 pb-5">
      <div className="glass-strong rounded-[28px] p-1.5">
        <div className="flex items-center justify-between">
          {items.map((it) => {
            const active = pathname === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2.5 transition-all ${
                  active ? "bg-gradient-ember text-primary-foreground shadow-ember" : "text-muted-foreground"
                }`}
              >
                <span className="text-[14px]">{it.icon}</span>
                <span className="text-[10px] uppercase tracking-[0.2em]">{it.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
