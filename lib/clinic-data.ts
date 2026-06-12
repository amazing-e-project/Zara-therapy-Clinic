export type Service = {
  name: string
  category: "Massage Technique" | "Medical Aid" | "Beauty Aids"
  description: string
  price: number
  duration: string
}

export const services: Service[] = [
  {
    name: "Deep Tissue Release",
    category: "Massage Technique",
    description:
      "Slow, firm strokes targeting the deepest layers of muscle and fascia to dissolve chronic tension.",
    price: 380,
    duration: "75 min",
  },
  {
    name: "Swedish Relaxation",
    category: "Massage Technique",
    description:
      "Flowing, rhythmic movements that soothe the nervous system and ease the body into deep stillness.",
    price: 290,
    duration: "60 min",
  },
  {
    name: "Hot Stone Ritual",
    category: "Massage Technique",
    description:
      "Heated basalt stones melt away stress while warm oil restores circulation and warmth.",
    price: 420,
    duration: "90 min",
  },
  {
    name: "Sports Recovery Therapy",
    category: "Medical Aid",
    description:
      "Targeted rehabilitation for athletes — reduces inflammation and accelerates muscle recovery.",
    price: 450,
    duration: "75 min",
  },
  {
    name: "Injury Rehabilitation",
    category: "Medical Aid",
    description:
      "Clinical, assessment-led sessions designed to restore mobility after strain or injury.",
    price: 480,
    duration: "60 min",
  },
  {
    name: "Circulation & Lymphatic",
    category: "Medical Aid",
    description:
      "Gentle, directional techniques to stimulate circulation and encourage natural detoxification.",
    price: 360,
    duration: "70 min",
  },
  {
    name: "Radiance Facial Therapy",
    category: "Beauty Aids",
    description:
      "A restorative facial pairing botanical serums with pressure-point relief for a luminous glow.",
    price: 320,
    duration: "60 min",
  },
  {
    name: "Aromatherapy Indulgence",
    category: "Beauty Aids",
    description:
      "Bespoke essential oil blends layered into a full-body ritual for the senses.",
    price: 340,
    duration: "75 min",
  },
  {
    name: "Scalp & Crown Renewal",
    category: "Beauty Aids",
    description:
      "A grounding scalp treatment that relieves tension headaches and nourishes the hair root.",
    price: 250,
    duration: "45 min",
  },
]

export type Product = {
  name: string
  blurb: string
  price: number
}

export const relatedProducts: Product[] = [
  {
    name: "Amber Reserve Essential Oil",
    blurb: "Hand-blended warming oil for at-home muscle relief.",
    price: 145,
  },
  {
    name: "Clinical Recovery Lotion",
    blurb: "Fast-absorbing therapeutic lotion for sore tissue.",
    price: 120,
  },
  {
    name: "Rehab Foam Roller",
    blurb: "Dense therapy roller for myofascial release.",
    price: 90,
  },
  {
    name: "Cedar & Sage Bath Soak",
    blurb: "Mineral soak to extend your relaxation at home.",
    price: 75,
  },
]

export const categories = [
  "Massage Technique",
  "Medical Aid",
  "Beauty Aids",
] as const

export const testimonials = [
  {
    name: "Layla A.",
    location: "West Bay, Doha",
    quote:
      "I came in with months of shoulder tension from desk work. After three sessions of deep tissue therapy, I finally sleep through the night. The atmosphere alone is healing.",
  },
  {
    name: "Omar K.",
    location: "The Pearl, Doha",
    quote:
      "As a runner, the Sports Recovery Therapy has been transformative. The therapists genuinely understand the body — this is clinical care wrapped in pure luxury.",
  },
  {
    name: "Fatima R.",
    location: "Lusail, Doha",
    quote:
      "The candlelit rooms, the warm oils, the gold detailing — Zara feels like a private sanctuary. I leave every visit feeling restored from the inside out.",
  },
]

export const gallery = [
  { src: "/images/gallery-1.png", alt: "Deep tissue back massage with warm oil" },
  { src: "/images/gallery-2.png", alt: "Essential oils and dried botanicals on dark stone" },
  { src: "/images/gallery-3.png", alt: "Hot therapy stones stacked on a cream towel" },
]
