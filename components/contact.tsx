"use client"

import { MapPin, Mail, Phone, Clock } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { Logo } from "@/components/logo"

export function Contact() {
  return (
    <footer id="contact" className="relative border-t border-border pt-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="text-[11px] tracking-luxe text-primary uppercase">
                Find Us
              </p>
              <h2 className="font-heading mt-4 text-balance text-4xl text-foreground sm:text-5xl">
                Visit the Clinic
              </h2>
              <div className="gold-line mt-6 w-20" />

              <ul className="mt-8 flex flex-col gap-5">
                <li className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span className="leading-relaxed text-muted-foreground">
                    Al Waab Street, Tower 14, West Bay
                    <br />
                    Doha, Qatar
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <a
                    href="mailto:hello@zaratherapy.qa"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    hello@zaratherapy.qa
                  </a>
                </li>
                <li className="flex items-start gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <a
                    href="tel:+97444001998"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    +974 4400 1998
                  </a>
                </li>
                <li className="flex items-start gap-4">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span className="leading-relaxed text-muted-foreground">
                    Sat – Thu · 9:00 AM – 10:00 PM
                    <br />
                    Friday · 2:00 PM – 10:00 PM
                  </span>
                </li>
              </ul>

              <div className="mt-8 border border-border bg-card/40 px-5 py-4">
                <p className="text-[10px] tracking-wide-sm text-muted-foreground uppercase">
                  Geolocation Node
                </p>
                <p className="font-mono mt-1 text-sm text-primary">
                  25.2854° N, 51.5310° E · Doha, Qatar
                </p>
              </div>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal delay={150}>
            <div className="h-full min-h-[360px] overflow-hidden border border-border">
              <iframe
                title="Zara Therapy Clinic location in Doha, Qatar"
                src="https://www.google.com/maps?q=Doha%2C%20Qatar&z=12&output=embed"
                className="h-full min-h-[360px] w-full grayscale-[0.4]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-border py-8 sm:flex-row">
          <Logo />
          <p className="text-center text-xs tracking-wide-sm text-muted-foreground sm:text-right">
            © {new Date().getFullYear()} Zara Therapy Clinic · Doha, Qatar · All
            rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
