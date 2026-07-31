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
 * border. CSS keyframes and properties are declared globally in globals.css.
 */
export default function AnimatedBorder({
  children,
  className = "",
}: AnimatedBorderProps) {
  return (
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
          background: "#0D111B",
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
