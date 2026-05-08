import type { ReactNode } from "react";

/** Centers content as a mobile-app surface on larger screens, full-bleed on phone. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto min-h-svh w-full max-w-[440px] overflow-hidden">
      {children}
    </div>
  );
}
