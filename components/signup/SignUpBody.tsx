'use client'
import { ChangeEvent, useState } from 'react'
import { FormField } from '../common/FormField'
import { PasswordTextField } from '../common/PasswordFormField'
import Link from 'next/link'
import { SignUpButton } from './SignUpButton'

type SignUpFormData = {
  firstName: string
  lastName: string
  school: string
  gradYear: number | ''
  email: string
  password: string
}

const emptySignUpFormData: SignUpFormData = {
  firstName: '',
  lastName: '',
  school: '',
  gradYear: '',
  email: '',
  password: '',
}

export const SignUpBody = () => {
  const [formData, setFormData] = useState(emptySignUpFormData)
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
        />
        <FormField
          label="Last Name"
          value={formData.lastName}
          name="lastName"
          errorMessage="Please enter your last name"
          onChange={handleChange}
          showError={errors.lastName}
        />
        <FormField
          label="School Name"
          value={formData.school}
          name="school"
          errorMessage="Please enter your school name"
          onChange={handleChange}
          showError={errors.school}
        />
        <FormField
          label="Graduation Year"
          type="number"
          value={formData.gradYear}
          name="gradYear"
          errorMessage="Please enter your Graduation Year"
          onChange={handleChange}
          showError={errors.gradYear}
        />
        <FormField
          label="Email"
          value={formData.email}
          name="email"
          errorMessage="Please enter your username or email address"
          onChange={handleChange}
          showError={errors.email}
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
        <SignUpButton />
      </div>
    </div>
  )
}

const LoginSection = () => {
  return (
    <p className="font-light text-lg text-gray-700">
      Already signed up? Login{' '}
      <Link href={'/login'}>
        <span className="underline font-semibold text-afh-orange">here</span>
      </Link>
      .
    </p>
  )
}
