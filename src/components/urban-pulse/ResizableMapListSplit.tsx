"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const MIN_SHARE = 0.22;
const MAX_SHARE = 0.82;
const DEFAULT_SHARE = 0.55;

function clampShare(n: number) {
  return Math.min(MAX_SHARE, Math.max(MIN_SHARE, n));
}

export interface ResizableMapListSplitProps {
  map: ReactNode;
  list: ReactNode;
}

/**
 * Horizontal split on lg+, vertical split on smaller screens.
 * `mapShare` is the fraction of the split area given to the map (width on desktop, height on mobile).
 */
export function ResizableMapListSplit({ map, list }: ResizableMapListSplitProps) {
  const [mapShare, setMapShare] = useState(DEFAULT_SHARE);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromPointer = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const isLg = window.matchMedia("(min-width: 1024px)").matches;
    if (isLg) {
      const ratio = (clientX - rect.left) / rect.width;
      setMapShare(clampShare(ratio));
    } else {
      const ratio = (clientY - rect.top) / rect.height;
      setMapShare(clampShare(ratio));
    }
  }, []);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!draggingRef.current) return;
      e.preventDefault();
      updateFromPointer(e.clientX, e.clientY);
    }
    function onUp() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [updateFromPointer]);

  useEffect(() => {
    function onMove(e: TouchEvent) {
      if (!draggingRef.current || e.touches.length === 0) return;
      e.preventDefault();
      const t = e.touches[0];
      updateFromPointer(t.clientX, t.clientY);
    }
    function onEnd() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");
    }
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);
    return () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [updateFromPointer]);

  function startDrag() {
    draggingRef.current = true;
    document.body.style.cursor = window.matchMedia("(min-width: 1024px)").matches
      ? "col-resize"
      : "row-resize";
    document.body.style.userSelect = "none";
  }

  const pct = mapShare * 100;

  return (
    <div
      ref={containerRef}
      className="flex min-h-0 w-full flex-1 flex-col overflow-hidden lg:flex-row"
    >
      {/* Map pane — fixed to allocated space; no overflow scroll */}
      <section
        className="relative min-h-[100px] shrink-0 overflow-hidden border-b border-zinc-800 lg:min-h-0 lg:min-w-0 lg:border-b-0 lg:border-r"
        style={{
          flex: `0 0 ${pct}%`,
          minWidth: 0,
        }}
      >
        <div className="absolute inset-0 overflow-hidden">{map}</div>
      </section>

      {/* Drag handle */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize map and list"
        tabIndex={0}
        onMouseDown={(e) => {
          e.preventDefault();
          startDrag();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          startDrag();
        }}
        onKeyDown={(e) => {
          const step = 0.03;
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            setMapShare((s) => clampShare(s - step));
          } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            setMapShare((s) => clampShare(s + step));
          }
        }}
        className="group relative z-10 flex shrink-0 cursor-row-resize items-center justify-center border-zinc-700 bg-zinc-900 py-1 lg:w-2 lg:cursor-col-resize lg:px-0 lg:py-0"
      >
        <span className="h-1 w-10 rounded-full bg-zinc-600 group-hover:bg-emerald-500 lg:h-10 lg:w-1" />
      </div>

      {/* List pane — scrolls internally */}
      <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {list}
      </section>
    </div>
  );
}
