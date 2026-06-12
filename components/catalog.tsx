"use client"

import { useState, useEffect } from "react"
import { Reveal } from "@/components/reveal"
import {
  services,
  relatedProducts,
  categories,
  type Service,
} from "@/lib/clinic-data"
import { ArrowRight, ShoppingBag, X, MessageCircle, Mail, Phone, CheckCircle2, User } from "lucide-react"
import { getLoggedInUserFull, type Gender } from "@/components/auth-modal"
import { getTherapistsForTreatment, type Therapist } from "@/components/therapists"

/* ─── Product image map ───────────────────────────────────── */
const PRODUCT_IMAGES: Record<string, string> = {
  "Amber Reserve Essential Oil":
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85",
  "Clinical Recovery Lotion":
    "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=85",
  "Rehab Foam Roller":
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=85",
  "Cedar & Sage Bath Soak":
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=85",
}

function fallbackSvg(label: string): string {
  const encoded = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="#1e2e28"/>
      <rect width="800" height="600" fill="url(#g)"/>
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2a3d35"/>
          <stop offset="100%" stop-color="#15211c"/>
        </linearGradient>
      </defs>
      <text x="400" y="280" text-anchor="middle" font-family="Georgia,serif"
        font-size="18" fill="rgba(196,163,101,0.35)" letter-spacing="6">${label.toUpperCase()}</text>
      <line x1="300" y1="308" x2="500" y2="308" stroke="rgba(196,163,101,0.2)" stroke-width="1"/>
    </svg>`)
  return `data:image/svg+xml,${encoded}`
}

/* ─── Enquire Modal ─────────────────────────────────────── */
type ContactMethod = "WhatsApp" | "Email" | "Phone"

interface EnquireModalProps {
  productName: string
  productPrice: number
  onClose: () => void
}

function EnquireModal({ productName, productPrice, onClose }: EnquireModalProps) {
  const [contact, setContact] = useState<ContactMethod>("WhatsApp")
  const [contactDetail, setContactDetail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  const contactMethods: { value: ContactMethod; icon: React.ReactNode; placeholder: string }[] = [
    { value: "WhatsApp", icon: <MessageCircle className="h-4 w-4" />, placeholder: "+974 XXXX XXXX" },
    { value: "Email",    icon: <Mail className="h-4 w-4" />,          placeholder: "you@example.com" },
    { value: "Phone",    icon: <Phone className="h-4 w-4" />,         placeholder: "+974 XXXX XXXX" },
  ]

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!contactDetail.trim()) {
      setError(`Please enter your ${contact} contact details.`)
      return
    }
    if (!message.trim()) {
      setError("Please add a message before sending.")
      return
    }
    // Save to localStorage
    try {
      const key = "zara_enquiries"
      const existing = JSON.parse(localStorage.getItem(key) || "[]")
      existing.push({
        product: productName,
        price: productPrice,
        method: contact,
        detail: contactDetail,
        message,
        sentAt: new Date().toISOString(),
      })
      localStorage.setItem(key, JSON.stringify(existing))
    } catch { /* silent */ }
    setSent(true)
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Enquire about ${productName}`}
    >
      <div
        className="animate-scale-in relative w-full max-w-lg border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border px-8 py-6">
          <div>
            <p className="text-[10px] tracking-luxe text-primary uppercase">Product Enquiry</p>
            <h3 className="font-heading mt-1 text-2xl text-foreground leading-tight">{productName}</h3>
            <p className="mt-1 font-heading text-lg text-primary">QR {productPrice}</p>
          </div>
          <button onClick={onClose} aria-label="Close enquiry" className="mt-1 text-muted-foreground transition-colors hover:text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-8 py-7">
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center animate-fade-in">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border border-primary/30 flex items-center justify-center" style={{ boxShadow: "0 0 32px oklch(0.74 0.11 80 / 0.15)" }}>
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <span className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
              </div>
              <div className="mt-2">
                <p className="font-heading text-2xl text-foreground">Enquiry Sent</p>
                <div className="gold-line mx-auto mt-3 w-12" />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-xs mx-auto">
                  Thank you! Our Doha team will reach out via your preferred{" "}
                  <span className="text-primary">{contact}</span> channel within 24 hours.
                </p>
              </div>
              <button onClick={onClose} className="mt-4 border border-border px-8 py-2.5 text-[11px] tracking-wide-sm text-muted-foreground uppercase transition-all hover:border-primary/50 hover:text-foreground">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex flex-col gap-5" noValidate>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] tracking-wide-sm text-muted-foreground uppercase">Preferred Contact Method</span>
                <div className="grid grid-cols-3 gap-2">
                  {contactMethods.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => { setContact(m.value); setContactDetail("") }}
                      className={`flex items-center justify-center gap-2 border py-2.5 text-[11px] tracking-wide-sm uppercase transition-all ${
                        contact === m.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {m.icon}
                      {m.value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] tracking-wide-sm text-muted-foreground uppercase">Your {contact} Details</label>
                <input
                  type={contact === "Email" ? "email" : "tel"}
                  value={contactDetail}
                  onChange={(e) => setContactDetail(e.target.value)}
                  placeholder={contactMethods.find(m => m.value === contact)?.placeholder}
                  className="review-input border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] tracking-wide-sm text-muted-foreground uppercase">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Inquiring about ${productName} — availability in Doha, bulk pricing, or gifting options…`}
                  rows={4}
                  className="review-input resize-none border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none transition-colors"
                />
              </div>

              {error && <p className="text-[12px] text-destructive" role="alert">{error}</p>}

              <button type="submit" className="mt-1 border border-primary bg-primary px-6 py-3 text-[11px] tracking-wide-sm text-primary-foreground uppercase transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/10 active:scale-[0.98]">
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Product Card ──────────────────────────────────────── */
function ProductCard({
  product,
  index,
  onEnquire,
}: {
  product: { name: string; blurb: string; price: number }
  index: number
  onEnquire: () => void
}) {
  const [imgError, setImgError] = useState(false)
  const imgSrc = PRODUCT_IMAGES[product.name]

  return (
    <article className="group flex flex-col bg-card/60 transition-colors hover:bg-card overflow-hidden">
      <div className="product-img-frame relative w-full overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
        <img
          src={imgError || !imgSrc ? fallbackSvg(product.name) : imgSrc}
          alt={product.name}
          onError={() => setImgError(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent" />
        <div className="absolute inset-0 opacity-30 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-15" style={{ background: "oklch(0.18 0.03 155)" }} />
        <div className="absolute top-3 left-3">
          <span className="border border-primary/40 bg-background/70 px-2.5 py-1 text-[9px] tracking-luxe text-primary uppercase backdrop-blur-sm">
            Clinic Collection
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-heading text-xl text-foreground leading-tight">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{product.blurb}</p>
        <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
          <p className="font-heading text-xl text-primary">QR {product.price}</p>
          <button
            onClick={onEnquire}
            className="flex items-center gap-1.5 border border-border px-4 py-2 text-[10px] tracking-wide-sm text-muted-foreground uppercase transition-all hover:border-primary/60 hover:text-primary active:scale-[0.97]"
          >
            <ShoppingBag className="h-3 w-3" />
            Enquire
          </button>
        </div>
      </div>
    </article>
  )
}

/* ─── Therapist pills inside service card ─────────────── */
function TherapistPills({
  therapists,
  onBook,
}: {
  therapists: Therapist[]
  onBook: (therapist: Therapist) => void
}) {
  if (therapists.length === 0) return null

  return (
    <div className="mt-4 border-t border-border/50 pt-4">
      <p className="mb-2 text-[10px] tracking-wide-sm text-muted-foreground uppercase">
        Your matched therapist{therapists.length > 1 ? "s" : ""}
      </p>
      <div className="flex flex-wrap gap-2">
        {therapists.map((t) => (
          <button
            key={t.id}
            onClick={() => onBook(t)}
            className="flex items-center gap-1.5 border border-primary/30 bg-primary/5 px-3 py-1.5 text-[10px] tracking-wide-sm text-primary uppercase transition-all hover:border-primary/60 hover:bg-primary/10 active:scale-[0.97]"
            title={`Book with ${t.name}`}
          >
            <User className="h-3 w-3 opacity-70" />
            {t.name.split(" ")[0]}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Service Card ──────────────────────────────────────── */
function ServiceCard({
  service,
  hovered,
  onHover,
  onLeave,
  onBook,
  onBookWithTherapist,
  featured,
  matchedTherapists,
}: {
  service: Service
  hovered: boolean
  onHover: () => void
  onLeave: () => void
  onBook: () => void
  onBookWithTherapist: (therapist: Therapist) => void
  featured: boolean
  matchedTherapists: Therapist[]
}) {
  return (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`group relative flex flex-col border bg-card/60 transition-all duration-300 ${
        hovered ? "border-primary/60 -translate-y-1 shadow-lg shadow-primary/5" : "border-border"
      } ${featured ? "lg:flex-row lg:items-stretch" : ""}`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 bg-primary transition-all duration-500 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className={`flex flex-col p-7 flex-1 ${featured ? "lg:pr-10" : ""}`}>
        <span className="text-[10px] tracking-wide-sm text-primary uppercase">
          {service.category}
        </span>
        <h3 className="font-heading mt-3 text-2xl text-foreground">{service.name}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        {/* Matched therapist pills — only when logged in */}
        {matchedTherapists.length > 0 && (
          <TherapistPills therapists={matchedTherapists} onBook={onBookWithTherapist} />
        )}

        <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
          <div>
            <p className="font-heading text-2xl text-primary">QR {service.price}</p>
            <p className="text-[11px] tracking-wide-sm text-muted-foreground uppercase">
              {service.duration}
            </p>
          </div>
          <button
            onClick={onBook}
            className={`flex items-center gap-2 border px-5 py-2.5 text-[11px] tracking-wide-sm uppercase transition-all ${
              hovered
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            Book Now
            <ArrowRight className={`h-3.5 w-3.5 transition-transform duration-300 ${hovered ? "translate-x-0.5" : ""}`} />
          </button>
        </div>
      </div>
    </article>
  )
}

/* ─── Catalog (main export) ─────────────────────────────── */
export function Catalog({
  onBook,
  user,
}: {
  onBook: (service?: Service, therapist?: Therapist) => void
  user?: string | null
}) {
  const [filter, setFilter] = useState<"All" | Service["category"]>("All")
  const [hovered, setHovered] = useState<string | null>(null)
  const [enquireProduct, setEnquireProduct] = useState<{ name: string; price: number } | null>(null)
  const [userGender, setUserGender] = useState<Gender | null>(null)

  useEffect(() => {
    if (user) {
      const full = getLoggedInUserFull()
      setUserGender(full?.gender ?? null)
    } else {
      setUserGender(null)
    }
  }, [user])

  const filtered =
    filter === "All" ? services : services.filter((s) => s.category === filter)
  const colA = filtered.filter((_, i) => i % 2 === 0)
  const colB = filtered.filter((_, i) => i % 2 !== 0)

  function getMatched(service: Service): Therapist[] {
    if (!user || !userGender) return []
    return getTherapistsForTreatment(service.name, userGender)
  }

  return (
    <>
      <section id="catalog" className="relative py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          {/* Header */}
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] tracking-luxe text-primary uppercase">The Treatment Menu</p>
                <h2 className="font-heading mt-4 text-balance text-4xl text-foreground sm:text-5xl">
                  Signature Therapies
                </h2>
                <div className="gold-line mt-6 w-20" />
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground lg:text-right">
                {user && userGender
                  ? `Each card shows your matched ${userGender.toLowerCase()} therapist for that treatment — tap their name to book directly.`
                  : "Each ritual is tailored to your body's precise needs — delivered by therapists trained in both clinical and holistic methodology."}
              </p>
            </div>
          </Reveal>

          {/* Filters */}
          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap gap-3">
              {(["All", ...categories] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`border px-5 py-2 text-[11px] tracking-wide-sm uppercase transition-all ${
                    filter === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Asymmetric service grid */}
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              {colA.map((s, i) => (
                <Reveal key={s.name} delay={i * 80}>
                  <ServiceCard
                    service={s}
                    hovered={hovered === s.name}
                    onHover={() => setHovered(s.name)}
                    onLeave={() => setHovered(null)}
                    onBook={() => onBook(s)}
                    onBookWithTherapist={(t) => onBook(s, t)}
                    featured={i === 0 && filter === "All"}
                    matchedTherapists={getMatched(s)}
                  />
                </Reveal>
              ))}
            </div>
            <div className="flex flex-col gap-6 lg:mt-10">
              {colB.map((s, i) => (
                <Reveal key={s.name} delay={i * 80 + 40}>
                  <ServiceCard
                    service={s}
                    hovered={hovered === s.name}
                    onHover={() => setHovered(s.name)}
                    onLeave={() => setHovered(null)}
                    onBook={() => onBook(s)}
                    onBookWithTherapist={(t) => onBook(s, t)}
                    featured={false}
                    matchedTherapists={getMatched(s)}
                  />
                </Reveal>
              ))}
            </div>
          </div>

          {/* Related Products */}
          <Reveal>
            <div className="mt-28 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] tracking-luxe text-primary uppercase">Take Home the Ritual</p>
                <h2 className="font-heading mt-4 text-balance text-4xl text-foreground sm:text-5xl">
                  Related Products
                </h2>
                <div className="gold-line mt-6 w-20" />
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-right">
                Clinic-grade formulations and tools to extend your treatment beyond our walls.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p, i) => (
              <Reveal key={p.name} delay={(i % 4) * 80}>
                <ProductCard
                  product={p}
                  index={i}
                  onEnquire={() => setEnquireProduct({ name: p.name, price: p.price })}
                />
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {enquireProduct && (
        <EnquireModal
          productName={enquireProduct.name}
          productPrice={enquireProduct.price}
          onClose={() => setEnquireProduct(null)}
        />
      )}
    </>
  )
}
