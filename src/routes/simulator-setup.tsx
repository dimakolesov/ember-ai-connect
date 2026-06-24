import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Upload, Sparkles, ChevronDown, Check } from "lucide-react";
import { EmberBg } from "@/components/EmberBg";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { loadSetup, saveSetup, DEFAULT_SETUP, type SimSetup } from "@/lib/ember-store";
import { toast } from "sonner";

export const Route = createFileRoute("/simulator-setup")({
  head: () => ({ meta: [{ title: "Rehearsal setup — Ember" }] }),
  component: SetupPage,
});

const CONTEXTS = ["App match", "Mutual friend group", "Coworker", "Old acquaintance", "Existing crush"];
const STYLES = ["Warm and expansive", "Dry and one-word", "Playful, teasing", "Slow to reply", "Reserved", "Ironic"];
const INTEREST = ["Into it", "Lukewarm", "Mixed signals", "Cold at first, opens up", "Not interested"];
const ATTACH = ["Secure", "Anxious", "Avoidant"];
const MOMENTS = [
  "Opening message", "Keep the thread alive", "Flirt", "Ask them out",
  "Revive a dead chat", "Read, no reply", "The 'what are we' talk",
  "Show vulnerability", "Set a boundary", "End it well",
];
const SKILLS = ["Brevity", "Playfulness", "Good questions", "Vulnerability", "Reading subtext", "Timing", "Confidence", "No double-texting", "Reset the tempo", "Calibrated escalation"];
const CURVES = ["Suddenly cools off", "Replies a day later", "Drops a dry 'haha'", "Changes the subject", "Mentions their ex", "Gets 'busy'"];
const EMOJIS = ["None", "Sparse", "Generous", "Ironic"];

function SetupPage() {
  const [s, setS] = useState<SimSetup>(DEFAULT_SETUP);
  const [recording, setRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [paste, setPaste] = useState("");
  const nav = useNavigate();
  const recTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setS(loadSetup()); }, []);

  const update = (patch: Partial<SimSetup>) => setS((curr) => {
    const next = { ...curr, ...patch };
    saveSetup(next);
    return next;
  });
  const updateWho = (patch: Partial<SimSetup["who"]>) => update({ who: { ...s.who, ...patch } });
  const updateRealism = (patch: Partial<SimSetup["realism"]>) => update({ realism: { ...s.realism, ...patch } });
  const updateCoach = (patch: Partial<SimSetup["coach"]>) => update({ coach: { ...s.coach, ...patch } });

  const toggleSkill = (k: string) => {
    const has = s.skills.includes(k);
    let next = has ? s.skills.filter((x) => x !== k) : [...s.skills, k];
    if (next.length > 2) next = next.slice(-2);
    update({ skills: next });
  };

  const startVoice = () => {
    setRecording(true);
    setVoiceText("Listening…");
    recTimer.current = setTimeout(() => {
      setRecording(false);
      const heard = "It's a guy from a friend's birthday last month. He's dry, replies slow, mixed signals. I want to ask him out without seeming thirsty.";
      setVoiceText(heard);
      // Parse heuristically
      update({
        who: { ...s.who, context: "Mutual friend group", style: "Slow to reply", interest: "Mixed signals", attachment: "Avoidant", backstory: heard },
        moment: "Ask them out",
        skills: ["Confidence", "Brevity"],
      });
      toast.success("Filled from your voice");
    }, 1800);
  };

  const calibrateFromPaste = () => {
    if (!paste.trim()) { toast("Paste a conversation first"); return; }
    // Simple heuristic style analysis
    const lines = paste.split("\n").filter(Boolean);
    const avgLen = lines.reduce((a, l) => a + l.length, 0) / Math.max(lines.length, 1);
    const style = avgLen < 25 ? "Dry and one-word" : avgLen < 60 ? "Reserved" : "Warm and expansive";
    const emojiRich = /[\u{1F300}-\u{1FAFF}]/u.test(paste);
    update({
      who: { ...s.who, style, backstory: `Calibrated from a real conversation (${lines.length} lines, ~${Math.round(avgLen)} chars/msg).` },
      realism: { ...s.realism, emoji: emojiRich ? "Generous" : "Sparse" },
      calibratedFrom: paste.slice(0, 600),
    });
    setPasteOpen(false);
    setPaste("");
    toast.success("Partner calibrated to that person");
  };

  return (
    <PhoneFrame>
      <EmberBg />
      <StatusBar />

      <header className="flex items-center justify-between px-6 pt-6">
        <Link to="/app" className="grid h-10 w-10 place-items-center rounded-full glass">←</Link>
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary/90">Rehearsal setup</div>
        <div className="w-10" />
      </header>

      <div className="px-7 pt-4 pb-36">
        <h1 className="font-serif text-[28px] leading-tight text-gradient-fade">Build the room.</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Six tuners. The closer to truth, the realer the rep.</p>

        {/* Killer feature row */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={startVoice} disabled={recording} className={`flex items-center gap-2 rounded-2xl border p-3 text-left text-[12px] backdrop-blur-xl transition-all ${recording ? "border-primary/70 bg-primary/10 animate-pulse" : "border-border/60 bg-card/40 hover:border-primary/40"}`}>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-ember text-primary-foreground"><Mic className="h-4 w-4" /></span>
            <span><span className="block font-medium text-foreground">Describe by voice</span><span className="text-muted-foreground">{recording ? "Listening…" : "Auto-fills setup"}</span></span>
          </button>
          <button onClick={() => setPasteOpen(true)} className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/40 p-3 text-left text-[12px] backdrop-blur-xl hover:border-primary/40">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-ember text-primary-foreground"><Upload className="h-4 w-4" /></span>
            <span><span className="block font-medium text-foreground">Calibrate from chat</span><span className="text-muted-foreground">Paste real messages</span></span>
          </button>
        </div>
        {voiceText && !recording && <div className="mt-2 rounded-xl border border-border/50 bg-card/30 p-3 text-[12px] italic text-foreground/80">"{voiceText}"</div>}

        {/* Block 1 */}
        <Block n={1} title="Who you're talking to">
          <Select label="Context" value={s.who.context} options={CONTEXTS} onChange={(v) => updateWho({ context: v })} />
          <Select label="Writing style" value={s.who.style} options={STYLES} onChange={(v) => updateWho({ style: v })} />
          <Chips label="Interest level" value={s.who.interest} options={INTEREST} onChange={(v) => updateWho({ interest: v })} />
          <Chips label="Emotional texture" value={s.who.attachment} options={ATTACH} onChange={(v) => updateWho({ attachment: v })} />
          <div>
            <FieldLabel>Backstory</FieldLabel>
            <textarea value={s.who.backstory} onChange={(e) => updateWho({ backstory: e.target.value })} rows={3} placeholder="A few details that matter…" className="mt-2 w-full resize-none rounded-2xl border border-border/60 bg-background/40 px-3 py-2 text-[13px] outline-none focus:border-primary/60" />
          </div>
        </Block>

        {/* Block 2 */}
        <Block n={2} title="The moment">
          <Select label="What this is" value={s.moment} options={MOMENTS} onChange={(v) => update({ moment: v })} />
        </Block>

        {/* Block 3 */}
        <Block n={3} title={`Skill you're training (${s.skills.length}/2)`}>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((k) => {
              const on = s.skills.includes(k);
              return (
                <button key={k} onClick={() => toggleSkill(k)} className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] transition-all ${on ? "border-primary bg-gradient-ember text-primary-foreground shadow-ember" : "border-border/60 text-foreground/80 hover:border-primary/40"}`}>
                  {on && <Check className="h-3 w-3" />}{k}
                </button>
              );
            })}
          </div>
        </Block>

        {/* Block 4 */}
        <Block n={4} title="Difficulty & curveballs">
          <div>
            <div className="flex items-center justify-between"><FieldLabel>Difficulty</FieldLabel><span className="text-[11px] text-primary">{["Easy","Soft","Real","Hard","Brutal"][s.difficulty-1]}</span></div>
            <input type="range" min={1} max={5} value={s.difficulty} onChange={(e) => update({ difficulty: parseInt(e.target.value) })} className="mt-2 w-full accent-[hsl(var(--primary))]" />
          </div>
          <div className="space-y-2">
            {CURVES.map((c) => (
              <Toggle key={c} label={c} value={!!s.curveballs[c]} onChange={(v) => update({ curveballs: { ...s.curveballs, [c]: v } })} />
            ))}
          </div>
        </Block>

        {/* Block 5 */}
        <Block n={5} title="Realism">
          <Toggle label="Typos" value={s.realism.typos} onChange={(v) => updateRealism({ typos: v })} />
          <div>
            <div className="flex items-center justify-between"><FieldLabel>Reply delay</FieldLabel><span className="text-[11px] text-primary">{["instant","quick","real","slow","glacial"][s.realism.delay-1]}</span></div>
            <input type="range" min={1} max={5} value={s.realism.delay} onChange={(e) => updateRealism({ delay: parseInt(e.target.value) })} className="mt-2 w-full accent-[hsl(var(--primary))]" />
          </div>
          <Toggle label="Short messages" value={s.realism.shortMessages} onChange={(v) => updateRealism({ shortMessages: v })} />
          <Chips label="Emoji style" value={s.realism.emoji} options={EMOJIS} onChange={(v) => updateRealism({ emoji: v })} />
        </Block>

        {/* Block 6 */}
        <Block n={6} title="Coach settings">
          <Chips label="Mode" value={s.coach.mode === "live" ? "Live hints" : "Debrief at end"} options={["Live hints", "Debrief at end"]} onChange={(v) => updateCoach({ mode: v === "Live hints" ? "live" : "after" })} />
          <Chips label="Help level" value={s.coach.helpLevel === "full" ? "Full" : s.coach.helpLevel === "hints" ? "Hints only" : "None"} options={["Full","Hints only","None"]} onChange={(v) => updateCoach({ helpLevel: v === "Full" ? "full" : v === "None" ? "none" : "hints" })} />
          <Chips label="Debrief depth" value={s.coach.depth === "every" ? "After each message" : "Final only"} options={["After each message", "Final only"]} onChange={(v) => updateCoach({ depth: v === "Final only" ? "final" : "every" })} />
        </Block>

        <button onClick={() => { saveSetup(s); nav({ to: "/simulator" }); }} className="mt-7 w-full rounded-full bg-gradient-ember py-3.5 text-[14px] font-medium text-primary-foreground shadow-ember">
          Begin rehearsal
        </button>
      </div>

      {pasteOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-up" onClick={() => setPasteOpen(false)}>
          <div className="w-full max-w-[440px] rounded-t-[32px] border border-border/60 bg-card/95 p-6 backdrop-blur-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-foreground/20" />
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary/90">Calibrate</div>
            <h3 className="mt-1 font-serif text-[22px]">Paste a real chat</h3>
            <p className="mt-1 text-[12px] text-muted-foreground">Ember reads their rhythm and rebuilds them for rehearsal.</p>
            <textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={8} placeholder="Paste messages, line by line…" className="mt-3 w-full resize-none rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-[13px] outline-none focus:border-primary/60" />
            <div className="mt-4 flex gap-2">
              <button onClick={() => setPasteOpen(false)} className="flex-1 rounded-full border border-border/60 py-3 text-[13px]">Cancel</button>
              <button onClick={calibrateFromPaste} className="flex-1 rounded-full bg-gradient-ember py-3 text-[13px] font-medium text-primary-foreground shadow-ember">Calibrate</button>
            </div>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}

function Block({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7 rounded-[24px] border border-border/60 bg-card/40 p-5 backdrop-blur-xl animate-fade-up">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-primary/90">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-ember text-[10px] text-primary-foreground">{n}</span>{title}
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{children}</label>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative mt-2">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none rounded-2xl border border-border/60 bg-background/40 px-3 py-2.5 pr-9 text-[13px] outline-none focus:border-primary/60">
          {options.map((o) => <option key={o} value={o} className="bg-background text-foreground">{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}

function Chips({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = o === value;
          return (
            <button key={o} onClick={() => onChange(o)} className={`rounded-full border px-3 py-1.5 text-[11px] transition-all ${on ? "border-primary bg-gradient-ember text-primary-foreground shadow-ember" : "border-border/60 text-foreground/80 hover:border-primary/40"}`}>{o}</button>
          );
        })}
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="flex w-full items-center justify-between rounded-2xl border border-border/60 bg-background/30 px-4 py-2.5 text-left text-[13px]">
      <span className="text-foreground/85">{label}</span>
      <span className={`relative h-5 w-9 rounded-full transition-colors ${value ? "bg-gradient-ember" : "bg-foreground/15"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}
