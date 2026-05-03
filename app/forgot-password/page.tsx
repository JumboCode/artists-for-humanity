'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit forgot password request.')
      }

      setMessage(data.message || 'If that email exists, a reset link has been sent.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-start px-4 sm:px-6 md:px-8 py-16 sm:py-20">
      <div className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <h1 className="font-light text-3xl font-heading text-afh-blue text-center">
            Reset your password
          </h1>

          <p className="text-center text-gray-700 font-light">
            Enter your email and we will send a reset link if your account exists.
          </p>

          <div className="w-full">
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-0 border-b border-gray-300 focus:!border-b-afh-orange focus:outline-none focus:ring-0 py-3 text-gray-900 bg-transparent text-lg font-light"
            />
            <label htmlFor="email" className="block mt-2 text-sm font-light text-gray-700">Email*</label>
          </div>

          {message ? (
            <output className="block border border-green-200 bg-green-50 text-green-700 rounded-lg p-4">
              {message}
            </output>
          ) : null}

          {error ? (
            <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-4" role="alert">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto sm:self-end border-[1px] border-afh-orange rounded-full px-6 py-2 text-afh-orange hover:bg-afh-orange hover:text-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send reset link'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Remembered your password?{' '}
            <Link href="/login" className="underline text-afh-orange">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
