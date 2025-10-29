'use client'
import Link from 'next/link'
import { PasswordTextField } from './PasswordTextField'
import { UsernameTextField } from './UsernameTextField'
import { ChangeEvent, useState } from 'react'
import { LoginButton } from './LoginButton'

export const LoginBody = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const [showUsernameError, setShowUsernameError] = useState(false)
  const [showPasswordError, setShowPasswordError] = useState(false)
  const [showFormError, setShowFormError] = useState(false)

  const handleUsernameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUserName(() => e.target.value)
    setShowUsernameError(() => username.includes('error'))
  }

  const handlePasswordChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(() => e.target.value)
    setShowPasswordError(() => password.includes('error'))
  }

  return (
    <div className="flex flex-col h-full w-full gap-[30px]">
      <h1 className="font-light text-3xl font-heading text-afh-blue">Student Portal Login</h1>
      <hr className="border border-gray-300" />
      <div className="flex flex-col gap-[60px]">
        <SignUpSection />
        <UsernameTextField
          username={username}
          onFieldChange={handleUsernameChange}
          showError={showUsernameError}
        />
        <div className="flex flex-col gap-2.5">
          <PasswordTextField
            password={password}
            onFieldChange={handlePasswordChange}
            showError={showPasswordError}
          />
          <ForgotPassword />
        </div>
      </div>

      {showFormError && (
        <label className="text-afh-orange font-secondary font-extralight">
          The email address or password you entered is incorrect. Please try
          again.
        </label>
      )}
      <LoginButton />
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
