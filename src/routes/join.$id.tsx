import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Users, Shield, Sparkles, ArrowRight } from "lucide-react";
import { EmberBg } from "@/components/EmberBg";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { getCircle, upsertCircle, uid, type Participant } from "@/lib/ember-store";
import { toast } from "sonner";

export const Route = createFileRoute("/join/$id")({
  head: () => ({ meta: [{ title: "Join a circle — Ember" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ c: typeof s.c === "string" ? s.c : undefined }),
  component: JoinPage,
});

function JoinPage() {
  const { id } = Route.useParams();
  const { c } = Route.useSearch();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);

  const session = useMemo(() => getCircle(id), [id]);

  useEffect(() => { setReady(true); }, []);

  if (!ready) return null;

  if (!session) {
    return (
      <PhoneFrame>
        <EmberBg />
        <StatusBar />
        <div className="flex flex-1 flex-col items-center justify-center px-7 text-center">
          <h1 className="font-serif text-[28px] text-gradient-fade">Invite not found</h1>
          <p className="mt-3 text-[13px] text-muted-foreground">This circle may have ended or the link is invalid.</p>
          <Link to="/circles" className="mt-6 rounded-full bg-gradient-ember px-6 py-3 text-[13px] font-medium text-primary-foreground shadow-ember">Go to Circles</Link>
        </div>
      </PhoneFrame>
    );
  }

  if (c && session.inviteCode && c !== session.inviteCode) {
    return (
      <PhoneFrame>
        <EmberBg />
        <StatusBar />
        <div className="flex flex-1 flex-col items-center justify-center px-7 text-center">
          <h1 className="font-serif text-[28px] text-gradient-fade">Link expired</h1>
          <p className="mt-3 text-[13px] text-muted-foreground">Ask the host to share a fresh invite.</p>
        </div>
      </PhoneFrame>
    );
  }

  const accept = () => {
    const trimmed = name.trim();
    if (!trimmed) { toast("Add your name"); return; }
    const existing = session.participants ?? [];
    const match = existing.find((p) => p.name.toLowerCase() === trimmed.toLowerCase());
    let participant: Participant;
    if (match) {
      participant = { ...match, status: "joined" };
    } else {
      participant = { id: uid(), name: trimmed, role: "guest", status: "joined", invitedAt: Date.now() };
    }
    const next = {
      ...session,
      participants: existing.some((p) => p.id === participant.id)
        ? existing.map((p) => (p.id === participant.id ? participant : p))
        : [...existing, participant],
      messages: [
        ...session.messages,
        { id: uid(), channel: "group" as const, from: "ai" as const, text: `${participant.name} just joined the circle. Welcome — take a breath before you speak.`, at: Date.now() },
      ],
    };
    upsertCircle(next);
    toast.success(`Welcome, ${participant.name}`);
    nav({ to: "/circles/$id", params: { id: session.id } });
  };

  return (
    <PhoneFrame>
      <EmberBg />
      <StatusBar />
      <header className="px-7 pt-10 animate-fade-up">
        <div className="text-[10px] uppercase tracking-[0.4em] text-primary/90">You're invited</div>
        <h1 className="mt-3 font-serif text-[32px] leading-[1.05] text-gradient-fade">{session.title}</h1>
        <p className="mt-3 text-[13px] text-muted-foreground">{session.goal}</p>
      </header>

      <section className="mt-6 space-y-3 px-7">
        <Row icon={<Shield className="h-4 w-4" />} label="A facilitator holds the room" />
        <Row icon={<Users className="h-4 w-4" />} label={`${(session.participants?.length ?? 0) + 1} people invited`} />
        <Row icon={<Sparkles className="h-4 w-4" />} label="Private whisper channel available" />
      </section>

      <section className="mt-7 px-7">
        <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Your name in the room</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="How should we call you?" className="mt-2 w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-[14px] outline-none focus:border-primary/60" />
        <button onClick={accept} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-ember py-3.5 text-[14px] font-medium text-primary-foreground shadow-ember">
          Enter the circle <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">By entering, you agree to keep what's said here in this room.</p>
      </section>
    </PhoneFrame>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/40 px-4 py-3 backdrop-blur-xl">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-ember/30 text-primary">{icon}</span>
      <span className="text-[13px] text-foreground/85">{label}</span>
    </div>
  );
}
