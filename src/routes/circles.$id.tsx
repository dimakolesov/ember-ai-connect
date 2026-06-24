import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Shield, Lock, Users, FileText, Sparkles, X } from "lucide-react";
import { EmberBg } from "@/components/EmberBg";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { getCircle, upsertCircle, uid, type CircleSession, type Channel, type CircleMessage } from "@/lib/ember-store";
import { toast } from "sonner";

export const Route = createFileRoute("/circles/$id")({
  component: CircleRoom,
});

const INTAKE_STEPS = [
  { key: "goals", q: "Before we open the room — what's the one outcome that would make this worth it for you?" },
  { key: "expectations", q: "What are you afraid the other side might do, and how would you like me to handle it if they do?" },
  { key: "consent", q: "I'll keep things slow, mirror both sides, and pause anything that turns into pressure. Ready to open the room?" },
] as const;

function CircleRoom() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [s, setS] = useState<CircleSession | undefined>(undefined);
  const [tab, setTab] = useState<Channel>("group");
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [intakeStep, setIntakeStep] = useState(0);
  const [intakeAnswer, setIntakeAnswer] = useState("");
  const [showReport, setShowReport] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const found = getCircle(id);
    if (!found) { toast("Session not found"); nav({ to: "/circles" }); return; }
    setS(found);
  }, [id, nav]);

  useEffect(() => { scroll.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [s?.messages.length, tab, typing, intakeStep]);

  if (!s) return null;

  const persist = (next: CircleSession) => { setS(next); upsertCircle(next); };

  const aiReply = (channel: Channel, text: string, delay = 1200) => {
    setTyping(true);
    setTimeout(() => {
      setS((curr) => {
        if (!curr) return curr;
        const next = { ...curr, messages: [...curr.messages, { id: uid(), channel, from: "ai" as const, text, at: Date.now() }] };
        upsertCircle(next);
        return next;
      });
      setTyping(false);
    }, delay);
  };

  const submitIntake = () => {
    if (!intakeAnswer.trim() && INTAKE_STEPS[intakeStep].key !== "consent") return;
    const key = INTAKE_STEPS[intakeStep].key;
    const next = { ...s };
    if (key === "consent") next.intake.consent = true;
    else (next.intake as any)[key] = intakeAnswer.trim();
    if (intakeStep < INTAKE_STEPS.length - 1) {
      setIntakeStep(intakeStep + 1);
      setIntakeAnswer("");
      persist(next);
    } else {
      next.status = "active";
      const opening: CircleMessage = {
        id: uid(), channel: "group", from: "ai",
        text: `Welcome. Three rules for this room: one voice at a time, no diagnosing the other, and we pause if it gets sharp. The goal we're holding: "${next.goal}". I'll open — who wants to speak first?`,
        at: Date.now(),
      };
      next.messages = [...next.messages, opening];
      persist(next);
      setIntakeAnswer("");
      setIntakeStep(0);
    }
  };

  const sendUser = () => {
    if (!input.trim()) return;
    const text = input.trim();
    const next = { ...s, messages: [...s.messages, { id: uid(), channel: tab, from: "you" as const, text, at: Date.now() }] };
    persist(next);
    setInput("");

    if (tab === "private") {
      const reply = privateReplies[Math.floor(Math.random() * privateReplies.length)];
      aiReply("private", reply, 1100);
    } else {
      const reply = facilitatorReplies[Math.floor(Math.random() * facilitatorReplies.length)];
      aiReply("group", reply, 1400);
    }
  };

  const finish = () => {
    const themesPool = ["Unspoken expectations", "Reassurance vs. space", "Pacing of repair", "Old hurts surfacing", "Boundaries"];
    const recsPool = [
      "Schedule a follow-up in 48 hours to revisit one specific point.",
      "Write one sentence each before next session: 'What I need from you is…'",
      "Practice the pause technique when emotional temperature rises above a 7.",
      "Name your softer want underneath each complaint.",
    ];
    const themes = pickN(themesPool, 3);
    const recs = pickN(recsPool, 3);
    const groupCount = s.messages.filter((m) => m.channel === "group").length;
    const report = {
      summary: `Across ${groupCount} exchanges, the room moved from defense to curiosity. You held your goal — "${s.goal}" — and the facilitator intervened to keep pace humane.`,
      themes,
      emotions: "Opened tense, softened around the middle, closed with cautious warmth.",
      recommendations: recs,
      at: Date.now(),
    };
    const next: CircleSession = { ...s, status: "completed", report };
    persist(next);
    setShowReport(true);
    toast.success("Report ready");
  };

  // Intake mode
  if (s.status === "intake") {
    const step = INTAKE_STEPS[intakeStep];
    return (
      <PhoneFrame>
        <EmberBg />
        <StatusBar />
        <header className="flex items-center justify-between px-6 pt-6">
          <Link to="/circles" className="grid h-10 w-10 place-items-center rounded-full glass">←</Link>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary/90">Private intake</div>
          <div className="w-10" />
        </header>

        <section className="flex flex-1 flex-col px-7 pt-6">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{s.title}</div>
          <h2 className="mt-1 font-serif text-[24px] leading-tight">Before we open the room</h2>

          <div className="mt-6 flex gap-1">
            {INTAKE_STEPS.map((_, i) => (
              <span key={i} className={`h-[2px] flex-1 rounded-full ${i <= intakeStep ? "bg-gradient-ember" : "bg-foreground/15"}`} />
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl animate-fade-up">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-primary/90">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-ember text-[10px] text-primary-foreground">E</span>
              Facilitator
            </div>
            <p className="mt-3 font-serif text-[18px] leading-snug text-foreground">{step.q}</p>
          </div>

          {step.key !== "consent" ? (
            <textarea value={intakeAnswer} onChange={(e) => setIntakeAnswer(e.target.value)} rows={4} placeholder="Type freely…" className="mt-5 w-full resize-none rounded-3xl border border-border/60 bg-background/40 px-4 py-3 text-[14px] outline-none focus:border-primary/60" />
          ) : (
            <div className="mt-5 text-[12px] text-muted-foreground">Tap "I'm ready" to open the group channel.</div>
          )}

          <button onClick={submitIntake} className="mt-6 w-full rounded-full bg-gradient-ember py-3.5 text-[14px] font-medium text-primary-foreground shadow-ember">
            {intakeStep < INTAKE_STEPS.length - 1 ? "Continue" : "I'm ready — open the room"}
          </button>
        </section>
      </PhoneFrame>
    );
  }

  // Active / completed chat
  const visible = s.messages.filter((m) => m.channel === tab);

  return (
    <PhoneFrame>
      <EmberBg />
      <StatusBar />

      <header className="flex items-center justify-between px-6 pt-6">
        <Link to="/circles" className="grid h-10 w-10 place-items-center rounded-full glass">←</Link>
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gradient-ember shadow-ember">
            <div className="absolute inset-0 animate-pulse-glow" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-[15px]">{s.title}</div>
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-[0.25em] text-primary/80"><Shield className="h-3 w-3" /> Facilitator</div>
          </div>
        </div>
        <button onClick={finish} disabled={s.status === "completed"} className="grid h-10 w-10 place-items-center rounded-full glass disabled:opacity-40" aria-label="Finish & report">
          <FileText className="h-4 w-4" />
        </button>
      </header>

      <div className="mt-4 px-6">
        <div className="flex rounded-full border border-border/60 bg-background/50 p-1 backdrop-blur-xl">
          <TabBtn active={tab === "group"} onClick={() => setTab("group")} icon={<Users className="h-3.5 w-3.5" />} label="Group" />
          <TabBtn active={tab === "private"} onClick={() => setTab("private")} icon={<Lock className="h-3.5 w-3.5" />} label="Whisper" />
        </div>
        {tab === "private" && (
          <p className="mt-2 px-2 text-[10px] text-muted-foreground">Private channel. The facilitator hears you here, but never repeats it in the group.</p>
        )}
      </div>

      <div ref={scroll} className="flex-1 space-y-3 overflow-y-auto px-6 pt-4 pb-40">
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 px-4 py-6 text-center text-[12px] text-muted-foreground">
            {tab === "private" ? "Say what you couldn't say out loud." : "The room is open. Speak when ready."}
          </div>
        )}
        {visible.map((m) => <Bubble key={m.id} m={m} />)}
        {typing && <div className="text-[11px] italic text-muted-foreground">Facilitator is typing…</div>}
      </div>

      {s.status === "active" && (
        <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[440px] px-5 pb-5">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 backdrop-blur-2xl">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendUser()}
              placeholder={tab === "private" ? "Whisper to the facilitator…" : "Speak to the room…"}
              className="flex-1 bg-transparent text-[14px] outline-none"
            />
            <button onClick={sendUser} className="grid h-9 w-9 place-items-center rounded-full bg-gradient-ember text-primary-foreground shadow-ember"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {s.status === "completed" && !showReport && (
        <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[440px] px-5 pb-5">
          <button onClick={() => setShowReport(true)} className="w-full rounded-full bg-gradient-ember py-3 text-[13px] font-medium text-primary-foreground shadow-ember">View report</button>
        </div>
      )}

      {showReport && s.report && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-up" onClick={() => setShowReport(false)}>
          <div className="max-h-[88vh] w-full max-w-[440px] overflow-y-auto rounded-t-[32px] border border-border/60 bg-card/95 p-6 backdrop-blur-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-foreground/20" />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-primary/90">Session report</div>
                <h3 className="mt-1 font-serif text-[24px]">{s.title}</h3>
              </div>
              <button onClick={() => setShowReport(false)} className="grid h-9 w-9 place-items-center rounded-full glass"><X className="h-4 w-4" /></button>
            </div>

            <ReportBlock title="Summary"><p className="text-[13px] leading-relaxed text-foreground/85">{s.report.summary}</p></ReportBlock>
            <ReportBlock title="Key themes">
              <ul className="space-y-1.5">
                {s.report.themes.map((t) => <li key={t} className="flex items-start gap-2 text-[13px] text-foreground/85"><Sparkles className="mt-0.5 h-3 w-3 text-primary" /> {t}</li>)}
              </ul>
            </ReportBlock>
            <ReportBlock title="Emotional arc"><p className="text-[13px] leading-relaxed text-foreground/85">{s.report.emotions}</p></ReportBlock>
            <ReportBlock title="Recommendations">
              <ul className="space-y-1.5">
                {s.report.recommendations.map((t) => <li key={t} className="text-[13px] leading-relaxed text-foreground/85">— {t}</li>)}
              </ul>
            </ReportBlock>

            <button onClick={() => { toast.success("Saved to your library"); setShowReport(false); }} className="mt-6 w-full rounded-full bg-gradient-ember py-3 text-[13px] font-medium text-primary-foreground shadow-ember">Save report</button>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-[11px] uppercase tracking-[0.2em] transition-colors ${active ? "text-primary-foreground" : "text-muted-foreground"}`}>
      {active && <span className="absolute inset-0 -z-0 rounded-full bg-gradient-ember shadow-ember" />}
      <span className="relative">{icon}</span>
      <span className="relative">{label}</span>
    </button>
  );
}

function Bubble({ m }: { m: CircleMessage }) {
  if (m.from === "you") {
    return (
      <div className="flex justify-end animate-fade-up">
        <div className="max-w-[78%] rounded-2xl rounded-br-md bg-gradient-ember px-4 py-2.5 text-[14px] text-primary-foreground shadow-ember">{m.text}</div>
      </div>
    );
  }
  if (m.from === "ai") {
    return (
      <div className="flex items-start gap-2 animate-fade-up">
        <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-ember text-[10px] text-primary-foreground">E</div>
        <div className="max-w-[78%] rounded-2xl rounded-tl-md border border-primary/30 bg-card/60 px-4 py-2.5 text-[14px] text-foreground/90 backdrop-blur-xl">
          <div className="mb-0.5 text-[9px] uppercase tracking-[0.25em] text-primary/80">Facilitator</div>
          {m.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 animate-fade-up">
      <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-foreground/15 text-[10px]">·</div>
      <div className="max-w-[78%] rounded-2xl rounded-tl-md border border-border/60 bg-card/40 px-4 py-2.5 text-[14px] text-foreground/85 backdrop-blur-xl">{m.text}</div>
    </div>
  );
}

function ReportBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function pickN<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

const facilitatorReplies = [
  "I hear that. Before we move, let me reflect what I caught — is there a softer want underneath it?",
  "Let's slow down. The other side gets a turn here. What would you like them to know first?",
  "That landed sharper than the moment can hold. Try again, this time with what you need, not what they did wrong.",
  "Noted. I'm parking that and we'll come back. Right now, one breath and one sentence.",
];
const privateReplies = [
  "Stay with me. You don't have to say all of that out loud — what's the one piece worth bringing into the room?",
  "Heard. I won't repeat any of this. When we go back, I'll steer toward your goal without naming what you told me here.",
  "That's a real fear. Want me to introduce it for you, framed gently, when there's an opening?",
  "Take a beat. I'll keep the room slow until you're ready to come back in.",
];
