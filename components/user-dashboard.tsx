"use client"

import { useState, useEffect, useCallback } from "react"
import { CalendarX, Sparkles, ArrowDown, Clock, Calendar, User, Tag, BadgeCheck } from "lucide-react"
import { therapists, type Therapist } from "@/components/therapists"
import { getLoggedInUserFull } from "@/components/auth-modal"

/* ─── Types ──────────────────────────────────────────────── */
type Appointment = {
  id: string
  serviceName: string
  serviceCategory: string
  price: number
  duration: string
  date: string
  time: string
  name: string
  email: string
  notes: string
  therapistName: string | null
  therapistId: string | null
  therapistGender: string | null
  userGender: string | null
  bookedAt: string
}

/* ─── Synchronized front-facing photo pools ──────────────── */
// Identical assets to the Therapist Directory — front-facing half-body
// portraits, faces fully visible (no masks/coverings), matching forest
// green clinic scrubs, blurred luxury wellness background. Keeping these
// in sync guarantees an assigned therapist looks the same on every
// dashboard booking card as they do in the directory.
const FEMALE_PHOTOS_UPDATED: Record<string, string> = {
  layla: "/images/therapist-layla.png",
  noor: "/images/therapist-noor.png",
  mariam: "/images/therapist-mariam.png",
  hessa: "/images/therapist-hessa.png",
}

const MALE_PHOTOS_UPDATED: Record<string, string> = {
  khalid: "/images/therapist-khalid.png",
  omar: "/images/therapist-omar.png",
  tariq: "/images/therapist-tariq.png",
  faisal: "/images/therapist-faisal.png",
}

/* ─── Helpers ─────────────────────────────────────────────── */
const APPOINTMENTS_KEY = "zara_appointments"

function getStoredAppointments(): Appointment[] {
  try {
    return JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || "[]")
  } catch {
    return []
  }
}

function saveAppointments(appts: Appointment[]) {
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appts))
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("en-QA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getTherapistPhoto(therapist: Therapist): string {
  const updated =
    therapist.gender === "Female"
      ? FEMALE_PHOTOS_UPDATED[therapist.id]
      : MALE_PHOTOS_UPDATED[therapist.id]
  return updated ?? therapist.photoUrl
}

/* ─── Category badge colour ──────────────────────────────── */
function CategoryHue(category: string): string {
  if (category === "Massage Technique") return "80"
  if (category === "Medical Aid") return "155"
  return "60"
}

/* ─── Booking card ───────────────────────────────────────── */
function BookingCard({
  appointment,
  onCancel,
}: {
  appointment: Appointment
  onCancel: (id: string) => void
}) {
  const [cancelling, setCancelling] = useState(false)
  const [imgError, setImgError] = useState(false)

  const therapist: Therapist | undefined = appointment.therapistId
    ? therapists.find((t) => t.id === appointment.therapistId)
    : undefined

  const hue = CategoryHue(appointment.serviceCategory)

  const photo = therapist ? getTherapistPhoto(therapist) : null

  function handleCancel() {
    setCancelling(true)
    // Brief animation then fire
    setTimeout(() => onCancel(appointment.id), 350)
  }

  return (
    <article
      className={`group relative flex flex-col border border-border bg-card/70 overflow-hidden transition-all duration-500 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/5 ${
        cancelling ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{ transition: cancelling ? "opacity 0.35s ease, transform 0.35s ease" : undefined }}
    >
      {/* Top accent bar */}
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(to right, oklch(0.74 0.11 ${hue} / 0.85), transparent)`,
        }}
      />

      <div className="flex flex-col flex-1 p-6 gap-5">

        {/* Treatment header */}
        <div>
          <span
            className="inline-flex items-center gap-1.5 text-[9px] tracking-widest uppercase"
            style={{ color: `oklch(0.74 0.11 ${hue} / 0.90)` }}
          >
            <Tag className="h-2.5 w-2.5" />
            {appointment.serviceCategory}
          </span>
          <h3 className="font-heading mt-2 text-2xl leading-tight text-foreground">
            {appointment.serviceName}
          </h3>
          <div
            className="mt-3 h-px w-8 transition-all duration-500 group-hover:w-14"
            style={{ background: `oklch(0.74 0.11 ${hue} / 0.55)` }}
          />
        </div>

        {/* Date / Time / Price row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 border border-border/50 bg-background/30 px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-[9px] tracking-widest text-muted-foreground uppercase">
              <Calendar className="h-2.5 w-2.5" />
              Date
            </span>
            <p className="text-[11px] text-foreground leading-snug">{formatDate(appointment.date)}</p>
          </div>
          <div className="flex flex-col gap-1 border border-border/50 bg-background/30 px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-[9px] tracking-widest text-muted-foreground uppercase">
              <Clock className="h-2.5 w-2.5" />
              Time & Duration
            </span>
            <p className="text-[11px] text-foreground">{appointment.time}</p>
            <p className="text-[10px] text-muted-foreground">{appointment.duration}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between border-t border-border/50 pt-4">
          <span className="text-[9px] tracking-widest text-muted-foreground uppercase">Session Fee</span>
          <span
            className="font-heading text-2xl"
            style={{ color: `oklch(0.74 0.11 ${hue})` }}
          >
            QR {appointment.price}
          </span>
        </div>

        {/* Practitioner badge */}
        <div className="border border-border/60 bg-background/20 overflow-hidden">
          <div className="flex items-stretch gap-0">

            {/* Avatar column */}
            <div
              className="relative flex-shrink-0 w-[72px]"
              style={{ background: `oklch(0.18 0.04 ${therapist?.accentHue ?? "80"} / 0.40)` }}
            >
              {therapist && photo && !imgError ? (
                <img
                  src={photo}
                  alt={therapist.name}
                  className="h-full w-full object-cover object-top"
                  style={{ minHeight: "88px" }}
                  onError={() => setImgError(true)}
                  draggable={false}
                />
              ) : therapist ? (
                <div
                  className="flex h-full min-h-[88px] w-full items-center justify-center"
                  style={{ background: `oklch(0.22 0.04 ${therapist.accentHue} / 0.60)` }}
                >
                  <span
                    className="font-heading text-2xl"
                    style={{ color: `oklch(0.74 0.11 ${therapist.accentHue})` }}
                  >
                    {therapist.initials}
                  </span>
                </div>
              ) : (
                <div className="flex h-full min-h-[88px] w-full items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground/40" />
                </div>
              )}

              {/* Bottom gradient overlay on photo */}
              {therapist && !imgError && (
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    background: `linear-gradient(to top, oklch(0.18 0.04 ${therapist.accentHue} / 0.80), transparent)`,
                  }}
                />
              )}
            </div>

            {/* Info column */}
            <div className="flex flex-1 flex-col justify-between gap-2 px-4 py-3">
              <div>
                <p className="text-[9px] tracking-widest text-muted-foreground uppercase mb-1">
                  Assigned Practitioner
                </p>
                <p className="font-heading text-base text-foreground leading-tight">
                  {therapist?.name ?? appointment.therapistName ?? "Any Available Therapist"}
                </p>
                {therapist && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">{therapist.title}</p>
                )}
              </div>

              {/* Status badge */}
              <div
                className="inline-flex items-center gap-1.5 self-start px-2.5 py-1"
                style={{
                  background: `oklch(0.74 0.11 80 / 0.10)`,
                  border: `1px solid oklch(0.74 0.11 80 / 0.30)`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: `oklch(0.74 0.11 80)` }}
                />
                <span
                  className="text-[8px] tracking-widest uppercase font-medium"
                  style={{ color: `oklch(0.74 0.11 80)` }}
                >
                  Practitioner Status: Booked &amp; Reserved
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Cancel button */}
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="group/btn mt-auto flex w-full items-center justify-center gap-2 border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-[10px] tracking-widest text-destructive/70 uppercase transition-all hover:bg-destructive/10 hover:border-destructive/60 hover:text-destructive disabled:opacity-40"
        >
          <CalendarX className="h-3.5 w-3.5 transition-transform group-hover/btn:scale-110" />
          Cancel Session
        </button>

      </div>
    </article>
  )
}

/* ─── Empty state ────────────────────────────────────────── */
function EmptyState({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-20 px-6">
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center border"
        style={{
          borderColor: "oklch(0.74 0.11 80 / 0.25)",
          background: "oklch(0.74 0.11 80 / 0.04)",
        }}
      >
        <CalendarX
          className="h-7 w-7"
          style={{ color: "oklch(0.74 0.11 80 / 0.50)" }}
        />
      </div>
      <p
        className="text-[9px] tracking-widest uppercase mb-3"
        style={{ color: "oklch(0.74 0.11 80 / 0.70)" }}
      >
        No Active Reservations
      </p>
      <p className="font-heading text-2xl text-foreground mb-2">Your calendar is clear.</p>
      <div
        className="mx-auto mb-5 h-px w-12"
        style={{ background: "oklch(0.74 0.11 80 / 0.35)" }}
      />
      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
        You do not have any upcoming muscle therapy sessions scheduled at our Doha branch.
        Browse our treatments to begin your restoration journey.
      </p>
      <button
        onClick={onBrowse}
        className="mt-8 inline-flex items-center gap-2.5 border px-8 py-3 text-[10px] tracking-widest uppercase transition-all hover:opacity-80"
        style={{
          borderColor: "oklch(0.74 0.11 80 / 0.50)",
          color: "oklch(0.74 0.11 80)",
          background: "oklch(0.74 0.11 80 / 0.06)",
        }}
      >
        <Sparkles className="h-3.5 w-3.5" />
        Explore Treatments
      </button>
    </div>
  )
}

/* ─── Logged-out gate ─────────────────────────────────────── */
function LoggedOutGate({ onOpenAuth }: { onOpenAuth: () => void }) {
  return (
    <div
      className="relative overflow-hidden border py-20 px-8 text-center"
      style={{
        borderColor: "oklch(0.38 0.035 140 / 40%)",
        background:
          "linear-gradient(135deg, oklch(0.23 0.03 155 / 0.85) 0%, oklch(0.20 0.028 155 / 0.95) 100%)",
      }}
    >
      {/* Decorative corner marks */}
      <span className="pointer-events-none absolute left-4 top-4 text-[10px] tracking-widest text-primary/20 uppercase select-none">
        ◆
      </span>
      <span className="pointer-events-none absolute right-4 bottom-4 text-[10px] tracking-widest text-primary/20 uppercase select-none">
        ◆
      </span>

      <div
        className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border"
        style={{
          borderColor: "oklch(0.74 0.11 80 / 0.25)",
          background: "oklch(0.74 0.11 80 / 0.06)",
        }}
      >
        <User className="h-6 w-6" style={{ color: "oklch(0.74 0.11 80 / 0.60)" }} />
      </div>

      <p
        className="text-[9px] tracking-widest uppercase mb-3"
        style={{ color: "oklch(0.74 0.11 80 / 0.70)" }}
      >
        Private Member Area
      </p>

      <p className="font-heading text-2xl text-foreground mb-2 max-w-md mx-auto leading-snug">
        Your Reservations Await.
      </p>

      <div
        className="mx-auto mb-5 h-px w-12"
        style={{ background: "oklch(0.74 0.11 80 / 0.35)" }}
      />

      <p className="max-w-sm mx-auto text-sm leading-relaxed text-muted-foreground mb-8">
        Please log in or create an account to view your personalised upcoming appointments
        and matched therapist allocations at our Doha branch.
      </p>

      <button
        onClick={onOpenAuth}
        className="inline-flex items-center gap-2.5 border px-10 py-3 text-[10px] tracking-widest uppercase transition-all hover:opacity-80"
        style={{
          borderColor: "oklch(0.74 0.11 80 / 0.60)",
          background: "oklch(0.74 0.11 80)",
          color: "oklch(0.20 0.03 150)",
        }}
      >
        <BadgeCheck className="h-3.5 w-3.5" />
        Login / Sign Up
      </button>
    </div>
  )
}

/* ─── Main UserDashboard export ──────────────────────────── */
export function UserDashboard({
  user,
  onOpenAuth,
  onBrowseTreatments,
}: {
  user: string | null
  onOpenAuth: () => void
  onBrowseTreatments: () => void
}) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [userEmail, setUserEmail] = useState<string | null>(null)

  /* Read appointments for the logged-in user */
  const loadAppointments = useCallback(() => {
    if (!user) { setAppointments([]); return }
    const full = getLoggedInUserFull()
    setUserEmail(full?.email ?? null)
    const all = getStoredAppointments()
    // Match by name (session identifier) or email
    const mine = all.filter((a) =>
      a.name.toLowerCase() === user.toLowerCase() ||
      (full?.email && a.email.toLowerCase() === full.email.toLowerCase())
    )
    // Only upcoming
    const upcoming = mine.filter(
      (a) => new Date(a.date + "T23:59:59") >= new Date()
    )
    setAppointments(upcoming)
  }, [user])

  useEffect(() => {
    loadAppointments()
    /* Listen for real-time booking confirms from BookingWizard */
    window.addEventListener("zara_appointments_changed", loadAppointments)
    return () => window.removeEventListener("zara_appointments_changed", loadAppointments)
  }, [loadAppointments])

  /* Cancel handler — removes appointment and releases therapist slot */
  function handleCancel(id: string) {
    const all = getStoredAppointments()
    const updated = all.filter((a) => a.id !== id)
    saveAppointments(updated)
    // Re-read to sync state immediately
    const full = getLoggedInUserFull()
    const mine = updated.filter(
      (a) =>
        a.name.toLowerCase() === (user ?? "").toLowerCase() ||
        (full?.email && a.email.toLowerCase() === full.email.toLowerCase())
    )
    const upcoming = mine.filter(
      (a) => new Date(a.date + "T23:59:59") >= new Date()
    )
    setAppointments(upcoming)
    // Dispatch a custom event so BookingWizard's availability check also re-evaluates
    window.dispatchEvent(new CustomEvent("zara_appointments_changed"))
  }

  /* ── Render ── */
  return (
    <section id="dashboard" className="relative py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Section header */}
        <div className="mb-10">
          <p
            className="text-[10px] tracking-widest uppercase"
            style={{ color: "oklch(0.74 0.11 80)" }}
          >
            Member Dashboard
          </p>
          <h2 className="font-heading mt-3 text-4xl text-foreground sm:text-5xl">
            Your Reservations
          </h2>
          <div
            className="mt-5 h-px w-16"
            style={{
              background:
                "linear-gradient(to right, oklch(0.74 0.11 80 / 0.80), transparent)",
            }}
          />
          {user && (
            <p className="mt-4 text-sm text-muted-foreground max-w-lg">
              Welcome back,{" "}
              <span className="text-foreground font-medium">{user}</span>. Your
              upcoming sessions and therapist assignments are displayed below.
              {userEmail && (
                <span className="ml-1 text-muted-foreground/60 text-xs">
                  ({userEmail})
                </span>
              )}
            </p>
          )}
        </div>

        {/* Gate: not logged in */}
        {!user && <LoggedOutGate onOpenAuth={onOpenAuth} />}

        {/* Logged in: show bookings or empty state */}
        {user && appointments.length === 0 && (
          <EmptyState onBrowse={onBrowseTreatments} />
        )}

        {user && appointments.length > 0 && (
          <>
            {/* Active bookings count */}
            <div
              className="mb-8 inline-flex items-center gap-2.5 border px-4 py-2"
              style={{
                borderColor: "oklch(0.74 0.11 80 / 0.25)",
                background: "oklch(0.74 0.11 80 / 0.05)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: "oklch(0.74 0.11 80)" }}
              />
              <p
                className="text-[10px] tracking-widest uppercase"
                style={{ color: "oklch(0.74 0.11 80)" }}
              >
                {appointments.length} Active{" "}
                {appointments.length === 1 ? "Reservation" : "Reservations"} —
                Practitioners Reserved
              </p>
            </div>

            {/* Cards grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {appointments.map((appt) => (
                <BookingCard
                  key={appt.id}
                  appointment={appt}
                  onCancel={handleCancel}
                />
              ))}
            </div>

            {/* Scroll hint */}
            <div className="mt-12 flex items-center justify-center gap-3">
              <div
                className="h-px flex-1 max-w-[80px]"
                style={{ background: "oklch(0.38 0.035 140 / 40%)" }}
              />
              <ArrowDown
                className="h-3.5 w-3.5"
                style={{ color: "oklch(0.74 0.11 80 / 0.40)" }}
              />
              <p
                className="text-[9px] tracking-widest uppercase"
                style={{ color: "oklch(0.74 0.11 80 / 0.40)" }}
              >
                Continue exploring
              </p>
              <div
                className="h-px flex-1 max-w-[80px]"
                style={{ background: "oklch(0.38 0.035 140 / 40%)" }}
              />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
