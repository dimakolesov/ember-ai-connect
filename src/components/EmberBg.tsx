export function EmberBg() {
  // Floating ember particles + ambient glow
  const sparks = Array.from({ length: 14 });
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-night" />
      <div className="absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px] animate-breathe" />
      <div className="absolute -bottom-20 right-[-10%] h-[55vh] w-[55vh] rounded-full bg-[oklch(0.42_0.13_162)]/25 blur-[110px] animate-breathe" style={{ animationDelay: "1.5s" }} />
      <div className="absolute -top-10 left-[-15%] h-[35vh] w-[35vh] rounded-full bg-[oklch(0.82_0.12_90)]/8 blur-[90px]" />
      {sparks.map((_, i) => (
        <span
          key={i}
          className="absolute bottom-0 h-[3px] w-[3px] rounded-full animate-ember-rise"
          style={{
            left: `${(i * 7 + 5) % 100}%`,
            animationDelay: `${i * 0.6}s`,
            animationDuration: `${5 + (i % 3)}s`,
            background: i % 4 === 0 ? "oklch(0.86 0.12 90)" : "oklch(0.78 0.16 158)",
            boxShadow: i % 4 === 0
              ? "0 0 10px 2px oklch(0.86 0.12 90 / 0.7)"
              : "0 0 10px 2px oklch(0.78 0.16 158 / 0.85)",
          }}
        />
      ))}
      <div className="absolute inset-0 noise" />
    </div>
  );
}
