"use client"

import { useEffect, useState } from "react"

export function Ticker() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const dateStr = now
    ? now.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—"

  const timeStr = now
    ? now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "—"

  const segments = [
    dateStr,
    `Doha Local Time · ${timeStr}`,
    "Geolocation Node · Doha, Qatar",
    "25.2854° N, 51.5310° E",
    "Zara Therapy Clinic · Restore · Relieve · Rehabilitate",
  ]

  // Duplicate for a seamless loop
  const loop = [...segments, ...segments]

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden border-t border-primary/30 bg-background/95 py-2.5 backdrop-blur-md">
      <div className="animate-marquee flex w-max items-center">
        {loop.map((seg, i) => (
          <span
            key={i}
            className="font-mono flex items-center text-[11px] tracking-wide-sm text-muted-foreground uppercase"
          >
            {seg}
            <span className="mx-6 text-primary">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
