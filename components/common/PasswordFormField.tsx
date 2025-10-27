import { useState } from 'react'
import { FormField } from './FormField'
import type { FormFieldProps } from './FormField'
import { IconButton, InputAdornment } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Link from 'next/link'

export const PasswordTextField = (props: FormFieldProps) => {
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
      <ForgotPassword />
    </div>
  )
}

export const ForgotPassword = () => {
  return (
    <Link
      className="underline text-black font-secondary font-light hover:text-black"
      href={'/'}
    >
      Forgot your password?
    </Link>
  )
}
