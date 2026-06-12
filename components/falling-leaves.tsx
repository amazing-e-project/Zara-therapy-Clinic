"use client"

import { useEffect, useRef, useState } from "react"

type Leaf = {
  id: number
  x: number
  delay: number
  duration: number
  size: number
  opacity: number
  swayAmount: number
  rotateDir: number
  shape: number
}

const LEAF_COUNT = 18

function generateLeaf(id: number): Leaf {
  return {
    id,
    x: Math.random() * 100,
    delay: Math.random() * 20,
    duration: 18 + Math.random() * 22,
    size: 10 + Math.random() * 18,
    opacity: 0.08 + Math.random() * 0.18,
    swayAmount: 60 + Math.random() * 80,
    rotateDir: Math.random() > 0.5 ? 1 : -1,
    shape: Math.floor(Math.random() * 4),
  }
}

// Four organic leaf SVG path shapes
const leafPaths = [
  // Simple elliptical leaf
  "M10,2 C16,2 22,6 22,12 C22,18 16,22 10,22 C4,22 0,18 0,12 C0,6 4,2 10,2 Z M10,2 C10,2 12,8 12,12 C12,16 10,22 10,22",
  // Asymmetric herb leaf
  "M12,0 C18,3 22,10 20,17 C18,22 14,24 10,22 C6,20 2,14 4,8 C6,2 10,-1 12,0 Z M12,0 C12,0 11,7 11,13 C11,18 10,22 10,22",
  // Pointed eucalyptus leaf
  "M10,0 C16,4 20,10 18,16 C16,22 12,26 10,24 C8,22 4,18 4,12 C4,6 6,0 10,0 Z",
  // Rounded spade leaf
  "M10,1 C15,1 20,5 20,11 C20,16 16,20 12,22 L10,25 L8,22 C4,20 0,16 0,11 C0,5 5,1 10,1 Z",
]

export function FallingLeaves() {
  const containerRef = useRef<HTMLDivElement>(null)
  // Leaves are generated only on the client to avoid SSR/client hydration
  // mismatches caused by Math.random() producing different values per render.
  const [leaves, setLeaves] = useState<Leaf[]>([])

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      if (containerRef.current) containerRef.current.style.display = "none"
      return
    }
    setLeaves(Array.from({ length: LEAF_COUNT }, (_, i) => generateLeaf(i)))
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <style>{`
        @keyframes leafFall {
          0% {
            transform: translateY(-60px) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) translateX(var(--sway-x)) rotate(var(--rotate-end));
            opacity: 0;
          }
        }
        @keyframes leafSway {
          0%   { margin-left: 0px; }
          25%  { margin-left: calc(var(--sway) * 0.6px); }
          50%  { margin-left: calc(var(--sway) * -0.4px); }
          75%  { margin-left: calc(var(--sway) * 0.8px); }
          100% { margin-left: 0px; }
        }
        .leaf-wrapper {
          position: absolute;
          top: 0;
          animation: leafFall var(--duration) ease-in var(--delay) infinite;
        }
        .leaf-svg {
          animation: leafSway var(--sway-duration) ease-in-out var(--delay) infinite;
        }
      `}</style>

      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="leaf-wrapper"
          style={{
            left: `${leaf.x}%`,
            ["--duration" as string]: `${leaf.duration}s`,
            ["--delay" as string]: `${leaf.delay}s`,
            ["--sway-x" as string]: `${leaf.swayAmount * leaf.rotateDir}px`,
            ["--rotate-end" as string]: `${leaf.rotateDir * (180 + Math.random() * 180)}deg`,
            ["--sway" as string]: `${leaf.swayAmount * 0.3}`,
            ["--sway-duration" as string]: `${leaf.duration * 0.4}s`,
          }}
        >
          <svg
            className="leaf-svg"
            width={leaf.size}
            height={leaf.size * 1.3}
            viewBox="0 0 22 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: leaf.opacity }}
          >
            <path
              d={leafPaths[leaf.shape]}
              fill="oklch(0.55 0.09 140)"
              stroke="oklch(0.65 0.12 145)"
              strokeWidth="0.5"
            />
            {/* Leaf vein */}
            <path
              d={`M${10 + (leaf.shape === 3 ? 0 : 0)},${leaf.shape === 0 ? 2 : 1} C${9 + leaf.shape},10 ${10},16 ${10 + (leaf.shape === 3 ? 0 : 0)},${leaf.shape === 3 ? 24 : 23}`}
              stroke="oklch(0.72 0.1 148)"
              strokeWidth="0.6"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}
