"use client"

import { useState } from "react"
import { X } from "lucide-react"

export type Gender = "Male" | "Female"

export type StoredUser = {
  name: string
  email: string
  password: string
  gender: Gender
}

export const USERS_KEY = "zara_users"

export function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  } catch {
    return []
  }
}

export function getLoggedInUserFull(): StoredUser | null {
  try {
    const session = localStorage.getItem("zara_session")
    if (!session) return null
    const users = getStoredUsers()
    return users.find((u) => u.name === session) ?? null
  } catch {
    return null
  }
}

export function getLoggedInGender(): Gender | null {
  return getLoggedInUserFull()?.gender ?? null
}

export function AuthModal({
  onClose,
  onLogin,
}: {
  onClose: () => void
  onLogin: (name: string) => void
}) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [gender, setGender] = useState<Gender | "">("")
  const [error, setError] = useState("")

  function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!name || !email || !password) {
      setError("Please complete every field.")
      return
    }
    if (!gender) {
      setError("Please select your gender to personalise your experience.")
      return
    }
    const users = getStoredUsers()
    if (users.some((u) => u.email === email.toLowerCase())) {
      setError("An account with this email already exists.")
      return
    }
    const newUser: StoredUser = {
      name,
      email: email.toLowerCase(),
      password,
      gender: gender as Gender,
    }
    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    onLogin(name)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const users = getStoredUsers()
    const match = users.find(
      (u) => u.email === email.toLowerCase() && u.password === password,
    )
    if (!match) {
      setError("Invalid credentials. Please try again or sign up.")
      return
    }
    onLogin(match.name)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Member access"
    >
      <div
        className="animate-scale-in relative w-full max-w-md border border-border bg-card p-8 shadow-2xl sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-muted-foreground transition-colors hover:text-primary"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="text-center text-[11px] tracking-luxe text-primary uppercase">
          Zara Members
        </p>
        <h2 className="font-heading mt-2 text-center text-3xl text-foreground">
          {mode === "login" ? "Welcome Back" : "Begin Your Ritual"}
        </h2>
        <div className="gold-line mx-auto mt-4 w-16" />

        <form
          onSubmit={mode === "login" ? handleLogin : handleSignup}
          className="mt-7 flex flex-col gap-4"
        >
          {mode === "signup" && (
            <Field
              label="Full Name"
              type="text"
              value={name}
              onChange={setName}
              placeholder="Your name"
            />
          )}
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
          />

          {/* ── Gender selector — sign-up only ── */}
          {mode === "signup" && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] tracking-wide-sm text-muted-foreground uppercase">
                Gender <span className="text-primary/80">*</span>
              </span>
              <p className="text-[11px] text-muted-foreground/70 leading-relaxed -mt-1">
                This ensures we match you exclusively with therapists of your
                same gender for your complete comfort and privacy.
              </p>
              <div className="mt-1 grid grid-cols-2 gap-3">
                {(["Female", "Male"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`flex items-center justify-center gap-2 border py-3 text-[11px] tracking-wide-sm uppercase transition-all ${
                      gender === g
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`h-3.5 w-3.5 rounded-full border-2 transition-all flex items-center justify-center ${
                        gender === g
                          ? "border-primary"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {gender === g && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary block" />
                      )}
                    </span>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 bg-primary py-3 text-xs tracking-luxe text-primary-foreground uppercase transition-opacity hover:opacity-90"
          >
            {mode === "login" ? "Enter" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? "New to Zara?" : "Already a member?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login")
              setError("")
              setGender("")
            }}
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  )
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] tracking-wide-sm text-muted-foreground uppercase">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-border bg-input/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
      />
    </label>
  )
}
