"use client";

/**
 * Brand mark beside the app title. Add your assets to `/public`:
 * - **`logo.svg`** (recommended) and/or **`logo.png`**
 *
 * If `logo.svg` fails to load, the component falls back to `logo.png`.
 */
export function AppLogo({ className }: { className?: string }) {
  const sizeClass =
    className ?? "h-9 w-auto max-h-10 max-w-[min(52vw,220px)]";
  return (
    // eslint-disable-next-line @next/next/no-img-element -- user-provided SVG/PNG in /public
    <img
      src="/logo.svg"
      alt="ZG Hand Holding"
      width={200}
      height={48}
      className={`pointer-events-none w-auto select-none object-contain object-left drop-shadow-sm ${sizeClass}`}
      onError={(e) => {
        const el = e.currentTarget;
        if (!el.src.endsWith("/logo.png")) {
          el.src = "/logo.png";
        }
      }}
    />
  );
}
