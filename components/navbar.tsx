"use client"

import { useEffect, useState } from "react"
import { Menu, X, Eye, Users, Star } from "lucide-react"
import { Logo } from "@/components/logo"

/*
  Navigation logic:
  - "Therapists" and "Reviews" are ALWAYS visible (logged-in or not)
  - When logged out:   Therapists shows full public roster; Reviews scrolls to testimonials wall
  - When logged in:    Same scroll targets; Therapists section switches to gender-filtered view
                       Header shows "Hi, [Name]" greeting
*/

const LINKS = [
  { id: "home",        label: "Home" },
  { id: "about",       label: "About" },
  { id: "catalog",     label: "Treatments" },
  { id: "therapists",  label: "Therapists", icon: "users" },
  { id: "testimonials",label: "Reviews",    icon: "star"  },
  { id: "contact",     label: "Contact" },
]

export function Navbar({
  user,
  onOpenAuth,
  onLogout,
}: {
  user: string | null
  onOpenAuth: () => void
  onLogout: () => void
}) {
  const [active,    setActive]    = useState("home")
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [visitors,  setVisitors]  = useState<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("zara_visitors")
    let count: number
    if (stored) {
      count = parseInt(stored, 10) + 1
    } else {
      count = Math.floor(Math.random() * (1200 - 850 + 1)) + 850
    }
    localStorage.setItem("zara_visitors", String(count))
    setVisitors(count)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const offsets = LINKS.map(({ id }) => {
        const el = document.getElementById(id)
        if (!el) return { id, top: Infinity }
        return { id, top: Math.abs(el.getBoundingClientRect().top - 120) }
      })
      offsets.sort((a, b) => a.top - b.top)
      setActive(offsets[0].id)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  function linkClass(id: string, mobile = false) {
    const isActive = active === id
    const isSpecial = id === "therapists" || id === "testimonials"
    const base = mobile
      ? "flex items-center gap-2 py-2 text-left text-sm tracking-wide-sm uppercase"
      : "nav-link flex items-center gap-1.5 text-[12px] tracking-wide-sm uppercase transition-all duration-200"

    if (isSpecial) {
      return `${base} ${isActive ? "text-primary" : "text-primary/70 hover:text-primary"}`
    }
    return `${base} ${isActive ? "text-primary" : mobile ? "text-muted-foreground" : "text-muted-foreground hover:text-foreground"}`
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border bg-background/90 py-3 backdrop-blur-md"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo — clicking reloads the page / resets SPA to default home view */}
        <button
          onClick={() => window.location.reload()}
          aria-label="Zara Therapy Clinic — return to home"
          className="transition-opacity hover:opacity-80"
        >
          <Logo />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={linkClass(l.id)}
            >
              {l.icon === "users" && <Users className="h-3 w-3 flex-shrink-0" />}
              {l.icon === "star"  && <Star  className="h-3 w-3 flex-shrink-0" />}
              {l.label}
              {/* Personalised indicator dot — only shown when logged in */}
              {l.id === "therapists" && user && (
                <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        {/* Right-side controls */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Visitor counter */}
          <div
            className="hidden items-center gap-2 text-muted-foreground sm:flex"
            title="Active visitors"
          >
            <Eye className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs tabular-nums">
              {visitors !== null ? visitors.toLocaleString() : "—"}
            </span>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="font-heading text-base text-primary">Hi, {user}</span>
              <button
                onClick={onLogout}
                className="text-[11px] tracking-wide-sm text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                Exit
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="border border-primary/60 px-5 py-2 text-[11px] tracking-wide-sm text-primary uppercase transition-all hover:bg-primary hover:text-primary-foreground"
            >
              Login
            </button>
          )}

          <button
            className="text-foreground lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="animate-fade-in mt-3 flex flex-col gap-1 border-t border-border bg-background/95 px-5 py-4 backdrop-blur-md lg:hidden">
          {LINKS.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} className={linkClass(l.id, true)}>
              {l.icon === "users" && <Users className="h-3.5 w-3.5" />}
              {l.icon === "star"  && <Star  className="h-3.5 w-3.5" />}
              {l.label}
              {l.id === "therapists" && user && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          ))}
          <div className="mt-2 flex items-center gap-2 border-t border-border pt-3 text-muted-foreground sm:hidden">
            <Eye className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs">
              {visitors !== null ? `${visitors.toLocaleString()} guests today` : "—"}
            </span>
          </div>
        </nav>
      )}
    </header>
  )
}
