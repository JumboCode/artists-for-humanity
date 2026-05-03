'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { PasswordTextField } from '@/components/common/PasswordFormField'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = useMemo(() => searchParams.get('token') || '', [searchParams])

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!token) {
      setError('Missing reset token. Please request a new reset link.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Unable to reset password.')
      }

      setMessage('Password reset successful. Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
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
            Set a new password
          </h1>

          <p className="text-center text-gray-700 font-light">
            Use at least 12 characters, including uppercase, lowercase, number, and symbol.
          </p>

          <PasswordTextField
            label="New Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showError={false}
            errorMessage=""
            required
          />

          <PasswordTextField
            label="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showError={false}
            errorMessage=""
            required
          />

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
            disabled={isSubmitting || !token}
            className="w-full sm:w-auto sm:self-end border-[1px] border-afh-orange rounded-full px-6 py-2 text-afh-orange hover:bg-afh-orange hover:text-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Resetting...' : 'Reset password'}
          </button>

          <p className="text-center text-sm text-gray-600">
            <Link href="/login" className="underline text-afh-orange">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
