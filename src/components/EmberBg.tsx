export function EmberBg() {
  // Minimal cinematic backdrop — a single soft emerald aurora over deep noir.
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-night" />
      <div className="absolute left-1/2 top-[18%] h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px] animate-breathe" />
      <div className="absolute -bottom-40 left-1/2 h-[60vh] w-[90vh] -translate-x-1/2 rounded-full bg-[oklch(0.50_0.20_300)]/15 blur-[160px]" />
      <div className="absolute inset-0 noise" />
    </div>
  );
}
