"use client"

import { X } from "lucide-react"

// Defining the type here so the modal knows what a 'pillar' is
type FocusArea = { title: string; desc: string }
type Pillar = {
  icon: React.ElementType
  title: string
  text: string
  headline: string
  intro: string
  focusAreas: FocusArea[]
  cta: string
}

export function PhilosophyModal({ pillar, onClose }: { pillar: Pillar; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-border bg-card p-8 shadow-2xl sm:p-12" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-5 top-5 text-muted-foreground hover:text-primary"><X className="h-5 w-5" /></button>
        <div className="flex items-center gap-3">
          <pillar.icon className="h-6 w-6 text-primary" />
          <p className="text-[11px] tracking-luxe text-primary uppercase">{pillar.title}</p>
        </div>
        <h2 className="font-heading mt-4 text-3xl sm:text-4xl">{pillar.headline}</h2>
        <div className="gold-line mt-5 w-16" />
        <p className="mt-6 text-muted-foreground">{pillar.intro}</p>
        <p className="mt-9 text-[11px] tracking-luxe text-primary uppercase">Our Specific Focus Areas</p>
        <ul className="mt-5 flex flex-col gap-5">
          {pillar.focusAreas.map((area: FocusArea) => (
            <li key={area.title} className="border-l border-primary/40 pl-5">
              <h3 className="font-heading text-lg">{area.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{area.desc}</p>
            </li>
          ))}
        </ul>
        <div className="gold-line mt-9 w-full opacity-40" />
        <p className="mt-6 font-heading text-lg">{pillar.cta}</p>
      </div>
    </div>
  )
}