"use client"

import { useState } from "react"
import { Reveal } from "@/components/reveal"
import { Leaf, HeartPulse, Sparkles, Activity, X, ArrowUpRight } from "lucide-react"

type FocusArea = { title: string; desc: string }

type Pillar = {
  icon: typeof HeartPulse
  title: string
  text: string
  headline: string
  intro: string
  focusAreas: FocusArea[]
  cta: string
}

const pillars: Pillar[] = [
  {
    icon: HeartPulse,
    title: "Pain Relief",
    text: "Chronic discomfort deserves more than a temporary fix. We listen closely to where your body holds tension, then apply gentle, targeted techniques that ease persistent pain at its source. The goal is not simply to mask the ache, but to restore lasting comfort and help you move through life with ease again.",
    headline: "Restoring Your Body's Natural Freedom",
    intro:
      "We believe pain is a message, never a life sentence. Our work begins by listening to your body with patience and precision, then easing discomfort at its true source rather than simply quieting the symptoms.",
    focusAreas: [
      {
        title: "Chronic Discomfort",
        desc: "We address pain that has lingered for months or years, working gently to interrupt long-held patterns and bring your body back to a place of genuine relief.",
      },
      {
        title: "Muscle Tension",
        desc: "Through targeted, intuitive pressure, we release the deep knots and guarding that keep muscles locked, allowing tightness to soften and dissolve.",
      },
      {
        title: "Joint Mobility",
        desc: "We carefully restore ease to stiff, restricted joints, helping you rediscover comfortable, confident movement in everyday life.",
      },
    ],
    cta: "Let us help you take the first step toward a pain-free life.",
  },
  {
    icon: Activity,
    title: "Circulation",
    text: "Healthy blood flow is the quiet engine of wellbeing. Our warming, rhythmic techniques invite circulation to deepen, carrying oxygen and nourishment to tired tissue and supporting the body's natural repair at a cellular level. As warmth spreads, you feel renewed energy, lighter limbs, and a restored sense of everyday vitality.",
    headline: "Awakening Vitality From Within",
    intro:
      "Healthy circulation is the quiet engine behind every feeling of wellbeing. We use warming, rhythmic techniques to invite blood flow to deepen, nourishing your body at the cellular level and reigniting a natural sense of vitality.",
    focusAreas: [
      {
        title: "Oxygen Delivery",
        desc: "By encouraging healthy blood flow, we help carry fresh oxygen to tired tissue, leaving you with lighter limbs and renewed energy.",
      },
      {
        title: "Cellular Healing",
        desc: "Improved circulation supports the body's innate ability to repair and regenerate itself, accelerating recovery from the inside out.",
      },
      {
        title: "Vitality & Warmth",
        desc: "As warmth spreads through the body, you feel deeply nourished, revitalised, and reconnected to your own natural energy.",
      },
    ],
    cta: "Let us help you feel warm, alive, and wonderfully renewed.",
  },
  {
    icon: Leaf,
    title: "Stress Relief",
    text: "True rest begins when the body finally feels safe. In the calm of our sanctuary, slow and intentional touch coaxes an overworked nervous system out of high alert and into quiet. Tension softens, breath deepens, and the mind grows still, leaving you with a profound, lasting sense of peace.",
    headline: "A Sanctuary for a Quiet Mind",
    intro:
      "True rest begins the moment your body finally feels safe. Within the calm of our sanctuary, we gently guide an overworked nervous system out of high alert and into deep, restorative stillness.",
    focusAreas: [
      {
        title: "Nervous System",
        desc: "Slow, intentional touch coaxes your body out of fight-or-flight, calming the nervous system and inviting a profound sense of safety.",
      },
      {
        title: "Mental Clarity",
        desc: "As tension melts away, the mind grows still and spacious, leaving you with renewed focus and a refreshing sense of calm.",
      },
      {
        title: "Physical Relaxation",
        desc: "We release the tension stored in your muscles and breath, allowing your whole body to soften into genuine, lasting ease.",
      },
    ],
    cta: "Let us help you exhale, unwind, and rediscover your peace.",
  },
  {
    icon: Sparkles,
    title: "Rehabilitation",
    text: "Recovery is a journey we walk beside you. Through careful assessment and progressive, hands-on care, we help restore movement, rebuild flexibility, and gently return strength after strain or injury. Every session is a thoughtful step toward resilient, long-term physical wellness, so your body can carry you confidently for years to come.",
    headline: "Rebuilding Strength, One Step at a Time",
    intro:
      "Recovery is a journey we walk beside you, never one you face alone. Through careful assessment and progressive, hands-on care, we help your body heal fully and return to the activities you love with confidence.",
    focusAreas: [
      {
        title: "Injury Recovery",
        desc: "We support your body's healing after strain or injury with attentive, progressive care designed around your unique needs.",
      },
      {
        title: "Flexibility",
        desc: "Through gentle, restorative techniques, we help rebuild range of motion and suppleness, returning ease to how you move.",
      },
      {
        title: "Long-Term Strength",
        desc: "Every session is a thoughtful step toward resilient, lasting wellness, so your body can carry you confidently for years to come.",
      },
    ],
    cta: "Let us help you move forward, stronger than before.",
  },
]

export function About() {
  const [active, setActive] = useState<Pillar | null>(null)

  return (
    <section id="about" className="relative py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="text-[11px] tracking-luxe text-primary uppercase">
                Our Philosophy
              </p>
              <h2 className="font-heading mt-4 text-balance text-4xl leading-tight text-foreground sm:text-5xl">
                Healing is a craft, not a transaction.
              </h2>
              <div className="gold-line mt-6 w-20" />
              <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
                For over two decades, Zara Therapy Clinic has practiced the art of
                muscle and tissue manipulation in Doha. Every session begins with
                a quiet consultation and unfolds in rooms scented with warm oils
                and lit by low amber light.
              </p>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                Our therapists blend clinical precision with deep intuition —
                because true wellness lives in the space between science and
                serenity.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 120}>
                <button
                  type="button"
                  onClick={() => setActive(p)}
                  aria-label={`Read more about ${p.title}`}
                  className="group flex h-full w-full flex-col text-left border border-border bg-card/60 p-7 transition-colors hover:border-primary/50"
                >
                  <p.icon className="h-7 w-7 text-primary" strokeWidth={1.4} />
                  <h3 className="font-heading mt-5 text-2xl text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.text}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] tracking-luxe text-primary uppercase opacity-80 transition-opacity group-hover:opacity-100">
                    Discover More
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {active && <PhilosophyModal pillar={active} onClose={() => setActive(null)} />}
    </section>
  )
}

function PhilosophyModal({
  pillar,
  onClose,
}: {
  pillar: Pillar
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={pillar.title}
    >
      <div
        className="animate-scale-in relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-border bg-card p-8 shadow-2xl sm:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-muted-foreground transition-colors hover:text-primary"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <pillar.icon className="h-6 w-6 text-primary" strokeWidth={1.4} />
          <p className="text-[11px] tracking-luxe text-primary uppercase">
            {pillar.title}
          </p>
        </div>

        <h2 className="font-heading mt-4 text-balance text-3xl leading-tight text-foreground sm:text-4xl">
          {pillar.headline}
        </h2>
        <div className="gold-line mt-5 w-16" />

        <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
          {pillar.intro}
        </p>

        <p className="mt-9 text-[11px] tracking-luxe text-primary uppercase">
          Our Specific Focus Areas
        </p>
        <ul className="mt-5 flex flex-col gap-5">
          {pillar.focusAreas.map((area) => (
            <li
              key={area.title}
              className="border-l border-primary/40 pl-5"
            >
              <h3 className="font-heading text-lg text-foreground">
                {area.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {area.desc}
              </p>
            </li>
          ))}
        </ul>

        <div className="gold-line mt-9 w-full opacity-40" />
        <p className="mt-6 text-pretty font-heading text-lg leading-relaxed text-foreground">
          {pillar.cta}
        </p>
      </div>
    </div>
  )
}
