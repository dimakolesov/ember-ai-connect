// Lightweight localStorage helpers for Ember features.
// No backend required. Everything is namespaced under "ember:".

export type Channel = "group" | "private";

export type Participant = {
  id: string;
  name: string;
  email?: string;
  role: "host" | "guest";
  status: "invited" | "joined";
  invitedAt: number;
};

export type CircleMessage = {
  id: string;
  channel: Channel;
  from: "you" | "them" | "ai" | string; // participant id allowed
  fromName?: string;
  text: string;
  at: number;
};

export type CircleStatus = "intake" | "active" | "completed";

export type CircleSession = {
  id: string;
  title: string;
  goal: string;
  status: CircleStatus;
  createdAt: number;
  intake: { goals: string; expectations: string; consent: boolean };
  messages: CircleMessage[];
  report?: {
    summary: string;
    themes: string[];
    emotions: string;
    recommendations: string[];
    at: number;
  };
};

const CIRCLES_KEY = "ember:circles";
const SIM_SETUP_KEY = "ember:sim-setup";

export function loadCircles(): CircleSession[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CIRCLES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCircles(list: CircleSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CIRCLES_KEY, JSON.stringify(list));
}

export function upsertCircle(s: CircleSession) {
  const list = loadCircles();
  const i = list.findIndex((x) => x.id === s.id);
  if (i >= 0) list[i] = s;
  else list.unshift(s);
  saveCircles(list);
}

export function getCircle(id: string): CircleSession | undefined {
  return loadCircles().find((s) => s.id === id);
}

export type SimSetup = {
  who: {
    context: string;
    style: string;
    interest: string;
    attachment: string;
    backstory: string;
  };
  moment: string;
  skills: string[];
  difficulty: number;
  curveballs: Record<string, boolean>;
  realism: {
    typos: boolean;
    delay: number;
    shortMessages: boolean;
    emoji: string;
  };
  coach: {
    mode: "live" | "after";
    helpLevel: "full" | "hints" | "none";
    depth: "every" | "final";
  };
  calibratedFrom?: string;
};

export const DEFAULT_SETUP: SimSetup = {
  who: { context: "App match", style: "Warm and expansive", interest: "Mixed signals", attachment: "Anxious", backstory: "" },
  moment: "Opening message",
  skills: ["Brevity"],
  difficulty: 3,
  curveballs: {
    "Suddenly cools off": false,
    "Replies a day later": false,
    "Drops a dry 'haha'": false,
    "Changes the subject": false,
    "Mentions their ex": false,
    "Gets 'busy'": false,
  },
  realism: { typos: false, delay: 2, shortMessages: false, emoji: "Sparse" },
  coach: { mode: "live", helpLevel: "hints", depth: "final" },
};

export function loadSetup(): SimSetup {
  if (typeof window === "undefined") return DEFAULT_SETUP;
  try {
    const raw = localStorage.getItem(SIM_SETUP_KEY);
    return raw ? { ...DEFAULT_SETUP, ...JSON.parse(raw) } : DEFAULT_SETUP;
  } catch {
    return DEFAULT_SETUP;
  }
}

export function saveSetup(s: SimSetup) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SIM_SETUP_KEY, JSON.stringify(s));
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
