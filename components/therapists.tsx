"use client"

import { useEffect, useState } from "react"
import { Reveal } from "@/components/reveal"
import { getLoggedInUserFull, type Gender } from "@/components/auth-modal"

/* ─── Types ───────────────────────────────────────────────── */
export type Therapist = {
  id: string
  name: string
  title: string
  gender: Gender
  experience: string
  about: string
  specialties: string[]
  initials: string
  accentHue: string
  photoUrl: string
}

/* ─── Portrait pools — front-facing, no masks, forest green clinic scrubs ── */
/*
  Synchronized AI studio portraits. Every asset is a realistic, high-quality
  front-facing half-body shot: the therapist looks directly into the camera,
  the face is fully visible and uncovered (no masks, no obstructive headwear,
  no hair across the face), they wear matching forest green medical clinic
  scrubs, and the background is a soft, warm, blurred luxury wellness clinic
  bokeh. These parameters are identical across the directory and every
  dashboard / booking card where the same therapist appears.
  object-center keeps the face visible in the card crop.
*/
const FEMALE_PHOTOS: string[] = [
  // Layla — warm-lit direct front-facing portrait, forest green scrubs
  "/images/therapist-layla.png",
  // Noor — confident frontal portrait, forest green scrubs
  "/images/therapist-noor.png",
  // Mariam — composed clinical portrait, forest green scrubs
  "/images/therapist-mariam.png",
  // Hessa — serene frontal portrait, forest green scrubs
  "/images/therapist-hessa.png",
]

const MALE_PHOTOS: string[] = [
  // Khalid — direct front-facing portrait, forest green scrubs
  "/images/therapist-khalid.png",
  // Omar — calm frontal portrait, forest green scrubs
  "/images/therapist-omar.png",
  // Tariq — relaxed direct-facing portrait, forest green scrubs
  "/images/therapist-tariq.png",
  // Faisal — warm frontal portrait, forest green scrubs
  "/images/therapist-faisal.png",
]

/* ─── Therapist roster ────────────────────────────────────── */
export const therapists: Therapist[] = [
  // ── Female ──
  {
    id: "layla",
    name: "Layla Al-Rashidi",
    title: "Senior Massage Therapist",
    gender: "Female",
    experience: "11 Years of Experience",
    about:
      "Layla's approach is rooted in the belief that true healing begins with trust. Trained in Swedish and deep tissue methodology, she tailors every session to the client's rhythm — never rushing, always listening. Her sessions are a quiet conversation between touch and tension.",
    specialties: ["Deep Tissue Release", "Swedish Relaxation", "Aromatherapy Indulgence"],
    initials: "LA",
    accentHue: "80",
    photoUrl: FEMALE_PHOTOS[0],
  },
  {
    id: "noor",
    name: "Noor Khalid",
    title: "Holistic Wellness Specialist",
    gender: "Female",
    experience: "8 Years of Experience",
    about:
      "Noor merges Eastern wellness philosophy with Western clinical training to create deeply integrative sessions. Her specialty in lymphatic work and circulation therapy has helped dozens of clients manage chronic fatigue and post-surgical recovery with grace and precision.",
    specialties: ["Circulation & Lymphatic", "Hot Stone Ritual", "Scalp & Crown Renewal"],
    initials: "NK",
    accentHue: "140",
    photoUrl: FEMALE_PHOTOS[1],
  },
  {
    id: "mariam",
    name: "Mariam Youssef",
    title: "Clinical Rehabilitation Therapist",
    gender: "Female",
    experience: "9 Years of Experience",
    about:
      "Mariam brings a clinical eye and a caring touch to every session. Her background in physiotherapy informs her rehabilitation work — she reads the body like a map and works methodically to restore what stress and injury have taken.",
    specialties: ["Injury Rehabilitation", "Sports Recovery Therapy", "Deep Tissue Release"],
    initials: "MY",
    accentHue: "60",
    photoUrl: FEMALE_PHOTOS[2],
  },
  {
    id: "hessa",
    name: "Hessa Al-Mannai",
    title: "Beauty & Restoration Expert",
    gender: "Female",
    experience: "6 Years of Experience",
    about:
      "Hessa believes that beauty treatments are as much about inner stillness as outer glow. Her facial and scalp rituals combine botanical knowledge with pressure-point mastery. Clients leave her room looking rested — and feeling profoundly themselves again.",
    specialties: ["Radiance Facial Therapy", "Scalp & Crown Renewal", "Aromatherapy Indulgence"],
    initials: "HA",
    accentHue: "50",
    photoUrl: FEMALE_PHOTOS[3],
  },
  // ── Male ──
  {
    id: "khalid",
    name: "Khalid Al-Sulaiti",
    title: "Sports & Deep Tissue Specialist",
    gender: "Male",
    experience: "13 Years of Experience",
    about:
      "Khalid has spent over a decade working with elite athletes across Qatar and the GCC, developing an instinctive understanding of high-performance bodies and the recovery they demand. His sessions are deliberate, powerful, and built on anatomical precision.",
    specialties: ["Sports Recovery Therapy", "Deep Tissue Release", "Injury Rehabilitation"],
    initials: "KS",
    accentHue: "80",
    photoUrl: MALE_PHOTOS[0],
  },
  {
    id: "omar",
    name: "Omar Jabr",
    title: "Medical & Rehabilitation Therapist",
    gender: "Male",
    experience: "10 Years of Experience",
    about:
      "Omar's clinical background in sports medicine shapes his diagnostic approach — he assesses before he treats, ensuring each technique serves a real physiological need. His calm authority puts clients at ease even during intensive protocols.",
    specialties: ["Injury Rehabilitation", "Circulation & Lymphatic", "Sports Recovery Therapy"],
    initials: "OJ",
    accentHue: "155",
    photoUrl: MALE_PHOTOS[1],
  },
  {
    id: "tariq",
    name: "Tariq Hassan",
    title: "Relaxation & Wellness Therapist",
    gender: "Male",
    experience: "7 Years of Experience",
    about:
      "Tariq trained in Thailand and Sweden before bringing his craft to Doha, blending Eastern rhythmic flow with Nordic precision. He specialises in helping clients transition from chronic stress into genuine stillness — his Hot Stone sessions are legendary among regulars.",
    specialties: ["Swedish Relaxation", "Hot Stone Ritual", "Aromatherapy Indulgence"],
    initials: "TH",
    accentHue: "70",
    photoUrl: MALE_PHOTOS[2],
  },
  {
    id: "faisal",
    name: "Faisal Al-Dosari",
    title: "Advanced Massage Therapist",
    gender: "Male",
    experience: "8 Years of Experience",
    about:
      "Faisal has a gift for reading what words cannot say — he works intuitively, adjusting pressure and rhythm in real time to what the body needs in the moment. His sessions are as meditative for him as they are healing for his clients.",
    specialties: ["Swedish Relaxation", "Deep Tissue Release", "Scalp & Crown Renewal"],
    initials: "FD",
    accentHue: "90",
    photoUrl: MALE_PHOTOS[3],
  },
]

/* ─── Helper: get therapists for a treatment, optionally filtered by gender ── */
export function getTherapistsForTreatment(
  treatmentName: string,
  gender?: Gender | null,
): Therapist[] {
  return therapists.filter(
    (t) =>
      t.specialties.includes(treatmentName) &&
      (gender ? t.gender === gender : true),
  )
}

/* ─── Helper: check if a therapist is booked for a given date+time slot ────── */
export function isTherapistBooked(
  therapistId: string,
  date: string,
  time: string,
): boolean {
  try {
    const all: Array<{ therapistId: string | null; date: string; time: string }> =
      JSON.parse(localStorage.getItem("zara_appointments") || "[]")
    return all.some(
      (a) => a.therapistId === therapistId && a.date === date && a.time === time,
    )
  } catch {
    return false
  }
}

/* ─── Portrait photo frame ───────────────────────────────── */
function TherapistPhoto({ therapist }: { therapist: Therapist }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className="relative mx-auto w-full overflow-hidden"
      style={{
        aspectRatio: "3 / 4",
        maxHeight: "430px",
        boxShadow: `0 0 28px oklch(0.74 0.11 ${therapist.accentHue} / 0.14)`,
      }}
    >
      {/* Accent border overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ border: `1px solid oklch(0.74 0.11 ${therapist.accentHue} / 0.30)` }}
      />

      {!imgError ? (
        <img
          src={therapist.photoUrl}
          alt={`${therapist.name} — ${therapist.title}`}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
          onError={() => setImgError(true)}
          loading="lazy"
          draggable={false}
        />
      ) : (
        /* Initials fallback */
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ background: `oklch(0.20 0.04 ${therapist.accentHue})` }}
        >
          <span
            className="font-heading text-5xl"
            style={{ color: `oklch(0.74 0.11 ${therapist.accentHue} / 0.80)` }}
          >
            {therapist.initials}
          </span>
        </div>
      )}

      {/* Bottom gradient scrim */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3"
        style={{
          background: "linear-gradient(to top, oklch(0.12 0.03 130 / 0.85), transparent)",
        }}
      />

      {/* Gender badge */}
      <p
        className="absolute bottom-2.5 left-3 z-20 text-[9px] tracking-wide-sm uppercase"
        style={{ color: `oklch(0.82 0.10 ${therapist.accentHue})` }}
      >
        {therapist.gender === "Female" ? "◆ Female Specialist" : "◆ Male Specialist"}
      </p>
    </div>
  )
}

/* ─── Therapist card ─────────────────────────────────────── */
function TherapistCard({ therapist }: { therapist: Therapist }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="group flex flex-col border border-border bg-card/60 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
      <TherapistPhoto therapist={therapist} />

      <div className="flex flex-col flex-1 p-6">
        <div
          className="mb-5 h-px w-10 transition-all duration-500 group-hover:w-16"
          style={{ background: `oklch(0.74 0.11 ${therapist.accentHue} / 0.60)` }}
        />

        <h3 className="font-heading text-2xl text-foreground leading-tight">
          {therapist.name}
        </h3>
        <p className="mt-1 text-[11px] tracking-wide-sm text-muted-foreground uppercase">
          {therapist.title}
        </p>
        <div className="mt-3 h-px w-6 opacity-40" style={{ background: `oklch(0.74 0.11 ${therapist.accentHue})` }} />
        <p
          className="mt-3 text-[11px] tracking-wide-sm uppercase"
          style={{ color: `oklch(0.74 0.11 ${therapist.accentHue} / 0.80)` }}
        >
          {therapist.experience}
        </p>

        <div className="mt-4 flex-1">
          <p className={`text-sm leading-relaxed text-muted-foreground transition-all duration-300 ${expanded ? "" : "line-clamp-3"}`}>
            {therapist.about}
          </p>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="mt-2 text-[10px] tracking-wide-sm text-primary/70 uppercase hover:text-primary transition-colors"
          >
            {expanded ? "Read less ↑" : "Read more ↓"}
          </button>
        </div>

        <div className="mt-5 border-t border-border/50 pt-5">
          <p className="mb-3 text-[10px] tracking-luxe text-muted-foreground uppercase">
            Specialises in
          </p>
          <div className="flex flex-col gap-1.5">
            {therapist.specialties.map((s) => (
              <span key={s} className="inline-flex items-center gap-2 text-[11px] text-muted-foreground">
                <span
                  className="h-1 w-1 rounded-full flex-shrink-0"
                  style={{ background: `oklch(0.74 0.11 ${therapist.accentHue} / 0.60)` }}
                />
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

/* ─── Therapists section (main export) ──────────────────── */
export function Therapists({
  user,
  onOpenAuth: _onOpenAuth,
}: {
  user: string | null
  onOpenAuth: () => void
}) {
  const [userGender, setUserGender] = useState<Gender | null>(null)

  useEffect(() => {
    if (user) {
      const full = getLoggedInUserFull()
      setUserGender(full?.gender ?? null)
    } else {
      setUserGender(null)
    }
  }, [user])

  /*
    Display logic:
    - Logged out  → show ALL therapists (full public roster, no filter)
    - Logged in   → filter to user's own gender only (comfort & privacy)
  */
  const displayed = user && userGender
    ? therapists.filter((t) => t.gender === userGender)
    : therapists

  const isFiltered = !!(user && userGender)

  return (
    <section id="therapists" className="relative py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Section header */}
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] tracking-luxe text-primary uppercase">
                Our Specialists
              </p>
              <h2 className="font-heading mt-4 text-balance text-4xl text-foreground sm:text-5xl">
                {isFiltered ? "Your Matched Team" : "Meet Our Therapists"}
              </h2>
              <div className="gold-line mt-6 w-20" />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground lg:text-right">
              {isFiltered
                ? `Showing ${displayed.length} ${userGender!.toLowerCase()} therapist${displayed.length !== 1 ? "s" : ""} matched to your profile — your comfort and privacy are our highest priority.`
                : "Every therapist at Zara is certified, culturally aware, and dedicated to your wellbeing. Sign in to unlock your personalised gender-matched team."}
            </p>
          </div>
        </Reveal>

        {/* Status badge */}
        {isFiltered ? (
          <Reveal delay={80}>
            <div className="mt-8 inline-flex items-center gap-2.5 border border-primary/30 bg-primary/5 px-4 py-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[11px] tracking-wide-sm text-primary uppercase">
                Comfort filter active — showing {userGender!.toLowerCase()} therapists only
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={80}>
            <div className="mt-8 inline-flex items-center gap-2.5 border border-border/60 bg-card/40 px-4 py-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              <p className="text-[11px] tracking-wide-sm text-muted-foreground uppercase">
                Browsing full public roster · Sign in to see your personalised gender-matched team
              </p>
            </div>
          </Reveal>
        )}

        {/* Therapist grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayed.map((t, i) => (
            <Reveal key={t.id} delay={i * 80}>
              <TherapistCard therapist={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
