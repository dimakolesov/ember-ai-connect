import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Home,
  MessageCircleHeart,
  Compass,
  Users,
  ImagePlus,
  Lock,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { EmberBg } from "@/components/EmberBg";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Ember — Who's right in your chat?" },
      { name: "description", content: "Upload your chat screenshot and find out who's right, how interested your partner is, and what to do next." },
    ],
  }),
  component: HomePage,
});


type Metric = { label: string; value: number; note: string };

const UNLOCK_KEY = "ember_unlocked";

function buildMetrics(): Metric[] {
  const r = (min: number, max: number) => Math.round(min + Math.random() * (max - min));
  return [
    { label: "Their interest", value: r(48, 82), note: "Still emotionally engaged" },
    { label: "Emotional distance", value: r(35, 70), note: "Protective, not indifferent" },
    { label: "Who's right (you)", value: r(52, 78), note: "Your read of the facts holds up" },
    { label: "Tension level", value: r(40, 75), note: "Escalation is avoidable" },
    { label: "Reconnection window", value: r(55, 85), note: "Open for the next few weeks" },
  ];
}

function HomePage() {
  const { pathname } = useLocation();
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [situation, setSituation] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<Metric[] | null>(null);
  const [probability, setProbability] = useState(0);
  const [paywall, setPaywall] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(UNLOCK_KEY) === "1") setUnlocked(true);
  }, []);

  const onFile = (f?: File | null) => {
    if (!f) return;
    setPreview(URL.createObjectURL(f));
  };

  const analyze = () => {
    if (!preview && situation.trim().length < 4) {
      toast("Add a screenshot or describe the situation first");
      return;
    }
    setAnalyzing(true);
    setTimeout(() => {
      setProbability(Math.floor(87 + Math.random() * 12)); // 87–98%
      setMetrics(buildMetrics());
      setAnalyzing(false);
    }, 2000);
  };

  const pay = () => {
    localStorage.setItem(UNLOCK_KEY, "1");
    setUnlocked(true);
    setPaywall(false);
    toast.success("Ember unlocked", { description: "Your full report is ready below." });
  };

  return (
    <PhoneFrame>
      <EmberBg />
      <StatusBar />

      <header className="px-7 pt-8 animate-fade-up">
        <div className="text-[10px] uppercase tracking-[0.4em] text-primary/90">Chat analysis</div>
        <h1 className="mt-3 font-serif text-[38px] font-light leading-[1.05] text-gradient-fade">
          Find out <span className="text-gradient-ember">who's right</span> between you two.
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          Upload a screenshot of your conversation. Ember reads tone, timing and subtext — and tells you what's really going on.
        </p>
      </header>

      {/* Upload */}
      <section className="mt-7 px-7 animate-fade-up delay-100">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative w-full overflow-hidden rounded-[28px] border border-dashed border-primary/35 bg-card/30 backdrop-blur-xl transition-colors hover:border-primary/60"
        >
          {preview ? (
            <img src={preview} alt="Chat screenshot to analyze" className="max-h-[320px] w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-12">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-ember shadow-ember">
                <ImagePlus className="h-5 w-5 text-primary-foreground" />
              </span>
              <div className="mt-4 font-serif text-[19px]">Upload chat screenshot</div>
              <div className="mt-1 text-[12px] text-muted-foreground">PNG or JPG · your data stays private</div>
            </div>
          )}
        </button>
        {preview && (
          <button
            onClick={() => setPreview(null)}
            className="mt-3 text-[12px] text-muted-foreground underline underline-offset-4"
          >
            Remove screenshot
          </button>
        )}
      </section>

      {/* Describe */}
      <section className="mt-4 px-7 animate-fade-up delay-200">
        <div className="rounded-[28px] border border-border/60 bg-card/30 p-5 backdrop-blur-xl">
          <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">Or describe it</div>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={4}
            placeholder="What happened between you? Write it in your own words…"
            className="mt-3 w-full resize-none bg-transparent text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mt-5 px-7">
        <button
          onClick={analyze}
          disabled={analyzing}
          className="flex h-[54px] w-full items-center justify-center rounded-full bg-gradient-ember text-[14px] font-medium text-primary-foreground shadow-ember transition-transform active:scale-[0.98] disabled:opacity-70"
        >
          {analyzing ? "Reading between the lines…" : "Analyze"}
        </button>
      </section>

      {/* Results */}
      {metrics && (
        <section className="mt-8 px-7 animate-fade-up">
          <div className="rounded-[28px] border border-primary/25 bg-card/40 p-6 text-center backdrop-blur-xl">
            <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
              Chance this can be fixed with Ember
            </div>
            <div className="mt-2 font-serif text-[68px] font-light leading-none text-gradient-ember">
              {probability}%
            </div>
            <p className="mt-3 text-[13px] text-muted-foreground">
              Based on tone, response timing and attachment signals in your conversation.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {metrics.map((m, i) => (
              <div
                key={m.label}
                className="rounded-[22px] border border-border/60 bg-card/30 p-4 backdrop-blur-xl animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{m.label}</span>
                  <span className="font-serif text-[18px] text-gradient-ember">{m.value}%</span>
                </div>
                <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-foreground/10">
                  <div className="h-full bg-gradient-ember transition-all duration-1000" style={{ width: `${m.value}%` }} />
                </div>
                <div className="mt-2 text-[12px] text-muted-foreground">{m.note}</div>
              </div>
            ))}
          </div>

          {!unlocked && (
            <button
              onClick={() => setPaywall(true)}
              className="mt-6 flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-foreground text-[14px] font-medium text-background transition-transform active:scale-[0.98]"
            >
              <Lock className="h-4 w-4" /> Get the solution to your problem
            </button>
          )}
        </section>
      )}

      {/* Full report after payment */}
      {unlocked && metrics && (
        <section className="mt-6 px-7 animate-fade-up">
          <div className="rounded-[28px] border border-border/60 bg-card/40 p-6 backdrop-blur-xl">
            <div className="text-[10px] uppercase tracking-[0.35em] text-primary/90">Full report</div>
            <h2 className="mt-3 font-serif text-[24px] leading-tight">
              They're not indifferent — they're guarding themselves.
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              The delays before short replies are regulation, not rejection. Your messages carry more emotional weight
              than theirs, which pushes them into an avoidant loop: the harder you reach, the more they retreat to feel safe.
              The good news is the door is still open — the tone is defensive, not closed.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Pause for 4–6 days. No explanations, no check-ins — let the pressure drop.",
                "Reopen with one light, specific memory. No questions about \"us\".",
                "Match their message length for the first three exchanges.",
                "Move the hard conversation to voice or a Circle — text amplifies blame.",
                "Run one rehearsal in the simulator before the real talk.",
              ].map((s, i) => (
                <div key={i} className="flex gap-3 rounded-2xl border border-border/50 bg-background/30 p-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-[13px] leading-relaxed text-foreground/90">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Paywall */}
      {paywall && (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-[440px] items-end bg-background/70 backdrop-blur-md">
          <div className="w-full rounded-t-[32px] border-t border-border/70 bg-card/95 p-7 pb-10 shadow-deep animate-fade-up">
            <div className="flex items-start justify-between">
              <div className="text-[10px] uppercase tracking-[0.35em] text-primary/90">Unlock Ember</div>
              <button onClick={() => setPaywall(false)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full border border-border/60">
                <X className="h-4 w-4" />
              </button>
            </div>

            <h2 className="mt-4 font-serif text-[30px] leading-[1.05]">
              $30<span className="text-[15px] text-muted-foreground"> / month</span>
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              Unlock the entire app and get a <span className="text-foreground">big, detailed report about your problem and
              your relationship</span> — what's really happening, why, and exactly what to do next.
            </p>

            <div className="mt-5 space-y-2.5">
              {[
                "Full written report on your chat and your relationship",
                "Step-by-step recovery and reconnection plan",
                "Unlimited chat analyses",
                "All tools: Analyst, Compose, Simulator, Circles, Recovery",
              ].map((b) => (
                <div key={b} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-[13px] text-foreground/90">{b}</span>
                </div>
              ))}
            </div>

            <button
              onClick={pay}
              className="mt-6 flex h-[54px] w-full items-center justify-center rounded-full bg-gradient-ember text-[14px] font-medium text-primary-foreground shadow-ember active:scale-[0.98]"
            >
              Unlock for $30 / month
            </button>
            <div className="mt-3 text-center text-[11px] text-muted-foreground">Cancel anytime</div>
          </div>
        </div>
      )}

      {unlocked && <BottomNav pathname={pathname} />}
    </PhoneFrame>
  );
}

export function BottomNav({ pathname }: { pathname: string }) {
  const items = [
    { to: "/app" as const, label: "Home", Icon: Home },
    { to: "/circles" as const, label: "Circles", Icon: Users },
    { to: "/simulator-setup" as const, label: "Talk", Icon: MessageCircleHeart },
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
                {active && <span className="absolute inset-0 -z-0 rounded-full bg-gradient-ember shadow-ember" />}
                <Icon className="relative h-[18px] w-[18px]" strokeWidth={1.6} />
                <span className="relative text-[9px] uppercase tracking-[0.25em]">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
