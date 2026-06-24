import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Rewind, Sliders, GitBranch, X } from "lucide-react";
import { EmberBg } from "@/components/EmberBg";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { BottomNav } from "./app";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Ex Simulator — Ember" },
      { name: "description", content: "Rehearse the conversation before it costs you anything." },
    ],
  }),
  component: Sim,
});

type Msg = { from: "you" | "them"; text: string };

const opening: Msg[] = [
  { from: "them", text: "I wasn't expecting to hear from you." },
];

const replies = [
  "I needed time. I'm not sure why I thought silence would fix anything.",
  "What do you want me to say? I've moved on. I think.",
  "Don't do this. Not tonight.",
  "I read your message three times before answering.",
];

function Sim() {
  const [persona, setPersona] = useState<"avoidant" | "anxious" | "cold">("avoidant");
  const [msgs, setMsgs] = useState<Msg[]>(opening);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroll.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [msgs, typing]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs((m) => [...m, { from: "you", text: input.trim() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setMsgs((m) => [...m, { from: "them", text: reply }]);
      setTyping(false);
    }, 1600);
  };

  return (
    <PhoneFrame>
      <EmberBg />
      <StatusBar />

      <header className="flex items-center justify-between px-6 pt-6">
        <Link to="/app" className="grid h-10 w-10 place-items-center rounded-full glass">←</Link>
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gradient-ember shadow-ember">
            <div className="absolute inset-0 animate-pulse-glow" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-[16px]">Them</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-primary/80 capitalize">{persona}</div>
          </div>
        </div>
        <div className="w-10" />
      </header>

      {/* Persona switcher */}
      <div className="mt-3 flex justify-center gap-1.5 px-6">
        {(["avoidant", "anxious", "cold"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPersona(p)}
            className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] transition-all ${
              persona === p ? "bg-gradient-ember text-primary-foreground" : "glass text-muted-foreground"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div ref={scroll} className="mt-4 h-[calc(100svh-340px)] overflow-y-auto px-5 pb-4">
        <div className="mx-auto mb-4 w-fit rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Simulation · not real
        </div>
        <div className="space-y-3">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`flex animate-fade-up ${m.from === "you" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[78%] rounded-3xl px-4 py-2.5 text-[14.5px] leading-snug ${
                  m.from === "you"
                    ? "bg-gradient-ember text-primary-foreground rounded-br-md shadow-ember"
                    : "glass text-foreground rounded-bl-md"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start animate-fade-up">
              <div className="glass rounded-3xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-breathe" />
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-breathe" style={{ animationDelay: "0.2s" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-breathe" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="fixed inset-x-0 bottom-[88px] mx-auto w-full max-w-[440px] px-4">
        <div className="glass-strong flex items-center gap-2 rounded-full p-1.5 pl-5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Say what you couldn't say…"
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={send}
            className="grid h-10 w-10 place-items-center rounded-full bg-gradient-ember text-primary-foreground shadow-ember active:scale-95"
          >
            ↑
          </button>
        </div>
      </div>

      <BottomNav pathname="/simulator" />
    </PhoneFrame>
  );
}
