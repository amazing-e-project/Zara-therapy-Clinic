"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronRight, ChevronLeft, Check, Calendar, Clock, User, Users, AlertCircle } from "lucide-react"
import { services, categories, type Service } from "@/lib/clinic-data"
import { getLoggedInUserFull, type Gender } from "@/components/auth-modal"
import {
  therapists,
  getTherapistsForTreatment,
  type Therapist,
} from "@/components/therapists"

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
  therapistGender: Gender | null
  userGender: Gender | null
  bookedAt: string
}

const APPOINTMENTS_KEY = "zara_appointments"

const timeSlots = [
  "09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
]

/* ─── Helpers ─────────────────────────────────────────────── */
function getDatesForNextWeeks(weeks = 3): string[] {
  const dates: string[] = []
  const today = new Date()
  for (let i = 1; i <= weeks * 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if (d.getDay() !== 0) {
      dates.push(d.toISOString().split("T")[0])
    }
  }
  return dates
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("en-QA", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })
}

function getStoredAppointments(): Appointment[] {
  try {
    return JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || "[]")
  } catch { return [] }
}

/* 
  Cross-service availability check:
  A therapist is unavailable for a given date+time if they have ANY booking
  across ALL treatments for that exact slot — regardless of treatment category.
*/
function isTherapistAvailable(therapistId: string, date: string, time: string): boolean {
  if (!date || !time) return true
  const all = getStoredAppointments()
  return !all.some(
    (a) => a.therapistId === therapistId && a.date === date && a.time === time,
  )
}

/* ─── Booking Wizard ─────────────────────────────────────── */
type Step = "service" | "therapist" | "datetime" | "details" | "confirm" | "success"

export function BookingWizard({
  onClose,
  preselectedService,
  preselectedTherapist,
  onRequireAuth,
}: {
  onClose: () => void
  preselectedService?: Service | null
  preselectedTherapist?: Therapist | null
  onRequireAuth?: () => void
}) {
  const [userGender, setUserGender] = useState<Gender | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")
  const [appointments, setAppointments] = useState<Appointment[]>([])

  /* Live bookings snapshot — refreshes when date/time changes so availability
     indicators update in real time as the user picks a slot */
  const [liveBookings, setLiveBookings] = useState<Appointment[]>([])

  const startStep: Step = preselectedService
    ? preselectedTherapist ? "datetime" : "therapist"
    : "service"

  const [step, setStep] = useState<Step>(startStep)
  const [categoryFilter, setCategoryFilter] = useState<string>("All")
  const [selectedService, setSelectedService] = useState<Service | null>(preselectedService ?? null)
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(preselectedTherapist ?? null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")

  const dates = getDatesForNextWeeks(3)

  /* Refresh liveBookings whenever appointments array might have changed */
  const refreshLive = useCallback(() => {
    setLiveBookings(getStoredAppointments())
  }, [])

  useEffect(() => {
    const full = getLoggedInUserFull()
    if (full) {
      setUserGender(full.gender)
      setName(full.name)
      setEmail(full.email)
    }
    const stored = getStoredAppointments()
    setAppointments(stored)
    setLiveBookings(stored)

    /* Listen for cancellation events fired by UserDashboard */
    const handleChange = () => refreshLive()
    window.addEventListener("zara_appointments_changed", handleChange)
    return () => window.removeEventListener("zara_appointments_changed", handleChange)
  }, [refreshLive])

  /* Re-check availability whenever date changes */
  useEffect(() => { refreshLive() }, [selectedDate, refreshLive])

  /* Therapists eligible for the selected service (gender-filtered when logged in) */
  const availableTherapists: Therapist[] = selectedService
    ? getTherapistsForTreatment(selectedService.name, userGender)
    : userGender
    ? therapists.filter((t) => t.gender === userGender)
    : therapists

  /* For the therapist picker, annotate each therapist with their availability
     for the currently-selected date+time (cross-service block) */
  function therapistIsBookedForSlot(therapistId: string): boolean {
    if (!selectedDate || !selectedTime) return false
    return liveBookings.some(
      (a) => a.therapistId === therapistId && a.date === selectedDate && a.time === selectedTime,
    )
  }

  /* Steps */
  const wizardSteps: { key: Step; label: string }[] = [
    { key: "service",   label: "Treatment" },
    { key: "therapist", label: "Therapist" },
    { key: "datetime",  label: "Date & Time" },
    { key: "details",   label: "Your Details" },
    { key: "confirm",   label: "Confirm" },
  ]
  const visibleSteps = wizardSteps.filter((s) => {
    if (s.key === "service"   && preselectedService)   return false
    if (s.key === "therapist" && preselectedTherapist) return false
    return true
  })
  const currentVisibleIndex = visibleSteps.findIndex((s) => s.key === step)

  const filteredServices =
    categoryFilter === "All"
      ? services
      : services.filter((s) => s.category === categoryFilter)

  /* ── Handlers ── */
  function handleSelectService(s: Service) {
    setSelectedService(s)
    setSelectedTherapist(null)
    setSelectedDate("")
    setSelectedTime("")
    setStep("therapist")
  }

  function handleSelectTherapist(t: Therapist | null) {
    setSelectedTherapist(t)
    setStep("datetime")
  }

  function handleDateTimeNext() {
    if (!selectedDate || !selectedTime) {
      setError("Please select a date and time slot.")
      return
    }
    setError("")
    setStep("details")
  }

  function handleDetailsNext() {
    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.")
      return
    }
    setError("")
    setStep("confirm")
  }

  function handleConfirm() {
    if (!selectedService || !selectedDate || !selectedTime) return

    /*
      Strict authorization gate:
      A reservation may only be written by an authenticated member. If there is
      no active session, block the submission entirely (nothing is written to
      localStorage) and surface the themed login / sign-up modal instead.
    */
    const hasSession =
      typeof window !== "undefined" && !!localStorage.getItem("zara_session")
    if (!hasSession) {
      onRequireAuth?.()
      return
    }

    const appt: Appointment = {
      id: `zara-${Date.now()}`,
      serviceName: selectedService.name,
      serviceCategory: selectedService.category,
      price: selectedService.price,
      duration: selectedService.duration,
      date: selectedDate,
      time: selectedTime,
      name: name.trim(),
      email: email.trim(),
      notes: notes.trim(),
      therapistName: selectedTherapist?.name ?? null,
      therapistId: selectedTherapist?.id ?? null,
      therapistGender: selectedTherapist?.gender ?? null,
      userGender: userGender,
      bookedAt: new Date().toISOString(),
    }
    const existing = getStoredAppointments()
    existing.push(appt)
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(existing))
    setAppointments(existing)
    setLiveBookings(existing)
    setStep("success")

    /*
      Dispatch real-time event so UserDashboard instantly reflects
      the new booking without a page reload.
    */
    window.dispatchEvent(new CustomEvent("zara_appointments_changed"))
  }

  function goBack() {
    if (step === "therapist") {
      if (preselectedService) { onClose(); return }
      setStep("service")
    } else if (step === "datetime") {
      if (preselectedTherapist) { onClose(); return }
      setStep("therapist")
    } else if (step === "details") {
      setStep("datetime")
    } else if (step === "confirm") {
      setStep("details")
    }
  }

  /* ── Render ── */
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Reserve a session"
    >
      <div
        className="animate-scale-in relative w-full max-w-2xl border border-border bg-card shadow-2xl"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-7 py-5">
          <div>
            <p className="text-[10px] tracking-luxe text-primary uppercase">Zara Therapy Clinic</p>
            <h2 className="font-heading mt-0.5 text-2xl text-foreground">
              {step === "success" ? "Reservation Confirmed" : "Reserve a Session"}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground transition-colors hover:text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Gender comfort badge */}
        {userGender && step !== "success" && (
          <div className="flex items-center gap-2.5 border-b border-border/50 bg-primary/5 px-7 py-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <p className="text-[10px] tracking-wide-sm text-primary uppercase">
              Comfort filter active — showing {userGender.toLowerCase()} therapists only
            </p>
          </div>
        )}

        {/* Progress bar */}
        {step !== "success" && (
          <div className="flex px-7 pt-5 pb-2 gap-2">
            {visibleSteps.map((vs, i) => (
              <div key={vs.key} className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center text-[10px] font-medium transition-all ${
                  i < currentVisibleIndex
                    ? "bg-primary text-primary-foreground"
                    : i === currentVisibleIndex
                    ? "border border-primary text-primary"
                    : "border border-border text-muted-foreground"
                }`}>
                  {i < currentVisibleIndex ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                <span className={`text-[10px] tracking-wide-sm uppercase truncate ${
                  i === currentVisibleIndex ? "text-foreground" : "text-muted-foreground"
                }`}>{vs.label}</span>
                {i < visibleSteps.length - 1 && <div className="h-px flex-1 bg-border" />}
              </div>
            ))}
          </div>
        )}

        <div className="px-7 py-6">

          {/* ── STEP: Service ── */}
          {step === "service" && (
            <div>
              <p className="text-sm text-muted-foreground mb-5">Choose your treatment to begin.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {(["All", ...categories] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategoryFilter(c)}
                    className={`border px-4 py-1.5 text-[10px] tracking-wide-sm uppercase transition-all ${
                      categoryFilter === c
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >{c}</button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredServices.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => handleSelectService(s)}
                    className="group text-left border border-border bg-card/60 p-5 transition-all hover:border-primary/60 hover:-translate-y-0.5"
                  >
                    <span className="text-[9px] tracking-wide-sm text-primary uppercase">{s.category}</span>
                    <h3 className="font-heading mt-1.5 text-xl text-foreground group-hover:text-primary transition-colors">{s.name}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">{s.description}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      <span className="font-heading text-lg text-primary">QR {s.price}</span>
                      <span className="text-[10px] tracking-wide-sm text-muted-foreground uppercase">{s.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP: Therapist ── */}
          {step === "therapist" && selectedService && (
            <div>
              <div className="mb-6 flex items-center gap-4 border border-primary/30 bg-primary/5 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-lg text-primary">{selectedService.name}</p>
                  <p className="text-[10px] tracking-wide-sm text-muted-foreground uppercase">{selectedService.duration} · QR {selectedService.price}</p>
                </div>
                {!preselectedService && (
                  <button onClick={() => setStep("service")} className="text-[10px] tracking-wide-sm text-muted-foreground uppercase hover:text-primary transition-colors">Change</button>
                )}
              </div>

              <div className="flex items-center gap-2 mb-5">
                <Users className="h-4 w-4 text-primary" />
                <p className="text-[11px] tracking-wide-sm text-muted-foreground uppercase">
                  {userGender ? `Select your ${userGender.toLowerCase()} therapist` : "Select your therapist"}
                </p>
              </div>

              {selectedDate && selectedTime && (
                <div className="mb-4 flex items-center gap-2 border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500/70 flex-shrink-0" />
                  <p className="text-[10px] tracking-wide-sm text-amber-500/80 uppercase">
                    Availability shown for {selectedDate} · {selectedTime}
                  </p>
                </div>
              )}

              {availableTherapists.length === 0 ? (
                <div className="border border-border bg-card/40 px-6 py-10 text-center">
                  <p className="text-sm text-muted-foreground">No therapist is currently assigned to this treatment for your profile.</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {availableTherapists.map((t) => {
                    const slotBooked = therapistIsBookedForSlot(t.id)
                    return (
                      <button
                        key={t.id}
                        onClick={() => !slotBooked && handleSelectTherapist(t)}
                        disabled={slotBooked}
                        className={`group text-left border bg-card/60 p-5 transition-all ${
                          slotBooked
                            ? "opacity-50 cursor-not-allowed border-border"
                            : selectedTherapist?.id === t.id
                            ? "border-primary bg-primary/5 hover:-translate-y-0.5"
                            : "border-border hover:border-primary/60 hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="relative flex h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border"
                            style={{ borderColor: `oklch(0.74 0.11 ${t.accentHue} / 0.40)` }}
                          >
                            <img
                              src={t.photoUrl}
                              alt={t.name}
                              className="h-full w-full object-cover object-center"
                              onError={(e) => {
                                const el = e.currentTarget as HTMLImageElement
                                el.style.display = "none"
                                const fb = el.nextElementSibling as HTMLElement | null
                                if (fb) fb.style.display = "flex"
                              }}
                            />
                            <div
                              className="absolute inset-0 items-center justify-center text-sm font-heading hidden"
                              style={{
                                color: `oklch(0.74 0.11 ${t.accentHue})`,
                                background: `oklch(0.28 0.04 ${t.accentHue} / 0.30)`,
                              }}
                            >
                              {t.initials}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-heading text-base text-foreground group-hover:text-primary transition-colors truncate">{t.name}</p>
                            <p className="text-[10px] tracking-wide-sm text-muted-foreground uppercase">{t.title}</p>
                          </div>
                          {/* Availability badge */}
                          {selectedDate && selectedTime && (
                            <span
                              className={`ml-auto flex-shrink-0 text-[8px] tracking-wide-sm uppercase px-2 py-1 ${
                                slotBooked
                                  ? "bg-destructive/10 text-destructive/80 border border-destructive/20"
                                  : "bg-primary/10 text-primary border border-primary/20"
                              }`}
                            >
                              {slotBooked ? "Unavailable" : "Available"}
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-[10px] tracking-wide-sm text-primary/70 uppercase">{t.experience}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">{t.about}</p>
                      </button>
                    )
                  })}
                </div>
              )}

              <button
                onClick={() => handleSelectTherapist(null)}
                className="mt-4 w-full border border-border py-2.5 text-[10px] tracking-wide-sm text-muted-foreground uppercase hover:border-primary/30 hover:text-foreground transition-all"
              >
                No preference — assign me any available therapist
              </button>

              {!preselectedService && (
                <div className="mt-5">
                  <button onClick={goBack} className="flex items-center gap-2 border border-border px-5 py-2.5 text-[11px] tracking-wide-sm text-muted-foreground uppercase hover:text-foreground transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── STEP: Date & Time ── */}
          {step === "datetime" && selectedService && (
            <div>
              <div className="mb-6 flex flex-col gap-2">
                <div className="flex items-center gap-4 border border-primary/30 bg-primary/5 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-lg text-primary">{selectedService.name}</p>
                    <p className="text-[10px] tracking-wide-sm text-muted-foreground uppercase">{selectedService.duration} · QR {selectedService.price}</p>
                  </div>
                </div>
                {selectedTherapist && (
                  <div className="flex items-center gap-3 border border-border bg-card/40 px-4 py-3">
                    <User className="h-4 w-4 text-primary/60 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] tracking-wide-sm text-muted-foreground uppercase">Therapist</p>
                      <p className="text-sm text-foreground">{selectedTherapist.name} · {selectedTherapist.title}</p>
                    </div>
                    {!preselectedTherapist && (
                      <button onClick={() => setStep("therapist")} className="ml-auto text-[10px] tracking-wide-sm text-muted-foreground uppercase hover:text-primary transition-colors flex-shrink-0">Change</button>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-[11px] tracking-wide-sm text-muted-foreground uppercase mb-3">
                    <Calendar className="h-4 w-4 text-primary" /> Select Date
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                    {dates.slice(0, 15).map((d) => {
                      const dateObj = new Date(d + "T00:00:00")
                      const dayName = dateObj.toLocaleDateString("en-QA", { weekday: "short" })
                      const dayNum = dateObj.getDate()
                      const month = dateObj.toLocaleDateString("en-QA", { month: "short" })
                      return (
                        <button
                          key={d}
                          onClick={() => { setSelectedDate(d); setSelectedTime("") }}
                          className={`flex flex-col items-center border py-3 px-1 transition-all text-center ${
                            selectedDate === d
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          }`}
                        >
                          <span className="text-[9px] tracking-wide-sm uppercase">{dayName}</span>
                          <span className="font-heading text-xl mt-0.5">{dayNum}</span>
                          <span className="text-[9px]">{month}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <label className="flex items-center gap-2 text-[11px] tracking-wide-sm text-muted-foreground uppercase mb-3">
                      <Clock className="h-4 w-4 text-primary" /> Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {timeSlots.map((t) => {
                        /* If a specific therapist is selected, grey out slots where they're booked */
                        const therapistBlocked =
                          selectedTherapist != null &&
                          liveBookings.some(
                            (a) => a.therapistId === selectedTherapist.id && a.date === selectedDate && a.time === t,
                          )
                        return (
                          <button
                            key={t}
                            onClick={() => !therapistBlocked && setSelectedTime(t)}
                            disabled={therapistBlocked}
                            title={therapistBlocked ? `${selectedTherapist?.name} is unavailable at this time` : undefined}
                            className={`border py-2.5 text-[11px] tracking-wide-sm uppercase transition-all ${
                              therapistBlocked
                                ? "opacity-40 cursor-not-allowed border-border/40 text-muted-foreground/40 line-through"
                                : selectedTime === t
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                            }`}
                          >{t}</button>
                        )
                      })}
                    </div>
                    {selectedTherapist && (
                      <p className="mt-2 text-[10px] text-muted-foreground/70">
                        Strikethrough slots are reserved for {selectedTherapist.name} across all treatments.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

              <div className="mt-6 flex gap-3">
                <button onClick={goBack} className="flex items-center gap-2 border border-border px-5 py-2.5 text-[11px] tracking-wide-sm text-muted-foreground uppercase hover:text-foreground transition-colors">
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={handleDateTimeNext} className="flex flex-1 items-center justify-center gap-2 bg-primary py-2.5 text-[11px] tracking-wide-sm text-primary-foreground uppercase hover:opacity-90 transition-opacity">
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: Details ── */}
          {step === "details" && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">Your details will be used for your reservation confirmation.</p>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] tracking-wide-sm text-muted-foreground uppercase flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-primary" /> Full Name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="border border-border bg-input/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] tracking-wide-sm text-muted-foreground uppercase">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="border border-border bg-input/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] tracking-wide-sm text-muted-foreground uppercase">Special Notes <span className="opacity-50">(optional)</span></span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any injuries, preferences, or sensitivities we should know…"
                  rows={3}
                  className="resize-none border border-border bg-input/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                />
              </label>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-3">
                <button onClick={goBack} className="flex items-center gap-2 border border-border px-5 py-2.5 text-[11px] tracking-wide-sm text-muted-foreground uppercase hover:text-foreground transition-colors">
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={handleDetailsNext} className="flex flex-1 items-center justify-center gap-2 bg-primary py-2.5 text-[11px] tracking-wide-sm text-primary-foreground uppercase hover:opacity-90 transition-opacity">
                  Review Booking <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: Confirm ── */}
          {step === "confirm" && selectedService && (
            <div>
              <p className="text-sm text-muted-foreground mb-6">Review your reservation before confirming.</p>
              <div className="border border-border bg-card/60 divide-y divide-border">
                <SummaryRow label="Treatment" value={selectedService.name} />
                <SummaryRow label="Category" value={selectedService.category} />
                <SummaryRow label="Duration" value={selectedService.duration} />
                {selectedTherapist ? (
                  <SummaryRow label="Therapist" value={`${selectedTherapist.name} — ${selectedTherapist.title}`} />
                ) : (
                  <SummaryRow label="Therapist" value="Any available therapist (no preference)" />
                )}
                <SummaryRow label="Date" value={formatDate(selectedDate)} />
                <SummaryRow label="Time" value={selectedTime} />
                <SummaryRow label="Guest" value={name} />
                <SummaryRow label="Email" value={email} />
                {notes && <SummaryRow label="Notes" value={notes} />}
                <div className="flex items-center justify-between px-5 py-4 bg-primary/5">
                  <span className="text-[11px] tracking-wide-sm text-muted-foreground uppercase font-medium">Total</span>
                  <span className="font-heading text-2xl text-primary">QR {selectedService.price}</span>
                </div>
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground">
                * Payment is settled at the clinic. Cancellations must be made 24 hours in advance.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={goBack} className="flex items-center gap-2 border border-border px-5 py-2.5 text-[11px] tracking-wide-sm text-muted-foreground uppercase hover:text-foreground transition-colors">
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={handleConfirm} className="flex flex-1 items-center justify-center gap-2 bg-primary py-2.5 text-[11px] tracking-wide-sm text-primary-foreground uppercase hover:opacity-90 transition-opacity">
                  <Check className="h-4 w-4" /> Confirm Reservation
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: Success ── */}
          {step === "success" && selectedService && (
            <div className="py-4 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-primary bg-primary/10">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <p className="text-[11px] tracking-luxe text-primary uppercase">Reservation Saved</p>
              <h3 className="font-heading mt-2 text-3xl text-foreground">You&apos;re confirmed.</h3>
              <div className="gold-line mx-auto mt-4 w-16" />
              <p className="mt-4 text-sm text-muted-foreground max-w-sm mx-auto">
                Your <strong className="text-foreground">{selectedService.name}</strong> session on{" "}
                <strong className="text-foreground">{formatDate(selectedDate)}</strong> at{" "}
                <strong className="text-foreground">{selectedTime}</strong>
                {selectedTherapist && (
                  <> with <strong className="text-foreground">{selectedTherapist.name}</strong></>
                )}{" "}
                has been saved. Your dashboard has been updated instantly.
              </p>

              {appointments.filter((a) => new Date(a.date + "T23:59:59") >= new Date()).length > 1 && (
                <div className="mt-8 text-left">
                  <p className="text-[11px] tracking-wide-sm text-muted-foreground uppercase mb-3">Your Upcoming Reservations</p>
                  <div className="space-y-2">
                    {appointments
                      .filter((a) => new Date(a.date + "T23:59:59") >= new Date())
                      .slice(-3)
                      .reverse()
                      .map((a) => (
                        <div key={a.id} className="flex items-center justify-between border border-border bg-card/60 px-4 py-3">
                          <div className="min-w-0">
                            <p className="font-heading text-base text-foreground truncate">{a.serviceName}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {formatDate(a.date)} · {a.time}
                              {a.therapistName && <> · {a.therapistName}</>}
                            </p>
                          </div>
                          <span className="font-heading text-primary ml-4 shrink-0">QR {a.price}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="mt-8 bg-primary px-10 py-3 text-[11px] tracking-luxe text-primary-foreground uppercase hover:opacity-90 transition-opacity"
              >
                Return to Zara
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 px-5 py-3">
      <span className="text-[10px] tracking-wide-sm text-muted-foreground uppercase shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  )
}

/* ─── Legacy mini dashboard (kept for backward compat in page.tsx) ─── */
export function ReservationsDashboard({ userName }: { userName: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const load = useCallback(() => {
    const all = getStoredAppointments()
    const mine = all.filter((a) => a.name.toLowerCase() === userName.toLowerCase())
    const upcoming = mine.filter((a) => new Date(a.date + "T23:59:59") >= new Date())
    setAppointments(upcoming)
  }, [userName])

  useEffect(() => {
    load()
    window.addEventListener("zara_appointments_changed", load)
    return () => window.removeEventListener("zara_appointments_changed", load)
  }, [load])

  if (appointments.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
      <div className="border border-primary/30 bg-primary/5 p-6">
        <p className="text-[10px] tracking-luxe text-primary uppercase mb-1">Quick View</p>
        <h3 className="font-heading text-2xl text-foreground">Your Upcoming Sessions</h3>
        <div className="gold-line mt-3 mb-5 w-16" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {appointments.slice(0, 3).map((a) => (
            <div key={a.id} className="border border-border bg-card/60 p-4">
              <span className="text-[9px] tracking-wide-sm text-primary uppercase">{a.serviceCategory}</span>
              <h4 className="font-heading mt-1 text-lg text-foreground">{a.serviceName}</h4>
              {a.therapistName && <p className="mt-1 text-[11px] text-primary/70">{a.therapistName}</p>}
              <p className="mt-2 text-[11px] text-muted-foreground">{formatDate(a.date)}</p>
              <p className="text-[11px] text-muted-foreground">{a.time} · {a.duration}</p>
              <p className="font-heading mt-3 text-lg text-primary">QR {a.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
