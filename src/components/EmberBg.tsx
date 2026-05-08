export function EmberBg() {
  // Floating ember particles + ambient glow
  const sparks = Array.from({ length: 14 });
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-night" />
      <div className="absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] animate-breathe" />
      <div className="absolute -bottom-20 right-[-10%] h-[50vh] w-[50vh] rounded-full bg-[oklch(0.45_0.20_18)]/20 blur-[100px] animate-breathe" style={{ animationDelay: "1.5s" }} />
      {sparks.map((_, i) => (
        <span
          key={i}
          className="absolute bottom-0 h-1 w-1 rounded-full bg-ember-glow animate-ember-rise"
          style={{
            left: `${(i * 7 + 5) % 100}%`,
            animationDelay: `${i * 0.6}s`,
            animationDuration: `${4 + (i % 3)}s`,
            boxShadow: "0 0 8px 2px oklch(0.72 0.20 35 / 0.8)",
          }}
        />
      ))}
      <div className="absolute inset-0 noise" />
    </div>
  );
}
