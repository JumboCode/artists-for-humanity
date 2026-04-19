'use client'
import { ChangeEvent, FormEvent, useState } from 'react'
import { FormField } from '../common/FormField'
import { PasswordTextField } from '../common/PasswordFormField'
import Link from 'next/link'
import { SignUpButton } from './SignUpButton'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type SignUpFormData = {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  bio: string
}

const emptySignUpFormData: SignUpFormData = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  bio: '',
}

export const SignUpBody = () => {
  const router = useRouter()
  const [formData, setFormData] = useState(emptySignUpFormData)
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({})
  const [showFormError, setShowFormError] = useState(false)
  const [formErrorMessage, setFormErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: boolean } = {}
    let isValid = true

    if (!formData.firstName.trim()) {
      newErrors.firstName = true
      isValid = false
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = true
      isValid = false
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = true
      isValid = false
    }
    if (!formData.username.trim()) {
      newErrors.username = true
      isValid = false
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = true
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: false,
    }))
    setShowFormError(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setShowFormError(true)
      setFormErrorMessage('Please fill in all required fields correctly.')
      return
    }

    setIsLoading(true)
    setShowFormError(false)

    try {
      // Create user account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      // Automatically sign in after successful signup
      const signInResult = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.error) {
        setShowFormError(true)
        setFormErrorMessage(
          'Account created, but failed to sign in. Please login manually.'
        )
      } else {
        // Success! Redirect to user portal
        router.push('/user-portal')
      }
    } catch (error) {
      console.error('Signup error:', error)
      setShowFormError(true)
      setFormErrorMessage(
        error instanceof Error
          ? error.message
          : 'An error occurred during signup'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full w-full gap-[30px]"
    >
      <h1 className="font-light text-3xl font-heading text-afh-blue text-center">
        Student Portal Sign Up
      </h1>
      <hr className="border border-gray-300" />
      <div className="flex flex-col gap-[60px]">
        <LoginSection />
        <FormField
          label="First Name"
          value={formData.firstName}
          name="firstName"
          errorMessage="Please enter your first name"
          onChange={handleChange}
          showError={errors.firstName}
          required
        />
        <FormField
          label="Last Name"
          value={formData.lastName}
          name="lastName"
          errorMessage="Please enter your last name"
          onChange={handleChange}
          showError={errors.lastName}
          required
        />
        <FormField
          label="Email"
          type="email"
          value={formData.email}
          name="email"
          errorMessage="Please enter a valid email address"
          onChange={handleChange}
          showError={errors.email}
          required
        />
        <FormField
          label="Username"
          value={formData.username}
          name="username"
          errorMessage="Please enter a username"
          onChange={handleChange}
          showError={errors.username}
          required
        />
        <PasswordTextField
          label="Password"
          value={formData.password}
          name="password"
          errorMessage="Password must be at least 8 characters"
          onChange={handleChange}
          showError={errors.password}
          required
        />
        <FormField
          label="Bio (Optional)"
          value={formData.bio}
          name="bio"
          onChange={handleChange}
          showError={false}
          multiline
          rows={3}
        />
      </div>

      {showFormError && (
        <div
          className="text-afh-orange font-secondary font-extralight"
          role="alert"
        >
          {formErrorMessage}
        </div>
      )}
      <div className="flex justify-center sm:justify-end">
        <SignUpButton isLoading={isLoading} />
      </div>
    </form>
  )
}

const LoginSection = () => {
  return (
    <p className="font-light text-lg text-gray-700 text-center">
      Already signed up? Login{' '}
      <Link href={'/login'}>
        <span className="underline font-semibold text-afh-orange">here</span>
      </Link>
      .
    </p>
  )
}
