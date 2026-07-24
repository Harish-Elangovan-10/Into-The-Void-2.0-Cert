"use client";

import { type ReactNode } from "react";

interface AnimatedBorderProps {
  children: ReactNode;
  className?: string;
  /** CSS border-radius value. Defaults to '12px'. */
  borderRadius?: string;
}

/**
 * AnimatedBorder
 *
 * Wraps children in a container that has a slowly rotating conic-gradient
 * border. Implementation uses a pseudo-element approach via nested divs:
 *
 *   outer (gradient, rotating)  →  1px padding acts as the border
 *   inner (solid bg, masks gradient)  →  holds content
 */
export default function AnimatedBorder({
  children,
  className = "",
}: AnimatedBorderProps) {
  return (
    <>
      <style>{`
        @property --border-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        @keyframes animatedBorderRotate {
          to {
            --border-angle: 360deg;
          }
        }
      `}</style>

      <div
        className={className}
        style={{
          padding: "1px",
          background: `conic-gradient(
            from var(--border-angle),
            rgba(123, 97, 255, 0.5),
            rgba(77, 168, 255, 0.5),
            rgba(168, 85, 247, 0.5),
            rgba(123, 97, 255, 0.5)
          )`,
          animation: "animatedBorderRotate 20s linear infinite",
        }}
      >
        <div
          style={{
            // borderRadius: `calc(${borderRadius} - 1px)`,
            background: "#0D111B",
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
