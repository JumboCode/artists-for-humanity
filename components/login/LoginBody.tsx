'use client'
import Link from 'next/link'
import { FormField } from '../common/FormField'
import { ChangeEvent, useState } from 'react'
import { LoginButton } from './LoginButton'
import { PasswordTextField } from '../common/PasswordFormField'

type LoginFormData = {
  username: string
  password: string
}

const emptyLoginFormData: LoginFormData = {
  username: '',
  password: '',
}

export const LoginBody = () => {
  const [formData, setFormData] = useState(emptyLoginFormData)
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({})
  const [showFormError, setShowFormError] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }))

    setErrors(prev => ({
      ...prev,
      [name]: value.trim() === '', // true if empty
    }))
  }

  return (
    <div className="flex flex-col h-full w-full gap-[30px]">
      <h1 className="font-light text-3xl font-heading text-afh-blue">
        Student Portal Login
      </h1>
      <hr className="border border-gray-300" />
      <div className="flex flex-col gap-[60px]">
        <SignUpSection />
        <FormField
          label="Username"
          value={formData.username}
          name="userName"
          errorMessage="Please enter your username or email address"
          onChange={handleChange}
          showError={errors.username}
        />
        <PasswordTextField
          label="Password"
          value={formData.password}
          name="password"
          errorMessage="Please enter your password"
          onChange={handleChange}
          showError={errors.password}
        />
      </div>
      {showFormError && (
        <label className="text-afh-orange font-secondary font-extralight">
          The email address or password you entered is incorrect. Please try
          again.
        </label>
      )}
      <div className="flex justify-end">
        <LoginButton />
      </div>
    </div>
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
