"use client"

import { Reveal } from "@/components/reveal"

export function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-massage.png"
          alt="Candlelit luxury massage therapy room at Zara Therapy Clinic"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/55 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pt-24 sm:px-8">
        <Reveal>
          <p className="text-[11px] tracking-luxe text-primary uppercase">
            Doha · Qatar · Est. 1998
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="font-heading mt-5 max-w-3xl text-balance text-5xl leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
            Restore the body.{" "}
            <span className="text-primary italic">Quiet</span> the mind.
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            A sanctuary for muscle and tissue therapy, stress relief, and injury
            rehabilitation — where clinical expertise meets candlelit calm in the
            heart of Doha.
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={onBook}
              className="bg-primary px-8 py-3.5 text-xs tracking-luxe text-primary-foreground uppercase transition-opacity hover:opacity-90"
            >
              Reserve a Session
            </button>
            <a
              href="#catalog"
              className="nav-link px-2 py-3.5 text-xs tracking-luxe text-foreground uppercase"
            >
              Explore Treatments
            </a>
          </div>
        </Reveal>

        <Reveal delay={500}>
          <div className="mt-16 flex flex-wrap gap-x-12 gap-y-6 border-t border-border pt-8">
            {[
              ["25+", "Years of care"],
              ["18", "Expert therapists"],
              ["9", "Signature rituals"],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="font-heading text-3xl text-primary">{num}</p>
                <p className="mt-1 text-[11px] tracking-wide-sm text-muted-foreground uppercase">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
