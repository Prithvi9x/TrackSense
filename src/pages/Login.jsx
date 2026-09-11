import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setSubmitting(true)
    try {
      if (mode === 'signin') {
        const { error: err } = await signIn(email, password)
        if (err) throw err
      } else {
        const { error: err } = await signUp(email, password)
        if (err) throw err
        setNotice('Account created. Check your email to confirm, then sign in.')
        setMode('signin')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-[28px] text-ink">TrackSense</h1>
          <p className="mt-1.5 text-[14px] text-ink-muted">Your daily expenses, kept simply.</p>
        </div>

        <div className="rounded-md border border-line bg-surface p-6">
          <div className="mb-5 flex gap-1 rounded bg-pine-50 p-1">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 rounded py-1.5 text-[13px] font-medium transition-colors ${
                mode === 'signin' ? 'bg-surface text-ink shadow-subtle' : 'text-ink-muted'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 rounded py-1.5 text-[13px] font-medium transition-colors ${
                mode === 'signup' ? 'bg-surface text-ink shadow-subtle' : 'text-ink-muted'
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-[13px] text-rust-500">{error}</p>}
            {notice && <p className="text-[13px] text-pine-600">{notice}</p>}

            <button type="submit" className="btn-primary mt-1" disabled={submitting}>
              {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[12px] text-ink-faint">
          Your data is private and only visible to you.
        </p>
      </div>
    </div>
  )
}
