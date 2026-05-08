export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-medium tracking-wider text-foreground/70">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
      </div>
    </div>
  );
}
