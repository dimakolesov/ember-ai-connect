import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Users, Sparkles, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { EmberBg } from "@/components/EmberBg";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { BottomNav } from "./app";
import { loadCircles, upsertCircle, uid, type CircleSession } from "@/lib/ember-store";
import { toast } from "sonner";

export const Route = createFileRoute("/circles")({
  head: () => ({ meta: [{ title: "Circles — Ember" }, { name: "description", content: "Mediated group conversations with an AI facilitator." }] }),
  component: CirclesPage,
});

function CirclesPage() {
  const [sessions, setSessions] = useState<CircleSession[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const nav = useNavigate();

  useEffect(() => setSessions(loadCircles()), []);

  const create = () => {
    if (!title.trim() || !goal.trim()) { toast("Add a title and a goal"); return; }
    const s: CircleSession = {
      id: uid(),
      title: title.trim(),
      goal: goal.trim(),
      status: "intake",
      createdAt: Date.now(),
      intake: { goals: "", expectations: "", consent: false },
      messages: [],
    };
    upsertCircle(s);
    toast.success("Circle created");
    nav({ to: "/circles/$id", params: { id: s.id } });
  };

  const active = sessions.filter((s) => s.status !== "completed");
  const done = sessions.filter((s) => s.status === "completed");

  return (
    <PhoneFrame>
      <EmberBg />
      <StatusBar />

      <header className="px-7 pt-8 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Circles</div>
            <h1 className="mt-2 font-serif text-[34px] leading-[1.05] text-gradient-fade">Hard talks, <span className="italic">held</span>.</h1>
            <p className="mt-2 max-w-xs text-[13px] text-muted-foreground">An AI facilitator mediates the room. You also get a private whisper channel.</p>
          </div>
          <Link to="/app" className="grid h-10 w-10 place-items-center rounded-full border border-border/60 text-foreground/80">←</Link>
        </div>
      </header>

      <section className="mt-6 px-7">
        <button
          onClick={() => setShowCreate(true)}
          className="flex w-full items-center justify-between rounded-[24px] border border-primary/40 bg-gradient-ember/15 p-5 text-left backdrop-blur-xl transition-all hover:border-primary/70 hover:shadow-ember"
        >
          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-primary/90">New session</div>
            <div className="mt-1 font-serif text-[20px]">Start a circle</div>
            <div className="text-[12px] text-muted-foreground">With a built-in facilitator</div>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-ember text-primary-foreground shadow-ember"><Plus className="h-4 w-4" /></span>
        </button>
      </section>

      <section className="mt-7 px-7 pb-36">
        <SectionTitle label="Active" count={active.length} />
        {active.length === 0 && <EmptyHint text="No circles in progress." />}
        <div className="mt-3 space-y-2">
          {active.map((s) => <CircleCard key={s.id} s={s} />)}
        </div>

        <div className="mt-7">
          <SectionTitle label="Completed" count={done.length} />
          {done.length === 0 && <EmptyHint text="Reports from finished sessions will appear here." />}
          <div className="mt-3 space-y-2">
            {done.map((s) => <CircleCard key={s.id} s={s} />)}
          </div>
        </div>
      </section>

      {showCreate && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-up" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-[440px] rounded-t-[32px] border border-border/60 bg-card/95 p-6 backdrop-blur-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-foreground/20" />
            <div className="text-[10px] uppercase tracking-[0.35em] text-primary/90">New circle</div>
            <h3 className="mt-1 font-serif text-[24px]">Set the room</h3>
            <label className="mt-4 block text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The unfinished conversation" className="mt-2 w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-[14px] outline-none focus:border-primary/60" />
            <label className="mt-4 block text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Goal</label>
            <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={3} placeholder="What do you want to leave with?" className="mt-2 w-full resize-none rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-[14px] outline-none focus:border-primary/60" />
            <div className="mt-5 flex gap-2">
              <button onClick={() => setShowCreate(false)} className="flex-1 rounded-full border border-border/60 py-3 text-[13px]">Cancel</button>
              <button onClick={create} className="flex-1 rounded-full bg-gradient-ember py-3 text-[13px] font-medium text-primary-foreground shadow-ember">Open</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav pathname="/circles" />
    </PhoneFrame>
  );
}

function SectionTitle({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-baseline justify-between">
      <h3 className="font-serif text-[18px] text-foreground/90">{label}</h3>
      <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{count}</span>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <div className="mt-3 rounded-2xl border border-dashed border-border/60 px-4 py-5 text-center text-[12px] text-muted-foreground">{text}</div>;
}

function CircleCard({ s }: { s: CircleSession }) {
  const badge =
    s.status === "intake" ? { label: "Intake", cls: "text-primary/90 border-primary/40" } :
    s.status === "active" ? { label: "Live", cls: "text-emerald-300/90 border-emerald-400/40" } :
    { label: "Completed", cls: "text-foreground/60 border-border/60" };
  return (
    <Link to="/circles/$id" params={{ id: s.id }} className="group flex items-center justify-between gap-3 rounded-[22px] border border-border/60 bg-card/40 p-4 backdrop-blur-xl transition-colors hover:border-primary/40">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-ember/30 text-primary"><Users className="h-4 w-4" /></div>
        <div className="min-w-0">
          <div className="truncate font-serif text-[16px]">{s.title}</div>
          <div className="truncate text-[11px] text-muted-foreground">{s.goal}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-[0.25em] ${badge.cls}`}>{badge.label}</span>
        {s.status === "completed" ? <CheckCircle2 className="h-4 w-4 text-foreground/40" /> : <ArrowUpRight className="h-4 w-4 text-foreground/50 group-hover:text-primary" />}
      </div>
    </Link>
  );
}
