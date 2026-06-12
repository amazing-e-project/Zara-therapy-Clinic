"use client"

import { useState, useEffect } from "react"
import { Play, Quote, Star, Lock, MessageSquarePlus } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { gallery, testimonials } from "@/lib/clinic-data"

/* ─── Types ─────────────────────────────────────────────── */
interface UserReview {
  id: string
  name: string
  message: string
  rating: number
  date: string
}

const STORAGE_KEY = "zara_user_reviews"

function loadReviews(): UserReview[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

function saveReviews(reviews: UserReview[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
}

/* ─── Star selector ─────────────────────────────────────── */
function StarSelector({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${n} star${n !== 1 ? "s" : ""}`}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            className="h-6 w-6 transition-colors duration-150"
            style={{
              fill: n <= (hovered || value) ? "oklch(0.74 0.11 80)" : "transparent",
              stroke: n <= (hovered || value)
                ? "oklch(0.74 0.11 80)"
                : "oklch(0.72 0.025 90)",
            }}
          />
        </button>
      ))}
    </div>
  )
}

/* ─── Review card ───────────────────────────────────────── */
function ReviewCard({ review }: { review: UserReview }) {
  return (
    <article className="review-card flex flex-col border border-border bg-card/50 p-6 transition-colors hover:bg-card/80">
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className="h-3.5 w-3.5"
            style={{
              fill: n <= review.rating ? "oklch(0.74 0.11 80)" : "transparent",
              stroke: n <= review.rating ? "oklch(0.74 0.11 80)" : "oklch(0.72 0.025 90)",
            }}
          />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-foreground/85 italic flex-1">
        &ldquo;{review.message}&rdquo;
      </p>
      <footer className="mt-4 pt-4 border-t border-border/50">
        <p className="font-heading text-base text-primary">{review.name}</p>
        <p className="text-[10px] tracking-wide-sm text-muted-foreground uppercase">
          {review.date}
        </p>
      </footer>
    </article>
  )
}

/* ─── Auth gate (replaces the form when logged out) ─────── */
function AuthGate({ onOpenAuth }: { onOpenAuth: () => void }) {
  return (
    <div className="auth-gate flex flex-col items-center justify-center gap-6 border border-border/60 bg-card/40 px-8 py-14 text-center backdrop-blur-[2px]">
      <div
        className="flex h-14 w-14 items-center justify-center border border-primary/25"
        style={{ boxShadow: "0 0 24px oklch(0.74 0.11 80 / 0.07)" }}
      >
        <Lock className="h-5 w-5 text-primary/70" />
      </div>

      <div>
        <p className="font-heading text-xl text-foreground">Share Your Experience</p>
        <div className="gold-line mx-auto mt-3 w-12" />
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
          We value your genuine feedback. Please{" "}
          <strong className="text-foreground/80 font-normal">Login</strong> or{" "}
          <strong className="text-foreground/80 font-normal">Sign Up</strong> to
          leave a review.
        </p>
      </div>

      {/* Locked star row */}
      <div className="flex gap-1.5 opacity-30 pointer-events-none" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className="h-5 w-5"
            style={{ fill: "transparent", stroke: "oklch(0.74 0.11 80)" }}
          />
        ))}
      </div>

      <button
        onClick={onOpenAuth}
        className="mt-1 border border-primary bg-primary px-8 py-3 text-[11px] tracking-luxe text-primary-foreground uppercase transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98]"
      >
        Login · Sign Up
      </button>
    </div>
  )
}

/* ─── Empty wall placeholder ─────────────────────────────── */
function EmptyWall({ user }: { user: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border/40 py-16 text-center">
      <MessageSquarePlus className="h-8 w-8 text-primary/30 mb-4" />
      <p className="text-sm text-muted-foreground">
        {user
          ? "Be the first to share your experience."
          : "Verified member reviews will appear here."}
      </p>
      {!user && (
        <p className="mt-1 text-[11px] tracking-wide-sm text-muted-foreground/50 uppercase">
          Sign in to leave the first review
        </p>
      )}
    </div>
  )
}

/* ─── Gallery ────────────────────────────────────────────── */
export function Gallery() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-[11px] tracking-luxe text-primary uppercase">The Sanctuary</p>
            <h2 className="font-heading mt-4 text-balance text-4xl text-foreground sm:text-5xl">
              A Glimpse Within
            </h2>
            <div className="gold-line mx-auto mt-6 w-20" />
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {gallery.map((g, i) => (
            <Reveal key={g.src} delay={i * 120}>
              <div className="group relative aspect-[3/4] overflow-hidden">
                <img
                  src={g.src || "/placeholder.svg"}
                  alt={g.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent opacity-80" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials + Review engine ──────────────────────── */
export function Testimonials({
  user,
  onOpenAuth,
}: {
  user: string | null
  onOpenAuth: () => void
}) {
  const [playing,     setPlaying]     = useState(false)
  const [userReviews, setUserReviews] = useState<UserReview[]>([])

  // Form state
  const [message,   setMessage]   = useState("")
  const [rating,    setRating]    = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState("")

  useEffect(() => {
    setUserReviews(loadReviews())
  }, [])

  // Reset success banner when user logs out
  useEffect(() => {
    if (!user) setSubmitted(false)
  }, [user])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setError("")

    if (!message.trim() || message.trim().length < 10) {
      setError("Please write at least 10 characters.")
      return
    }
    if (rating === 0) {
      setError("Please select a star rating.")
      return
    }

    const newReview: UserReview = {
      id: Date.now().toString(),
      name: user,
      message: message.trim(),
      rating,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }

    const updated = [newReview, ...loadReviews()]
    saveReviews(updated)
    setUserReviews(updated)

    setMessage("")
    setRating(0)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section id="testimonials" className="relative py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Section header */}
        <Reveal>
          <div className="text-center">
            <p className="text-[11px] tracking-luxe text-primary uppercase">In Their Words</p>
            <h2 className="font-heading mt-4 text-balance text-4xl text-foreground sm:text-5xl">
              Voices of Calm
            </h2>
            <div className="gold-line mx-auto mt-6 w-20" />
          </div>
        </Reveal>

        {/* Video + seed testimonials */}
        <div className="mt-14 grid items-start gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-video overflow-hidden border border-border">
              {playing ? (
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/inpok4MKVLM?autoplay=1"
                  title="Zara Therapy Clinic experience"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <button
                  onClick={() => setPlaying(true)}
                  className="group block h-full w-full"
                  aria-label="Play testimonial video"
                >
                  <img
                    src="/images/testimonial-video.png"
                    alt="Guest relaxing at Zara Therapy Clinic"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-background/30 transition-colors group-hover:bg-background/20">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-primary bg-background/60 backdrop-blur-sm transition-transform group-hover:scale-110">
                      <Play className="ml-1 h-6 w-6 text-primary" fill="currentColor" />
                    </span>
                  </span>
                </button>
              )}
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <blockquote className="border border-border bg-card/50 p-7">
                  <Quote className="h-6 w-6 text-primary" />
                  <p className="mt-4 text-pretty leading-relaxed text-foreground/90 italic">
                    {t.quote}
                  </p>
                  <footer className="mt-5">
                    <p className="font-heading text-lg text-primary">{t.name}</p>
                    <p className="text-[11px] tracking-wide-sm text-muted-foreground uppercase">
                      {t.location}
                    </p>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Review engine ── */}
        <div className="mt-24">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="text-[11px] tracking-luxe text-primary uppercase">Client Reviews</p>
              <h3 className="font-heading mt-4 text-3xl text-foreground sm:text-4xl">
                {user ? "Leave a Review" : "Client Reviews"}
              </h3>
              <div className="gold-line mx-auto mt-5 w-16" />
              {!user && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Sign in to share your experience and join our community of guests.
                </p>
              )}
            </div>
          </Reveal>

          {/*
            Two-column layout:
            Left  = sticky form panel (or auth gate)
            Right = live review wall (always visible, expands naturally)
          */}
          <div className="grid gap-12 lg:grid-cols-[400px_1fr] lg:items-start">

            {/* ── Left: form or gate ── */}
            <Reveal>
              <div className="review-form-wrapper border border-border bg-card/60">

                {!user ? (
                  <AuthGate onOpenAuth={onOpenAuth} />

                ) : submitted ? (
                  /* Success state */
                  <div className="flex flex-col items-center gap-3 px-8 py-14 text-center animate-fade-in">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className="h-5 w-5"
                          style={{
                            fill: "oklch(0.74 0.11 80)",
                            stroke: "oklch(0.74 0.11 80)",
                          }}
                        />
                      ))}
                    </div>
                    <p className="font-heading text-xl text-primary mt-2">
                      Thank you, {user}.
                    </p>
                    <div className="gold-line w-10 mt-1" />
                    <p className="text-sm text-muted-foreground mt-1">
                      Your review has been added to our board.
                    </p>
                  </div>

                ) : (
                  /* Unlocked review form */
                  <div className="p-8">
                    <p className="text-[10px] tracking-luxe text-primary uppercase mb-1">
                      Your Voice
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Posting as{" "}
                      <span className="text-primary font-medium">{user}</span>
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] tracking-wide-sm text-muted-foreground uppercase">
                          Your Review
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Describe your experience at Zara Therapy Clinic…"
                          rows={5}
                          className="review-input resize-none border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] tracking-wide-sm text-muted-foreground uppercase">
                          Rating
                        </label>
                        <StarSelector value={rating} onChange={setRating} />
                      </div>

                      {error && (
                        <p className="text-[12px] text-destructive" role="alert">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="mt-1 border border-primary bg-primary px-6 py-3 text-[11px] tracking-wide-sm text-primary-foreground uppercase transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/10 active:scale-[0.98]"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </Reveal>

            {/* ── Right: review wall — always visible ── */}
            <Reveal delay={80}>
              <div className="review-wall">
                {userReviews.length === 0 ? (
                  <EmptyWall user={user} />
                ) : (
                  <div className="review-masonry">
                    {userReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}

                {userReviews.length > 0 && (
                  <p className="mt-4 text-right text-[10px] tracking-wide-sm text-muted-foreground/50 uppercase">
                    {userReviews.length} verified client{" "}
                    {userReviews.length === 1 ? "review" : "reviews"}
                  </p>
                )}
              </div>
            </Reveal>
          </div>
        </div>

      </div>
    </section>
  )
}
