import { useState } from 'react'
import { FormField } from './FormField'
import type { FormFieldProps } from './FormField'
import { IconButton, InputAdornment } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Link from 'next/link'

type PasswordTextFieldProps = FormFieldProps & {
  showForgotPasswordLink?: boolean
  forgotPasswordHref?: string
}

export const PasswordTextField = ({
  showForgotPasswordLink = false,
  forgotPasswordHref = '/forgot-password',
  ...props
}: PasswordTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword(show => !show)

  return (
    <div className="flex flex-col gap-2.5">
      <FormField
        {...props}
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position="end" className="pr-4">
            <IconButton onClick={handleClickShowPassword} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      {showForgotPasswordLink ? <ForgotPassword href={forgotPasswordHref} /> : null}
    </div>
  )
}

export const ForgotPassword = ({ href }: Readonly<{ href: string }>) => {
  return (
    <Link
      className="underline text-gray-600 font-secondary font-light hover:text-afh-orange transition-colors"
      href={href}
    >
      Forgot your password?
    </Link>
  )
}
