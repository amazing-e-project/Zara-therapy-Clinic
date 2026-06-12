"use client"

import { useEffect, useState, useCallback } from "react"

type Slide = {
  src: string
  alt: string
  caption: string
  subCaption: string
}

const slides: Slide[] = [
  {
    src: "/images/hero-massage.png",
    alt: "Candlelit luxury massage therapy room at Zara Therapy Clinic",
    caption: "The art of touch.",
    subCaption: "Deep tissue & muscle release",
  },
  {
    src: "/images/gallery-1.png",
    alt: "Deep tissue back massage with warm oil",
    caption: "Warm oil, slow hands.",
    subCaption: "Swedish & aromatherapy rituals",
  },
  {
    src: "/images/gallery-2.png",
    alt: "Essential oils and dried botanicals on dark stone",
    caption: "Botanicals & stillness.",
    subCaption: "Essential oil therapies",
  },
  {
    src: "/images/gallery-3.png",
    alt: "Hot therapy stones stacked on a cream towel",
    caption: "Stone & heat.",
    subCaption: "Hot stone restorative ritual",
  },
]

export function HeroMedia({ onBook }: { onBook: () => void }) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [fading, setFading] = useState(false)

  const advance = useCallback(() => {
    setFading(true)
    setPrev(current)
    setTimeout(() => {
      setCurrent((c) => (c + 1) % slides.length)
      setFading(false)
      setPrev(null)
    }, 900)
  }, [current])

  useEffect(() => {
    const timer = setInterval(advance, 5500)
    return () => clearInterval(timer)
  }, [advance])

  function goTo(idx: number) {
    if (idx === current) return
    setFading(true)
    setPrev(current)
    setTimeout(() => {
      setCurrent(idx)
      setFading(false)
      setPrev(null)
    }, 900)
  }

  const slide = slides[current]
  const prevSlide = prev !== null ? slides[prev] : null

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
      aria-label="Zara Therapy Clinic hero"
    >
      <style>{`
        @keyframes slideKenBurns {
          0%   { transform: scale(1.0) translateX(0); }
          100% { transform: scale(1.07) translateX(-1%); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1.0); }
        }
        @keyframes slideOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        .hero-slide-in {
          animation: slideIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .hero-slide-out {
          animation: slideOut 0.9s ease forwards;
        }
        .ken-burns {
          animation: slideKenBurns 8s ease-out forwards;
        }
        @keyframes heroTextRise {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-text-rise {
          animation: heroTextRise 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards;
          opacity: 0;
        }
        .hero-text-rise-d1 {
          animation: heroTextRise 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards;
          opacity: 0;
        }
        .hero-text-rise-d2 {
          animation: heroTextRise 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.7s forwards;
          opacity: 0;
        }
        .hero-text-rise-d3 {
          animation: heroTextRise 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.9s forwards;
          opacity: 0;
        }
        .hero-text-rise-d4 {
          animation: heroTextRise 1.1s cubic-bezier(0.22, 1, 0.36, 1) 1.1s forwards;
          opacity: 0;
        }
      `}</style>

      {/* Outgoing slide */}
      {prevSlide && (
        <div className="absolute inset-0 hero-slide-out">
          <img
            src={prevSlide.src}
            alt={prevSlide.alt}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Active slide */}
      <div className={`absolute inset-0 ${fading ? "" : "hero-slide-in"}`}>
        <img
          key={current}
          src={slide.src}
          alt={slide.alt}
          className="h-full w-full object-cover ken-burns"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/65 via-background/45 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/30 to-transparent" />

      {/* Slide caption badge — bottom right */}
      <div className="absolute bottom-28 right-8 hidden text-right sm:block">
        <p className="text-[10px] tracking-luxe text-primary uppercase opacity-80">
          {slide.subCaption}
        </p>
        <p className="font-heading mt-1 text-xl italic text-foreground/70">
          {slide.caption}
        </p>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-500 ${
              i === current
                ? "h-1.5 w-8 bg-primary"
                : "h-1.5 w-1.5 bg-muted-foreground/40 hover:bg-primary/50"
            }`}
          />
        ))}
      </div>

      {/* Hero content */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pt-24 sm:px-8">
        <p className="hero-text-rise text-[11px] tracking-luxe text-primary uppercase">
          Doha · Qatar · Est. 1998
        </p>

        <h1 className="hero-text-rise-d1 font-heading mt-5 max-w-3xl text-balance text-5xl leading-[1.05] text-foreground sm:text-6xl md:text-[5.5rem]">
          Restore the body.{" "}
          <span className="text-primary italic">Quiet</span> the mind.
        </h1>

        <p className="hero-text-rise-d2 mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
          A sanctuary for muscle and tissue therapy, stress relief, and injury
          rehabilitation — where clinical expertise meets candlelit calm in the
          heart of Doha.
        </p>

        <div className="hero-text-rise-d3 mt-9 flex flex-wrap items-center gap-4">
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

        <div className="hero-text-rise-d4 mt-16 flex flex-wrap gap-x-12 gap-y-6 border-t border-border pt-8">
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
      </div>
    </section>
  )
}
