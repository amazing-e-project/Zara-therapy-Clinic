"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { HeroMedia } from "@/components/hero-media"
import { About } from "@/components/about"
import { Catalog } from "@/components/catalog"
import { Therapists } from "@/components/therapists"
import { Gallery, Testimonials } from "@/components/gallery-testimonials"
import { Contact } from "@/components/contact"
import { Ticker } from "@/components/ticker"
import { AuthModal } from "@/components/auth-modal"
import { FallingLeaves } from "@/components/falling-leaves"
import { BookingWizard, ReservationsDashboard } from "@/components/booking-wizard"
import { UserDashboard } from "@/components/user-dashboard"
import type { Service } from "@/lib/clinic-data"
import type { Therapist } from "@/components/therapists"

export default function Page() {
  const [user, setUser] = useState<string | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [preselectedService, setPreselectedService] = useState<Service | null>(null)
  const [preselectedTherapist, setPreselectedTherapist] = useState<Therapist | null>(null)
  /* Holds a guest's booking choices (treatment / therapist) while they are
     gated behind the auth modal, so their reservation resumes smoothly the
     instant they finish logging in or signing up. */
  const [pendingBooking, setPendingBooking] = useState<{
    service: Service | null
    therapist: Therapist | null
  } | null>(null)

  useEffect(() => {
    const session = localStorage.getItem("zara_session")
    if (session) setUser(session)
  }, [])

  function handleLogin(name: string) {
    setUser(name)
    localStorage.setItem("zara_session", name)
    setAuthOpen(false)

    /* If the guest was interrupted mid-booking, resume their reservation
       immediately with their previously chosen treatment & therapist held. */
    if (pendingBooking) {
      setPreselectedService(pendingBooking.service)
      setPreselectedTherapist(pendingBooking.therapist)
      setBookingOpen(true)
      setPendingBooking(null)
    }
  }

  function handleLogout() {
    setUser(null)
    localStorage.removeItem("zara_session")
  }

  function openBooking(service?: Service, therapist?: Therapist) {
    /* Gate: an unauthenticated guest is interrupted immediately. We hold their
       booking choices in state and pop the themed auth modal as an overlay
       instead of opening the wizard or blocking with an alert. */
    const hasSession =
      typeof window !== "undefined" && !!localStorage.getItem("zara_session")
    if (!hasSession) {
      setPendingBooking({ service: service ?? null, therapist: therapist ?? null })
      setAuthOpen(true)
      return
    }

    setPreselectedService(service ?? null)
    setPreselectedTherapist(therapist ?? null)
    setBookingOpen(true)
  }

  function closeBooking() {
    setBookingOpen(false)
    setPreselectedService(null)
    setPreselectedTherapist(null)
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden pb-12">
      <FallingLeaves />

      <Navbar
        user={user}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={handleLogout}
      />

      <HeroMedia onBook={() => openBooking()} />

      {user && <ReservationsDashboard userName={user} />}

      <UserDashboard
        user={user}
        onOpenAuth={() => setAuthOpen(true)}
        onBrowseTreatments={() => {
          const el = document.getElementById("catalog")
          if (el) el.scrollIntoView({ behavior: "smooth" })
        }}
      />

      <About />

      <Catalog
        onBook={(service, therapist) => openBooking(service, therapist)}
        user={user}
      />

      <Therapists user={user} onOpenAuth={() => setAuthOpen(true)} />

      <Gallery />

      <Testimonials user={user} onOpenAuth={() => setAuthOpen(true)} />

      <Contact />
      <Ticker />

      {bookingOpen && (
        <BookingWizard
          onClose={closeBooking}
          preselectedService={preselectedService}
          preselectedTherapist={preselectedTherapist}
          onRequireAuth={() => setAuthOpen(true)}
        />
      )}

      {/* Rendered last so the auth popup always layers above the booking wizard
          when an unauthenticated guest is gated mid-reservation. */}
      {authOpen && (
        <AuthModal
          onClose={() => {
            setAuthOpen(false)
            setPendingBooking(null)
          }}
          onLogin={handleLogin}
        />
      )}
    </main>
  )
}
