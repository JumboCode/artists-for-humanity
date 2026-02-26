'use client'
import Link from 'next/link'
import { FormField } from '../common/FormField'
import { PasswordTextField } from '../common/PasswordFormField'
import { ChangeEvent, FormEvent, useState } from 'react'
import { LoginButton } from './LoginButton'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const LoginBody = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({})
  const [showFormError, setShowFormError] = useState(false)
  const [formErrorMessage, setFormErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: false,
    }))
    setShowFormError(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validate
    const newErrors: { [key: string]: boolean } = {}
    if (!formData.username.trim()) newErrors.username = true
    if (!formData.password) newErrors.password = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setShowFormError(true)
      setFormErrorMessage('Please fill in all fields.')
      return
    }

    setIsLoading(true)
    setShowFormError(false)

    try {
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setShowFormError(true)
        setFormErrorMessage('Invalid username or password. Please try again.')
      } else {
        // Success! Fetch session to get user role
        const sessionResponse = await fetch('/api/auth/session')
        const session = await sessionResponse.json()
        
        // Redirect based on role
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/user-portal')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setShowFormError(true)
      setFormErrorMessage('An error occurred during login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full w-full gap-[30px]">
      <h1 className="font-light text-3xl font-heading text-afh-blue">
        Student Portal Login
      </h1>
      <hr className="border border-gray-300" />
      <div className="flex flex-col gap-[60px]">
        <SignUpSection />
        <FormField
          label="Username"
          value={formData.username}
          name="username"
          errorMessage="Please enter your username"
          onChange={handleChange}
          showError={errors.username}
          required
        />
        <PasswordTextField
          label="Password"
          value={formData.password}
          name="password"
          errorMessage="Please enter your password"
          onChange={handleChange}
          showError={errors.password}
          required
        />
      </div>

      {showFormError && (
        <div className="text-afh-orange font-secondary font-extralight" role="alert">
          {formErrorMessage}
        </div>
      )}
      <div className="flex justify-end">
        <LoginButton isLoading={isLoading} />
      </div>
    </form>
  )
}

const SignUpSection = () => {
  return (
    <p className="font-secondary font-light text-lg text-gray-700">
      Don't have an account yet? Sign up{' '}
      <Link href={'/sign-up'}>
        <span className="underline font-semibold text-afh-orange">here</span>
      </Link>
      .
    </p>
  )
}

const ForgotPassword = () => {
  return (
    <Link
      className="underline text-gray-600 font-secondary font-light hover:text-afh-orange transition-colors"
      href={'/sign-up'}
    >
      Forgot your password?
    </Link>
  )
}
